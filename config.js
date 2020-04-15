// require dotenv to work with the heroku env variables and load them into process.env
const dotenv = require('dotenv');

dotenv.config();

// export the Atlas cloud username and password - these are obtained from the env variables pushed to Heroku
// But is temporarily unavailable due to the application not being fully integrated to my heroku domain.
// module.exports.username = process.env.ATLAS_CLOUD_USER;
// module.exports.password = process.env.ATLAS_CLOUD_PASS;

// temporary username and password for the database access
module.exports.username = "nikiryom";
module.exports.password = "YESiXuBlo6JBPVuZ";