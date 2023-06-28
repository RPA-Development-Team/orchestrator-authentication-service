const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/AuthConfig');


const verifyToken = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return res.status(403).send({
        message: "User unauthenticated."
      });
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.decodedUser = decoded;
    } catch (err) {
      return res.status(401).send({
        message: "Invalid Token."
      });
    }
    return next();
};


module.exports = verifyToken;