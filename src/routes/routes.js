const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

router.use('/authenticate', authRoutes);

module.exports = router;