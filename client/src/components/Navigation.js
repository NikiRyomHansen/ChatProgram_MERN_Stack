import React from "react";
import LoginComponent from "./LoginComponent";
import Rooms from "./Rooms";
import EventHistory from "./EventHistory";
import ChatHistory from "./ChatHistory";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            showLogin: false,
            showTest: false,
            showRooms: false,
            showEventHistory: true,
            showChatHistory: false,
        };
        this.hideComponent = this.hideComponent.bind(this);
    }

    hideComponent(name) {
        switch (name) {
            case "showRooms":
                this.setState({
                    showRooms: !this.state.showRooms,
                    isLoggedIn: true,
                    showLogin: false,
                    showEventHistory: false,
                    showChatHistory: false,
                });
                break;

            case "showEventHistory":
                this.setState({
                    showEventHistory: !this.state.showEventHistory,
                    isLoggedIn: false,
                    showRooms: false,
                    showLogin: false,
                    showChatHistory: false,
                });
                break;

            case "showChatHistory":
                this.setState({
                    showChatHistory: !this.state.showChatHistory,
                    isLoggedIn: false,
                    showRooms: false,
                    showEventHistory: false,
                    showLogin: false,
                });
                break;

            case "logout":
                this.setState({
                    isLoggedIn: false,
                    showLogin: true,
                    showEventHistory: false,
                    showChatHistory: false,
                    showRooms: false,
                });
        }
    }

    render() {
        const {showLogin, showRooms, showEventHistory, showChatHistory} = this.state;

        return (
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
                </div>
            </div>
        )
    }
}

export default Navigation;