var express = require('express');
var path = require('path');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3001;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Roon HTTP API',
      version: '1.1.0',
      description: 'HTTP API wrapper for the Roon audio streaming system',
    },
    servers: [
      { url: 'http://localhost:' + PORT, description: 'Local server' },
    ],
  },
  apis: ['./routes.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(express.static(path.join(__dirname, 'htmls')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./routes')(app);

app.listen(PORT);

console.log('Listening on port: ' + PORT);
