const express = require('express')
const app = express()
const port = 3000

const { sequelize, Cliente, Produto } = require('./db');

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();     
})();


app.get('/', async (req, res) => {
  const clientes = await Cliente.findAll();
  res.status(200).json(clientes);
})

app.get('/clientes', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})