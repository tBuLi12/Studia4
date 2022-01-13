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
import { fetchGroups, useRemoteData } from './Remote';
import AdminSchedule from './AdminSchedule';

export const UserContext = React.createContext();
export const DispatchContext = React.createContext();

function stateReducer(state, { action, data }) {
    switch (action) {
        case "resize":
            return {...state, width: window.innerWidth};
        case "login":
            return {...state, user: data, content: <CoursesList/>};
        case "logout":
            return {...state, user: null, content: <LogIn/>};
        case "setContent":
            return {...state, content: data};
    }
}

export default function App() {
    const [{ content, user, width }, dispatch] = React.useReducer(stateReducer, {
        content: <LogIn/>,
        user: null,
        width: window.innerWidth
    });

    React.useEffect(function() {
        let updateWidth = () => dispatch({action: "resize"});
        window.addEventListener("resize", updateWidth);     
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    return (
        <DispatchContext.Provider value={dispatch}>
        <UserContext.Provider value={user}>
            <NavBar links={[
                {name: "Przedmioty", view: <CoursesList/>},
                {name: "Plan zajęć", view: <ScheduleView/>},
                {name: "Oceny", view: <Grades/>},
                {name: "Zmiany grup", view: <ReschedRequests/>, nNots: user ? 3 : undefined},
                {name: "Rejestracja", view: <Register/>},
                {name: "Ankiety", view: <Polls/>, nNots: user ? 10 : undefined},
                {name: "Aktualności", view: <News/>},
                {name: "Pracownicy", view: <Workers/>},
                {name: "Plan", view: <AdminSchedule/>},
            ]} windWidth={width}/>
            <ContentBox>
                {content}
            </ContentBox>
            <Footer/>
        </UserContext.Provider>
        </DispatchContext.Provider>
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

export function Button({ onClick, children, submit, style }) {
    const [clicked, setClicked] = React.useState(false);
    return (
        <button 
            className={"button" + (clicked ? " button-clicked" : "")} 
            onClick={onClick}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
            onMouseLeave={() => setClicked(false)}
            type={submit ? "submit" : ""}
            style={style}
        >
            <div className="bdummy">{children}</div>
            <div className={"btext"  + (clicked ? " btext-clicked" : "")}>{children}</div>
        </button>
    )
}

export function SearchBar({ onSearch, suggestions }) {
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
                                    setVal(fltrSuggerstions[focusedSugg]);
                                    setFocusedSugg(null);
                                    setShowSugg(false);
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

export function usePopup() {
    const [currElem, setElem] = React.useState(null);
    return [currElem, function(elemGetter) {
        return new Promise(function(resolve, reject) {
            setElem(
                <div className='pop-up'>
                    <Button onClick={function() {
                        setElem(null);
                        reject("popup closed");
                    }}>X</Button>
                    {elemGetter(function(data) {
                        setElem(null);
                        resolve(data);
                    })}
                </div>
            );
        })
    }]
}

export function GroupSelector({ onSelect }) {
    const allGroups = useRemoteData(fetchGroups);
    const [groups, setGroups] = React.useState([]);
    const groupNames = React.useMemo(() => allGroups?.map(gr => gr.name), [allGroups]);
    if (allGroups === null) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <SearchBar onSearch={function(searchVal) {
                const newGroups = [];
                allGroups.forEach(function(grp) {
                    if (grp.name.includes(searchVal)) {
                        groups.includes(grp) || newGroups.push(grp);
                    }
                });
                setGroups(g => [...g, ...newGroups]);
            }} suggestions={groupNames}/>
            {groups.map(grp => <div key={grp.id+grp.type}>{grp.name}<Button onClick={function() {
                setGroups(function(g) {
                    const cp = [...g];
                    cp.splice(g.indexOf(grp), 1)
                    return cp;
                });
            }}>X</Button></div>)}
            <Button onClick={() => groups.length === 0 || onSelect(groups)}>Wybierz</Button>
        </div>
    )
}

export function verifyClose(err) {
    if (err !== "popup closed") {
        throw err;
    }
}