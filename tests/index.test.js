const server = require('../router/scraperRouter');
// const server = require('./controller/scraperController');
// const supertest = require('supertest');
const request = require('supertest');

describe('page endpoints', () => {
  it('GET / should show all articles', (done) => {
    request(server)
      .get('/')
      .set('Accept', 'application/JSON')
      .expect('Content-Type', /json/)
      .expect(200, done);
    done();
  });
  it('GET /page should show all articles from p.1 to page', (done) => {
    request(server)
      .get('/3')
      .set('Accept', 'application/JSON')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });
  it('GET /invalid should respond with error', (done) => {
    request(server).get('//').expect(404);
    done();
  });
});
