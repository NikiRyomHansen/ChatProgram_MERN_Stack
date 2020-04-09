const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newRoom = new Schema(
    {
        room: String,
        status: String,
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('newRoom', newRoom);