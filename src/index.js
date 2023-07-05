const express = require('express');
const cors = require('cors');
const keycloakConsumer = require('./keycloak/keycloak-consumer');
const routes = require('./routes/routes');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api', routes);

app.use(cors({
    origin: '*'
  }));
  

keycloakConsumer.consume();

app.listen(PORT, () => {
    console.log(`Authentication backend listening to port ${PORT}`);
});