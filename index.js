const express = require('express');
const routes = require('./routes/routes');
const app = express();
const PORT = 8000;

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Authentication backend listening to port ${PORT}`);
});