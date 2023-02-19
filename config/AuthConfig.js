const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
    jwtSecret: process.env.JWT_SECRET
};