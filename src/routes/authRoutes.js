const express = require('express');
const userController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const router = express.Router();
const { prisma }  = require('rpa-prisma-module');

router.route("/register").post(userController.createNewUser);
router.route("/login").post(userController.authenticateUser);
router.route("/logout").post(userController.logoutUser);
router.route("/tenant").post(auth, userController.createNewTenant);
router.route("/tenant").get(auth, userController.getTenants);
router.route("/user").get(auth, userController.getUser);
router.route("/tester").get(async (req, res, next) => {
  let users = await prisma.userAccount.findMany();
  res.send(users);
});

module.exports = router;