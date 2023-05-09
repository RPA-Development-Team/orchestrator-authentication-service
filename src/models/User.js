const { PrismaClient } = require('@prisma/client')
const { pool } = require('../database/DatabaseHandler');

const prisma = new PrismaClient()

class User {
    constructor (id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    async save() {

        try {
            let res = await prisma.userAccount.create({
                data: {
                    updatedAt: new Date().toISOString(),
                    username: this.username,
                    email: `${this.username}@gmail.com`,
                    password: this.password,
                }
            });
            return res;
        } catch (err) {
            console.log(err);
            return null;
        }


        // let sql = `
        // INSERT INTO "user" (
        //     username,
        //     password,
        //     role
        // ) 
        // VALUES(
        //     '${this.username}',
        //     '${this.password}',
        //     '${this.role}'
        // )
        // RETURNING id;
        // `
        // try {
        //     const result = await pool.query(sql);
        //     return result;
        // } catch(err) {
        //     console.log(err);
        //     return null;
        // }
    }

    static async saveUser(username, password) {
        let user = new User(0, username, password);
        let result = await user.save();
        if (!result) return null;
        user.id = result.id;
        return user;
    }

    static async findUserByName(username) {
        try {
            const result = await prisma.userAccount.findUnique({
                where: {
                    username: username
                }
            });
            return new User(result.id, result.username, result.password);
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static async findUserById(id) {
        try {
            const result = await prisma.userAccount.findUnique({
                where: {
                    id: id
                }
            });
            return new User(result.id, result.username, result.password);
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static async findAll() {
        try {
            const result = await prisma.userAccount.findAll();
            let userArr = [];
            result.forEach(userJson => {
                userArr.push(new User(userJson.id, userJson.username, userJson.password));
            });
            return userArr;
        } catch(err) {
            console.log(err);
            return null;
        }
    }
}

module.exports = User;