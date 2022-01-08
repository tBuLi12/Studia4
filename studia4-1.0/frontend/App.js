import React from 'react';
import ScheduleView from './Schedule';
import LogIn from './Login';
import NavBar from './Nav';
import CoursesList from './Courses';
import './App.css';

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
                {name: "Plan zajęć", view: <ScheduleView/>}
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

export function Button({ onClick, children, submit }) {
    const [clicked, setClicked] = React.useState(false);
    return (
        <button 
            className={"button" + (clicked ? " button-clicked" : "")} 
            onClick={onClick}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
            onMouseLeave={() => setClicked(false)}
            type={submit ? "submit" : ""}
        >
            <div className="bdummy">{children}</div>
            <div className={"btext"  + (clicked ? " btext-clicked" : "")}>{children}</div>
        </button>
    )
}

function Footer() {
    return (
        <div id="footer">
            Studia 4 PAP-Z223
        </div>
    );
}