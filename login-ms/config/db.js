const { Sequelize } = require('sequelize');
require('dotenv').config();  // Load environment variables

// Configuring the database connection with SSL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',  
  dialectOptions: {
    ssl: {
      require: true,  // Enable SSL
      rejectUnauthorized: false
    }
  }
});

// Export the Sequelize instance
module.exports = { sequelize };

// Check the connection to the database
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Synchronize the models with the database
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Modelos sincronizados correctamente con la base de datos.');
  })
  .catch(err => {
    console.error('Error al sincronizar los modelos:', err);
  });
