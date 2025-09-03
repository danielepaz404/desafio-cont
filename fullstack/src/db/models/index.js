function initiModels(sequelize) {
    const Cliente = require('./cliente.model')(sequelize);
    const Produto = require('./produto.model')(sequelize);

    return { Cliente, Produto };
}

module.exports = initiModels;