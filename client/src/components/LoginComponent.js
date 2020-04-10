import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import App from "./App";

const LoginComponent = (props) => {
    // TODO: Add state and error event handlers
    return (
        <div className="root-container">
            <div className="box-container">
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
                                // onChange={this.onUsernameChange.bind(this)}
                                   autoComplete="off"
                                   placeholder="Username"/>
                            {/*<small className="danger-error">{usernameErr ? usernameErr : ""}</small>*/}
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password"
                                   name="password"
                                   className="login-input"
                                // onChange={this.onPasswordChange.bind(this)}
                                   placeholder="Password"/>
                            {/*<small className="danger-error">{passwordErr ? passwordErr : ""}</small>*/}
                        </div>
                        {/* Routing to adminhome */}
                        <BrowserRouter>
                            <Link to={{
                                pathname: '/admin',
                                state: {
                                    loggedIn: true
                                }
                            }}
                                  className="login-btn"
                                  onClick={props.isLoggedIn}>Login</Link>
                            <Route>
                                <Switch>
                                    <Route path="/admin" component={App}/>
                                </Switch>
                            </Route>
                        </BrowserRouter>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent;