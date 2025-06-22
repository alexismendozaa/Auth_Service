
const request = require('supertest');
const app = require('../app'); 

describe('POST /reset', () => {
  it('should return 200 for valid reset request', async () => {
    const response = await request(app)
      .post('/reset')
      .send({ email: 'user@example.com', token: 'valid-token' });

    expect(response.status).toBe(200);
  });

  it('should return 400 for invalid token', async () => {
    const response = await request(app)
      .post('/reset')
      .send({ email: 'user@example.com', token: 'invalid-token' });

    expect(response.status).toBe(400);
  });
});
