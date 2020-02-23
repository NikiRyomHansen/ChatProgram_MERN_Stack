const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Eventlog Schema to track every socket.io event (Except "typing" and "not typing").
const eventLog = new Schema(
    {
        socketId: String,
        username: String,
        type: String,
        date: String,
        time: String
    });

module.exports = mongoose.model('eventLog', eventLog);
