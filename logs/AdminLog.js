const adminModel = require('../models/AdminSchema');

// save an event to the DB and export the function
module.exports = function admins(username, password) {

    // Create an instance of the eventLog model
    const adminLog = new adminModel({
        username,
        password
    });
};