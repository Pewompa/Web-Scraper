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
test('GET /word to return empty array', async () => {
  const response = await api.get('/word');
  expect(response.body).toHaveLength(0);
});
test('GET /2 there are 60 articles', async () => {
  const response = await api.get('/2');
  expect(response.body).toHaveLength(60);
});

afterAll(() => {
  server.close();
});
