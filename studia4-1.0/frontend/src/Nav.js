import React from 'react';
import { DispatchContext } from "./App";
import { LogInLink } from './Login';
import './Nav.css';


export function NavLink({ children, view, nNots }) {
    const dispatch = React.useContext(DispatchContext);
    return (<span onClick={() => dispatch({action: "setContent", data: view})}>
        {children}
        {nNots && <div className="notifIndicator">{nNots}</div>}
    </span>);
}

export default function NavBar({ links, windWidth, user }) {
    const [sideVisible, setSide] = React.useState(false);
    const prompt = <div className='info-text'>You must be logged in to view this content</div>;
    if (windWidth < 900) {
        return (
            <nav className="small-nav">
                <div style={{transform: `translateX(-${sideVisible ? 0 : 100}%)`}} onClick={() => setSide(false)}>
                    {links.map((link, i) => <NavLink key={i} view={user ? link.view : prompt} stack={true} nNots={link.nNots}>{link.name}</NavLink>)}
                </div>
                <span onClick={() => setSide(prev => !prev)}>Menu</span>
                <LogInLink user={user}/>
            </nav>
        );    
    }
    return (
        <nav>
            <LogInLink user={user}/>
            {links.map((link, i) => <NavLink key={i} view={user ? link.view : prompt} stack={false} nNots={link.nNots}>{link.name}</NavLink>)}
        </nav>
    );
}
