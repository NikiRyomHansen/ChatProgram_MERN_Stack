import React from "react";
import {Link} from "react-router-dom";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
            isAdminOpen: false,
            username: "",
            password: "",
            errors: []
        };
    }

    handleSubmit(e) {
        console.log("handlesubmit triggered");
        if ((this.state.username === "")
            && this.state.password === "") {
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

                            <Link to="/admin"
                                  className="login-btn"
                                  onClick={this.handleSubmit.bind(this)}>Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Login;
