
var express = require('express');
var router = express.Router();
const { Cliente } = require('../db');

/**
 * @openapi
 * /clientes:
 *  get:
 *    description: Retrieve a list of clients
 *    tags:
 *      - Clientes
 *    responses:
 *      200:
 *        description: Returns the list of clients in json format.
*/
router.get('/', async (req, res, next) => {
  const clientes = await Cliente.findAll();
  res.status(200).json(clientes);
})


module.exports = router;
