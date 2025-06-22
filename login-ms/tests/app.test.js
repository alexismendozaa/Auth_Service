// tests/app.test.js para login-ms
const request = require('supertest');
const app = require('../app'); // Suponiendo que app.js es tu servidor Express

describe('POST /login', () => {
  it('should return 200 for valid login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'valid-password' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
  });

  it('should return 400 for invalid login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'wrong-password' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});
