const users = require('./controllers/users');
const authentication = require('./middlewares/authentication');

exports.init = app => {
  app.post('/signup', [], users.signUp);

  app.post('/signin', [], users.signIn);

  app.get('/users', [authentication.authenticate, authentication.validateSession], users.listUsers);
  app.post(
    '/admin/users',
    [authentication.authenticate, authentication.validateSession, authentication.validatePermission],
    users.addAdmin
  );
  app.get('/albums', [authentication.authenticate], authentication.validateSession, users.listAlbums);

  app.get(
    '/users/:user_id/albums',
    [authentication.authenticate, authentication.validateSession, authentication.validateAlbumsRequest],
    users.listUserAlbums
  );

  app.get(
    '/users/albums/:id/photos',
    [authentication.authenticate, authentication.validateSession, authentication.validatePhotosRequest],
    users.listPhotos
  );

  app.post(
    '/albums/:id',
    [authentication.authenticate, authentication.validateSession, authentication.validateAlbumsBuyRequest],
    users.buyAlbum
  );

  app.post(
    '/users/sessions/invalidate_all',
    [authentication.authenticate, authentication.validateSession],
    users.invalidateAllSessions
  );
};
