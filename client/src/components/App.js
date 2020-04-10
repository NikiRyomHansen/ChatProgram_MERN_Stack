import React from "react";
import Login from "./Login";
import EventHistory from "./EventHistory";
import ChatHistory from "./ChatHistory";
import Rooms from "./Rooms";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            showLogin: true,
            showTest: false,
            showRooms: false,
            showEventHistory: false,
            showChatHistory: false,
            showLogout: false
        };
        this.hideComponent = this.hideComponent.bind(this);
    }

    componentDidMount() {

    }

    hideComponent(name) {
        console.log(name);
        switch (name) {

            case "showRooms":
                this.setState({
                    showRooms: !this.state.showRooms,
                    loggedIn: true,
                    showLogin: false,
                    showEventHistory: false,
                    showChatHistory: false,
                    showLogout: true
                });
                break;

            case "showEventHistory":
                this.setState({
                    showEventHistory: !this.state.showEventHistory,
                    loggedIn: true,
                    showRooms: false,
                    showLogin: false,
                    showChatHistory: false,
                    showLogout: true
                });
                break;

            case "showChatHistory":
                this.setState({
                    showChatHistory: !this.state.showChatHistory,
                    loggedIn: true,
                    showRooms: false,
                    showEventHistory: false,
                    showLogin: false,
                    showLogout: true
                });
                break;
            case "logout":
                this.setState({
                    loggedIn: true,
                    showLogin: true,
                    showEventHistory: false,
                    showChatHistory: false,
                    showRooms: false,
                    showLogout: false,
                })
        }
    }


    render() {
        const {loggedIn, showLogin, showRooms, showEventHistory, showChatHistory, logout} = this.state;
        const { isLoggedIn } = this.props;

        return (
            <div>
                {isLoggedIn === true ? (
                    <div className="root-container">
                        <div className="box-controller">
                            <div className={"controller " + (this.state.showEventHistory ? "selected-controller" : "")}
                                 onClick={() => this.hideComponent("showEventHistory")}>
                                Event History
                            </div>
                            <div className={"controller " + (this.state.showChatHistory ? "selected-controller" : "")}
                                 onClick={() => this.hideComponent("showChatHistory")}>
                                Chat History
                            </div>
                            <div className={"controller " + (this.state.showRooms ? "selected-controller" : "")}
                                 onClick={() => this.hideComponent("showRooms")}>
                                Rooms
                            </div>
                            <div className={"controller"}
                                 onClick={() => this.hideComponent("logout")}>
                                Logout
                            </div>
                        </div>

                        {/*Showing each tab, depending on the user choice*/}
                        <div className="box-container">
                            {showRooms && <Rooms/>}
                            {showEventHistory && <EventHistory/>}
                            {showChatHistory && <ChatHistory/>}
                            {logout && <Login/>}
                        </div>
                    </div>
                ) : (
                    <div className="login-page">
                        {showLogin && <Login />}
                    </div>
                )}
            </div>
        )
    }
}


export default App;