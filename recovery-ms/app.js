const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./config/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passwordRoutes = require('./routes/passwordRoutes');  // Asegúrate de que la ruta sea correcta

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

// Configuration Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Recuperación de Contraseña',
      description: 'API para recuperación de contraseñas',
      version: '1.0.0',
    },
  },
  apis: ['./routes/passwordRoutes.js'],
};

// Generate Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api', passwordRoutes);

// Swagger UI
app.use('/api-docs-recovery', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connecting to the database and starting the server
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
    sequelize.sync({ alter: true }) 
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

// Server configuration
const port = process.env.PORT || 3002;
app.listen(port,'0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
