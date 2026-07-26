var express = require('express');
var path = require('path');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
require('dotenv').config();

var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 3001;
var SWAGGER_HOST = process.env.SWAGGER_HOST || HOST;
var SWAGGER_PORT = process.env.SWAGGER_PORT || PORT;

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
      { url: 'http://' + SWAGGER_HOST + ':' + SWAGGER_PORT, description: 'Roon HTTP API' },
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

app.listen(PORT, HOST, function() {
  console.log('Listening on ' + HOST + ':' + PORT);
});
