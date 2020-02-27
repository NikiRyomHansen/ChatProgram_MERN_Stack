// require api schema and eventlog
const apiModel = require('../models/ApiSchema');

// save an api request to the db and export the function
module.exports = function apiLog(URI) {

    // Create an instance of the api model
    const api = new apiModel({
        urlRequested: URI
    });
    // save the instance to the db, if error, print the error
    api.save()
        .catch(error => console.log(error));
}