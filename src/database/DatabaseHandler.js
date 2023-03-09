const mysql = require('mysql2');
const { dbHost, dbUsername, dbPassword, dbSchema } = require('../config/DatabaseConfig');

var promisePool;
    try {
        let pool = mysql.createPool({
            host: dbHost,
            user: dbUsername,
            password: dbPassword,
            database: dbSchema
        });
        promisePool = pool.promise();
    } catch (err) {
        console.log("Failed to connect to MySQL", err);
    }

module.exports = {
    pool: promisePool
}