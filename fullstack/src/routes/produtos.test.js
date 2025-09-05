const request = require('supertest');
const express = require('express');

const produtosRouter = require('./produtos');

jest.mock('../db', () => {
  const mockProduto = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    build: jest.fn((attrs) => ({
      ...attrs,
      validate: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
    })),
  };
  return { Produto: mockProduto };
});
const { Produto } = require('../db');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/produtos', produtosRouter);
  app.use((err, _req, res, _next) => res.status(500).json({ error: 'Internal Server Error' }));
  return app;
}

describe('Produtos routes', () => {
  let app;

  beforeEach(() => {
    app = makeApp();
    jest.clearAllMocks();
  });

  describe('GET /produtos', () => {
    it('returns the list of produtos (200)', async () => {
      const fake = [
        { id: 1, nome: 'Teclado', preco: '99.90', estoque: 10 },
        { id: 2, nome: 'Mouse', preco: '49.90', estoque: 25 },
      ];
      Produto.findAll.mockResolvedValue(fake);

      const res = await request(app).get('/produtos').expect(200);
      expect(Produto.findAll).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual(fake);
    });

    it('returns 500 when findAll throws', async () => {
      Produto.findAll.mockRejectedValue(new Error('db down'));
      const res = await request(app).get('/produtos').expect(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('POST /produtos', () => {
    it('creates a produto (201) when payload is valid', async () => {
      const payload = { nome: 'Monitor', preco: '799.00', estoque: 5 };
      const res = await request(app).post('/produtos').send(payload).expect(201);

      expect(Produto.build).toHaveBeenCalledWith(payload);
      expect(res.body).toMatchObject(payload);
    });

    it('returns 400 when nome is missing', async () => {
      const res = await request(app)
        .post('/produtos')
        .send({ preco: '10.00', estoque: 1 })
        .expect(400);

      expect(res.body).toEqual({ error: 'Nome e preço são obrigatórios' });
      expect(Produto.build).not.toHaveBeenCalled();
    });

    it('returns 400 when preco is missing', async () => {
      const res = await request(app)
        .post('/produtos')
        .send({ nome: 'Cabo HDMI', estoque: 12 })
        .expect(400);

      expect(res.body).toEqual({ error: 'Nome e preço são obrigatórios' });
      expect(Produto.build).not.toHaveBeenCalled();
    });

    it('returns 400 when model validation fails', async () => {
      const brokenInstance = {
        nome: 'Notebook',
        preco: '-1',
        estoque: 3,
        validate: jest.fn().mockRejectedValue({
          errors: [
            { message: 'preco must be greater than zero' },
            { message: 'nome must be unique' },
          ],
        }),
        save: jest.fn(),
      };
      Produto.build.mockReturnValueOnce(brokenInstance);

      const res = await request(app)
        .post('/produtos')
        .send({ nome: 'Notebook', preco: '-1', estoque: 3 })
        .expect(400);

      expect(res.body).toEqual({
        error: 'preco must be greater than zero, nome must be unique',
      });
      expect(brokenInstance.save).not.toHaveBeenCalled();
    });

    it('bubbles up unexpected errors to error handler (500)', async () => {
      const instance = {
        nome: 'Headset',
        preco: '199.90',
        estoque: 8,
        validate: jest.fn().mockRejectedValue(new Error('weird failure')),
        save: jest.fn(),
      };
      Produto.build.mockReturnValueOnce(instance);

      const res = await request(app)
        .post('/produtos')
        .send({ nome: 'Headset', preco: '199.90', estoque: 8 })
        .expect(500);

      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /produtos/:id', () => {
    it('returns the produto (200) when found', async () => {
      const produto = { id: 42, nome: 'SSD', preco: '299.00', estoque: 15 };
      Produto.findByPk.mockResolvedValue(produto);

      const res = await request(app).get('/produtos/42').expect(200);
      expect(Produto.findByPk).toHaveBeenCalledWith('42');
      expect(res.body).toEqual(produto);
    });

    it('returns 404 when produto is not found', async () => {
      Produto.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/produtos/999').expect(404);
      expect(res.body).toEqual({ error: 'Produto não encontrado' });
    });

    it('returns 500 when findByPk throws', async () => {
      Produto.findByPk.mockRejectedValue(new Error('db kaboom'));
      const res = await request(app).get('/produtos/1').expect(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
