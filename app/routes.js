const users = require('./controllers/users');

exports.init = app => {
  app.post('/signup', [], users.signUp);
};
