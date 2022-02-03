const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { authByToken } = require('./utils/auth');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(authByToken);

app.use('/tickets', require('./tickets/router'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send({ message: err.message });
});

app.get('/', (req, res) => {
  res
    .status(200)
    .send(
      `Welcome!. Please got to <a href="/api-docs">docs</a> to see swagger UI`
    );
});

module.exports = app;
