import React from 'react';
import ScheduleView from './Schedule';
import LogIn from './Login';
import NavBar from './Nav';
import CoursesList from './Courses';
import './App.css';
import Grades from './Grades';
import ReschedRequests from './ReschedRequests';
import Register from './Register';
import Polls from './Polls';
import News from './News';
import Workers from './Workers';
import { fetchGroups, fetchUser, useRemoteData } from './Remote';
import AdminSchedule from './AdminSchedule';

export const DispatchContext = React.createContext();
export const WidthContext = React.createContext();

function stateReducer(state, { action, data }) {
    switch (action) {
        case "resize":
            return {...state, width: window.innerWidth};
        case "login":
            return {...state, user: data, content: <News/>};
        case "logout":
            return {...state, user: null, content: <LogIn/>};
        case "setContent":
            return {...state, content: data};
        case "error":
            return {...state, content: <div className='info-text'>{data.message}</div>}
        case "popupError":
            return {...state, popup: <div className='info-text'>{data.message}</div>}
        case "closePopup":
            return {...state, popup: null}
        case "setUser":
            return {...state, user: data};
        default:
            return state;
    }
}

export default function App() {
    const [{ content, user, width, popup }, dispatch] = React.useReducer(stateReducer, {
        content: null,
        user: undefined,
        width: window.innerWidth,
        popup: null
    });
    React.useEffect(function() {
        const updateWidth = () => dispatch({action: "resize"});
        window.addEventListener("resize", updateWidth);     
        return () => window.removeEventListener("resize", updateWidth);
    }, []);
    React.useEffect(function() {
        if (user === undefined) {
            dispatch({action: "setUser", data: null});
            fetchUser()
                .then(user => dispatch(user === false ? {action: "setContent", data: <LogIn/>} : {action: "login", data: user}))
                .catch(err => dispatch({action: "error", data: err}));
        }
    }, [user])
    React.useEffect(function() {
        // const intt = setInterval(() => console.log(document.activeElement), 500);
        // return () => clearInterval(intt);
        const logevent = event => console.log(event);
        window.addEventListener("pointerdown", logevent);
        window.addEventListener("pointerup", logevent);
        window.addEventListener("pointercancel", logevent);
    }, []);

    const links = [
        {name: "Plan zajęć", view: <ScheduleView/>},
        {name: "Ankiety", view: <Polls user={user}/>, nNots: user ? 10 : undefined},
        {name: "Aktualności", view: <News/>},
        {name: "Pracownicy", view: <Workers/>},
    ];
    const showAll = true;
    if (user) {
        if (user.position === "ROLE_STUDENT" || showAll) {
        links.push(...[
            {name: "Oceny", view: <Grades/>},
            {name: "Przedmioty", view: <CoursesList/>},
            {name: "Rejestracja", view: <Register/>},
        ]);
        } else {
            links.push({name: "Zmiany grup", view: <ReschedRequests/>, nNots: user ? 3 : undefined});
        }
        if (showAll) {
            links.push({name: "Zmiany grup", view: <ReschedRequests/>, nNots: user ? 3 : undefined});
        }
        if (user.security === "ROLE_ADMIN" || showAll) {
            links.push({name: "Plan", view: <AdminSchedule/>});
        }
    }
    return (
        <WidthContext.Provider value={width}>
        <DispatchContext.Provider value={dispatch}>
            <NavBar links={links} windWidth={width} user={user}/>
            <ContentBox>
                {user === undefined ? <div>Loading...</div> : content}
            </ContentBox>
            {popup && <Popup close={() => dispatch({action: "closePopup"})}>{popup}</Popup>}
            <Footer/>
        </DispatchContext.Provider>
        </WidthContext.Provider>
    );
}

function ContentBox({ children }) {
    return (
        <div id="content">
            <div>
                {children}
            </div>
        </div>
    );
}

export const Button = React.forwardRef(function({ onClick, children, submit, style, autofocus, form }, ref) {
    const [clicked, setClicked] = React.useState(false);
    React.useEffect(() => autofocus && ref.current.focus({preventScroll: true}), []);
    return (
        <button 
            className={"button" + (clicked ? " button-clicked" : "")} 
            onClick={onClick}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
            onMouseLeave={() => setClicked(false)}
            type={submit ? "submit" : ""}
            style={style}
            ref={ref}
            {...(form ? {form} : {})}
        >
            <div className="bdummy">{children}</div>
            <div className={"btext"  + (clicked ? " btext-clicked" : "")}>{children}</div>
        </button>
    )
})

