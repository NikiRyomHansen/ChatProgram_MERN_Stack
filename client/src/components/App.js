import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import NavBar from "./NavBar";
import LoginComponent from "./LoginComponent";
import Rooms from "./Rooms";
import Error from './Error';
import EventHistory from "./EventHistory";
import ChatHistory from "./ChatHistory";
import AddRoom from "./AddRoom";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: false
        }
    }


    render() {

        return (

            <BrowserRouter history={History}>
                <Route path="/admin" component={NavBar}/>
                <Route path="/eventhistory" component={NavBar}/>
                <Route path="/chathistory" component={NavBar}/>
                <Route path="/rooms" component={NavBar}/>
                <Switch>
                    <Route exact path="/" component={LoginComponent}/>
                    <Route path="/admin"/>
                    <Route path="/eventhistory" component={EventHistory}/>
                    <Route path="/chathistory" component={ChatHistory}/>
                    <Route path="/rooms" component={Rooms}/>
                    <Route path="/room/:room?" component={AddRoom}/>
                    <Route path="/logout" component={LoginComponent}/>
                    <Route component={Error}/>
                </Switch>
            </BrowserRouter>

        )
    }
}


export default App;