const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.INVALID_USER]: 400,
  [errors.BOOK_NOT_FOUND]: 404,
  [errors.SAVING_ERROR]: 400,
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.MISSING_USER_INFORMATION]: 400,
  [errors.INVALID_EMAIL_DOMAIN]: 400,
  [errors.INVALID_PASSWORD_FORMAT]: 400,
  [errors.INVALID_EMAIL_DOMAIN]: 400,
  [errors.EMAIL_ALREADY_USED]: 400,
  [errors.INVALID_CREDENTIALS]: 400,
  [errors.AUTHENTICATION_FAILURE]: 400,
  [errors.INVALID_CREDENTIALS]: 400,
  [errors.NO_ACCESS_PERMISSION]: 400
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
