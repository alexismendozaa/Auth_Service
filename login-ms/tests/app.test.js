const request = require('supertest');
const app = require('../app');

describe('POST /api/login', () => {
  it('should authenticate the user and return a token', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'afmendozaf@uce.edu.ec',
        password: 'alexis123'
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should return an error for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'wronguser@example.com',
        password: 'wrongpassword'
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
