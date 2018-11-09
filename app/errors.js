const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'Default error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'Database error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.MISSING_USER_INFORMATION = 'Missing user information';
exports.missingUserInformation = () =>
  internalError(exports.MISSING_USER_INFORMATION, exports.MISSING_USER_INFORMATION);

exports.EMAIL_ALREADY_USED = 'Email is already used';
exports.emailAlreadyUsed = () => internalError(exports.EMAIL_ALREADY_USED, exports.EMAIL_ALREADY_USED);

exports.INVALID_EMAIL_DOMAIN = 'Invalid email domain';
exports.invalidEmailDomain = () => internalError(exports.INVALID_EMAIL_DOMAIN, exports.INVALID_EMAIL_DOMAIN);

exports.INVALID_PASSWORD = 'Invalid Password';
exports.invalidPassword = () => internalError(exports.INVALID_PASSWORD, exports.INVALID_PASSWORD);
