const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const User = require('./User'); 

dotenv.config();

// Configure the connection to the database with SSL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Enable SSL
      rejectUnauthorized: false,
    },
  },
});

// Synchronize models with the database
sequelize.sync().then(() => {
  console.log('Modelos sincronizados');
}).catch(err => console.error('Error al sincronizar los modelos:', err));

module.exports = { sequelize, User };  // Export the connection and model
