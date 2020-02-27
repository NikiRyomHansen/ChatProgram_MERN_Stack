$(function () {
    // make connection
    const socket = io.connect('http://localhost:27017');

    // Declaring ans assigning values to variables for easier and more readable access
    const message = $('#message');
    const username = $('#username');
    const sendMessage = $('#send_message');
    const changeUsername = $('#change_username');
    const chatRoom = $('#chatroom');
    const isTyping = $('#is_typing');
    const theCornerBtn = $('#the_corner');
    const mainRoomBtn = $('#main_room');

    // Listen on connect and emit main room and new user
    socket.on('connect', () => {
        socket.emit('connection successful');
    });

    // Listen on connection successful and append a message to the client.
    socket.on('connection successful', () => {
        chatRoom.append("<p class='message'>Welcome to the chat! Your username is currently anonymous, " +
            "change your username if you wish to or stay anonymous.</p>");
    });

    // Listen on 'new user' and append a message that is broadcast to all sockets
    socket.on('new user in room', (data) => {
        chatRoom.append(`<p>${data.username} has joined the chat!</p>`);
    });

    // Emit typing on any keypress in the message input field
    message.bind('keypress', () => {
        socket.emit('typing');
    });

    // listen on typing and echo a message to all other sockets
    socket.on('typing', (data) => {
        isTyping.html(`<p><i>${data.username} is typing a message...</i></p>`);
    });

    // listen on stop typing and clear the String
    socket.on('not typing', () => {
        isTyping.html("");
    });

    // Emit message and not typing to stop the "is typing" from showing after message is sent.
    sendMessage.click(function () {
        socket.emit('message', {
            message: message.val()
        });
        // Clear the message input field
        message.val('');
        socket.emit('not typing');
    });

    // when the client hits ENTER on their keyboard emit the message
    message.on('keydown', ((e) => {
        if(e.keyCode === 13 || e.which === 13) {
            socket.emit('message', {
                message: message.val()
            });
            // Clear the message input field
            message.val('');
            socket.emit('not typing');
        }
    }));

    // Listen on new_message
    socket.on('message', (data) => {
        chatRoom.append(`<p class='message'>${data.username}: ${data.message}</p>`);
    });

    // on clicking changeUsername
    changeUsername.click(function () {
        // if the username input field is empty, append a message to the user
        if (username.val() === '') {
            chatRoom.append('<p>Username cannot be empty</p>');
            return;
        }
        // Emit "change username" and get the value of input field #username
        socket.emit('change username', {
            username: username.val()
        });
        // clear the username input field after 50 ms
        setTimeout(() => {
            username.val('');
        }, 50);
    });

    // on [Enter], emit "change username"
    username.on('keydown', ((e) => {
        if (e.keyCode === 13 || e.which === 13) {
            // if the username input field is empty, append a message to the user
            if (username.val() === '') {
                chatRoom.append('<p>Username cannot be empty</p>');
                return;
            }
            socket.emit('change username', {
                username: username.val()
            });
            // clear the username input field after 50 ms
            setTimeout(() => {
                username.val('');
            }, 50);
        }
    }));

    // Listen to a username change
    socket.on('change username', (data) => {
        console.log('username changed to:', data);
        chatRoom.append(`<p class='message'>You changed your username to: ${data}</p>`);
    });

    // Listen on "invalid username"
    socket.on('invalid username', (data) => {
        if (username.val() === data.username)
            chatRoom.append(`<p>Username cannot be empty or equal to your old username</p>`);
    });

    // Listen on "user disconnected" and append a message to the chatroom
    socket.on('user disconnected', (data) => {
        chatRoom.append(`<p class='message'>${data.username} has disconnected</p>`);
    });

    // listen on "empty message" and append a message to chatroom
    socket.on('empty message', () => {
        chatRoom.append("<p class='message'>Stop trying to send an empty message silly...</p>");
    });

    // on clicking mainRoomBtn emit "main room" and "leave corner room" sending "the corner room" to the server
    mainRoomBtn.click(() => {
        socket.emit('switch room', 'main room');
        // socket.emit('leave corner room', 'the corner room');
    });

    // Listen on 'switch room', depending on the data sent by the server, enter either if statements
    socket.on('switch room', (data) => {
        if (data.room === 'the corner room') {
            chatRoom.append("<p class='message'>You have joined 'The Corner'</p>");
        } else if (data.room === 'main room') {
            chatRoom.append("<p class='message'>You have joined the 'Main Room'</p>");
        }
    });

    socket.on('left room', (data) => {
        chatRoom.append(`<p>${data.username} has left the chat</p>`)
    });

    // on clicking theCornerBtn, emit "the corner room"
    theCornerBtn.click(function () {
        socket.emit('switch room', 'the corner room');
    });

    // listen on "already in room"
    socket.on('already in room', (room) => {
        chatRoom.append(`<p>You are already in '${room}'</p>`);
    });

}); // end of function