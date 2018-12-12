const chai = require('chai'),
  server = require('../../app'),
  should = chai.should(),
  constants = require('../../app/constants'),
  users = require('../../app/models').users,
  bcrypt = require('bcryptjs'),
  tokenManager = require('../../app/services/tokenManager'),
  albumsManager = require('../../app/services/albumsManager'),
  support = require('../support/mocks'),
  data = require('../support/data');

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

const forceAlbum = (ownerId, albumId, title) => {
  const newAlbum = {
    ownerId,
    id: albumId,
    title
  };

  return albumsManager.addAlbum(newAlbum);
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
            res3.body.allAlbums[0].userId.should.equal(1);
            res3.body.allAlbums[0].id.should.equal(1);
            res3.body.allAlbums[0].title.should.equal('quidem molestiae enim');
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
        const decodedToken = tokenManager.decodeToken(regularUserToken);

        chai
          .request(server)
          .get(`/users/${decodedToken.id + 1}/albums`)
          .set('authorization', regularUserToken)
          .catch(err => {
            err.should.have.status(401);
            done();
          });
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
        const decodedToken = tokenManager.decodeToken(adminUserToken);

        chai
          .request(server)
          .get(`/users/${decodedToken.id + 1}/albums`)

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

  describe('/users/albums/:id/photos GET', () => {
    let regularUserToken = null;
    let adminUserToken = null;

    beforeEach('A regular user is created and logged in. An album is added to each one of them', done => {
      const signUpAdminUser = forceSignUpAsAdmin('orangutan@wolox.com.ar', '12345678');
      const signUpRegularUser = signUpUser('koala@wolox.com.ar', '12345678');

      const signInAdminUser = signIn('orangutan@wolox.com.ar', '12345678');

      const signInRegularUser = signIn('koala@wolox.com.ar', '12345678');

      const addAdminUserAlbum = albumsManager.addAlbum(data.adminUserAlbum);
      const addRegularUserAlbum1 = albumsManager.addAlbum(data.regularUserAlbum1);
      const addRegularUserAlbum2 = albumsManager.addAlbum(data.regularUserAlbum2);

      Promise.all([
        signUpAdminUser,
        signUpRegularUser,
        addAdminUserAlbum,
        addRegularUserAlbum1,
        addRegularUserAlbum2
      ]).then(() =>
        Promise.all([signInAdminUser, signInRegularUser]).then(([res1, res2]) => {
          adminUserToken = res1.body.token;
          regularUserToken = res2.body.token;
          done();
        })
      );
    });
    context('No user is logged in', () => {
      it('A non logged in user trying to list photos should fail', done => {
        chai
          .request(server)
          .get('/users/albums/0/photos')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
    context('An admin is logged in', () => {
      it('An admin should be able to list his own photos', done => {
        const decodedToken = tokenManager.decodeToken(adminUserToken);
        support.mockPhotosGetRequest(decodedToken.id);
        chai
          .request(server)
          .get(`/users/albums/${decodedToken.id}/photos`)
          .set('authorization', adminUserToken)
          .then(res => {
            res.should.have.status(200);
            res.body.photos.albumId.should.equal(decodedToken.id);
            res.body.photos.title.should.equal(support.expectedPhotosResponse(decodedToken.id).title);
            done();
          });
      });
      it('An admin should not be able to list other users photos', done => {
        const decodedToken = tokenManager.decodeToken(adminUserToken);
        support.mockPhotosGetRequest(decodedToken.id);
        chai
          .request(server)
          .get(`/users/albums/${decodedToken.id + 1}/photos`)
          .set('authorization', adminUserToken)
          .catch(err => {
            err.should.have.status(404);
            done();
          });
      });
    });
    context('A regular user is logged in', () => {
      it('A regular user should be able to list his own photos', done => {
        const decodedToken = tokenManager.decodeToken(regularUserToken);
        support.mockPhotosGetRequest(decodedToken.id);
        chai
          .request(server)
          .get(`/users/albums/${decodedToken.id}/photos`)
          .set('authorization', regularUserToken)
          .then(res => {
            res.should.have.status(200);
            res.body.photos.albumId.should.equal(decodedToken.id);
            res.body.photos.title.should.equal(support.expectedPhotosResponse(decodedToken.id).title);
            done();
          });
      });

      it('A regular user should no the able to list other users photos', done => {
        const decodedToken = tokenManager.decodeToken(regularUserToken);
        support.mockPhotosGetRequest(decodedToken.id);
        chai
          .request(server)
          .get(`/users/albums/${decodedToken.id + 1}/photos`)
          .set('authorization', regularUserToken)
          .catch(err => {
            err.should.have.status(404);
            done();
          });
      });
    });
  });
  describe('Session expiration', () => {
    it('A user is signed up and logged in, after a second the session should expire', done => {
      signUpUser('miguel.toscano@wolox.com.ar', '12345678')
        .then(() => signIn('miguel.toscano@wolox.com.ar', '12345678'))
        .then(res1 => {
          setTimeout(
            res => {
              chai
                .request(server)
                .get('/albums')
                .set('authorization', res.body.token)
                .catch(err => {
                  err.should.have.status(401);
                  done();
                });
            },
            1500,
            res1
          );
        });
    });
  });
  describe('/albums/:id POST', () => {
    let regularUserToken = null;
    let adminUserToken = null;

    beforeEach('A regular user is created and logged in. An album is added to each one of them', done => {
      const signUpAdminUser = forceSignUpAsAdmin('orangutan@wolox.com.ar', '12345678');
      const signUpRegularUser = signUpUser('koala@wolox.com.ar', '12345678');
      const forceAlbum1 = forceAlbum(1, 1, 'Straighten the rudder');
      const forceAlbum2 = forceAlbum(2, 2, 'DADDY YANKEE BIGGEST HITS');
      const signInAdminUser = signIn('orangutan@wolox.com.ar', '12345678');
      const signInRegularUser = signIn('koala@wolox.com.ar', '12345678');

      Promise.all([signUpAdminUser, signUpRegularUser, forceAlbum1, forceAlbum2]).then(() =>
        Promise.all([signInAdminUser, signInRegularUser]).then(([res1, res2]) => {
          adminUserToken = res1.body.token;
          regularUserToken = res2.body.token;
          done();
        })
      );
    });

    context('No user is logged in', () => {
      it('A non logged in user trying to buy an album fails', done => {
        chai
          .request(server)
          .post('/albums/1')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });

    context('A user is logged in', () => {
      it('An admin user should be able to buy an album', done => {
        const decodedToken = tokenManager.decodeToken(adminUserToken);

        const albumId = 11;

        chai
          .request(server)
          .post(`/albums/${albumId}`)
          .set('authorization', adminUserToken)
          .then(res => {
            res.should.have.status(200);
            res.body.boughtAlbum.title.should.equal('quam nostrum impedit mollitia quod et dolor');
            res.body.boughtAlbum.id.should.equal(albumId);
            res.body.boughtAlbum.ownerId.should.equal(decodedToken.id);
            done();
          });
      });

      it('A regular user should be able to buy an album', done => {
        const decodedToken = tokenManager.decodeToken(regularUserToken);
        const albumId = 10;

        support.mockAlbumsGetRequest(albumId); //

        chai
          .request(server)
          .post(`/albums/${albumId}`)
          .set('authorization', regularUserToken)
          .then(res => {
            res.should.have.status(200);
            res.body.boughtAlbum.title.should.equal('distinctio laborum qui');
            res.body.boughtAlbum.id.should.equal(10);
            res.body.boughtAlbum.ownerId.should.equal(decodedToken.id);
            done();
          });
      });

      it('An admin user should not be able to buy an alreadey owned album', done => {
        const alreadyOwnedAlbumId = 1;

        support.mockAlbumsGetRequest(alreadyOwnedAlbumId);

        chai
          .request(server)
          .post(`/albums/${alreadyOwnedAlbumId}`)
          .set('authorization', adminUserToken)
          .catch(err => {
            err.should.have.status(403);
            done();
          });
      });

      it('A regular user should not be able to buy an already owned album', done => {
        const alreadyOwnedAlbumId = 2;

        support.mockAlbumsGetRequest(alreadyOwnedAlbumId);

        chai
          .request(server)
          .post(`/albums/${alreadyOwnedAlbumId}`)
          .set('authorization', regularUserToken)
          .catch(err => {
            err.should.have.status(403);
            done();
          });
      });
    });
  });

  describe.only('/users/sessions/invalidate_all POST', () => {
    it('A user is logged in, invalidates sessions and cannot make any more requests', done => {
      let userToken = null;

      chai
        .request(server)
        .post('/signup')
        .send({
          email: 'mandragora@wolox.com.ar',
          password: '12345678',
          firstName: 'Miguel',
          lastName: 'Toscano'
        })
        .then(() => {
          chai
            .request(server)
            .post('/signin')
            .send({
              email: 'mandragora@wolox.com.ar',
              password: '12345678'
            })
            .then(res => {
              userToken = res.body.token;

              chai
                .request(server)
                .post('/users/sessions/invalidate_all')
                .set('authorization', userToken)
                .then(() => {
                  chai
                    .request(server)
                    .get('/albums')
                    .set('authorization', userToken)
                    .catch(err => {
                      err.should.have.status(403);
                      done();
                    });
                });
            });
        });
    });
  });
});
