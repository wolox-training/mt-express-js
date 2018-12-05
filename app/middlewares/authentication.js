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
  const userId = req.params.user_id;

  if (decodedToken.role !== constants.ADMIN_ROLE && decodedToken.id === userId)
=======

  if (decodedToken.role === constants.REGULAR_ROLE && decodedToken.id !== Number(req.params.user_id))
>>>>>>> d78d62901c655609096e0fd405cca24ec22b7696
    return next(errors.noAccessPermission());

  return next();
};
