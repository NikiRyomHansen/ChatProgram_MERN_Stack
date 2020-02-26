$(function () {
    // make connection
    const socket = io.connect('http://localhost:8080');

    // Declaring ans assigning values to variables for easier and more readable access
    const message = $('#message');
    const username = $('#username');
    const sendMessage = $('#send_message');
    const sendMessageCorner = $('#send_message_corner');
    const changeUsername = $('#change_username');
    const chatRoom = $('#chatroom');
    const isTyping = $('#is_typing');
    const theCornerBtn = $('#the_corner');
    const mainRoomBtn = $('#main_room');

    // Listen on connect and emit main room and new user
    socket.on('connect', () => {
        socket.emit('connection successful');
        socket.emit('main room', 'main room');
        socket.emit('new user');
    });

    // Listen on connection successful and append a message to the client.
    socket.on('connection successful', () => {
        chatRoom.append("<p class='message'>Welcome to the chat! Your username is currently anonymous, " +
            "change your username if you wish to or stay anonymous.</p>");
    });

    // Emit typing
    message.bind('keypress', () => {
        socket.emit('typing');
    });

    // listen on typing
    socket.on('typing', (data) => {
        isTyping.html(`<p><i>${data.username} is typing a message...</i></p>`);
    });

    // listen on stop typing
    socket.on('not typing', () => {
        isTyping.html("");
    });

    // Emit message and not typing to stop the "is typing" from showing after message is sent.
    sendMessage.click(function () {
        socket.emit('main room message', {
            message: message.val()
        });
        // Clear the message input field
        message.val('');
        socket.emit('not typing');
    });

    // when the client hits ENTER on their keyboard emit the message
    message.on('keydown', ((e) => {
        if(e.keyCode === 13 || e.which === 13) {
            socket.emit('main room message', {
                message: message.val()
            });
            // Clear the message input field
            message.val('');
            socket.emit('not typing');
        }
    }));

    // Listen on new_message
    socket.on('main room message', (data) => {
        chatRoom.append(`<p class='message_main'>${data.username}: ${data.message}</p>`);
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

    // Listen on leaving main room - broadcast message when leaving room
    socket.on('leaving main room', (data) => {
        chatRoom.append(`<p class='message'>${data.username} has left the channel</p>`);
    });

    // on clicking mainRoomBtn emit "main room" and "leave corner room" sending "the corner room" to the server
    mainRoomBtn.click(() => {
        socket.emit('main room');
        socket.emit('leave corner room', 'the corner room');
    });

    // Listen on "joined main room emit" and append a message to the chatRoom
    socket.on('joined main room emit', () => {
        chatRoom.append("<p class='message'>You have joined the Main Room</p>");
    });

    // Listen on "joined main room broadcast" and append a message to the chatroom
    socket.on('joined main room broadcast', (data) => {
        chatRoom.append(`<p class='message'>${data.username} has joined the channel!</p>`);
    });

    // Listen on "leaving the corner room" and append a message to the chatRoom
    socket.on('leaving the corner room', (data) => {
        chatRoom.append(`<p class='message'>${data.username} has left the channel</p>`);
    });

    // on clicking theCornerBtn, emit "the corner room"
    theCornerBtn.click(function () {
        socket.emit('the corner room', 'the corner room');
    });

    // listen on joined corner room emit and inform the client that it has changed channel
    socket.on('joined corner room emit', () => {
        chatRoom.append("<p class='message'>You have joined The Corner Room</p>");
    });

    // listen on joined corner room broadcast and inform all clients in the channel who has joined
    socket.on('joined corner room broadcast', (data) => {
        chatRoom.append(`<p class='message'>${data.username} has joined the channel!</p>`);
    });

    // listen on "already in room"
    socket.on('already in room', (room) => {
        chatRoom.append(`<p>You are already in '${room}'</p>`);
    });

    // Emits a message to the corner room
    sendMessageCorner.click(() => {
        socket.emit('corner room message', {
            message: message.val()
        });
        // Clears the input field
        message.val('');
        socket.emit('not typing');
    });

    // Listen on corner room message
    socket.on('corner room message', (data) => {
        chatRoom.append(`<p class='message_main'>${data.username}: ${data.message}</p>`);
    });


}); // end of function