const eventModel = require('../models/EventSchema');

// save an event to the DB and export the function
module.exports = function events(socketId, username, type, date = new Date().toLocaleDateString(),
                time = new Date().toLocaleTimeString(), errorMessage) {

    // Create an instance of the eventLog model
    const eventLog = new eventModel({
        socketId,
        username,
        type,
        date,
        time
    });
    // Save the instance to the db, if error print errorMessage and the error.
    return eventLog.save()
        .catch(error => console.log(`errorMessage: ${errorMessage}, error: ${error}`));
}