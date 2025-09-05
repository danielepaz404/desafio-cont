const { sequelize } = require('./db')
const app = require('./app');
const port = 3000;

(async () => {
  await sequelize.sync();
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
  console.log("All models were synchronized successfully.");
})();
