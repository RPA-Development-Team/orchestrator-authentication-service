const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { prisma }  = require('rpa-prisma-module');
const { jwtSecret } = require('../config/AuthConfig');
const { generateTenant } = require('../utils/tenantGenerator');
const keycloakConnector = require('../utils/keycloakConnector')

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

  let user = await findUserById(req.decodedUser.uuid);

  if (!user || user.userType != "ADMIN") return res.status(403).send({
    message: "Invalid user."
  });

  if (user.userAccounts.length >= user.userLicense.license.maxTenants) {
    return res.status(400).send({
      message: "Maximum tenant amount exceeded for user license."
    });
  }

  let tenant = generateTenant();
  await keycloakConnector.createUser(tenant.username, tenant.password, user.id);

  return res.send({
    profile: tenant
  });
}

exports.getTenants = async (req, res, next) => {
  let user = await findUserById(req.decodedUser.uuid);

  if (!user) {
    return res.status(404).json({
      message: "User not found."
    });
  }

  const returnedTenants = user.userAccounts.map(({id: tenantId, ...data})=>({tenantId, ...data}));

  return res.send(returnedTenants);
}

exports.deleteTenant = async (req, res, next) => {
  
  if (!req.body.uuid) {
    return res.status(422).json({
      message: "User uuid not provided."
    });
  }

  let user = await findUserById(req.decodedUser.uuid);

  for (tenantId in user.userAccounts) {
    if (user.userAccounts[tenantId].uuid == req.body.uuid) {
      try {
        await prisma.userAccount.delete({
          where: {
            uuid: user.uuid
          }
        });
    
        return res.json({
          message: "Tenant deleted successfully."
        });
      } catch (err) {
        return res.status(500).json({
          message: "An error occurred."
        });
      }
    }
  }

  return res.status(404).json({
    message: "User not found."
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
  let user = await findUserById(req.decodedUser.uuid);

  if (!user) {
    return res.status(403).send({
      message: "Invalid user."
    });
  }
  
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
              uuid: id
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

exports.saveUser = async (username, email, hashedPassword, firstName, lastName, userType = undefined, adminId = undefined, userId = undefined) => {
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
        uuid: userId
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