const users = require('./controllers/users');
const authentication = require('./middlewares/authentication');

exports.init = app => {
  app.post('/signup', [], users.signUp);
  app.post('/signin', [], users.signIn);
  app.get('/users', [], users.listUsers);
  app.post('/admin/users', [authentication.validatePermission], users.addAdmin);
  app.get('/albums', [], users.listAlbums);
};
