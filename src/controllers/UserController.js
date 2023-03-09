const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/AuthConfig');

exports.createNewUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
  let user = await User.saveUser(req.body.username, hashedPassword, req.body.role);

  if (!user) res.status(404).send({
    message: "An error occurred.",
    success: false
  });

  else {
    const {password, ...data} = user;
    res.send({
      message: "User created.",
      success: true,
      user: data
    });
  }
};

exports.authenticateUser = async (req, res, next) => {
  user = await User.findUserByName(req.body.username);

  if (!user || !await bcrypt.compare(req.body.password, user.password)) return res.status(400).send({
    message: "Invalid credentials.",
    success: false
  });

  const token = jwt.sign({id: user.id}, jwtSecret);
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.send({
    message: "Login Successful.",
    success: true
  });
};

exports.getUser = async (req, res, next) => {
  const token = req.cookies['jwt'];

  let failResponse = {
    message: "Unauthenticated user.",
    success: false
  };

  if (!token) return res.status(401).send(failResponse);

  const claims = jwt.verify(token, jwtSecret);

  if (!claims) return res.status(401).send(failResponse);

  let user = await User.findUserById(claims.id);

  if (!user) return res.status(401).send(failResponse);

  const {password, ...data} = user;
  res.send({
    message: "Found user profile.",
    success: true,
    user: data 
  });
};

exports.logoutUser = async (req, res, next) => {
  const token = req.cookies['jwt'];
  if(!token) {
    return res.send({
      message: "User not logged in.",
      success: false
    });
  }
  res.cookie('jwt', '', { maxAge: 0 });
  res.send({
    message: "Logout successful.",
    success: true
  });
};