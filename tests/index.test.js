const server = require('../router/scraperRouter');
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
      .then((res) => {
        expect(res.body.length).toBe(90);
        expect(res.body).to.have.property('ecdsa_fingerprint');
      })
      .expect(200, done());
  });
  it('GET /invalid should respond with error', (done) => {
    request(server).get('//').expect(404);
    done();
  });
});
