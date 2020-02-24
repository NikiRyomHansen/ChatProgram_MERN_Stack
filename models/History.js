const mongoose = require('mongoose');
// Define Schema
const Schema = mongoose.Schema;

// instantiate message Schema
const history = new Schema(
    {
        socketId: String,
        username: String,
        message: String,
        room: String
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('history', history);