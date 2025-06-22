const request = require('supertest');
const app = require('../app');  // Asegúrate de importar el archivo correcto

describe('POST /api/auth/register', () => {
  it('should register a new user and upload profile picture', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
        profileImage: 'fake-image-url' 
      });
    expect(response.status).toBe(201);
    expect(response.body.email).toBe('newuser@example.com');
    expect(response.body.profileImage).toBe('fake-image-url');
  });

  it('should return an error if user already exists', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'existinguser@example.com',
        password: 'password123',
        profileImage: 'fake-image-url'
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });
});
