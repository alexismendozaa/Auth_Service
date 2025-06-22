const axios = require('axios');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const FormData = require('form-data');
dotenv.config();  // Cargar variables de entorno desde .env

// Configuración de Sightengine
const SIGHTENGINE_API_USER = process.env.SIGHTENGINE_API_USER;
const SIGHTENGINE_API_KEY = process.env.SIGHTENGINE_API_KEY;

// Función para analizar la imagen usando Sightengine
const checkImage = async (req, res) => {
    try {
        // Obtener el token JWT del encabezado 'Authorization' sin la palabra 'Bearer'
        const token = req.headers['authorization'];

        // Verificar si el token existe
        if (!token) {
            return res.status(401).json({ message: 'Token JWT no proporcionado' });
        }

        // Eliminar 'Bearer ' del token si está presente
        const jwtToken = token.replace(/^Bearer\s+/, '');  // Eliminar 'Bearer ' si está presente

        // Verificar el token JWT
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Obtener la URL de la imagen del perfil desde la base de datos
        const user = await User.findByPk(userId);
        if (!user || !user.profileImage) {
            return res.status(400).json({
                message: 'No se ha encontrado una imagen de perfil para este usuario.'
            });
        }
        const imageUrl = user.profileImage;  // Aquí es donde obtenemos la URL de la imagen

        // Crear los datos del formulario para multipart/form-data
        const form = new FormData();
        form.append('models', 'nudity,weapon,recreational_drug,medical,offensive,gore,violence,self-harm');  // Todos los modelos que deseas usar
        form.append('api_user', SIGHTENGINE_API_USER);  // Usuario de la API
        form.append('api_secret', SIGHTENGINE_API_KEY);  // Clave secreta de la API
        form.append('url', imageUrl);  // URL de la imagen

        // Realizar la solicitud a Sightengine
        const response = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
            headers: {
                ...form.getHeaders(),  // Incluye los headers necesarios para multipart/form-data
            }
        });

        // Procesar la respuesta
        if (response.data.status === 'success') {
            const data = response.data;

            // Definir umbrales para cada modelo
            const nudityThreshold = 0.8; // Umbral para desnudez
            const violenceThreshold = 0.2; // Umbral para violencia
            const weaponThreshold = 0.2; // Umbral para armas
            const drugThreshold = 0.2; // Umbral para drogas recreativas
            const medicalThreshold = 0.2; // Umbral para contenido médico
            const goreThreshold = 0.2; // Umbral para contenido gore
            const offensiveThreshold = 0.2; // Umbral para contenido ofensivo
            const selfHarmThreshold = 0.2; // Umbral para contenido de autolesión

            // Evaluar cada modelo
            if (data.nudity && data.nudity.raw > nudityThreshold) {
                return handleInappropriateContent(res, 'Desnudez', imageUrl, userId);
            }
            if (data.violence && data.violence.prob > violenceThreshold) {
                return handleInappropriateContent(res, 'Violencia', imageUrl, userId);
            }
            if (data.weapon && data.weapon.prob > weaponThreshold) {
                return handleInappropriateContent(res, 'Armas', imageUrl, userId);
            }
            if (data.recreational_drug && data.recreational_drug.prob > drugThreshold) {
                return handleInappropriateContent(res, 'Drogas recreativas', imageUrl, userId);
            }
            if (data.medical && data.medical.prob > medicalThreshold) {
                return handleInappropriateContent(res, 'Contenido médico', imageUrl, userId);
            }
            if (data.gore && data.gore.prob > goreThreshold) {
                return handleInappropriateContent(res, 'Contenido gore', imageUrl, userId);
            }
            if (data.offensive && data.offensive.prob > offensiveThreshold) {
                return handleInappropriateContent(res, 'Contenido ofensivo', imageUrl, userId);
            }
            if (data.self_harm && data.self_harm.prob > selfHarmThreshold) {
                return handleInappropriateContent(res, 'Autolesión', imageUrl, userId);
            }

            // Si la imagen es apropiada
            return res.status(200).json({ message: 'La imagen es apropiada' });
        } else {
            return res.status(400).json({
                message: 'Error en el análisis de la imagen',
                error: response.data
            });
        }
    } catch (error) {
        console.error('Error en el análisis de la imagen:', error);
        return res.status(500).json({ message: 'Error al procesar la imagen' });
    }
};

// Función para manejar contenido inapropiado y eliminar la imagen
async function handleInappropriateContent(res, contentType, imageUrl, userId) {
    try {
        // Aquí asumimos que la URL de la imagen contiene el nombre del archivo
        const s3ImageKey = imageUrl.split('/').pop();  // Extraemos el nombre del archivo

        // Eliminar la imagen de S3
        const s3DeleteUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3ImageKey}`;
        await axios.delete(s3DeleteUrl);

        // Eliminar la imagen de la base de datos (suponiendo que tenemos un campo 'profileImage' en el modelo User)
        const user = await User.findByPk(userId);
        if (user) {
            await User.update({ profileImage: null }, { where: { id: userId } });
        }

        return res.status(400).json({ message: `Imagen con contenido inapropiado: ${contentType}. Ha sido eliminada.` });

    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        return res.status(500).json({ message: 'Error al eliminar la imagen' });
    }
}

module.exports = { checkImage };
