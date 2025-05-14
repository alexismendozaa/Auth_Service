const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuring the database connection with SSL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',  
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false 
    }
  }
});

// Export the Sequelize instance
module.exports = { sequelize };

// Add error handling to verify the connection
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
