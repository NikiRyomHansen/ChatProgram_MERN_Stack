import React from "react";
/* Currently does not have any routing functionality nor any actual register functionality */
class RegisterBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {username: "", email: '', password: '', errors: []};
    }

    submitRegister(e) {

        if (this.state.username === "") {
            this.showValidationErr("username", "Username cannot be empty!");
        }
        if (this.state.email === "") {
            this.showValidationErr("email", "Email cannot be empty!");
        }
        if (this.state.password === "") {
            this.showValidationErr("password", "Password cannot be empty!");
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

    onEmailChange(e) {
        this.setState({email: e.target.value});
        this.clearValidationErr("email");
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
        this.clearValidationErr("password");
    }

    render() {

        let usernameErr = null, passwordErr = null, emailErr = null;

        for (let err of this.state.errors) {
            if (err.element === "username") {
                usernameErr = err.msg;
            }
            if (err.element === "password") {
                passwordErr = err.msg;
            }
            if (err.element === "email") {
                emailErr = err.msg;
            }
        }

        return (
            <div className="inner-container">
                <div className="header">
                    Register
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
                        <label htmlFor="email">Email</label>
                        <input type="text"
                               name="email"
                               className="login-input"
                               onChange={this.onEmailChange.bind(this)}
                               autoComplete="off"
                               placeholder="Email"/>
                        <small className="danger-error">{emailErr ? emailErr : ""}</small>

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

                    <button type="button" className="login-btn" onClick={this.submitRegister.bind(this)}>Register
                    </button>
                </div>
            </div>
        )
    }
}

export default RegisterBox