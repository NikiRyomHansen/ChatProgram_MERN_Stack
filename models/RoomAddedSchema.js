const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newRoom = new Schema(
    {
        room: { type: String, required: true },
        status: { type: String, required: true }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('newRoom', newRoom);