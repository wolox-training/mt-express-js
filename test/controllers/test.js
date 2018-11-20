const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../../app'),
  should = chai.should(),
  logger = require('../../app/logger');

const signUpUser = email => {
  return chai
    .request(server)
    .post('/signup')
    .send({
      email,
      password: '12345678',
      firstName: 'Miguel',
      lastName: 'Toscano'
    });
};

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
    beforeEach('A user is created', done => {
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
    context('A user was previously created', () => {
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
  describe('/users GET', () => {
    beforeEach('3 users are succesfully created', done => {
      signUpUser('miguel.toscano@wolox.com.ar')
        .then(signUpUser('hola@wolox.com.ar'))
        .then(signUpUser('chau@wolox.com.ar'))
        .then(() => done());
    });
    context('A user is logged in', () => {
      it('All users are listed succesfully', done => {
        chai
          .request(server)
          .post('/signin')
          .send({
            email: 'miguel.toscano@wolox.com.ar',
            password: '12345678'
          })
          .then(res2 => {
            const token2 = res2.body.token;
            chai
              .request(server)
              .get('/users')
              .set('authorization', token2)
              .then(res => {
                res.should.have.status(200);
                done();
              });
          });
      });
    });
  });
  describe('/admin/users POST', () => {
    beforeEach('An admin is created', done => {
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
    context('An admin is logged in', () => {
      it('A new user is added as an admin', done => {
        chai
          .request(server)
          .post('/signin')
          .send({
            email: 'miguel.toscano@wolox.com.ar',
            password: '12345678'
          })
          .then(res => {
            const token = res.body.token;
            chai
              .request(server)
              .post('/admin/users')
              .send({
                email: 'peter.parker@wolox.com.ar',
                password: '12345678',
                firstName: 'Peter',
                lastName: 'Parker'
              })
              .then(finalRes => {
                finalRes.should.have.status(200);
                done();
              });
          });
      });
    });
  });
});
