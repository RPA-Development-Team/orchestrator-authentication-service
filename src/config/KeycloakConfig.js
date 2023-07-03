const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
    KCClientId: process.env.KC_CLIENT_ID,
    KCCLientSecret: process.env.KC_CLIENT_SECRET,
    KCUrl: process.env.KC_URL
};