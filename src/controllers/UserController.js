const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { prisma }  = require('rpa-prisma-module');
const { jwtSecret } = require('../config/AuthConfig');
const { generateTenant } = require('../utils/tenantGenerator')

exports.createNewUser = async (req, res, next) => {

  const {username, password: reqPassword, email, firstName, lastName} = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(reqPassword, salt);
  
  let result = await saveUser(username, email, hashedPassword, firstName, lastName, "ADMIN");

  if (!result) {
    return res.status(500).send({
      message: "Username or email already exists."
    });
  }

  const {password, ...data} = result;

  res.send({
    message: "User created.",
    success: true,
    user: data
  });
};

exports.createNewTenant = async (req, res, next) => {

  const {email, firstName, lastName} = req.body;

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

  if (!user || user.userType != "ADMIN") return res.status(403).send(failResponse);

  console.log(user.userAccounts.length, user.userLicense.license.maxTenants)

  if (user.userAccounts.length >= user.userLicense.license.maxTenants) {
    return res.status(400).send({
      message: "Maximum tenant amount exceeded for user license."
    });
  }

  let tenant = generateTenant(),
      salt = await bcrypt.genSalt(10),
      hashedPassword = await bcrypt.hash(tenant.password, salt),
      result = await saveUser(tenant.username, email, hashedPassword, firstName, lastName, "TENANT", claims.id);

  if (!result) {
    return res.status(500).send({
      message: "An error occurred."
    });
  }

  return res.send({
    profile: tenant
  });
}

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
};

const findUserById = async (id) => {
  try {
      const result = await prisma.userAccount.findUnique({
          where: {
              id: id
          },
          include: {
            userAccounts: true,
            userLicense: {
              include: {
                license: true
              }
            }
          }
      });
      return result;
  } catch(err) {
      console.log(err);
      return null;
  }
};

const saveUser = async (username, email, hashedPassword, firstName, lastName, userType = undefined, adminId = undefined) => {
  try {
    let result = await prisma.userAccount.create({
      data: {
        updatedAt: new Date().toISOString(),
        username: username,
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        userType: userType,
        adminID: adminId,
      }
    });

    let endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 10) // 10 year duration by default for the basic plan (practically forever)

    let userLicense = await prisma.userLicense.create({
      data: {
        startDate: new Date(),
        endDate: endDate,
        admin: {
          connect: {
            id: result.id
          }
        },
        user: { // should be deleted
          connect: {
            id: result.id
          }
        },
        license: {
          connect: {
            id: 1 // basic license should always have the id 1
          }
        }
      }
    });

    return result
  } catch (err) {
    console.log(err);
    return null;
  }
};