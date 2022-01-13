import React from 'react';
import { DispatchContext, UserContext } from "./App";
import { LogInLink } from './Login';
import './Nav.css';


export function NavLink({ children, view, nNots }) {
    const dispatch = React.useContext(DispatchContext);
    return (<span onClick={() => dispatch({action: "setContent", data: view})}>
        {children}
        {nNots && <div className="notifIndicator">{nNots}</div>}
    </span>);
}

function ShowNav({ toggle }) {
    return <span onClick={toggle}>O</span>;
}

// function SideNav() {
//     return (
        
//     )
// }

export default function NavBar({ links, windWidth }) {
    const [sideVisible, setSide] = React.useState(false);
    const user = React.useContext(UserContext);
    const prompt = <div>You must be logged in to view this content</div>;
    if (windWidth < 500) {
        return (
            <nav>
                <div style={{display: sideVisible ? "block" : "none"}}>
                    {links.map((link, i) => <NavLink key={i} view={user ? link.view : prompt} stack={true} nNots={link.nNots}>{link.name}</NavLink>)}
                </div>
                <ShowNav toggle={function() {setSide(prev => !prev)}}/>
                <LogInLink/>
            </nav>
        );    
    }
    return (
        <nav>
            <LogInLink/>
            {links.map((link, i) => <NavLink key={i} view={user ? link.view : prompt} stack={false} nNots={link.nNots}>{link.name}</NavLink>)}
        </nav>
    );
}
