import React from "react"
import { Button, DispatchContext, UserContext } from "./App";
import "./Login.css"

export default function LogIn() {
    const dispatch = React.useContext(DispatchContext);
    const [nameVal, setName] = React.useState("");
    function onChange(event) {
        setName(event.target.value);
    }
    function onSubmit(event) {
        dispatch({action: "login", data: nameVal});
        event.preventDefault();
    }
    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="name" value={nameVal} onChange={onChange} required placeholder="Login"/><br/>
            <input type="password" name="password" value={nameVal} onChange={onChange} required placeholder="Hasło"/><br/>
            <Button submit>Log in</Button>
        </form>
    );
}

export function LogInLink() {
    const dispatch = React.useContext(DispatchContext);
    const user = React.useContext(UserContext);
    if (user) {
        return (
            <span style={{float: "right"}} onClick={function() {
                dispatch({action: "logout"});
            }}>Log out</span>
        )
    }
    return (
        <span style={{float: "right"}} onClick={function() {
            dispatch({action: "setContent", data: <LogIn/>});
        }}>Log in</span>
    )
}