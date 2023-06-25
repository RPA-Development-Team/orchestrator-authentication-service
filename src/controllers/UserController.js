const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/AuthConfig');
const { prisma } = require('../utils/db');

exports.createNewUser = async (req, res, next) => {

  const {username, password, email, userType} = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  try {
    let result = await prisma.userAccount.create({
      data: {
        updatedAt: new Date().toISOString(),
        username: username,
        email: email,
        password: hashedPassword,
        userType: userType
      }
    });

    const {password, ...data} = result;

    res.send({
      message: "User created.",
      success: true,
      user: data
    });

    
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "An error has occurred."
    });
  }
};

exports.authenticateUser = async (req, res, next) => {
  let user = await findUserByName(req.body.username);

  if (!user || !await bcrypt.compare(req.body.password, user.password)) {
    return res.status(401).send({
      message: "Invalid credentials."
    });
  }

  const token = jwt.sign({id: user.id}, jwtSecret);
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  const {password, ...data} = user;
  data.accessToken = token;

  res.send({
      profile: data
  });
};

exports.getUser = async (req, res, next) => {
  let failResponse = {
    message: "Unauthenticated user."
  };

  let token;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(403).send(failResponse);

  const claims = jwt.verify(token, jwtSecret);

  if (!claims) return res.status(403).send(failResponse);

  let user = await findUserById(claims.id);

  if (!user) return res.status(403).send(failResponse);

  const {password, ...data} = user;
  res.send(data);
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

const findUserByName = async (username) => {
  try {
      const result = await prisma.userAccount.findUnique({
          where: {
              username: username
          }
      });
      return result;
  } catch(err) {
      console.log(err);
      return null;
  }
}

const findUserById = async (id) => {
  try {
      const result = await prisma.userAccount.findUnique({
          where: {
              id: id
          }
      });
      return result;
  } catch(err) {
      console.log(err);
      return null;
  }
}