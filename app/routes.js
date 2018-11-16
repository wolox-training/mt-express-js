const users = require('./controllers/users');

exports.init = app => {
  app.post('/signup', [], users.signUp);
  app.post('/signin', [], users.signIn);
<<<<<<< HEAD
  app.get('/users', [], users.listUsers);
=======
>>>>>>> master
};
