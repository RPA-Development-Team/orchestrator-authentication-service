const { prisma }  = require('rpa-prisma-module');

exports.setUserLicense = async (req, res, next) => {
    const { userId, licenseId } = req.body;
    
    try {
        const userLicense = await prisma.userLicense.update({
            where: {
                userID: userId
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