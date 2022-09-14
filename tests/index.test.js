const supertest = require('supertest');
const { app, server } = require('../index');
const api = supertest(app);

test('GET / articles are returned as json', async () => {
  await api
    .get('/')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});
test('GET /invalid should return error', async () => {
  await api.get('//').expect(404);
});

test('GET /2 there are 60 articles', async () => {
  const response = await api.get('/2');
  expect(response.body).toHaveLength(60);
});
test('GET / each object should have 8 keys', async () => {
  const response = await api.get('/');
  expect(Object.keys(response.body[0]).length).toBe(8);
});

afterAll(() => {
  server.close();
});
