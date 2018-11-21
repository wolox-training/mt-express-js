const users = require('./controllers/users');

exports.init = app => {
  app.post('/signup', [], users.signUp);
  app.post('/signin', [], users.signIn);
  app.get('/users', [], users.listUsers);
  app.post('/admin/users', [], users.addAdmin);
};
