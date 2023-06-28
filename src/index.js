const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Authentication backend listening to port ${PORT}`);
});