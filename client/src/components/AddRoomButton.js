import React from 'react';
import {Link} from "react-router-dom";

const AddRoomButton = () => {
    return (
        <Link to="/room">
            <div className="add-room-btn ">
                Add New Room
            </div>
        </Link>
    );
};

export default AddRoomButton;