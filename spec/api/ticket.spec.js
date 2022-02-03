const supertest = require('supertest');
const userService = require('../../services/users');
const app = require('../../app');
const request = supertest(app);

const VALID_TOKEN = 'USER-1-TOKEN';
const INVALID_TOKEN = 'INVALID-TOKEN';

describe('Ticket tests', () => {
  beforeAll(async () => {
    spyOn(userService, 'getUserByToken').and.callFake(async (token) => {
      if (token.startsWith('INVALID')) {
        return Promise.reject(new Error('Invalid Token'));
      } else {
        return Promise.resolve({
          id: 'USER-1-ID',
          name: 'User 1',
          email: 'user1mail@gmail.com',
        });
      }
    });
  });

  afterAll(() => {
    userService.getUserByToken.stub();
  });

  it('shoul show success message for logged in users', async () => {
    const response = await request
      .get('/tickets')
      .set('Authorization', VALID_TOKEN);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello User 1!');
  });

  it('shoul show error for non-user', async () => {
    const response = await request.get('/tickets');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('shoul show invalid message for invalid token', async () => {
    const response = await request
      .get('/tickets')
      .set('Authorization', INVALID_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Token');
  });
});
