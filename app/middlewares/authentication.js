const tokenManager = require('../services/tokenManager');
const errors = require('../errors');
const constants = require('../constants');

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return next(errors.authenticationFailure());
  return next();
};

exports.validatePermission = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next(errors.noAccessPermission());
  const decodedToken = tokenManager.decodeToken(token);
  if (decodedToken.role !== constants.ADMIN_ROLE) return next(errors.noAccessPermission());
  return next();
};
