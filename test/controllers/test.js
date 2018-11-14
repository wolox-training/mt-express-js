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
            done();
          });
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

  describe('/signin POST', () => {
    beforeEach('Se crea un usuario', done => {
      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'miguel.toscano@wolox.com.ar',
          password: '12345678',
          firstName: 'Miguel',
          lastName: 'Toscano'
        })
        .then(() => done());
    });
    context('A user was preoviously created', () => {
      it('Signing in with correct email and password should succeed', done => {
        chai
          .request(server)
          .post('/signin')
          .send({
            email: 'miguel.toscano@wolox.com.ar',
            password: '12345678'
          })
          .then(res => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            done();
          });
      });
      it('Signing in with an incorrect password should fail', done => {
        chai
          .request(server)
          .post('/signin')
          .send({
            email: 'miguel.toscano@wolox.com.ar',
            password: '123456789' // Incorrect password
          })
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
      it('Signing in with an inexistent email should fail', done => {
        chai
          .request(server)
          .post('/signin')
          .send({
            email: 'miguel.riquelme@wolox.com.ar', // Unregistered email
            password: '12345678'
          })
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
      it('Signing in with an invalid email domain should fail', done => {
        chai
          .request(server)
          .post('/signin')
          .send({
            email: 'miguel.toscano@gmail.com' // Invalid email domain
          })
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
    });
  });
  /* describe('/users GET', () => {
    beforeEach('Se crean 3 usuarios', done => {
      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'miguel.toscano@wolox.com.ar',
          password: '12345678',
          firstName: 'Miguel',
          lastName: 'Toscano'
        })
        .send({
          email: 'mauricio.macri@wolox.com.ar',
          password: '12345678',
          firstName: 'Mauricio',
          lastName: 'Macri'
        })
        .send({
          email: 'marcelo.tinelli@wolox.com.ar',
          password: '12345678',
          firstName: 'Marcelo',
          lastName: 'Tinelli'
        })
        .then(() => done());
    });
  });
  context(''); */
});
