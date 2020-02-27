/*--- All API routing and DB connection is in this file ---*/

const routes = require('express').Router();

// requiring mongoose models
const historyModel = require('../models/HistorySchema');
const eventLog = require('../models/EventSchema');
const roomModel = require('../models/RoomSchema');

// get request for the root, index view
routes.get('/', (req, res) => {
    // Returns the rendered view of the index file to the client
    res.render('index');
});


// api get request, querying all JSON objects in the collection history
routes.get('/api/history', (req, res) => {
    console.log('--- GET /api/history was requested ---');
    historyModel.find({}, (err, history) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(history);
    });
});

// api get request, querying all JSON objects in the given room in the collection "history"
routes.get('/api/history/:room', async function(req, res) {
    // Get the path variable from the URI
    const room = req.params.room;
    console.log(`--- GET /api/history/${room} was requested ---`);

    // save the mongoose query in the variable rooms, async await function to ensure the query finishes before
    // before the JSON is returned in the response
    let rooms = await historyModel.find({room: room })
        .catch(err => console.log(err));

    // return a the mongoose query rooms in a JSON response.
    res.json(rooms);
});

// api get request, querying all JSON objects in the collection eventLog
routes.get('/api/eventlog', (req, res) => {
    console.log('--- GET /api/eventlog was requested ---');
    eventLog.find({}, (err, eventLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(eventLog);
    });
});

routes.get('/api/roomLog', (req, res) => {
    console.log('--- GET /api/roomLog was requested ---');
    roomModel.find({}, (err, roomLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(roomLog);
    });
});

// exports the module so we can require it in other files.
module.exports = routes;