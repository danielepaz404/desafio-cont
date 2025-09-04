const express = require('express');
const router = express.Router();
const { Cliente } = require('../db');

/**
 * @openapi
 * /clientes:
 *   get:
 *     description: Retorna a lista de clientes
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Retorna a lista de clientes em json
 */
router.get('/', async (req, res, next) => {
  const clientes = await Cliente.findAll();
  res.status(200).json(clientes);
})

/**
 * @openapi
 * /clientes:
 *   post:
 *     description: Cria um cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - nome
 *               - email
 *     tags:
 *       - Clientes
 *     responses:
 *       400:
 *         description: Paramétros inválidos
 *       201:
 *         description: Retorna o cliente que foi criado
 */
router.post('/', async (req, res, next) => {
  try {
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }
    const newCliente = await Cliente.build({ nome, email });

    await newCliente.validate()

    await newCliente.save();

    res.status(201).json(newCliente);
  } catch (error) {

    if (error?.errors) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }

    next(error);
  }
});


module.exports = router;
