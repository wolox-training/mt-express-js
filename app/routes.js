const users = require('./controllers/users');
const authentication = require('./middlewares/authentication');

exports.init = app => {
  app.post('/signup', [], users.signUp);

  app.post('/signin', [], users.signIn);

  app.get('/users', [authentication.authenticate], users.listUsers);
<<<<<<< HEAD

  app.post('/admin/users', [authentication.validatePermission], users.addAdmin);
=======
  app.post('/admin/users', [authentication.authenticate, authentication.validatePermission], users.addAdmin);
  app.get('/albums', [authentication.authenticate], users.listAlbums);
>>>>>>> 5edd3a269f4562038a08e2611ce8f96bacdb77b6

  app.get('/albums', [authentication.authenticate], users.listAlbums);
  app.get(
    '/users/:user_id/albums',
    [authentication.authenticate, authentication.validateAlbumsRequest],
    users.listUserAlbums
  );

<<<<<<< HEAD
  // Para listar las fotos, un usuario debe poder realizar un http request (GET) a "users/albums/:id/photos"
  // Se debe estar autenticado para consumir dicho recurso
  // Un usuario solo podra ver las fotos de albumes que el haya comprado
  // Un administrador solo podra ver las fotos de albumes que haya comprado
  // Se deben agregar Tests, para los cuales se debera mockear la respuesta del servicio externo
  // Realizar logs informativos en caso de considerarlo necesario.
  // Loggear un error en caso de falla de la base de datos.

  app.get(
    'users/albums/:id/photos',
=======
  app.get(
    '/users/albums/:id/photos',
>>>>>>> 5edd3a269f4562038a08e2611ce8f96bacdb77b6
    [authentication.authenticate, authentication.validatePhotosRequest],
    users.listPhotos
  );
};
