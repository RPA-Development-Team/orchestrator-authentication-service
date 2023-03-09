const { pool } = require('../database/DatabaseHandler');

class User {
    constructor (id, username, password, role) {
        this.id = id;
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
            return null;
        }
    }

    static async saveUser(username, password, role) {
        let user = new User(0, username, password, role);
        let result = await user.save();
        if (!result) return null;
        user.id = result[0].insertId;
        return user;
    }

    static async findUserByName(username) {
        let sql = `
        SELECT * FROM user WHERE username = '${username}';
        `
        try {
            const result = (await pool.execute(sql))[0][0];
            if (typeof result === 'undefined') return null;
            return new User(result.id, result.username, result.password, result.role);
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static async findUserById(id) {
        let sql = `
        SELECT * FROM user WHERE id = '${id}';
        `
        try {
            const result = (await pool.execute(sql))[0][0];
            return new User(result.id, result.username, result.password, result.role);
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static async findAll() {
        let sql = `
        SELECT * FROM user;
        `
        try {
            const result = await pool.execute(sql);
            let userArr = [];
            result[0].forEach(userJson => {
                userArr.push(new User(userJson.id, userJson.username, userJson.password, userJson.role));
            });
            return userArr;
        } catch(err) {
            console.log(err);
            return null;
        }
    }
}

module.exports = User;