export function SearchBar({ onSearch, suggestions, searchOnSelect }) {
    const [searchVal, setVal] = React.useState("");
    const [focused, setFocused] = React.useState(false);
    const [focusedSugg, setFocusedSugg] = React.useState(null);
    const [showSugg, setShowSugg] = React.useState(true);
    const fltrSuggerstions = React.useMemo(() => suggestions
        ?.filter(sug => sug.includes(searchVal)),
    [suggestions, searchVal])
    return (
        <form onSubmit={function(event) {
            event.preventDefault();
            onSearch(searchVal);
        }} autoComplete='off'>
            <div  className="search-bar">
                <input
                    type="text"
                    name="name"
                    value={searchVal}
                    onChange={function(event) {
                        setFocusedSugg(null);
                        setVal(event.target.value);
                        setShowSugg(true);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={function(event) {
                        // eslint-disable-next-line default-case
                        switch(event.key) {
                            case "ArrowDown":
                                setFocusedSugg(i => Math.min((i ?? -1) + 1, fltrSuggerstions.length - 1));
                                break;
                            case "ArrowUp":
                                setFocusedSugg(i => i === null || i === 0 ? null : i - 1);
                                break;
                            case "Enter":
                                if (focusedSugg !== null) {
                                    event.preventDefault();
                                    const sug = fltrSuggerstions[focusedSugg];
                                    setVal(sug);
                                    setFocusedSugg(null);
                                    setShowSugg(false);
                                    searchOnSelect && onSearch(sug);
                                }
                        }
                    }}
                    required
                    placeholder="Szukaj po nazwie"
                />
                {focused && fltrSuggerstions && showSugg && (
                    <div className="suggestions">
                        {fltrSuggerstions.map((sug, i) => <div key={i}
                            className={"suggestion" + (i === focusedSugg ? " focused-sugg" : "")}
                            onMouseDown={function() {
                                setVal(sug);
                                setFocusedSugg(null);
                                setShowSugg(false);
                                searchOnSelect && onSearch(sug);
                            }}
                        >{sug}</div>)}
                    </div>
                )}
            </div>
            <Button submit>Szukaj</Button>
        </form>
    );
}

function Footer() {
    return (
        <div id="footer">
            Studia 4 PAP-Z223
        </div>
    );
}

function Popup({ children, close }) {
    return (
        <div className='pop-up-container' onClick={event => event.target === event.currentTarget && close()}>
            <div className='pop-up'>
                <div className='button-div'>
                    <Button onClick={close}>X</Button>
                </div>
                {children}
            </div>
        </div>
    )
}

export function usePopup() {
    const rejector = React.useRef(null);
    const [currElem, setElem] = React.useState(null);
    React.useEffect(() => () => rejector.current?.("popup closed"), []);
    const show = React.useCallback(function(elemGetter) {
        return new Promise(function(resolve, reject) {
            rejector.current = reject;
            function close() {
                setElem(null);
                reject("popup closed");
            }
            setElem(<Popup close={close}>{elemGetter(function(data) {
                setElem(null);
                resolve(data);
            })}</Popup>);
        })
    }, [])
    return [currElem, show];
}

export function GroupSelector({ onSelect }) {
    const buttonRef = React.useRef();
    const [allGroups] = useRemoteData(fetchGroups);
    const [groups, setGroups] = React.useState([]);
    const groupNames = React.useMemo(() => allGroups?.map(gr => gr.name), [allGroups]);
    if (allGroups === undefined) {
        return <div>Loading...</div>;
    }
    return (
        <div className='group-selector'>
            <SearchBar searchOnSelect onSearch={function(searchVal) {
                const newGroups = [];
                allGroups.forEach(function(grp) {
                    if (grp.name.includes(searchVal)) {
                        groups.includes(grp) || newGroups.push(grp);
                    }
                });
                setGroups(g => [...g, ...newGroups]);
                buttonRef.current?.focus({preventScroll: true});
            }} suggestions={groupNames}/>
            {groups.map(grp => <div key={grp.id}>{grp.name}<Button onClick={function() {
                setGroups(function(g) {
                    const cp = [...g];
                    cp.splice(g.indexOf(grp), 1)
                    return cp;
                });
            }}>X</Button></div>)}
            {groups.length === 0 || <Button onClick={() => onSelect(groups)} ref={buttonRef} autofocus>Wybierz</Button>}
        </div>
    )
}

export function verifyClose(err) {
    if (err !== "popup closed") {
        throw err;
    }
}