const chai = require('chai'),
  server = require('../../app'),
  should = chai.should(),
  constants = require('../../app/constants'),
  users = require('../../app/models').users,
  bcrypt = require('bcryptjs'),
<<<<<<< HEAD
<<<<<<< HEAD
  support = require('../support/mocks'),
  tokenManager = require('../../app/services/tokenManager');
=======
  tokenManager = require('../../app/services/tokenManager'),
  support = require('../support/mocks');
>>>>>>> d78d62901c655609096e0fd405cca24ec22b7696
=======
  tokenManager = require('../../app/services/tokenManager'),
  support = require('../support/mocks');
>>>>>>> list-albums-photos

const signUpUser = (email, password = '12345678') => {
  return chai
    .request(server)
    .post('/signup')
    .send({
      email,
      password,
      firstName: 'Miguel',
      lastName: 'Toscano'
    });
};

const signIn = (email, password) => {
  return chai
    .request(server)
    .post('/signin')
    .send({
      email,
      password
    });
};

const forceSignUpAsAdmin = (email, password) => {
  const newUser = {
    email,
    password,
    firstName: 'Mister',
    lastName: 'Admin',
    role: constants.ADMIN_ROLE
  };

  return bcrypt.hash(password, constants.SALT).then(hash => {
    newUser.password = hash;
    return users.addUser(newUser);
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
    let adminToken = null;
    beforeEach('3 regular users and 1 admin are created', done => {
      const firstUser = signUpUser('perro@wolox.com.ar', '12345678');
      const secondUser = signUpUser('gato@wolox.com.ar', '12345678');
      const thirdUser = signUpUser('caballo@wolox.com.ar', '12345678');
      const adminUser = forceSignUpAsAdmin('dinosaurio@wolox.com.ar', '12345678');

      Promise.all([firstUser, secondUser, thirdUser, adminUser])
        .then(() => signIn('dinosaurio@wolox.com.ar', '12345678'))
        .then(res => {
          adminToken = res.body.token;
          done();
        });
    });
    context('An admin is logged in', () => {
      it('Adding a non already existing user as an admin providing correct user info should succeed', done => {
        const email = 'pajaro@wolox.com.ar';
        const password = '12345678';

        const newUser = {
          email,
          password,
          firstName: 'Pajaro',
          lastName: 'Volador'
        };

        chai
          .request(server)
          .post('/admin/users')
          .set('authorization', adminToken)
          .send(newUser)
          .then(res2 => {
            res2.should.have.status(200);
            done();
          });
      });
      it('Trying to update an already admin user to admin should not throw any errors', done => {
        chai
          .request(server)
          .post('/admin/users')
          .set('authorization', adminToken)
          .send({
            email: 'dinosaurio@wolox.com.ar'
          })
          .then(res2 => {
            res2.should.have.status(200);
            done();
          });
      });
      it('Adding a non already existing user as an admin providing incorrect user info should fail', done => {
        const newUser = {
          email: 'pajaro@wolox.com.ar',
          password: '1234567',
          firstName: 'Pajaro',
          lastName: 'Volador'
        };
        chai
          .request(server)
          .post('/admin/users')
          .set('authorization', adminToken)
          .send(newUser)
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
      it('Updating an already existing regular user as an admin to an admin should succeed', done => {
        chai
          .request(server)
          .post('/admin/users')
          .set('authorization', adminToken)
          .send({
            email: 'perro@wolox.com.ar'
          })
          .then(res2 => {
            res2.should.have.status(200);
            done();
          });
      });
    });
    context('An admin is not logged in', () => {
      it('Trying to add a new admin user while not being logged in should fail', done => {
        chai
          .request(server)
          .post('/admin/users')
          .send({
            email: 'elefante@wolox.com.ar',
            password: '12345678',
            firstName: 'Dumbo',
            lastName: 'Orejas'
          })
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
      it('Trying to update an already existing user to admin while not being logged in should fail', done => {
        chai
          .request(server)
          .post('/admin/users')
          .send({
            email: 'pajaro@wolox.com.ar'
          })
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });
  describe('/albums GET', () => {
    let token = null;

    beforeEach('A user is created and logged in', done => {
      signUpUser('rata@wolox.com.ar', '12345678')
        .then(res1 => signIn('rata@wolox.com.ar', '12345678'))
        .then(res2 => {
          token = res2.body.token;
          support.mockAlbumsGetRequest();
          done();
        });
    });

    context('A user is logged in', () => {
      it('A logged in user should list albums succesfully', done => {
        chai
          .request(server)
          .get('/albums')
          .set('authorization', token)
          .then(res3 => {
            res3.should.have.status(200);
            res3.body.id.should.equal(support.expectedAlbumsResponse.id);
            res3.body.userId.should.equal(support.expectedAlbumsResponse.userId);
            res3.body.title.should.equal(support.expectedAlbumsResponse.title);
            done();
          });
      });
    });

    context('A user is not logged in', () => {
      it('A non logged in user trying to list albums should fail', done => {
        chai
          .request(server)
          .get('/albums')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('/users/:user_id/albums GET', () => {
    let regularUserToken = null;
    let adminUserToken = null;

    beforeEach('A regular user is created and logged in', done => {
      forceSignUpAsAdmin('orangutan@wolox.com.ar', '12345678')
        .then(() => signIn('orangutan@wolox.com.ar', '12345678'))
        .then(res1 => {
          adminUserToken = res1.body.token;
        })
        .then(() => signUpUser('koala@wolox.com.ar', '12345678'))
        .then(() => signIn('koala@wolox.com.ar', '12345678'))
        .then(res2 => {
          regularUserToken = res2.body.token;
          done();
        });
    });

    context('A regular user is logged in', () => {
      it('A regular user lists its own albums', done => {
        const decodedToken = tokenManager.decodeToken(regularUserToken);

        chai
          .request(server)
          .get(`/users/${decodedToken.id}/albums`)
          .set('authorization', regularUserToken)
          .then(res => {
            res.should.have.status(200);
            done();
          });
      });
      it('A regular user should not be able to list other users albums', done => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
        const decodedToken = tokenManager.decodeToken(regularUserToken);

>>>>>>> list-albums-photos
        chai
          .request(server)
          .get(`/users/${decodedToken.id + 1}/albums`)
          .set('authorization', regularUserToken)
          .catch(err => {
            err.should.have.status(401);
            done();
          });
<<<<<<< HEAD
        done();
=======
        const decodedToken = tokenManager.decodeToken(regularUserToken);

        chai
          .request(server)
          .get(`/users/${decodedToken.id + 1}/albums`)
          .set('authorization', regularUserToken)
          .catch(err => {
            err.should.have.status(401);
            done();
          });
>>>>>>> d78d62901c655609096e0fd405cca24ec22b7696
=======
>>>>>>> list-albums-photos
      });
    });

    context('An admin user is logged in', () => {
      it('An admin lists his own albums', done => {
        const decodedToken = tokenManager.decodeToken(adminUserToken);

        chai
          .request(server)
          .get(`/users/${decodedToken.id}/albums`)
          .set('authorization', adminUserToken)
          .then(res => {
            res.should.have.status(200);
            done();
          });
      });
      it('An admin lists other users albums', done => {
<<<<<<< HEAD
<<<<<<< HEAD
        chai
          .request(server)
          .get(`/users/5/albums`)
=======
        const decodedToken = tokenManager.decodeToken(adminUserToken);

        chai
          .request(server)
          .get(`/users/${decodedToken.id + 1}/albums`)
>>>>>>> d78d62901c655609096e0fd405cca24ec22b7696
=======
        const decodedToken = tokenManager.decodeToken(adminUserToken);

        chai
          .request(server)
          .get(`/users/${decodedToken.id + 1}/albums`)
>>>>>>> list-albums-photos
          .set('authorization', regularUserToken)
          .then(res => {
            res.should.have.status(200);
            done();
          });
      });
    });

    context('No user is logged in', () => {
      it('A non-logged in user cant list any albums', done => {
        chai
          .request(server)
          .get('/users/2/albums')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });
});
