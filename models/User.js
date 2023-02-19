const { pool } = require('../database/DatabaseHandler');

class User {
    constructor (username, password, role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    async save() {
        let sql = `
        INSERT INTO user(
            username,
            password,
            role
        ) 
        VALUES(
            '${this.username}',
            '${this.password}',
            '${this.role}'
        )
        `
        try {
            const result = await pool.execute(sql);
            return result;
        } catch(err) {
            console.log(err);
        }
        return null;
    }

    static async findUserByName(username) {
        let sql = `
        SELECT * FROM user WHERE username = '${username}';
        `
        try {
            const result = await pool.execute(sql);
            return new User(...Object.values(result[0][0]));
        } catch(err) {
            console.log(err);
        }
        return null;
    }

    static async findUserById(id) {
        let sql = `
        SELECT * FROM user WHERE id = '${id}';
        `
        try {
            const result = await pool.execute(sql);
            return new User(...Object.values(result[0][0]));
        } catch(err) {
            console.log(err);
        }
        return null;
    }

    static async findAll() {
        let sql = `
        SELECT * FROM user;
        `
        try {
            const result = await pool.execute(sql);
            let userArr = [];
            result[0].forEach(userJson => userArr.push(new User(...Object.values(userJson))));
            return userArr;
        } catch(err) {
            console.log(err);
        }
        return null;
    }
}

module.exports = User;