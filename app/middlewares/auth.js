const tokenManager = require('../services/tokenManager');
const errors = require('../errors');
const constants = require('../controllers/constants');

exports.validatePermission = token =>
  new Promise((resolve, reject) => {
    if (!token) reject(errors.noAccessPermission());
    const decodedToken = tokenManager.decodeToken(token);
    if (decodedToken.role !== constants.ADMIN_ROLE) reject(errors.noAccessPermission());
    resolve();
  });
