const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../../app'),
  should = chai.should(),
  logger = require('../../app/logger');

describe('User Tests', () => {
  describe('/signup POST', () => {
    context('', () => {
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
    });
    context('An user is previously created so that an already used email exists', () => {
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
          .then(() => {
            chai
              .request(server)
              .post('/signup')
              .send({
                email: 'miguel.toscano@wolox.com.ar',
                password: '12345678',
                firstName: 'Miguel',
                lastName: 'Toscano'
              })
              .catch(err => {
                err.should.have.status(400);
                done();
              });
          });
      });
    });
    context('Invalid fields tests', () => {
      it('Signing up should fail with a password shorter than 8 characters', done => {
        chai
          .request(server)
          .post('/signup')
          .send({
            email: 'miguel.toscano@wolox.com.ar',
            password: '1234567',
            firstName: 'Miguel',
            lastName: 'Toscano'
          })
          .catch(err => {
            err.should.have.status(400);
            done();
          });
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
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
      it('Signing up with an invalid email domain should fail', done => {
        chai
          .request(server)
          .post('/signup')
          .send({
            email: 'miguel.toscano@gmail.com',
            password: '12345678',
            firstName: 'Miguel',
            lastName: 'Toscano'
          })
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
    });
  });
});
