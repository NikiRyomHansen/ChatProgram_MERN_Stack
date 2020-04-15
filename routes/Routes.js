/*--- Routing setup ---*/

const routes = require('express').Router();

// require log methods
const apiLog = require('../logs/ApiLog'); // logs the api calls
const roomAddLog = require('../logs/RoomAddLog');
const eventLog = require('../logs/EventLog');


// requiring mongoose models
const historyModel = require('../models/HistorySchema');
const eventModel = require('../models/EventSchema');
const roomModel = require('../models/RoomSchema');
const apiModel = require('../models/ApiSchema');
const roomAddModel = require('../models/RoomAddedSchema');
const adminModel = require('../models/AdminSchema');

// get request for the root, index view
routes.get('/', (req, res) => {
    // Returns the rendered view of the index file to the client
    res.render('index');
});

// get request returning the api file containing a list of api commands / paths.
routes.get('/api', (req, res) => {
    apiLog('/api');
    res.render('api');
});

// api get request, querying all JSON objects in the collection history
routes.get('/api/history', (req, res) => {
    console.log('--- GET /api/history was requested ---');
    apiLog('/api/history');
    historyModel.find({}, (err, history) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(history);
    });
});

// api get request, querying all JSON objects in the given room in the collection "history"
routes.get('/api/history/:room', async function (req, res) {
    // Get the path variable from the URI
    const room = req.params.room;
    console.log(`--- GET /api/history/${room} was requested ---`);
    apiLog('/api/history/' + room);

    // save the mongoose query in the variable rooms, async await function to ensure the query finishes before
    // before the JSON is returned in the response
    let rooms = await historyModel.find({room: room})
        .catch(err => console.log(err));

    // return a the mongoose query rooms in a JSON response.
    res.json(rooms);
});

// api get request, querying all JSON objects in the collection eventlog
routes.get('/api/eventlog', (req, res) => {
    console.log('--- GET /api/eventlog was requested ---');
    apiLog('/api/eventlog');
    eventModel.find({}, (err, eventLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(eventLog);
    });
});

// api get request, querying all JSON objects in the collection roomlog
routes.get('/api/roomlog', (req, res) => {
    console.log('--- GET /api/roomlog was requested ---');
    apiLog('/api/roomlog');
    roomModel.find({}, (err, roomLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(roomLog);
    });
});

// api get request, querying all JSON objects in the collection apilog
routes.get('/api/apilog', (req, res) => {
    console.log('--- GET /api/apilog was requested ---');
    apiLog('/api/apilog');
    apiModel.find({}, (err, theApiLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(theApiLog);
    });
});

// api get request, querying all JSON objects in the collection roomAddLog
routes.get('/api/rooms', (req, res) => {
    // Check if the corner room in /api/rooms exists
    roomAddModel.exists({room: "the corner room"}, (err, result) => {
        if (err) {
            res.send(err);
        }
        if (result === false) {
            // if the room does not exist, add it
            roomAddLog('the corner room',);
        }
    });
    // Check if the main room in /api/rooms exists
    roomAddModel.exists({room: "main room"}, (err, result) => {
        if (err) {
            res.send(err);
        }
        if (result === false) {
            // if the room does not exist, add it
            roomAddLog('main room',);
        }
    });
    console.log('--- GET /api/rooms was requested ---');
    apiLog('/api/rooms');
    roomAddModel.find({}, (err, roomsLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(roomsLog);
    });
});

// Get request for a single record of a room
routes.get('/api/room/:room', (req, res) => {
    console.log('--- GET "/api/room/:' + req.params.room +  '" was requested ---');
    // find a room by name
    roomAddModel.findOne({room: req.params.room}, (err, foundRoom) => {
        // if room isn't found
        if (!foundRoom) {
            res.status(400).json('Unable to find the room')
        } else {
            res.json(foundRoom);
        }
    }).catch((err) => console.log('Error finding room ' + err));
});

// Post request to create a new room
routes.post('/api/createroom', (req, res) => {
    const room = new roomAddModel(req.body);
    room.save()
        .then(() => {
            res.json('Room added successfully');
        })
        .catch(() => {
            res.status(400).send('Unable to save to database');
        });
});

// Put request to update a room by name
routes.put('/api/room/:room', (req, res) => {
    // Find a room by name
    roomAddModel.findOne({room: req.params.room}, (err, foundRoom) => {
        // if room isn't found
        if (!foundRoom) {
            res.status(400).json('Unable to find the room')
        } else {

            res.json('Found room: ' + req.params.room);

            console.log(req.body.room)
            console.log(req.body.status)
            // Update the room properties with the body
            foundRoom.room = req.body.room;
            foundRoom.status = req.body.status;

            // Save the updated room to the database
            foundRoom.save()
                .catch(() => {
                    console.log('Error saving room to database');
                    eventLog(undefined, 'Admin', 'ERROR', undefined, undefined,
                        'Error saving a room to database');
                });
        }
    });
});

// fetch the admin
routes.get('/api/admins', (req, res) => {
    console.log('--- GET /api/admins was requested ---');
    apiLog('/api/admins');

    // find the admin in the collection
    adminModel.find({}, (err, adminLog) => {
        if (err) return res.send(err);
        res.json(adminLog);
    })
});

// handle status code 404 if the page isn't found
routes.use((req, res) => {
    res.type("text/plain");
    res.status(404);
    res.send('404 - Not found \nGo to /api for possible URLs');
});

// exports the module so we can require it in other files.
module.exports = routes;