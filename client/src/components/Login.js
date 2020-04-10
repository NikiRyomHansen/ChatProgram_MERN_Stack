import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import App from "./App";
import Rooms from "./Rooms";


class LoginBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {notLoggedIn: true, isAdminOpen: false, username: "", password: "", errors: []};
    }

    handleSubmit(e) {
        if (this.state.username === "" || this.state.username !== "admin"
            && this.state.password === "" || this.state.password !== "admin") {
            this.showValidationErr("username", "Password or username is incorrect!");
            this.showValidationErr("password", "Password or username is incorrect");
        }
    }

    showValidationErr(element, msg) {
        this.setState((prevState) => ({errors: [...prevState.errors, {element, msg}]}));
    }

    clearValidationErr(element) {
        this.setState((prevState) => {
            let newArr = [];
            for (let err of prevState.errors) {
                if (element !== err.element) {
                    newArr.push(err);
                }
            }
            return {errors: newArr};
        });
    }

    onUsernameChange(e) {
        this.setState({username: e.target.value});
        this.clearValidationErr("username");
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
        this.clearValidationErr("password");
    }


    render() {
        const {notLoggedIn} = this.state;
        let usernameErr, passwordErr = null;
        // for each error in the state errors array, print a corresponding error message
        for (let err of this.state.errors) {
            if (err.element === "username") {
                usernameErr = err.msg;
            }
            if (err.element === "password") {
                passwordErr = err.msg;
            }
        }

        return (

            <div className="inner-container">
                <div className="header">
                    Login
                </div>
                <div className="box">

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text"
                               name="username"
                               className="login-input"
                               onChange={this.onUsernameChange.bind(this)}
                               autoComplete="off"
                               placeholder="Username"/>
                        <small className="danger-error">{usernameErr ? usernameErr : ""}</small>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                               name="password"
                               className="login-input"
                               onChange={this.onPasswordChange.bind(this)}
                               placeholder="Password"/>
                        <small className="danger-error">{passwordErr ? passwordErr : ""}</small>
                    </div>
                    {/* Routing to adminhome */}
                    <BrowserRouter>
                        <Link to={{
                            pathname: '/App',
                            state: {
                                isLoggedIn: true
                            }
                        }}
                              className="login-btn"
                              onClick={this.handleSubmit.bind(this)}>Login</Link>
                        <Route>
                            <Switch>
                                <Route exact path="/App"/>
                            </Switch>
                        </Route>
                    </BrowserRouter>
                </div>

            </div>


        )
    }
}

export default LoginBox;
