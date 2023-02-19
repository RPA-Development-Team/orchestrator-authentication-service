const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

router.route("/register").post(userController.createNewUser);
router.route("/login").get(userController.authenticateUser);

module.exports = router;