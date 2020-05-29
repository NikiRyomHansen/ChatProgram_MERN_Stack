/*--- Setup for express ---*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Require the view route and API routes
const routes = require('./Routes');
app.set('view engine', 'ejs');

// setting up middleware to access the public directory for the stylesheet (CSS)
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Setup middleware for routing, using the Routes.js file
app.use('/', routes);
const port = process.env.PORT || 5000;

server = app
    .listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });

// Require socket.io
const io = require('socket.io')(server);

module.exports = io;