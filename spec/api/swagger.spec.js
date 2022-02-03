const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);

describe('Swagger tests', function () {
  it('should return 301', function (done) {
    request.get('/api-docs').expect(301, done);
  });

  it('should return 200', function (done) {
    request.get('/api-docs/').expect(200, done);
  });

  it('should say hello', async () => {
    const response = await request.get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text.startsWith('Welcome')).toBeTrue();
  });
});
