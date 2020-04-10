import React from "react";

class Navigation extends React.Component {



    render() {
        return (
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
        );
    }

}