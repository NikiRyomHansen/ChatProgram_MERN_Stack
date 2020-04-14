import React from "react";
import AddRoomButton from "./AddRoomButton";
import axios from 'axios';
import {Link} from "react-router-dom";

class Rooms extends React.Component {

    // Set the initial state
    constructor(props) {
        super(props);
        this.state = {rooms: []}
    }

    // Fetch the eventlog after the first mount
    componentDidMount() {
        this.getRoomsLog();
    }

    // Fetch the api request and store it in the state
    getRoomsLog = () => {
        axios.get('/api/rooms')
            .then(res => res.data)
            .then(rooms => this.setState({rooms}));
    };


    render() {

        const {rooms} = this.state;

        return (
            <div className="root-container">
                <div className="box-container">
                    <AddRoomButton />
                    <div className="admin-root-container">
                        <div className="api-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Room</th>
                                    <th>Created at</th>
                                    <th>Updated at</th>
                                    <th>Status</th>
                                    <th>Options</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* Map through the state array and return each value in a table cell */}
                                {rooms.map((item) =>
                                    <tr key={item.room}>
                                        <td>{item._id}</td>
                                        <td>{item.room}</td>
                                        <td>{item.createdAt}</td>
                                        <td>{item.updatedAt}</td>
                                        <td>{item.status}</td>
                                        <td><Link to={`/room/${item.room}`}>Edit</Link></td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Rooms;