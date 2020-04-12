const roomAddedModel = require('../models/RoomAddedSchema');

module.exports = function roomAddedLog(room, status = "Active") {

    const roomAddedLog = new roomAddedModel({
        room,
        status
    });

    return roomAddedLog.save()
        .catch(error => console.log(error));

}