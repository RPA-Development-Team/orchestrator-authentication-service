const { prisma }  = require('rpa-prisma-module');

exports.getUserLicense = async (req, res, next) => {
    try {
        const user = await prisma.userAccount.findUnique({
            where: {
                uuid: req.decodedUser.uuid
            },
            include: {
                userLicense: {
                    include: {
                        license: true
                    }
                }
            }
        });

        if (user.userType == "ADMIN") {
            res.send(user.userLicense.license);
        } else {
            let admin = await prisma.userAccount.findUnique({
                where: {
                    id: user.adminID
                },
                include: {
                    userLicense: {
                        include: {
                            license: true
                        }
                    }
                }
            });
            res.send(admin.userLicense.license);
        }
    } catch (err) {
        res.status(404).send({
            message: "User not found."
        });
    }
}

exports.setUserLicense = async (req, res, next) => {
    const { licenseId } = req.body;
    
    try {
        const user = await prisma.userAccount.findUnique({
            where: {
                uuid: req.decodedUser.uuid
            },
            include: {
                userLicense: {
                    include: {
                        license: true
                    }
                }
            }
        });

        if (user.userType != "ADMIN") {
            return res.status(403).json({
                message: "User is not an Admin."
            })
        }

        const userLicense = await prisma.userLicense.update({
            where: {
                userID: user.id
            },
            data: {
                license: {
                    connect: {
                        id: licenseId
                    }
                }
            }
        });

        res.send({
            message: "User license successfully updated."
        });
    } catch (err) {
        res.status(422).send({
            message: "Incorrect data."
        });
    }
};