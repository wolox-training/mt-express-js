// const controller = require('./controllers/controller');
const users = require('./controllers/users');

exports.init = app => {
  // Aca defini la ruta y adonde va
  app.post('/signup', [], users.signUp);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
