import React from "react";
import LoginBox from "./Login";
import EventHistory from "./EventHistory";
import ChatHistory from "./ChatHistory";
import Rooms from "./Rooms";
import Test from "./Test";

class LoginContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEventHistoryOpen: false,
            isLoginOpen: true,
            isChatHistoryOpen: false,
            isRoomsOpen: false,
            test: false
        };
    }



    showLoginBox() {
        this.setState({isEventHistoryOpen: false, isLoginOpen: true, isChatHistoryOpen: false, isRoomsOpen: false})
    }

    showEventHistory() {
        this.setState({isEventHistoryOpen: true, isLoginOpen: false, isChatHistoryOpen: false, isRoomsOpen: false})
    }

    showChatHistory() {
        this.setState({isEventHistoryOpen: false, isLoginOpen: false, isChatHistoryOpen: true, isRoomsOpen: false})
    }

    showRooms() {
        this.setState({isEventHistoryOpen: false, isLoginOpen: false, isChatHistoryOpen: false, isRoomsOpen: true})
    }

    showTest() {
        console.log("test 123 here on line 38");
        this.setState({
            isEventHistoryOpen: false,
            isLoginOpen: false,
            isChatHistoryOpen: false,
            isRoomsOpen: false,
            test: true,
        })
    }


    render() {

        return (
            <div className="root-container">
                <div className="box-controller">
                    <div className={"controller " + (this.state.isLoginOpen ? "selected-controller" : "")}
                         onClick={this.showLoginBox.bind(this)}>
                        Login
                    </div>
                    <div className={"controller " + (this.state.isEventHistoryOpen ? "selected-controller" : "")}
                         onClick={this.showEventHistory.bind(this)}>
                        Event History
                    </div>
                    <div className={"controller " + (this.state.isChatHistoryOpen ? "selected-controller" : "")}
                         onClick={this.showChatHistory.bind(this)}>
                        Chat History
                    </div>
                    <div className={"controller " + (this.state.isRoomsOpen ? "selected-controller" : "")}
                         onClick={this.showRooms.bind(this)}>
                        Rooms
                    </div>
                    <div className={"controller " + (this.state.test ? "selected-controller" : "")}
                         onClick={this.showTest.bind(this)}>
                        test
                    </div>

                </div>

                <div className="box-container">

                    {this.state.isLoginOpen && <LoginBox/>}
                    {this.state.isEventHistoryOpen && <EventHistory/>}
                    {this.state.isChatHistoryOpen && <ChatHistory/>}
                    {this.state.isRoomsOpen && <Rooms/>}
                    {this.state.test && <Test/>}

                </div>
            </div>
        )
    }
}


export default LoginContainer;