
const request = require('supertest');
const app = require('../app'); 

describe('POST /login', () => {
  it('should return 200 for valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'password' });

    expect(response.status).toBe(200);
  });

  it('should return 400 for invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'wrongpassword' });

    expect(response.status).toBe(400);
  });
});
