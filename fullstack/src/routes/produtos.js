const express = require('express');
const router = express.Router();
const { Produto } = require('../db');

/**
 * @openapi
 * /produtos:
 *   get:
 *     description: Retorna a lista de produtos
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Retorna a lista de produtos em json
 */
router.get('/', async (req, res, next) => {
  const produtos = await Produto.findAll();
  res.status(200).json(produtos);
})

/**
 * @openapi
 * /produtos:
 *   post:
 *     description: Cria um produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: 
 *                 type: string
 *               preco:
 *                 type: string
 *             required:
 *               - nome    
 *               - preco
 *     tags:
 *       - Produtos
 *     responses:
 *       400:
 *         description: Paramétros inválidos
 *       201:
 *         description: Retorna o produto que foi criado
 */
router.post('/', async (req, res, next) => {
  try {
    const { nome, preco, estoque } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }
    const newProduto = await Produto.build({ nome, preco, estoque });

    await newProduto.validate()

    await newProduto.save();

    res.status(201).json(newProduto);
  } catch (error) {

    if (error?.errors) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }

    next(error);
  }
});

/**
 * @openapi
 * /produtos/{id}:
 *   get:
 *     description: Retorna um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Retorna o produto em json
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json(produto);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
