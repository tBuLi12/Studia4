import React from "react"
import { Button, DispatchContext, UserContext } from "./App";
import "./Login.css"
import { login } from "./Remote";

export default function LogIn() {
    const dispatch = React.useContext(DispatchContext);
    const [nameVal, setName] = React.useState("");
    const [passVal, setPass] = React.useState("");
    function onChangeName(event) {
        setName(event.target.value);
    }
    function onChangePass(event) {
        setPass(event.target.value);
    }
    function onSubmit(event) {
        event.preventDefault();
        login(nameVal, passVal).then(un => dispatch({action: "login", data: un})).catch(alert);
    }
    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="name" value={nameVal} onChange={onChangeName} required placeholder="Login"/><br/>
            <input type="password" name="password" value={passVal} onChange={onChangePass} required placeholder="Hasło"/><br/>
            <Button submit onClick={() => console.log("pressed log in")}>Log in</Button>
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