// tests/app.test.js para register-ms
const request = require('supertest');
const app = require('../app'); // Suponiendo que app.js es tu servidor Express

describe('POST /register', () => {
  it('should return 200 for successful registration', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'newuser', password: 'newpassword' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Registration successful');
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'newuser' });  // Falta el campo de la contraseña
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Password is required');
  });
});
