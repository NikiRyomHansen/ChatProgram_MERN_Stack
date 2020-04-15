const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema to create new admins
const adminSchema = new Schema(
    {
        username: String,
        password: String
    });

module.exports = mongoose.model('admins', adminSchema);
