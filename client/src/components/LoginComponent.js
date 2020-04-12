import React, {useEffect, useState} from "react";
import axios from "axios";


const LoginComponent = (props) => {

    /* Fetching Admin login */
    // initialize state with an empty array
    const [admins, setAdmins] = useState([]);

    // get the API
    const fetchItems = async () => {
        await axios.get('/api/admins')
            .then(res => res.data)
            .then(admin => setAdmins(admin));
        console.log("Admin has been fetched!");
        console.log()
    };

    useEffect(() => {
        fetchItems()
        if (admins.length > 0) {
            console.log('print this')
        }
    }, []);

        // TODO: Add state and error event handlers - LOOK INTO HOOKS and useContext!
    // initialize states
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [badCredentials, setCredentials] = useState(true);

    // get history props
    const { history } = props;

    // extract the username and password from the state
    let adminUsername = admins.map(item => item.username).toString();
    let adminPassword = admins.map(item => item.password).toString();

    // handle the login click and push '/admin' onto the history
    const handleSubmit = () => {
        if (username === adminUsername && password === adminPassword) {
            history.push('/admin', true);
        } else {
            // if pass or user is incorrect, set credentials to false and show an error message
            setCredentials(false);
        }
    };

    const onUsernameChange = (e) => {
        setUsername(e.target.value);

    };

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (

        <div className="root-container">
            <div className="box-container">
                <div className="header">
                    Login
                </div>
                <div className="box">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text"
                               name="username"
                               className="login-input"
                            onChange={
                                (e) => onUsernameChange(e)}
                               autoComplete="off"
                               placeholder="Username"/>
                        <small className="danger-error">{""}</small>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                               name="password"
                               className="login-input"
                            onChange={
                                (e) => onPasswordChange(e)}
                               placeholder="Password"/>
                        <small className="danger-error">{!badCredentials ? (
                        "Password or username is incorrect") : ""}</small>
                    </div>
                    <a
                          className="login-btn"
                          onClick={
                              () => handleSubmit()}>
                        Login
                    </a>
                </div>
            </div>
        </div>

    );
};

export default LoginComponent;