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
    const userHistory = $('#user_history');
    const userHistoryByRoom = $('#user_history_by_room');

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
        message.val('');
        socket.emit('not typing');
    });

    // Listen on new_message
    socket.on('main room message', (data) => {
        chatRoom.append(`<p class='message_main'>${data.username}: ${data.message}</p>`);
    });

    // Emit a username
    changeUsername.click(function () {
        socket.emit('change username', {
            username: username.val()
        });
    });

    // Listen to a username change
    socket.on('change username', (data) => {
        console.log('username changed to:', data);
        chatRoom.append(`<p class='message'>You changed your username to: ${username.val()}</p>`);
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

    // listen on new user in chat and broadcast a message to users
    socket.on('new user in chat', () => {
        chatRoom.append("<p class='message'>New user has joined the chat!</p>");
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

    // Emits "user history" on click
    userHistory.click(() => {
        socket.emit('user history');
    });

    // TODO: Possibly add an admin who can view the history, so not all users can see the history
    // Listen on "display user history" and gets the messages collection from the db.
    socket.on('display user history', () => {
        // get request for /api/history, getting all the data in the history collection
        $.get('http://localhost:8080/api/history', (data) => {
            chatRoom.append("<p>Chat record from the history collection:</p>")
            // iterate through each JSON object in the collection and call addMessage to append it to the chatRoom
            data.forEach(addMessage);
        });
    });

    // on clicking userHistoryByRoom, emit "user history by room"
    userHistoryByRoom.click(() => {
        socket.emit('user history by room');
    });

    // appends a message to the chatRoom
    function addMessage(data) {
        chatRoom.append(`<p class='message_main'>${data.username}: ${data.message}</p>`);
    }

}); // end of function