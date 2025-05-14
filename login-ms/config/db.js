const { Sequelize } = require('sequelize');
require('dotenv').config();  // Cargar las variables de entorno

// Configuración de la conexión a la base de datos con SSL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',  // Usamos PostgreSQL
  dialectOptions: {
    ssl: {
      require: true,  // Habilitar SSL
      rejectUnauthorized: false  // Para conexiones a RDS (AWS)
    }
  }
});

// Exportar la instancia de Sequelize
module.exports = { sequelize };

// Verificar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Sincronizar los modelos con la base de datos
sequelize.sync({ force: false })  // Sincroniza sin eliminar datos existentes
  .then(() => {
    console.log('Modelos sincronizados correctamente con la base de datos.');
  })
  .catch(err => {
    console.error('Error al sincronizar los modelos:', err);
  });
