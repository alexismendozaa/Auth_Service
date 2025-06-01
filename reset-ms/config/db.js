const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuring the database connection with SSL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }, logging: false,
  
});

module.exports = { sequelize };
