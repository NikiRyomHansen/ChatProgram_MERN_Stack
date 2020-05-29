/*--- Client setup ---*/

// on page load
$(function () {
    // make connection, load the socket with the hostname given
    // const socket = io(window.location.hostname); // -- for Heroku hosting
    const socket = io('http://localhost:5000'); // -- for localhost
    console.log('page loaded successfully');

    // Declaring ans assigning values to variables for easier and more readable access
    const message = $('#message');
    const username = $('#username');
    const sendMessage = $('#send_message');
    const changeUsername = $('#change_username');
    const chatRoom = $('#feedback');
    const isTyping = $('#is_typing');
    const theCornerBtn = $('#the_corner');
    const mainRoomBtn = $('#main_room');
    const scrollDown = document.getElementById('feedback');

    // Listen on connect and emit main room and new user
    socket.on('connect', () => {
        socket.emit('connection successful');
    });

    // Listen on connection successful and append a message to the client.
    socket.on('connection successful', () => {
        chatRoom.append("<p class='message'>Welcome to the chat! Your username is currently anonymous, " +
            "change your username if you wish to or stay anonymous.</p>");
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

    // Listen on 'new user' and append a message that is broadcast to all sockets
    socket.on('new user in room', (data) => {
        chatRoom.append(`<p>${data.username} has joined the chat!</p>`);
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

    // Emit typing on any keypress in the message input field
    message.bind('keypress', () => {
        if (message.val() === ''){
            return;
        }
        socket.emit('typing');
    });

    // listen on typing and echo a message to all other sockets
    socket.on('typing', (data) => {
        isTyping.html(`<p><i>${data.username} is typing a message...</i></p>`);
    });

    // listen on stop typing and clear the String
    socket.on('not typing', () => {
        isTyping.html("");
        console.log('not typing')
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
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

    // on clicking changeUsername
    changeUsername.click(function () {
        // if the username input field is empty, append a message to the user
        if (username.val() === '') {
            chatRoom.append('<p>Username cannot be empty</p>');
            scrollDown.scrollTop = scrollDown.scrollHeight;
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
                scrollDown.scrollTop = scrollDown.scrollHeight;
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
        chatRoom.append(`<p class='message'>You changed your username to: ${data}</p>`);
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

    // Listen on "invalid username"
    socket.on('invalid username', (data) => {
        if (username.val() === data.username)
            chatRoom.append(`<p>Username cannot be equal to your old username</p>`);
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

    // Listen on "user disconnected" and append a message to the chatroom
    socket.on('user disconnected', (data) => {
        chatRoom.append(`<p class='message'>${data.username} has disconnected</p>`);
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

    // listen on "empty message" and append a message to chatroom
    socket.on('empty message', () => {
        chatRoom.append("<p class='message'>Stop trying to send an empty message silly...</p>");
        scrollDown.scrollTop = scrollDown.scrollHeight;
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
            scrollDown.scrollTop = scrollDown.scrollHeight;
        } else if (data.room === 'main room') {
            chatRoom.append("<p class='message'>You have joined the 'Main Room'</p>");
            scrollDown.scrollTop = scrollDown.scrollHeight;
        }
    });

    socket.on('left room', (data) => {
        chatRoom.append(`<p>${data.username} has left the chat</p>`);
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

    // on clicking theCornerBtn, emit "the corner room"
    theCornerBtn.click(function () {
        socket.emit('switch room', 'the corner room');
    });

    // listen on "already in room"
    socket.on('already in room', (room) => {
        chatRoom.append(`<p>You are already in '${room}'</p>`);
        scrollDown.scrollTop = scrollDown.scrollHeight;
    });

}); // end of function