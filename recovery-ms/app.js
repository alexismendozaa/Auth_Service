const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./config/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passwordRoutes = require('./routes/passwordRoutes');  // Asegúrate de que la ruta sea correcta

dotenv.config(); // Cargar las variables de entorno

const app = express();

// Middleware
app.use(express.json());

// Habilitar CORS para Swagger UI (o cualquier cliente externo)
app.use(cors({
  origin: 'http://localhost:3002',  // Reemplaza con la URL de tu Swagger UI
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Recuperación de Contraseña',
      description: 'API para recuperación de contraseñas',
      version: '1.0.0',
    },
  },
  apis: ['./routes/passwordRoutes.js'], // Asegúrate de que esta ruta apunte al archivo correcto
};

// Generar la documentación de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Rutas de la API
app.use('/api', passwordRoutes);

// Swagger UI
app.use('/api-docs-recovery', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Conexión a la base de datos y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
    sequelize.sync({ alter: true })  // Usamos 'alter' para actualizar las tablas sin perder datos
      .then(() => {
        console.log('Modelos sincronizados');
      })
      .catch(err => {
        console.error('Error al sincronizar los modelos:', err);
      });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Configuración del servidor
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
