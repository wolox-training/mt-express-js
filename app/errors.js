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

exports.INVALID_PASSWORD_FORMAT = 'Invalid Password format';
exports.invalidPasswordFormat = () =>
  internalError('Password has to be atleast 8 characters long', exports.INVALID_PASSWORD_FORMAT);
