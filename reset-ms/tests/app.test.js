const request = require('supertest');
const app = require('../app');

describe('POST /api/reset', () => {
  it('should reset the password using a valid token', async () => {
    const response = await request(app)
      .post('/api/reset')
      .send({
        token: 'valid-reset-token',
        newPassword: 'newPassword123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password successfully reset');
  });

  it('should return an error for an invalid token', async () => {
    const response = await request(app)
      .post('/api/reset')
      .send({
        token: 'invalid-reset-token',
        newPassword: 'newPassword123'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid token');
  });
});
