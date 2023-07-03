const amqp = require('amqplib/callback_api');
const userController = require('../controllers/UserController');

exports.consume = () => {
    amqp.connect('amqp://rabbitmq', (err, connection) => {
    if (err) {
        throw err;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        let adminQueue = "admin";

        // Creating queue for admin accounts
        channel.assertQueue(adminQueue, {
            durable: false
        });

        // Binding queue to amq.topic with its appropriate routing key
        channel.bindQueue(adminQueue, 'amq.topic', 'KK.EVENT.CLIENT.*.SUCCESS.account-console.REGISTER');
        
        channel.consume(adminQueue, (msg) => {
            content = JSON.parse(msg.content);
            const {username, email, first_name, last_name} = content.details;
            userController.saveUser(username, email, null, first_name, last_name, "ADMIN", null, content.userId);
        }, {
            noAck: true
        });
    });
});
}
