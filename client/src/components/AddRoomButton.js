import React from 'react';
import {Link} from "react-router-dom";

const AddRoomButton = () => {
    return (
        <Link to="/addroom">
            <div className="add-room-btn ">
                Add New Room
            </div>
        </Link>
    );
};

export default AddRoomButton;