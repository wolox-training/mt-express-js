const tokenManager = require('../services/tokenManager');
const errors = require('../errors');
const constants = require('../constants');

// Checks if an user is logged in
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return next(errors.authenticationFailure());
  return next();
};

// Checks if the user has admin permission
exports.validatePermission = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next(errors.noAccessPermission());
  const decodedToken = tokenManager.decodeToken(token);
  if (decodedToken.role !== constants.ADMIN_ROLE) return next(errors.noAccessPermission());
  return next();
};

// Checks that a regular user can just request for his own albums, while
// an admin can request for any user's album
exports.validateAlbumsRequest = (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = tokenManager.decodeToken(token);
<<<<<<< HEAD
<<<<<<< HEAD
  const userId = req.params.user_id;

  if (decodedToken.role !== constants.ADMIN_ROLE && decodedToken.id === userId)
=======

  if (decodedToken.role === constants.REGULAR_ROLE && decodedToken.id !== Number(req.params.user_id))
>>>>>>> d78d62901c655609096e0fd405cca24ec22b7696
=======
  const userId = Number(req.params.user_id);

  if (decodedToken.role === constants.REGULAR_ROLE && decodedToken.id !== userId)
>>>>>>> list-albums-photos
    return next(errors.noAccessPermission());

  return next();
};

// Para listar las fotos, un usuario debe poder realizar un http request (GET) a "users/albums/:id/photos"
// Se debe estar autenticado para consumir dicho recurso
// Un usuario solo podra ver las fotos de albumes que el haya comprado
// Un administrador solo podra ver las fotos de albumes que haya comprado
// Se deben agregar Tests, para los cuales se debera mockear la respuesta del servicio externo
// Realizar logs informativos en caso de considerarlo necesario.
// Loggear un error en caso de falla de la base de datos.

exports.validatePhotosRequest = (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = tokenManager.decodeToken(token);
  const albumOwnerId = Number(req.params.id);

  if (decodedToken.id !== albumOwnerId) return next(errors.noAccessPermission());

  return next();
};
