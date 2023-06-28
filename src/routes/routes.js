const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const licenseRoutes = require('./licenseRoutes');

router.use('/auth', authRoutes);
router.use('/license', licenseRoutes);

module.exports = router;