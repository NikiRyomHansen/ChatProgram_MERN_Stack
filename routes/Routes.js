/*--- Routing setup ---*/

const routes = require('express').Router();

// require log methods
const apiLog = require('../logs/ApiLog'); // logs the api calls

// requiring mongoose models
const historyModel = require('../models/HistorySchema');
const eventModel = require('../models/EventSchema');
const roomModel = require('../models/RoomSchema');
const apiModel = require('../models/ApiSchema');

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
routes.get('/api/history/:room', async function(req, res) {
    // Get the path variable from the URI
    const room = req.params.room;
    console.log(`--- GET /api/history/${room} was requested ---`);
    apiLog('/api/history/' + room);

    // save the mongoose query in the variable rooms, async await function to ensure the query finishes before
    // before the JSON is returned in the response
    let rooms = await historyModel.find({room: room })
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

// handle status code 404 if the page isn't found
routes.use((req, res) => {
    res.type("text/plain");
    res.status(404);
    res.send('404 - Not found \nGo to /api for possible URLs');
});

// exports the module so we can require it in other files.
module.exports = routes;