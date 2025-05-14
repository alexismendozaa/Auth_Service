const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./config/db');  // Importamos la conexión desde db.js

dotenv.config();

const app = express();
app.use(bodyParser.json()); // Para procesar JSON en el cuerpo de las solicitudes

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login Microservice API',
      version: '1.0.0',
      description: 'API para la autenticación de usuarios',
    },
  },
  apis: ['./routes/authRoutes.js'], // Aquí se encuentra la definición de las rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de autenticación
app.use('/api', authRoutes);

// Verificar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('¡Conexión exitosa a la base de datos!');
    
    // Sincronizar los modelos después de verificar la conexión
    sequelize.sync({ force: false })  // Usa { force: false } para evitar eliminar datos existentes
      .then(() => {
        console.log('Modelos sincronizados correctamente con la base de datos.');

        // Iniciar el servidor solo después de que la conexión y sincronización sean exitosas
        const PORT = process.env.PORT || 3001;  // Cambiado el puerto a 3001
        app.listen(PORT, () => {
          console.log(`Servidor corriendo en puerto ${PORT}`);
        });
      })
      .catch((error) => {
        console.error('Error al sincronizar los modelos:', error);
      });
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });
