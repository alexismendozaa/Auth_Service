const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const uuid = require('uuid');

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
    type: DataTypes.STRING, // URL  image S3
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = User;
