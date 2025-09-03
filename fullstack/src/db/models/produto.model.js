const { DataTypes } = require("sequelize");

module.exports = sequelize =>
    sequelize.define('Produto', {
        id: {
            autoincrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        estoque: DataTypes.INTEGER,
        data_criacao: DataTypes.DATE,
    });