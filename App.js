/*--- Server setup ---*/

// Require express setup
const io = require('./routes/Express');

// Require MongoDB connection and Mongoose module
const mongoose = require('./DBConnection');
mongoose();

// require logs
const eventLog = require('./logs/EventLog');
const roomLog = require('./logs/RoomLog');
const historyLog = require('./logs/HistoryLog');

// on connection
io.on('connection', (socket) => {

    // Listen on 'connection successful', assign the sockets room to 'main room', emit and broadcast the new user
    socket.on('connection successful', (username) => {
        // Default username to give all connecting clients
        socket.username = 'Anonymous';
        // Assigning socket room to 'main room'
        socket.room = 'main room';
        socket.join('main room'); // join 'main room'
        console.log(`--- ${socket.username} joined 'main room' ---`);
        socket.emit('connection successful');
        socket.broadcast.to(socket.room).emit('new user in room', {
            username: socket.username
        });
        // Log the connected socket to the db
        eventLog(socket.id, socket.username, 'CONNECTION', undefined, undefined,
            'Error logging connection');
        eventLog(socket.id, socket.username, 'JOIN', undefined, undefined,
            `Error joining ${socket.room}`);
        // log "main room" to the roomLog when a client connects
        roomLog(socket.id, socket.username, 'main room');

    });

    // Listen on "switch room" and join the room the client requests
    socket.on('switch room', (data) => {
        // if the socket is in the main room
        if (socket.room === 'main room' && data === 'the corner room') {
            // leave current room 'main room'
            socket.leave(socket.room, () => {
                console.log(`--- ${socket.username} left the ${socket.room} ---`);
                // broadcast to the sockets in current room and to 'left room' sending the username to the client
                socket.broadcast.to('main room').emit('left room', {
                    username: socket.username
                });
                eventLog(socket.id, socket.username, 'LEAVE', undefined, undefined,
                    'Error logging leaving main room');
                roomLog(socket.id, socket.username, undefined, 'main room');
            });
            // Join the corner room and set the sockets room to 'the corner room'
            socket.join('the corner room', () => {
                socket.room = data;
                console.log(`--- ${socket.username} joined 'the corner room' ---`);

                // Emit 'joined corner room' and send the room to the client
                socket.emit('switch room', {
                    username: socket.username,
                    room: socket.room
                });
                // Broadcast to all except the socket that it has joined the current room
                socket.broadcast.to(socket.room).emit('new user in room', {
                    username: socket.username
                });
                eventLog(socket.id, socket.username, 'JOIN', undefined, undefined,
                    'Error logging joining the corner room');
                roomLog(socket.id, socket.username, 'the corner room');
            });
            // if the socket is in the corner room and clicks the main room btn
        } else if (socket.room === 'the corner room' && data === 'main room') {
            // leave current room 'the corner room'
            socket.leave(socket.room, () => {
                console.log(`--- ${socket.username} left the '${socket.room}' ---`);
                // broadcast to the sockets in current room - sending the username to the client
                socket.broadcast.to('the corner room').emit('left room', {
                    username: socket.username
                });
                // log the event leaving the corner room
                eventLog(socket.id, socket.username, 'LEAVE', undefined, undefined,
                    'Error logging leaving the corner room')
                roomLog(socket.id, socket.username, undefined, 'the corner room');
            });
            // Join the main room and set the sockets room to the 'main room'
            socket.join('main room', () => {
                socket.room = data;
                console.log(`--- ${socket.username} joined 'main room' ---`);

                // Emit 'joined corner room' and send the room to the client
                socket.emit('switch room', {
                    room: socket.room
                });
                // Broadcast to all except the socket that it has joined the current room
                socket.broadcast.to(socket.room).emit('new user in room', {
                    username: socket.username
                });
                // log joining a room
                eventLog(socket.id, socket.username, 'JOIN', undefined, undefined,
                    'Error logging joining main room');
                roomLog(socket.id, socket.username, 'main room');
            });
        } else {
            // if the socket is in the room it's trying to join, emit 'already in room' and send the room to the client
            socket.emit('already in room', socket.room)
        }
    });

    // Listen on change_username
    socket.on('change username', (data) => {
        // if the users input is empty then return
        if (data.username === '') {
            return;
        }

        let tempUsername = socket.username;
        // If the user tries to change to an identical username then emit the username and return.
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

    // listen on  message and send a message to the room the socket is in
    socket.on('message', (data) => {
        // if the message equals an empty string emit 'empty message'
        if (data.message === '') {
            socket.emit('empty message');
            return;
        }
        // Create an instance of the historyLog and log the message
        const message = historyLog(socket.id, socket.username, data.message, socket.room);

        // emit the message to the room the socket is currently in emitting "main room message"
        io.to(socket.room).emit('message', message);

        // log send message to the event log
        eventLog(socket.id, socket.username, 'MESSAGE SENT', undefined, undefined,
            'Error logging "message"');
    });

    // Listen on typing and broadcasts
    socket.on('typing', () => {
        socket.broadcast.to(socket.room).emit('typing', {
            username: socket.username
        });
    });

    // Listen on not typing and then broadcasts to all except current socket
    socket.on('not typing', () => {
        socket.broadcast.to(socket.room).emit('not typing');
    });

    // Listen on disconnect
    socket.on('disconnect', () => {
        socket.broadcast.to(socket.room).emit('user disconnected', {
            username: socket.username
        });

        // Log to the roomLog that the user leaves its current room
        roomLog(socket.id, socket.username, undefined, socket.room);
        // log the disconnect to the eventLog
        eventLog(socket.id, socket.username, 'DISCONNECT', undefined, undefined,
            'Error logging "disconnect"');
        console.log(`--- ${socket.username} disconnected ---`);
    });

}); // end of on "connection"
