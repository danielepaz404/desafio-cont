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
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
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
 *         description: Parâmetros inválidos
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

/**
 * @openapi
 * /clientes/{id}:
 *   get:
 *     description: Retorna um cliente pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Retorna o cliente em json
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
