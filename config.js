// require dotenv to work with the heroku env variables and load them into process.env
if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

// export the Atlas cloud username and password - these are obtained from the env variables pushed to Heroku
module.exports.username = process.env.ATLAS_CLOUD_USER;
module.exports.password = process.env.ATLAS_CLOUD_PASS;
