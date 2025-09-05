# Descrição do Teste Técnico — Desenvolvedor FullStack

## Objetivo

Construir uma API em Node.js puro (http) ou qualquer biblioteca HTTP (Express, Fastify, etc.), que consuma dados de um banco de dados SQLite e permita realizar operações básicas de cadastro e consulta.

## Requisitos obrigatórios

### Tecnologia:

- A API deve ser criada utilizando Node.js puro (módulo http) ou qualquer biblioteca HTTP (ex.: Express, Fastify, Hapi etc.).

### Banco de dados:

- Utilizar SQLite como banco de dados.

- O banco deve possuir duas tabelas:
  - **produtos** (campos mínimos: id, nome, preço, estoque, data de criação)
  - **clientes** (campos mínimos: id, nome, email, data de criação)

### Rotas obrigatórias:

- **POST /produtos** → cadastrar um produto
- **GET /produtos** → listar produtos (com possibilidade de consulta por parâmetros simples, ex.: busca ou paginação)
- **GET /produtos/:id** → buscar produto pelo ID
- **POST /clientes** → cadastrar um cliente
- **GET /clientes** → listar clientes
- **GET /clientes/:id** → buscar cliente pelo ID

### Validações mínimas:

- Não permitir cadastro de produto sem nome ou preço.
- Não permitir cadastro de cliente sem nome ou email.
- Emails devem ser únicos.

### Entrega:

- Fornecer instruções de execução do projeto (ex.: npm install, npm start).
- O banco pode ser entregue com script de criação (SQL).
- Publique o código-fonte em um **repositório público** (GitHub, GitLab ou Bitbucket).
- Inclua esse **README.md** na raiz do repositório, com o checklist abaixo preenchido.
- Envie **apenas o link do repositório** como resposta final.

## ✅ Checklist do Teste Técnico

- [x] Criar uma **API em Node.js** usando:

  - Node.js puro (`http`) **ou** qualquer biblioteca HTTP (Express, Fastify, etc.)

- [x] Utilizar **SQLite** como banco de dados

- [x] Criar duas tabelas no banco:

  - **produtos** → id, nome, preço, estoque, data de criação
  - **clientes** → id, nome, email, data de criação

- [x] Implementar rotas de **cadastro**:

  - `POST /produtos` → cadastrar produto
  - `POST /clientes` → cadastrar cliente

- [x] Implementar rotas de **consulta**:

  - `GET /produtos` → listar produtos (com paginação ou busca simples)
  - `GET /produtos/:id` → buscar produto por ID
  - `GET /clientes` → listar clientes
  - `GET /clientes/:id` → buscar cliente por ID

- [x] Regras de **validação**:

  - Produto deve ter nome e preço obrigatórios
  - Cliente deve ter nome e email obrigatórios
  - Email de cliente deve ser **único**

- [x] Entregar junto instruções claras de como rodar a API:
  - Entrar na pasta do projeto (`cd fullstack`)
  - Instalação de dependências (`npm install`)
  - Execução do projeto (`npm start`)
  - Entrar na URL (`http://localhost:3000/api-docs/`)
  - Na tela do Swagger você poderá testar os endpoints clicando em 'Try it out'
    <img width="1454" height="685" alt="image" src="https://github.com/user-attachments/assets/05de39b5-2778-4a5e-9f30-191700d358a1" />
  - Nas requisições POST poderá inserir os valores do body:
    <img width="1454" height="735" alt="image" src="https://github.com/user-attachments/assets/84ec18fe-9def-49e1-b590-93b098ef113d" />
  - Ao clicar em 'Execute' a resposta aparecerá como no exemplo abaixo:
    <img width="1460" height="665" alt="image" src="https://github.com/user-attachments/assets/b2ab2396-9cfc-452d-af02-bf9430653a42" />
  - Também é possível rodar os testes da aplicação executando o comando `npm test`



