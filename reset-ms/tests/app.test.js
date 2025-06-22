// tests/app.test.js para reset-ms
const request = require('supertest');
const app = require('../app'); // Suponiendo que app.js es tu servidor Express

describe('POST /reset', () => {
  it('should return 200 for valid reset request', async () => {
    const response = await request(app)
      .post('/reset')
      .send({ email: 'valid-email@example.com' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Reset email sent');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/reset')
      .send({ email: 'invalid-email' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid email format');
  });
});
