const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rooms = new Schema(
    {
        socketId: {type: String, required: true},
        username: {type: String, required: true},
        joinedRoom: String,
        leftRoom: String
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('roomLog', rooms);