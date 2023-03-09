const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

router.route("/register").post(userController.createNewUser);
router.route("/login").post(userController.authenticateUser);
router.route("/logout").post(userController.logoutUser);
router.route("/user").get(userController.getUser);

module.exports = router;