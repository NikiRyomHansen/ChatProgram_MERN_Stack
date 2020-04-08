// require dotenv to work with the heroku env variables and load them into process.env
const dotenv = require('dotenv');

dotenv.config();

// export the Atlas cloud username and password - these are obtained from the env variables pushed to Heroku
// module.exports.username = process.env.ATLAS_CLOUD_USER;
module.exports.username = "nikiryom";
// module.exports.password = process.env.ATLAS_CLOUD_PASS;
module.exports.password = "YESiXuBlo6JBPVuZ";