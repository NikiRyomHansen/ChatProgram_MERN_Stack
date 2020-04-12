import React, {Component} from 'react';
import axios from 'axios'

class AddRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: "",
            status: ""
        };
    }

    handleChange = e => {
        const {name, value} = e.target;

        this.setState(() => ({
            [name]: value
        }));
    }


    handleSubmit = e => {
        e.preventDefault();

        const {room, status} = this.state;
        this.setState(() => (
            {
                active: `New roomname: ${room}, status: ${status}`
            }
        ));
        const fetchItems = async () => {
            await axios.post('/api/createroom', {
                room: room, status: status
            });
            console.log("Fetched fetchItems")
        }
        fetchItems();

    }


    componentWillMount() {

        console.log("Component will mount")

    }



    render() {

        const {room, status, active} = this.state;

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Room Name
                        <input
                            type="text"
                            name="room"
                            value={room}
                            autoComplete="off"
                            onChange={this.handleChange}
                        />
                    </label>
                    <br/>
                    <label>
                        Status
                        <input
                            type="text"
                            name="status"
                            value={status}
                            autoComplete="off"
                            onChange={this.handleChange}
                        />
                        <br/>
                        <input type="submit" value="Submit"/>
                    </label>
                </form>
                <div>{active}</div>
            </div>
        );
    }
}

export default AddRoom;