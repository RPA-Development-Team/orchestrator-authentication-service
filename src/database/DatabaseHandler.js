const {Pool} = require('pg');
const {dbHost, dbUsername, dbPassword, dbSchema, dbPort} = require('../config/DatabaseConfig');

exports.pool = new Pool({
    user: dbUsername,
    database: dbSchema,
    password: dbPassword,
    port: dbPort,
    host: dbHost,
    ssl: true
});