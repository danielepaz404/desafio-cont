const path = require('path');
const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Desafio Cont API',
      version: '1.0.0',
    },
  },
  apis: [path.join(__dirname, 'routes/**/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const indexRouter = require('./routes/index');
const clientesRouter = require('./routes/clientes');
const produtosRouter = require('./routes/produtos');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})