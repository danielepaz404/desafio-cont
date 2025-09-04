const { DataTypes } = require("sequelize");

module.exports = sequelize =>
    sequelize.define('Produto', {
        id: {
            autoIncrement: true,
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
            allowNull: false,
            validate: {
                min: 0,
                isFloat: true
            }
        },
        estoque: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                min: 0,
                isInt: true
            }
        },
        data_criacao: DataTypes.DATE

    }, {
        tableName: 'produtos',
        createdAt: 'data_criacao',
        updatedAt: false,
    });