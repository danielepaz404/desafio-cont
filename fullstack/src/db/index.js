const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './src/db/data/database.sqlite'
});

const initModels = require('./models');
const models = initModels(sequelize);

module.exports = {  sequelize, ...models };