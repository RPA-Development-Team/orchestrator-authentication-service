const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const amqp = require('amqplib/callback_api');
const routes = require('./routes/routes');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api', routes);

amqp.connect('amqp://rabbitmq', (err, connection) => {
    if (err) {
        throw err;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }
        let queueName = "testQ";
        channel.assertQueue(queueName, {
            durable: false
        });
        channel.bindQueue(queueName, 'amq.topic', 'KK.EVENT.CLIENT.*.SUCCESS.account-console.REGISTER');
        channel.consume(queueName, (msg) => {
            console.log(msg.content.toString());
        })
    });
});

app.listen(PORT, () => {
    console.log(`Authentication backend listening to port ${PORT}`);
});