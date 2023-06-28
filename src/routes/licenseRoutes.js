const express = require('express');
const licenseController = require('../controllers/LicenseController');
const router = express.Router();

router.route("/update").put(licenseController.setUserLicense);

module.exports = router;