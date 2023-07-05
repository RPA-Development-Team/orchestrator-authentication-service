const express = require('express');
const licenseController = require('../controllers/LicenseController');
const auth = require('../middleware/auth');
const router = express.Router();

router.route("/").get(auth, licenseController.getUserLicense);
router.route("/update").put(auth, licenseController.setUserLicense);

module.exports = router;