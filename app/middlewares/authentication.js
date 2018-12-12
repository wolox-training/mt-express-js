const tokenManager = require('../services/tokenManager');
const errors = require('../errors');
const constants = require('../constants');
const albumsManager = require('../services/albumsManager');
const moment = require('moment');
const config = require('../../config');
const users = require('../models').users;

// Checks if an user is logged in
exports.authenticate = (req, res, next) => {
  if (!req.headers.authorization) return next(errors.authenticationFailure());
  const decodedToken = tokenManager.decodeToken(req.headers.authorization);
  const sessionTimeLimit = moment(decodedToken.creationTime).add(
    config.common.session.expirationTime,
    'hours'
  );
  const currentTime = moment();
  const result = moment(currentTime).isAfter(sessionTimeLimit);
  if (result) return next(errors.sessionExpired());
  req.user = decodedToken;
  return next();
};

// Checks if the currentSessionKey provided in the token is the same as the one stored in the database
exports.validateSession = (req, res, next) =>
  users.findUserByEmail(req.user.email).then(foundUser => {
    if (foundUser.currentSessionKey !== req.user.currentSessionKey) return next(errors.invalidSession());

    return next();
  });

// Checks if the user has admin permission
exports.validatePermission = (req, res, next) => {
  if (req.user.role !== constants.ADMIN_ROLE) return next(errors.noAccessPermission());
  return next();
};

// Checks that a regular user can just request for his own albums, while
// an admin can request for any user's album
exports.validateAlbumsRequest = (req, res, next) => {
  if (req.user.role === constants.REGULAR_ROLE && req.user.id !== parseInt(req.params.user_id))
    return next(errors.noAccessPermission());
  return next();
};

exports.validateAlbumsBuyRequest = (req, res, next) => {
  albumsManager
    .getAlbumByParams({
      id: parseInt(req.params.id),
      ownerId: parseInt(req.user.id)
    })
    .then(foundAlbum => {
      if (foundAlbum) return next(errors.albumAlreadyOwned());
      return next();
    });
};
exports.validatePhotosRequest = (req, res, next) =>
  albumsManager
    .getAlbumByParams({
      id: parseInt(req.params.id),
      ownerId: parseInt(req.user.id)
    })
    .then(album => {
      if (!album) return next(errors.notFoundFailure('Could not find a match for the provided album id'));
      return next();
    });
