const request = require('supertest');
const app = require('../app'); 

describe('POST /recovery', () => {
  it('should return 200 for a valid recovery request', async () => {
    const response = await request(app)
      .post('/recovery')
      .send({ email: 'user@example.com' });

    expect(response.status).toBe(200);
  });

  it('should return 400 for an invalid email', async () => {
    const response = await request(app)
      .post('/recovery')
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(400);
  });
});
