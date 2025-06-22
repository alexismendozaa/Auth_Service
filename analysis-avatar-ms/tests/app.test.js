const request = require('supertest');
const app = require('../app');

describe('POST /analysis/avatar', () => {
  it('should analyze the avatar image with a valid token', async () => {
    const response = await request(app)
      .post('/analysis/avatar')
      .send({
        token: 'valid-temporary-token',
        imageUrl: 'fake-image-url'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Avatar analysis complete');
  });

  it('should return an error if token is invalid', async () => {
    const response = await request(app)
      .post('/analysis/avatar')
      .send({
        token: 'invalid-temporary-token',
        imageUrl: 'fake-image-url'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid token');
  });
});
