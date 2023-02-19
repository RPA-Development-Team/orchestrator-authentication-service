const User = require('../models/User');
const bcrypt = require("bcrypt");

exports.createNewUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  let user = await User.saveUser(req.body.username, hashedPassword, req.body.role);
  if (!user) res.status(404).send({message: "An error has occured."});
  else {
    const {password, ...data} = user;
    res.send(data);
  }
};

exports.authenticateUser = async (req, res, next) => {
  user = await User.findUserByName(req.body.username);
  if (!user) return res.status(404).send({message: "An error has occured."});
  if (!await bcrypt.compare(req.body.password, user.password)) return res.status(400).send({message: "Invalid credentials."});
  const {password, ...data} = user;
  res.send(data);
};