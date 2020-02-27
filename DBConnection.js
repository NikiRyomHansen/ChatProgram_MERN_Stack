module.exports = function dbConnection() {
//Import the mongoose module
    const mongoose = require('mongoose');

// Import bluebird to take full advantage of Promises
    mongoose.Promise = require('bluebird');

//Set up default mongoose connection
    const mongoDB = "mongodb+srv://nikiryom:232Chatting@chataway-bbyke.mongodb.net/chataway?retryWrites=true&w=majority";

    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => (console.log(err)));

//Bind connection to error event (to get notification of connection errors)
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

}