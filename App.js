const express = require('express');
const app = express();

// Require the view route and API routes
const routes = require('./routes/ApiRoutes');
app.set('view engine', 'ejs');

// access the public directory for the stylesheet (CSS)
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// using middleware to connect our end points??? TODO: Is this correct??
app.use('/', routes);
// Listening on port 8080
server = app.listen(8080, () => {
    console.log('Listening on port: 8080');
});
// Require socket.io
const io = require('socket.io')(server);

//Import the mongoose module
const mongoose = require('mongoose');

// Import bluebird to take full advantage of Promises
mongoose.Promise = require('bluebird');

//Set up default mongoose connection
const mongoDB = "mongodb://localhost:27017/chataway";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => (console.log(err)));

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// requiring mongoose models
const historyModel = require('./models/History');
const eventModel = require('./models/EventLog');
const roomModel = require('./models/RoomSchema');

// on connection
io.on('connection', (socket) => {
    // Default username to give all connecting clients
    socket.username = "Anonymous";

    // Log the connected socket to the db.
    eventLog(socket.id, socket.username, 'CONNECTION', undefined, undefined,
        'Error logging connection');

    // Emit connection successful
    socket.emit('connection successful');

    // log "main room" to the roomLog when a client connects
    roomLog(socket.id, socket.username, 'MAIN ROOM', undefined);

    // Listen on "main room" and join main room
    socket.on('main room', () => {
    // get all rooms, filtering out the socket id.
        let rooms = (Object.keys(socket.rooms).filter(id => id !== socket.id));
        // if the socket is already in the main room
        if (rooms.includes('main room')) {
            // Emit a message tell the user that it is already in the given room
            socket.emit('already in room', 'Main Room');
            return;
        }
        socket.join('main room', () => {
            console.log(`--- ${socket.username} joined main room ---`);

            // emits a message to the client
            socket.emit('joined main room emit');

            // broadcast a message to all other clients informing this socket has joined the room
            socket.broadcast.to('main room').emit('joined main room broadcast', {
                username: socket.username
            });
            // Log joining the main room to the roomLog
            roomLog(socket.id, socket.username, 'MAIN ROOM');

            // Log joining the main room to the eventLog
            eventLog(socket.id, socket.username, 'JOIN', undefined, undefined,
                'Error logging "main room"');
        });
    });

    // Listen on "leave corner room"
    socket.on('leave corner room', (room) => {
        // get all rooms, filtering out the socket id.
        const rooms = (Object.keys(socket.rooms).filter(id => id !== socket.id));
        // if the socket is not in the room, then just return.
        if (!rooms.includes('the corner room')) {
            return;
        }
        // leave "the corner room"
        socket.leave(room, () => {
            console.log(`--- ${socket.username} left the corner room ---`);

            // broadcast to the corner room that the socket has left.
            socket.broadcast.to('the corner room').emit('leaving the corner room', {
                username: socket.username
            });
            // Log leaving the corner room to the roomLog
            roomLog(socket.id, socket.username, undefined, 'THE CORNER ROOM');

            // log leaving the corner room to the eventLog
            eventLog(socket.id, socket.username, 'LEAVE', undefined, undefined,
                `Error logging leaving ${room}`);
        });
    });

    // Listen on change_username
    socket.on('change username', (data) => {
        // if the users input is empty then return
        if (data.username === '') {
            return;
        }

        let tempUsername = socket.username;
        // If the user tries to change to an identical username then return.
        if (tempUsername === data.username) {
            socket.emit('invalid username', {
                username: socket.username
            });
            return;
        }
        socket.username = data.username;
        console.log(`--- "${tempUsername}" changed username to "${data.username}" ---`);
        io.to(`${socket.id}`).emit('change username', data.username);

        // log change username to the eventlog
        eventLog(socket.id, socket.username, 'CHANGE USERNAME', undefined, undefined,
            'Error logging "change username"');
    });

    // listen on main room message
    socket.on('main room message', (data, room) => {
        // if the message equals an empty string emit 'empty message'
        if (data.message === '') {
            socket.emit('empty message');
            return;
        }
        // Create an instance of the message model
        const message = historyLog(socket.id, socket.username, data.message, 'MAIN ROOM');

        // emit the message to main room emitting "main room message"
        io.to('main room').emit('main room message', message);

        // log send message to the event log
        eventLog(socket.id, socket.username, 'MESSAGE SENT', undefined, undefined,
            'Error logging "main room message"');
    });

    // Listen on typing and broadcasts
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // Listen on not typing and then broadcasts to all except current socket
    socket.on('not typing', () => {
        socket.broadcast.emit('not typing', {
            username: socket.username
        });
    });

    // Listen on "the corner room" - Join the corner room and leave main room
    socket.on('the corner room', (room) => {
        // get all rooms, filtering out the socket id.
        const rooms = (Object.keys(socket.rooms).filter(id => id !== socket.id));
        // If the socket is already in the room, emit a message telling it that.
        if (rooms.includes('the corner room')) {
            socket.emit('already in room', 'The Corner');
            return;
        }
        console.log(`--- ${socket.username} joined: '${room}' ---`);
        socket.join(room, () => {
            // emit and broadcast the event
            socket.emit('joined corner room emit');
            socket.broadcast.to(room).emit('joined corner room broadcast', {
                username: socket.username
            });

            // log joining the corner room and leaving the main room
            roomLog(socket.id, socket.username, 'THE CORNER ROOM', undefined);
            // Log joining the corner room
            eventLog(socket.id, socket.username, 'JOIN', undefined, undefined,
                'Error logging "the corner room"');
        });
        // if the socket is not in the main room, return
        if (!rooms.includes('main room')) {
            return;
        }
        // leaving the 'main room'
        socket.leave('main room', () => {
            console.log(`--- ${socket.username} left main room ---`);
            // Log leaving the main room to the roomLog
            roomLog(socket.id, socket.username, undefined, 'MAIN ROOM');
            // Log leaving main room to the eventLog
            eventLog(socket.id, socket.username, 'LEAVE', undefined, undefined,
                'Error logging "main room"');
            // broadcast to the main room that the socket has left
            socket.broadcast.to('main room').emit('leaving main room', {
                username: socket.username
            });
        });

    });

    // Listen on corner room message and emit a message to that room
    socket.on('corner room message', (data) => {
        if (data.message === '') {
            socket.emit('empty message');
            return;
        }
        // Log the message sent to the historyLog
        const message = historyLog(socket.id, socket.username, data.message, 'THE CORNER ROOM');

        // Emit the message to the corner room.
        io.to('the corner room').emit('corner room message', message);

        // Log sending a message in "the corner room"
        eventLog(socket.id, socket.username, 'MESSAGE SENT', undefined, undefined,
            'Error logging "corner room message"');
    });

    // Listen on disconnect TODO: Send to the correct room
    socket.on('disconnect', (room) => {
        socket.broadcast.to(room).emit('user disconnected', {
            username: socket.username
        });
        // TODO: Log to the roomLog when the user disconnects, log which room the user leaves.
        // log the disconnect to the eventLog
        eventLog(socket.id, socket.username, 'DISCONNECT', undefined, undefined,
            'Error logging "disconnect"');
        console.log(`--- ${socket.username} disconnected ---`);
    });

}); // end of on "connection"

