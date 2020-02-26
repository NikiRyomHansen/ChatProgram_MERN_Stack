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

// using middleware to connect our end points??? TODO: Is this correct?
app.use('/', routes);
// Listening on port 8080
server = app.listen(8080, () => {
    console.log('Listening on port: 8080');
});

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
const eventLog = require('./models/EventLog');
const roomModel = require('./models/RoomSchema');

// Require socket.io
const io = require('socket.io')(server);
// TODO: Add Eventlogging to all error messages.
// on connection
io.on('connection', (socket) => {
    // Default username to give all connecting clients
    socket.username = "Anonymous";

    // Log the connected socket to the db.
    eventLogging(socket.id, socket.username, 'CONNECTION', undefined, undefined,
        'Error logging connection');

    // Emit connection successful
    socket.emit('connection successful');

    // log "main room" to the roomLog when a client connects
    roomLog(socket.id, socket.username, 'main room', undefined,
        'Error saving roomLog to db when joining "main room"');

    // Listen on "main room" and join main room
    socket.on('main room', (room) => {
        console.log('---', socket.username, 'joined:', room, '---');
        socket.join(room);

        // Log joining the main room
        eventLogging(socket.id, socket.username, 'JOIN', undefined, undefined,
            'Error logging "main room"');
    });

    // Broadcast a message that a new user has joined to the main room
    socket.broadcast.to('main room').emit('new user in chat');

    // Listen on change_username
    socket.on('change username', (data) => {
        // if the users input is empty then return
        if (data.username === '') return;
        // TODO: Emit that the username field cannot be empty or the same as before when trying to change username
        let tempUsername = socket.username;
        // If the user tries to change to an identical username then return.
        if (tempUsername === data.username) return;
        socket.username = data.username;
        console.log('--- "' + tempUsername + '" changed username to "' + data.username + '" ---');
        io.to(`${socket.id}`).emit('change username', data.username);

        // log change username to the eventlog
        eventLogging(socket.id, socket.username, 'CHANGE USERNAME', undefined, undefined,
            'Error logging "change username"');
    });

    // listen on main room message
    socket.on('main room message', (data) => {
        // if the message equals an empty string emit 'empty message'
        if (data.message === '') {
            socket.emit('empty message');
            return;
        }
        // Create an instance of the message model
        const message = sendMessage(socket.id, socket.username, data.message, 'main room',
            'Error saving main room message to the db');

        // emit the message to main room emitting "main room message"
        io.to('main room').emit('main room message', message);

        // log send message to the event log
        eventLogging(socket.id, socket.username, 'MESSAGE SENT', undefined, undefined,
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
        console.log('---', socket.username, 'joined:', room, '---');
        socket.join(room, () => {
            // emit and broadcast the event
            socket.emit('joined corner room emit');
            socket.broadcast.to(room).emit('joined corner room broadcast', {
                username: socket.username
            });

            // log joining the corner room and leaving the main room
            roomLog(socket.id, socket.username, 'the corner room', 'main room',
                'Error saving roomLog to db when joining "the corner room"');
            // Log joining the corner room
            eventLogging(socket.id, socket.username, 'JOIN', undefined, undefined,
                'Error logging "the corner room"');
        });
        // leaving the 'main room'
        socket.leave('main room', () => {
            console.log('---', socket.username, 'left main room ---');

            // Log leaving main room
            eventLogging(socket.id, socket.username, 'LEAVE', undefined, undefined,
                'Error logging "main room"');
        });
        socket.broadcast.to('main room').emit('leaving main room', {
            username: socket.username
        });
    });

    // Listen on corner room message and emit a message to that room
    socket.on('corner room message', (data) => {
        if (data.message === '') {
            socket.emit('empty message');
            return;
        }
        const message = sendMessage(socket.id, socket.username, data.message, 'the corner room',
            'Error saving main room message to the db');

        io.to('the corner room').emit('corner room message', message);

        // Log sending a message in "the corner room"
        eventLogging(socket.id, socket.username, 'MESSAGE SENT', undefined, undefined,
            'Error logging "corner room message"');
    });

    // Listen on disconnect TODO: Add room functionality, so it will send to all rooms the socket is in
    socket.on('disconnect', (room) => {
        socket.broadcast.to(room).emit('user disconnected', {
            username: socket.username
        });

        // log the disconnect to the eventLog
        eventLogging(socket.id, socket.username, 'DISCONNECT', undefined, undefined,
            'Error logging "disconnect"');

        console.log('---', socket.username, 'disconnected ---');
    });

    // print each room the connected socket is in TODO: Create client-side code and add emitting the room data
    socket.on('print rooms', () => {
        console.log(socket.username, 'is in the following rooms:');
        // looping through the sockets connected rooms and printing them
        for (let x in socket.rooms) {
            console.log(x);
        }
        socket.emit('print rooms', {
            username: socket.username
        });
    });

    // Listen on "user history"
    socket.on('user history', () => {
        // Emits "display user history"
        socket.emit('display user history');
        // Log the "user history" event to the DB
        eventLogging(socket.id, socket.username, 'USER HISTORY', undefined, undefined,
            'Error logging the user history');
    });

    // Listen on "user history by room"
    socket.on('user history by room', () => {
        // Emits "display user history by room"
        socket.emit('display user history by room');
    });
}); // on "connection"

/*--- Functions for saving to the DB ---*/

// Log socket events to eventLog collection
function eventLogging(socketId, username, type, date = new Date().toLocaleDateString(),
                      time = new Date().toLocaleTimeString(), errorMessage) {

    // Create an instance of the eventLog model
    const eventLogConnection = new eventLog({
        socketId: socketId,
        username: username,
        type: type,
        date: date,
        time: time
    });
    // Save the instance to the db, if error print errorMessage and the error.
    return eventLogConnection.save()
        .catch(err => console.log('***', errorMessage, '***', err));
}

// Log each message sent to the history collection
function sendMessage(socketId, username, message, room, errorMessage) {

    // Create an instance of the history model
    const sendMessage = new historyModel({
        socketId: socketId,
        username: username,
        message: message,
        room: room
    });
    // Save the instance to the db, if error print errorMessage and the error.
    sendMessage.save()
        .catch(err => console.log('***', errorMessage, '***', err));

    return sendMessage;
}

// Log each "joined room" or "left room" events in the roomlog collection
function roomLog(socketId, username, joinedRoom = undefined, leftRoom = undefined, errorMessage) {

    // Create an instance of the room model
    const roomLog = new roomModel({
        socketId: socketId,
        username: username,
        joinedRoom: joinedRoom,
        leftRoom: leftRoom
    });
    // Save the instance to the db, if error print errorMessage and the error.
    return roomLog.save()
        .catch(err => console.log('***', errorMessage, '***', err));
}