import React from "react";

class ChatHistory extends React.Component {

    // set the initial state
    constructor(props) {
        super(props);
        this.state = {historylog: []}
    }

    // Fetch the historylog after the first mount
    componentDidMount() {
        this.getHistoryLog();
    }

    // Fetch the api request and store it in the state
    getHistoryLog = () => {
        fetch('/api/history')
            .then(res => res.json())
            .then(historylog => this.setState({historylog}));
    };


    render() {

        // store the current state in historylog
        const {historylog} = this.state;

        return (


            <div className="admin-root-container">
                <div className="api-container">
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Date & Time</th>
                            <th>Sender</th>
                            <th>Message</th>
                            <th>Room</th>
                        </tr>
                        {/* Map through the state array and return each value in a table cell */}
                        {historylog.map((events, index) =>
                            <tr key={index}>
                                <td>{events._id}</td>
                                <td className="td-created-at">{events.createdAt}</td>
                                <td>{events.username}</td>
                                <td>{events.message}</td>
                                <td>{events.room}</td>
                            </tr>)}
                    </table>
                </div>
            </div>
        )
    }

}

export default ChatHistory;