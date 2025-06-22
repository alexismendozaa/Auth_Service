
const request = require('supertest');
const app = require('../app'); 

describe('POST /register', () => {
  it('should return 201 for successful registration', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'newuser', password: 'password' });

    expect(response.status).toBe(201);
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'newuser' });

    expect(response.status).toBe(400);
  });
});
