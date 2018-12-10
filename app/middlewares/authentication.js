const tokenManager = require('../services/tokenManager');
const errors = require('../errors');
const constants = require('../constants');
const albumsManager = require('../services/albumsManager');
const moment = require('moment');
const config = require('../../config');

// Checks if an user is logged in
exports.authenticate = (req, res, next) => {
  if (!req.headers.authorization) return next(errors.authenticationFailure());
  const decodedToken = tokenManager.decodeToken(req.headers.authorization);
  const sessionTimeLimit = moment(decodedToken.creationTime).add(
    config.common.session.expirationTime,
    'seconds'
  );
  const currentTime = moment();
  const result = moment(currentTime).isAfter(sessionTimeLimit);
  if (result) return next(errors.sessionExpired());
  req.user = decodedToken;
  return next();
};

// Checks if the user has admin permission
exports.validatePermission = (req, res, next) => {
  if (req.user.role !== constants.ADMIN_ROLE) return next(errors.noAccessPermission());
  return next();
};

// Checks that a regular user can just request for his own albums, while
// an admin can request for any user's album
exports.validateAlbumsRequest = (req, res, next) => {
  if (req.user.role === constants.REGULAR_ROLE && req.user.id !== Number(req.params.user_id))
    return next(errors.noAccessPermission());
  return next();
};

exports.validatePhotosRequest = (req, res, next) => {
  return albumsManager
    .getAlbumByParams({
      id: req.params.id,
      ownerId: req.user.id
    })
    .then(album => {
      if (!album) return next(errors.notFoundFailure('Could not find a match for the provided album id'));
      return next();
    })
    .catch(next);
};
