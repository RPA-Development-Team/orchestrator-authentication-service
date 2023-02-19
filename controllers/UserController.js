const User = require('../models/User');
const bcrypt = require("bcrypt");

exports.createNewUser = async (req, res, next) => {
  let { username, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let user = new User(username, hashedPassword, role);
  let result = await user.save();
  if (!user) res.status(404).send({message: "An error has occured."});
  else res.send(result);
};

exports.authenticateUser = async (req, res, next) => {
  user = await User.findUserByName(req.body.username);
  if (!user) return res.status(404).send({message: "An error has occured."});
  if (!await bcrypt.compare(req.body.password, user.password)) return res.status(400).send({message: "Invalid credentials."});
  const {password, ...data} = user;
  res.send(data);
};