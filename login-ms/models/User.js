const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');  // Asegúrate de tener esta conexión a tu base de datos
const uuid = require('uuid');

// Definición del modelo de usuario
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: uuid.v4(),
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.STRING,  // URL de la imagen almacenada en S3
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Exporta el modelo para que lo podamos usar en los controladores
module.exports = User;
