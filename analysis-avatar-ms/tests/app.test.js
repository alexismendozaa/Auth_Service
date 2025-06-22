// tests/app.test.js para analysis-avatar-ms
const request = require('supertest');
const app = require('../app'); // Suponiendo que app.js es tu servidor Express

describe('POST /analysis/avatar', () => {
  it('should return status 200 for valid request', async () => {
    const response = await request(app)
      .post('/analysis/avatar')
      .send({ token: 'valid-token', imageUrl: 'fake-image-url' });
    
    expect(response.status).toBe(200);  // Suponiendo que esta es la respuesta esperada
    expect(response.body).toHaveProperty('message', 'Avatar analysis complete');  // Asegúrate de que devuelva el mensaje correcto
  });

  it('should return 400 for invalid token', async () => {
    const response = await request(app)
      .post('/analysis/avatar')
      .send({ token: 'invalid-token', imageUrl: 'fake-image-url' });
    
    expect(response.status).toBe(400);  // O el código de error que esperas
    expect(response.body).toHaveProperty('error', 'Invalid token');  // Error por token inválido
  });
});
