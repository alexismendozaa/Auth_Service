const request = require('supertest');
const app = require('../app');

describe('POST /api/recovery', () => {
  it('should send a recovery token to the user email', async () => {
    const response = await request(app)
      .post('/api/recovery')
      .send({ email: 'newuser@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Recovery email sent');
  });

  it('should return an error if email not found', async () => {
    const response = await request(app)
      .post('/api/recovery')
      .send({ email: 'nonexistent@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email not found');
  });
});
