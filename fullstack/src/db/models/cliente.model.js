const { DataTypes } = require("sequelize");

module.exports = sequelize =>
    sequelize.define('Cliente', {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        data_criacao: DataTypes.DATE,
    }, {
        tableName: 'clientes',
        createdAt: 'data_criacao',
        updatedAt: false,
    });