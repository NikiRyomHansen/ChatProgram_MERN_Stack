import React from "react";
import axios from 'axios';

class EventHistory extends React.Component {

    // Set the initial state
    constructor(props) {
        super(props);
        this.state = {eventlog: []}
    }

    // Fetch the eventlog after the first mount
    componentDidMount() {
        this.getEventLog();
    }

    // Fetch the api request and store it in the state
    getEventLog = () => {
        axios.get('/api/eventlog')
            .then(res => res.data)
            .then(eventlog => this.setState({eventlog}));
    };

    render() {

        const {eventlog} = this.state;

        return (
            <div className="root-container">
                <div className="box-container">
                    <div className="admin-root-container">
                        <div className="api-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>User</th>
                                    <th>EventID</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* Map through the state array and return each value in a table cell */}
                                {eventlog.map((events, index) =>
                                    <tr key={index}>
                                        <td>{events.type}</td>
                                        <td>{events.date}</td>
                                        <td>{events.time}</td>
                                        <td>{events.username}</td>
                                        <td>{events._id}</td>
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

export default EventHistory;