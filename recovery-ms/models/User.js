const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
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
  resetPasswordToken: {
    type: DataTypes.STRING,  // Token de recuperación de contraseña
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,  // Fecha de expiración del token
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = User;
