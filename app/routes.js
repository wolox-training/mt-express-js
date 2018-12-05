const users = require('./controllers/users');
const authentication = require('./middlewares/authentication');

exports.init = app => {
  app.post('/signup', [], users.signUp);
  app.post('/signin', [], users.signIn);
  app.get('/users', [authentication.authenticate], users.listUsers);
  app.post('/admin/users', [authentication.validatePermission], users.addAdmin);
  app.get('/albums', [authentication.authenticate], users.listAlbums);

  app.get(
    '/users/:user_id/albums',
    [authentication.authenticate, authentication.validateAlbumsRequest],
    users.listUserAlbums
  );
};
