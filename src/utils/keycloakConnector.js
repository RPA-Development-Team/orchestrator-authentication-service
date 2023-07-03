const { KCClientId, KCClientSecret, KCUrl } = require('../config/KeycloakConfig');
const userController = require('../controllers/UserController');
const request = require('request');

exports.createUser = async (username, password, adminId) => {
    
    let realm = 'test';

    let tokenOptions = {
        url: `${KCUrl}/realms/master/protocol/openid-connect/token`,
        method: 'POST',
        form: {
            grant_type: 'client_credentials',
            client_id: 'register',
            client_secret: 'xz7tmcP8kAZeRfOYkaaXkQsP1qz8Cl47'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    let {error, body} = request(tokenOptions);

    request(tokenOptions, (error, response, body) => {
        let token = JSON.parse(body).access_token;
        if (!error) {

            let createOptions = {
                url: `${KCUrl}/admin/realms/${realm}/users`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    enabled: "true", 
                    username: username,
                    email: `${username}@gmail.com`,
                    credentials: [{
                        type: "password",
                        value: password,
                        temporary: false
                    }]
                })
            }
            
            request(createOptions, (error, response, body) => {
                if (!error) {
                    let header = response.headers['location'].split('/'), userId = header[header.length - 1];
                    userController.saveUser(username, `${username}@gmail.com`, null, null, null, "TENANT", adminId, userId);
                } else {
                    console.log(error);
                }
            });
        } else {
            console.log(error);
        }
    });

}
