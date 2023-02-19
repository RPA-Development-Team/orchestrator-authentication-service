const User = require('../models/User');
const bcrypt = require("bcrypt");

exports.createNewUser = async (req, res, next) => {
    let { username, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = new User(username, hashedPassword, role);
    user = await user.save();
    console.log(user);
    res.send("User added.");
};

exports.authenticateUser = async (req, res, next) => {
  user = await User.findUserByName(req.body.username);
  console.log(user);
  res.send("Found,");  
};