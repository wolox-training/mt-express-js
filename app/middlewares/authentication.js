const tokenManager = require('../services/tokenManager');
const errors = require('../errors');
const constants = require('../constants');

exports.validatePermission = (req, res, next) =>
  new Promise((resolve, reject) => {
    const token = req.body.token;
    if (!token) reject(res.status(401).send(errors.noAccessPermission()));
    const decodedToken = tokenManager.decodeToken(token);
    if (decodedToken.role !== constants.ADMIN_ROLE) reject(res.status(401).send(errors.noAccessPermission()));
    resolve(res.status(200).send());
  });
