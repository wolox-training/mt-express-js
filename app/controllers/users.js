const users = require('../models').users;
const bcrypt = require('bcryptjs');
const errors = require('../errors');
const userServices = require('../services/users');
const logger = require('../logger');

const SALT = 10; // to ensure security
const MIN_PASSWORD_LENGTH = 8;

// Regex for Email domain validation
const ARGENTINA_WOLOX_DOMAIN = new RegExp('@wolox.com.ar');
const COLOMBIA_WOLOX_DOMAIN = new RegExp('@wolox.co');
const CHILE_WOLOX_DOMAIN = new RegExp('@wolox.cl');

const hasNoEmptyFields = user =>
  new Promise((resolve, reject) => {
    if (user.email && user.password && user.firstName && user.lastName) {
      resolve();
    } else {
      logger.error(errors.MISSING_USER_INFORMATION);
      throw errors.missingUserInformation();
    }
  });

const hasValidDomain = email =>
  new Promise((resolve, reject) => {
    if (
      ARGENTINA_WOLOX_DOMAIN.test(email) ||
      COLOMBIA_WOLOX_DOMAIN.test(email) ||
      CHILE_WOLOX_DOMAIN.test(email)
    ) {
      resolve();
    } else {
      logger.error(errors.INVALID_EMAIL_DOMAIN);
      throw errors.invalidEmailDomain();
    }
  });

const hasValidPassword = password =>
  new Promise((resolve, reject) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      logger.error(errors.INVALID_PASSWORD);
      throw errors.invalidPassword();
    } else {
      resolve();
    }
  });

const hasUniqueEmail = email =>
  users.findUserByEmail(email).then(foundUser => {
    if (foundUser) {
      logger.error('Email already used');
      throw errors.emailAlreadyUsed();
    }
  });

const encryptPassword = password =>
  bcrypt.hash(password, SALT).catch(err => {
    logger.error(err);
    throw errors.defaultError(err);
  });

exports.signUp = (req, res, next) => {
  const user = req.body;

  hasNoEmptyFields(user)
    .then(() => hasValidDomain(user.email))
    .then(() => hasUniqueEmail(user.email))
    .then(() => hasValidPassword(user.password))
    .then(() => encryptPassword(user.password))
    .then(hash => {
      user.password = hash;
      return users.addUser(user);
    })
    .then(() => res.status(200).send('User created!'))
    .catch(next);
};
