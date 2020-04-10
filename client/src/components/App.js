import React from "react";
import LoginComponent from "./LoginComponent";
import Navigation from "./Navigation";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
        };
    }

    triggerLogin = () => {
        this.setState({
            isLoggedIn: true,
        })
    }

    render() {
        return (
            <div>
                {!this.state.isLoggedIn && <LoginComponent isLoggedIn={this.triggerLogin}/>}
                {this.state.isLoggedIn && <Navigation/>}
            </div>
        )
    }
}


export default App;