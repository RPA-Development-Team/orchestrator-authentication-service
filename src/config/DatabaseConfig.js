const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

module.exports = {
    dbHost: process.env.DB_HOST,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbSchema: process.env.DB_SCHEMA,
    dbURL: process.env.DB_URL,
    dbPort: process.env.DB_PORT
};