/*--- Functions for saving to the DB ---*/

// Log socket events to eventLog collection
function eventLog(socketId, username, type, date = new Date().toLocaleDateString(),
                      time = new Date().toLocaleTimeString(), errorMessage) {

    // Create an instance of the eventLog model
    const eventLogConnection = new eventModel({
        socketId: socketId,
        username: username,
        type: type,
        date: date,
        time: time
    });
    // Save the instance to the db, if error print errorMessage and the error.
    return eventLogConnection.save()
        .catch(err => console.log(`*** ${errorMessage} *** ${err}`));
}

// Log each message sent to the history collection
function historyLog(socketId, username, message, room) {

    // Create an instance of the history model
    const history = new historyModel({
        socketId: socketId,
        username: username,
        message: message,
        room: room
    });
    // Save the instance to the db, if error log it to the eventLog
    history.save()
        .catch(eventLog(socketId, username, 'ERROR', undefined, undefined,
            'Error while saving to roomLog'));

    return history;
}

// Log each "joined room" or "left room" events in the roomlog collection
function roomLog(socketId, username, joinedRoom = undefined, leftRoom = undefined) {

    // Create an instance of the room model
    const roomLog = new roomModel({
        socketId: socketId,
        username: username,
        joinedRoom: joinedRoom,
        leftRoom: leftRoom
    });
    // Save the instance to the db, if error log it to the eventLog
    return roomLog.save()
        .catch(eventLog(socketId, username, 'ERROR', undefined, undefined,
            'Error while saving to roomLog'));
}