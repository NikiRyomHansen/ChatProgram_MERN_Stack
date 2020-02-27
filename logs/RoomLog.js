const roomModel = require('../models/RoomSchema');
const eventLog = require('../logs/EventLog');


// save an event to the DB and export the function
module.exports = function roomLog(socketId, username, joinedRoom = undefined, leftRoom = undefined) {

    // Create an instance of the room model
    const roomLog = new roomModel({
        socketId: socketId,
        username: username,
        joinedRoom: joinedRoom,
        leftRoom: leftRoom
    });
    // Save the instance to the db, if error log it to the eventLog
    return roomLog.save()
        .catch(error => {
            eventLog(socketId, username, 'ROOM ERROR', undefined, undefined,
                `Error while saving to roomLog. Error message: ${error}`);
        });

}