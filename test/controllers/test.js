const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../../app'),
  should = chai.should(),
  logger = require('../../app/logger'),
  tokenManager = require('../../app/services/tokenManager'),
  constants = require('../../app/controllers/constants');

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
            lastName: 'Toscano',
            role: constants.ADMIN_ROLE
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
            lastName: 'Toscano',
            role: 'admin'
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
            lastName: 'Toscano',
            role: 'admin'
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
            lastName: 'Toscano',
            role: 'admin'
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
            lastName: 'Toscano',
            role: 'admin'
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
          lastName: 'Toscano',
          role: 'admin'
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
            err.should.have.status(401);
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
            err.should.have.status(401);
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
        .then(() => signUpUser('hola@wolox.com.ar'))
        .then(() => signUpUser('chau@wolox.com.ar'))
        .then(() => done());
    });
    context('A user is logged in', () => {
      it('All user are listed succesfully', done => {
        chai
          .request(server)
          .post('/signin')
          .send({
            email: 'miguel.toscano@wolox.com.ar',
            password: '12345678'
          })
          .then(res => {
            chai
              .request(server)
              .get('/users')
              .set('authorization', res.body.token)
              .then(res2 => {
                res.should.have.status(200);
                should.equal(res2.body.count, 3);
                done();
              });
          });
      });
    });
    context('A user is not logged in', () => {
      it('Trying to list users when not logged in should fail', done => {
        chai
          .request(server)
          .get('/users')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });
  describe('/admin/users POST', () => {
    beforeEach('3 regular users are created', done => {
      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'miguel.toscano@wolox.com.ar',
          password: '12345678',
          firstName: 'Miguel',
          lastName: 'Toscano'
        })
        .then(() => signUpUser('martin.cirio@wolox.com.ar'))
        .then(() => signUpUser('ricardo.fort@wolox.com.ar'))
        .then(() => done());
    });
    context('An admin is logged in', () => {
      it('Converting an existing user to an admin should succeed', done => {
        const adminUser = {
          role: 'admin'
        };
        const token = tokenManager.createToken(adminUser);
        chai
          .request(server)
          .post('/admin/users')
          .set('authorization', token)
          .send({
            token,
            user: { email: 'martin.cirio@wolox.com.ar' } // existing email
          })
          .then(res2 => {
            res2.should.have.status(200);
            done();
          });
      });
      it('Adding a new user with admin role as an admin should succeed', done => {
        const adminUser = {
          role: 'admin'
        };
        const token = tokenManager.createToken(adminUser);
        chai
          .request(server)
          .post('/admin/users')
          .set('authorization', token)
          .send({
            token,
            user: {
              email: 'new.user@wolox.com.ar',
              firstName: 'new',
              lastName: 'user',
              password: '12345678'
            }
          })
          .then(res2 => {
            res2.should.have.status(200);
            done();
          });
      });
      it('Trying to modify an user role without logging in should fail', done => {
        chai
          .request(server)
          .post('/admin/users')
          .send({
            user: {
              email: 'miguel.toscano@wolox.com.ar',
              password: '12345678'
            }
          })
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
      it('Trying to add a new admin user whithout logging in should fail', done => {
        chai
          .request(server)
          .post('/admin/users')
          .send({
            user: {
              email: 'rogelio.funesmori@wolox.com.ar',
              password: '12345678',
              firstName: 'Rogelio',
              lastName: 'Funes Mori',
              role: 'admin'
            }
          })
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });
  describe('/albums GET', () => {
    it('Trying to list albums without beeing logged in should fail', done => {
      chai
        .request(server)
        .get('/albums')
        .catch(err => {
          err.should.have.status(401);
          done();
        });
    });
    it('Listing albums while beeing logged in should succeed', done => {
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
            .post('/signin')
            .send({
              email: 'miguel.toscano@wolox.com.ar',
              password: '12345678'
            })
            .then(res => {
              chai
                .request(server)
                .get('/albums')
                .set('authorization', res.body.token)
                .then(res1 => {
                  res1.should.have.status(200);
                  done();
                });
            });
        });
    });
  });
});
