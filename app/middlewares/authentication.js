const tokenManager = require('../services/tokenManager');
const errors = require('../errors');
const constants = require('../constants');
const albumsManager = require('../services/albumsManager');

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

  if (decodedToken.role === constants.REGULAR_ROLE && decodedToken.id !== Number(req.params.user_id))
    return next(errors.noAccessPermission());

  return next();
};


exports.validatePhotosRequest = (req, res, next) => {
  const user = tokenManager.decodeToken(req.headers.authorization);

  albumsManager
    .getAlbumByParams({
      id: req.params.id,
      ownerId: user.id
    })
    .then(album => {
      if (!album) throw errors.notFoundFailure('Could not find a match for the provided album id');
      return next();
    })
    .catch(next);
};
