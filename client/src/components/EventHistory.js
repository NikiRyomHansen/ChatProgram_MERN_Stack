import React from "react";

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
        fetch('/api/eventlog')
            .then(res => res.json())
            .then(eventlog => this.setState({eventlog}));
    };

    render() {

        const {eventlog} = this.state;

        return (
            <div className="admin-root-container">
                    <div className="api-container">
                        <table>
                            <tr>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>User</th>
                                <th>EventID</th>
                            </tr>
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
                        </table>
                    </div>
            </div>
        )
    }

}

export default EventHistory;