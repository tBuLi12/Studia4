import React from "react"
import { Button, DispatchContext } from "./App";
import "./Login.css"
import { fetchUser, login } from "./Remote";

export default function LogIn() {
    const dispatch = React.useContext(DispatchContext);
    const [nameVal, setName] = React.useState("");
    const [passVal, setPass] = React.useState("");
    const [invalidCred, setInvalidCred] = React.useState(false);
    function onChangeName(event) {
        setName(event.target.value);
    }
    function onChangePass(event) {
        setPass(event.target.value);
    }
    function onSubmit(event) {
        event.preventDefault();
        login(nameVal, passVal)
            .then(fetchUser)
            .then(function(user) {
                if (!user) {
                    setInvalidCred(true);
                } else {
                    dispatch({action: "login", data: user});
                }
            }, err => dispatch({action: "error", data: err}));
    }
    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="name" value={nameVal} onChange={onChangeName} required placeholder="Login"/><br/>
            <input type="password" name="password" value={passVal} onChange={onChangePass} required placeholder="Hasło"/><br/>
            <Button submit>Log in</Button>
            {invalidCred && <div className="invalid-cred">
                Invalid credentials
            </div>}
        </form>
    );
}

export function LogInLink({ user }) {
    const dispatch = React.useContext(DispatchContext);
    if (user) {
        return (
            <span style={{float: "right"}} onClick={() => dispatch({action: "logout"})}>Log out</span>
        )
    }
    return (
        <span style={{float: "right"}} onClick={function() {
            dispatch({action: "setContent", data: <LogIn/>});
        }}>Log in</span>
    )
}