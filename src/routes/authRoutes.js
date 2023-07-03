const express = require('express');
const userController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const router = express.Router();
const request = require('request');
const jwt = require('jsonwebtoken');

router.route("/register").post(userController.createNewUser);
router.route("/login").post(userController.authenticateUser);
router.route("/logout").post(userController.logoutUser);
router.route("/tenant").post(auth, userController.createNewTenant);
router.route("/user").get(auth, userController.getUser);
router.route("/tester").get(async (req, res, next) => {
    // assumes bearer token is passed as an authorization header
    if (req.headers.authorization) {
      let token;
      if (req.headers.authorization.split(' ')[0] === 'Bearer') {
          token = req.headers.authorization.split(' ')[1];
      }
      // configure the request to your keycloak server
      const options = {
        method: 'POST',
        url: `http://34.155.103.216.nip.io:8080/realms/orch/protocol/openid-connect/token/introspect`,
        form: {
          grant_type: 'client_credentials',
          client_id: 'register',
          client_secret: 'Gc6mjXoPJPuUZ5LQci1Daczcsnnnng5U',
          token: token
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
  
      // send a request to the userinfo endpoint on keycloak
      request(options, (error, response, body) => {
        if (error) throw new Error(error);
        
        console.log(body)

        // if the request status isn't "OK", the token is invalid
        if (response.statusCode !== 200) {
          res.status(401).json({
            error: `unauthorized`,
          });
        }
        // the token is valid pass request onto your next function
        else {
          decodedToken = jwt.decode(token);
          decodedUser = {
            uuid: decodedToken.sub,
            username: decodedToken.preferred_username,
            firstName: decodedToken.given_name,
            lastName: decodedToken.family_name,
          }
          req.decodedUser = decodedUser;
          next();
        }
      });
    } else {
      // there is no token, don't process request further
        res.status(401).json({
            error: `unauthorized`,
        });
    }
});

module.exports = router;