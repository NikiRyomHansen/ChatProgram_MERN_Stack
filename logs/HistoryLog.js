const historyModel = require('../models/HistorySchema');
const eventLog = require('../logs/EventLog');

// save an event to the DB and export the function
module.exports = function historyLog(socketId, username, message, room) {

    // Create an instance of the history model
    const history = new historyModel({
        socketId: socketId,
        username: username,
        message: message,
        room: room
    });
    // Save the instance to the db, if error log it to the eventLog
    history.save()
        .catch(error => {
            eventLog(socketId, username, 'HISTORY ERROR', undefined, undefined,
                `Error while saving to history. Error message: ${error}`);
        });

    return history;
}