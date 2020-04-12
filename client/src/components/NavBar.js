import React from "react";
import {
    Link
} from "react-router-dom";

function NavBar(props) {

    const {history} = props;

    return (
        <div className="header-controller">
            <div className="box-controller">
                <Link to="/eventhistory">
                    <div className={"controller"}>Event History</div>
                </Link>
                <Link to="/chathistory">
                    <div className="controller">Chat History</div>
                </Link>
                <Link to="/rooms">
                    <div className="controller">Rooms</div>
                </Link>
                <Link to="/">
                    <div className="controller">Logout</div>
                </Link>
            </div>
        </div>

    )


}

export default NavBar;