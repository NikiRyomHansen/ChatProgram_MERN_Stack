import React, {useEffect, useState} from "react";
import axios from 'axios';
import UpdateItemTwoProperties from "./API/UpdateItemTwoProperties";

const AddRoom = ({match}) => {

    const [room, setRoom] = useState("");
    const [status, setStatus] = useState("");
    const [added, setAdded] = useState("");


    // TODO: make generic handleChange and import
    const handleRoomChange = (e) => {
        setRoom(e.target.value)
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
    };

    // TODO: Add a redirect button

    const handleSubmit = e => {
        e.preventDefault();
        console.log(match.params.room)
        if (match.params.room === undefined) {
            postItem()
                .then(() => {
                    setAdded('Added room: "' + room + '", Status: "' + status + '"');
                })
                .catch(err => console.log('Error posting item: ' + err));
        }
        else {
            updateItem()
                .then(() => {
                    setAdded('Made changes to room: "' + room + '", Status: "' + status + '"');
                })
                .catch(err => console.log('Error updating item: ' + err));
        }
    };

    //
    const postItem = async () => {
        await axios.post('/api/createroom', {
            room: room,
            status: status
        });
    };

    // TODO: Handle status code 400 in Routes.js when parameter is empty
    // get the param item and set the state corresponding to passed object
    const fetchItem = async () => {
        await axios.get(
            `/api/room/${match.params.room}`)
            .then((res) => {
                setRoom(res.data.room);
                setStatus(res.data.status);
            })
            .catch((err) => {
                console.log("Response from server: " + err.response.data);
            });
    };

    // (put) update the current room to the updated state
    const updateItem = async () => {
        const data = UpdateItemTwoProperties("room", room, "status", status);
        await axios.put(`/api/room/${match.params.room}`, data)
            .catch(err => console.log(err));
    };

    // get the current room on componentDidMount
    useEffect(() => {
        fetchItem();
    }, []);

    // TODO: Add a dropDownList for the status with two options, where inactive is selected
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Room Name
                    <input
                        type="text"
                        name="room"
                        value={room}
                        autoComplete="off"
                        onChange={handleRoomChange}
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
                        onChange={handleStatusChange}
                    />
                    <br/>
                    <input type="submit" value="Submit"/>
                </label>
            </form>
            <b>{added}</b>
        </div>
    );
}


export default AddRoom;