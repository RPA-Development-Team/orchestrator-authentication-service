const express = require('express');
const userController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const router = express.Router();

router.route("/register").post(userController.createNewUser);
router.route("/login").post(userController.authenticateUser);
router.route("/logout").post(userController.logoutUser);
router.route("/tenant").post(auth, userController.createNewTenant);
router.route("/user").get(auth, userController.getUser);

module.exports = router;