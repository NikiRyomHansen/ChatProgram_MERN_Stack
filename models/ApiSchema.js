const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const api = new Schema(
    {
        urlRequested: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('apiLog', api);