const supertest = require('supertest');
const userService = require('../../services/users');
const app = require('../../app');
const req = require('express/lib/request');
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

  it('should show success message for logged in users', async () => {
    const response = await request
      .get('/tickets')
      .set('Authorization', VALID_TOKEN);
    expect(response.status).toBe(200);
  });

  it('should show error for non-user', async () => {
    const response = await request.get('/tickets');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should show invalid message for invalid token', async () => {
    const response = await request
      .get('/tickets')
      .set('Authorization', INVALID_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Token');
  });

  it('should post a ticket', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);
  });

  it('should not post a ticket without category', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Category is required');
  });

  it('should get ticket by id', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request
      .get(`/tickets/${response.body.id}`)
      .set('Authorization', VALID_TOKEN);
    expect(response1.status).toBe(200);
    expect(response1.body.id).toBe(response.body.id);
    expect(response1.body.category).toBe('asset');
    expect(response1.body.subcategory).toBe('requestAllocation');
    expect(response1.body.title).toBe('Ticket Title');
    expect(response1.body.description).toBe('Ticket Description');
    expect(response1.body.assignedTo).toBe('USER-1-ID');
    expect(response1.body.status).toBe('open');
  });

  it('should not get ticket by id if not logged in', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request.get(`/tickets/${response.body.id}`);
    expect(response1.status).toBe(401);
    expect(response1.body.message).toBe('Unauthorized');
  });

  it('should not get ticket by id if invalid token', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request
      .get(`/tickets/${response.body.id}`)
      .set('Authorization', INVALID_TOKEN);
    expect(response1.status).toBe(400);
    expect(response1.body.message).toBe('Invalid Token');
  });

  it('should update ticket by id', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request
      .put(`/tickets/${response.body.id}`)
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subCategory: 'requestAllocation',
        title: 'Ticket Title2',
        description: 'Ticket Description2',
        assignedTo: 'USER-1-ID',
        status: 'closed',
      });
    expect(response1.status).toBe(200);
    expect(response1.body.id).toBe(response.body.id);
    expect(response1.body.category).toBe('asset');
    expect(response1.body.subcategory).toBe('requestAllocation');
    expect(response1.body.title).toBe('Ticket Title2');
    expect(response1.body.description).toBe('Ticket Description2');
    expect(response1.body.assignedTo).toBe('USER-1-ID');
    expect(response1.body.status).toBe('closed');
  });

  it('should not update ticket by id if not logged in', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request.put(`/tickets/${response.body.id}`).send({
      category: 'asset',
      subcategory: 'requestAllocation',
      title: 'Ticket Title',
      description: 'Ticket Description',
      assignedTo: 'USER-1-ID',
      status: 'closed',
    });
    expect(response1.status).toBe(401);
    expect(response1.body.message).toBe('Unauthorized');
  });

  it('should not update ticket by id if invalid token', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request
      .put(`/tickets/${response.body.id}`)
      .set('Authorization', INVALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
        status: 'closed',
      });
    expect(response1.status).toBe(400);
    expect(response1.body.message).toBe('Invalid Token');
  });

  it('should delete ticket by id', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request
      .delete(`/tickets/${response.body.id}`)
      .set('Authorization', VALID_TOKEN);
    expect(response1.status).toBe(200);
    expect(response1.text).toBe('Ticket deleted successfully');
  });

  it('should not delete ticket by id if not logged in', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request.delete(`/tickets/${response.body.id}`);
    expect(response1.status).toBe(401);
    expect(response1.body.message).toBe('Unauthorized');
  });

  it('should not delete ticket by id if invalid id', async () => {
    const response = await request
      .delete('/tickets/INVALID-ID')
      .set('Authorization', VALID_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Ticket Id');
  });

  it('should get all tickets', async () => {
    const response = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title',
        description: 'Ticket Description',
        assignedTo: 'USER-1-ID',
      });
    expect(response.status).toBe(201);

    const response1 = await request
      .post('/tickets')
      .set('Authorization', VALID_TOKEN)
      .send({
        category: 'asset',
        subcategory: 'requestAllocation',
        title: 'Ticket Title2',
        description: 'Ticket Description2',
        assignedTo: 'USER-1-ID',
      });
    expect(response1.status).toBe(201);

    const response2 = await request
      .get('/tickets')
      .set('Authorization', VALID_TOKEN);
    expect(response2.status).toBe(200);
    expect(response2.body[response2.body.length - 2].id).toBe(response.body.id);
    expect(response2.body[response2.body.length - 2].category).toBe('asset');
    expect(response2.body[response2.body.length - 2].subcategory).toBe(
      'requestAllocation'
    );
    expect(response2.body[response2.body.length - 2].title).toBe(
      'Ticket Title'
    );
    expect(response2.body[response2.body.length - 2].description).toBe(
      'Ticket Description'
    );
    expect(response2.body[response2.body.length - 2].assignedTo).toBe(
      'USER-1-ID'
    );
    expect(response2.body[response2.body.length - 2].status).toBe('open');
    expect(response2.body[response2.body.length - 1].id).toBe(
      response1.body.id
    );
    expect(response2.body[response2.body.length - 1].category).toBe('asset');
    expect(response2.body[response2.body.length - 1].subcategory).toBe(
      'requestAllocation'
    );
    expect(response2.body[response2.body.length - 1].title).toBe(
      'Ticket Title2'
    );
    expect(response2.body[response2.body.length - 1].description).toBe(
      'Ticket Description2'
    );
    expect(response2.body[response2.body.length - 1].assignedTo).toBe(
      'USER-1-ID'
    );
    expect(response2.body[response2.body.length - 1].status).toBe('open');
  });
});
