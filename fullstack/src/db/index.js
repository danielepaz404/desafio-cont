const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './src/db/data/database.sqlite'
});

const initModels = require('./models');
const models = initModels(sequelize);

(async () => {
  await sequelize.sync();  
  console.log("All models were synchronized successfully.");   
})();

module.exports = {  sequelize, ...models };