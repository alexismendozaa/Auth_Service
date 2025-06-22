
const request = require('supertest');
const app = require('../app');

describe('POST /analysis/avatar', () => {
  it('should return 200 for a valid request', async () => {
    const response = await request(app)
      .post('/analysis/avatar')
      .send({ token: 'valid-token', imageUrl: 'fake-image-url' });

    expect(response.status).toBe(200);
  });

  it('should return 400 for an invalid token', async () => {
    const response = await request(app)
      .post('/analysis/avatar')
      .send({ token: 'invalid-token', imageUrl: 'fake-image-url' });

    expect(response.status).toBe(400);
  });
});
