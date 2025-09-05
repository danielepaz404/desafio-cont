const request = require('supertest');
const express = require('express');

const clientesRouter = require('./clientes');

jest.mock('../db', () => {
  const mockCliente = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    build: jest.fn((attrs) => {
      return {
        ...attrs,
        validate: jest.fn().mockResolvedValue(undefined),
        save: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
  return { Cliente: mockCliente };
});

const { Cliente } = require('../db');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/clientes', clientesRouter);

  app.use((err, _req, res, _next) => {
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

describe('Clientes routes', () => {
  let app;

  beforeEach(() => {
    app = makeApp();
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('GET /clientes', () => {
    it('returns the list of clientes (200)', async () => {
      const fakeClientes = [
        { id: 1, nome: 'Ana', email: 'ana@example.com' },
        { id: 2, nome: 'Bruno', email: 'bruno@example.com' },
      ];
      Cliente.findAll.mockResolvedValue(fakeClientes);

      const res = await request(app).get('/clientes').expect(200);
      expect(Cliente.findAll).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual(fakeClientes);
    });

    it('returns 500 when findAll throws', async () => {
      Cliente.findAll.mockRejectedValue(new Error('db down'));

      const res = await request(app).get('/clientes').expect(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('POST /clientes', () => {
    it('creates a cliente (201) when payload is valid', async () => {
      const payload = { nome: 'Carla', email: 'carla@example.com' };
      const res = await request(app).post('/clientes').send(payload).expect(201);

      expect(Cliente.build).toHaveBeenCalledWith(payload);
      expect(res.body).toMatchObject(payload);
    });

    it('returns 400 when nome is missing', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({ email: 'semnome@example.com' })
        .expect(400);

      expect(res.body).toEqual({ error: 'Nome e email são obrigatórios' });
      expect(Cliente.build).not.toHaveBeenCalled();
    });

    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({ nome: 'Sem Email' })
        .expect(400);

      expect(res.body).toEqual({ error: 'Nome e email são obrigatórios' });
      expect(Cliente.build).not.toHaveBeenCalled();
    });

    it('returns 400 when model validation fails', async () => {
      const brokenInstance = {
        nome: 'Diego',
        email: 'not-an-email',
        validate: jest.fn().mockRejectedValue({
          errors: [{ message: 'email must be a valid email' }],
        }),
        save: jest.fn(),
      };

      Cliente.build.mockReturnValueOnce(brokenInstance);

      const res = await request(app)
        .post('/clientes')
        .send({ nome: 'Diego', email: 'not-an-email' })
        .expect(400);

      expect(res.body).toEqual({
        error: 'email must be a valid email',
      });
      expect(brokenInstance.save).not.toHaveBeenCalled();
    });

    it('bubbles up unexpected errors to error handler (500)', async () => {
      const instance = {
        nome: 'Eva',
        email: 'eva@example.com',
        validate: jest.fn().mockRejectedValue(new Error('weird failure')),
        save: jest.fn(),
      };
      Cliente.build.mockReturnValueOnce(instance);

      const res = await request(app).post('/clientes').send({ nome: 'Eva', email: 'eva@example.com' }).expect(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /clientes/:id', () => {
    it('returns the cliente (200) when found', async () => {
      const cliente = { id: 42, nome: 'Fernanda', email: 'fernanda@example.com' };
      Cliente.findByPk.mockResolvedValue(cliente);

      const res = await request(app).get('/clientes/42').expect(200);
      expect(Cliente.findByPk).toHaveBeenCalledWith('42');
      expect(res.body).toEqual(cliente);
    });

    it('returns 404 when cliente is not found', async () => {
      Cliente.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/clientes/999').expect(404);
      expect(res.body).toEqual({ error: 'Cliente não encontrado' });
    });

    it('returns 500 when findByPk throws', async () => {
      Cliente.findByPk.mockRejectedValue(new Error('db kaboom'));

      const res = await request(app).get('/clientes/1').expect(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
