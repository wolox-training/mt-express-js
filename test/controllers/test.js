const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../../app'),
  should = chai.should();

describe('User Tests', () => {
  describe('/signup POST', () => {
    it('Signing up should succeed providing the correct user information', done => {
      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'miguel.toscano@wolox.com.ar',
          password: '12345678',
          firstName: 'Miguel',
          lastName: 'Toscano'
        })
        .then(res => {
          res.should.have.status(200);
        });
      done();
    });
    it('Signing up with an already used email should fail', done => {
      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'miguel.toscano@wolox.com.ar',
          password: '12345678',
          firstName: 'Miguel',
          lastName: 'Toscano'
        })
        .then(res => {
          res.should.have.status(400); // EMAIL_ALREADY_IN_USE
        });
      done();
    });
    it('Signing up should fail with a password shorte than 8 characters', done => {
      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'miguel.toscano@wolox.com.ar',
          password: '1234567',
          firstName: 'Miguel',
          lastName: 'Toscano'
        })
        .then(res => {
          res.should.have.status(400);
        });
      done();
    });
    it('Signing up with a missing field in the user information should fail', done => {
      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'miguel.toscano@wolox.com.ar',
          password: '12345678',
          lastName: 'Toscano'
        })
        .then(res => {
          res.should.have.status(400);
        });
      done();
    });
  });
});
