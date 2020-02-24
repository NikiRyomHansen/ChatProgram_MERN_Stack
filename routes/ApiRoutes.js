/*--- All API routing and DB connection is in this file ---*/

const routes = require('express').Router();

// requiring mongoose models
const historyModel = require('../models/History');
const eventLog = require('../models/EventLog');
const roomModel = require('../models/RoomSchema');


// get request for the index view
routes.get('/', (req, res) => {
    res.render('index');
});

// api get request, querying all JSON objects in the collection history
routes.get('/api/history', (req, res) => {
    console.log('--- /api/history was requested ---');
    historyModel.find({}, (err, history) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(history);
    });
});

// api get request, querying all JSON objects in the collection eventLog
routes.get('/api/eventlog', (req, res) => {
    console.log('--- /api/eventlog was requested ---');
    eventLog.find({}, (err, eventLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(eventLog);
    });
});

routes.get('/api/roomLog', (req, res) => {
    console.log('--- /api/roomLog was requested ---');
    roomModel.find({}, (err, roomLog) => {
        if (err) return err;
        // returns a response with the JSON objects in the mongoose query
        res.json(roomLog);
    });
});

// exports the module so we can require it in other files.
module.exports = routes;