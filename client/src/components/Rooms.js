import React from "react";

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
        fetch('/api/rooms')
            .then(res => res.json())
            .then(rooms => this.setState({rooms}));
    };

    render() {

        const {rooms} = this.state;

        return (
            <div className="admin-root-container">
                <div className="api-container">
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Room</th>
                            <th>Created at</th>
                            <th>Updated at</th>
                            <th>Status</th>
                            <th>Options</th>
                        </tr>
                        {/* Map through the state array and return each value in a table cell */}
                        {rooms.map((events, index) =>
                            <tr key={index}>
                                <td>{events._id}</td>
                                <td>{events.room}</td>
                                <td>{events.createdAt}</td>
                                <td>{events.updatedAt}</td>
                                <td>{events.status}</td>
                            </tr>
                        )}
                    </table>
                </div>
            </div>
        )
    }

}

export default Rooms;