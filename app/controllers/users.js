const users = require('../models').users;
const bcrypt = require('bcryptjs');
const errors = require('../errors');
const userServices = require('../services/users');
const logger = require('../logger');

const SALT = 10; // to ensure security
const MIN_PASSWORD_LENGTH = 8;

// Regex for Email domain validation
const ARGENTINA_WOLOX_DOMAIN = /^\w+([\.-]?\w+)*@wolox\.com\.ar/;
const COLOMBIA_WOLOX_DOMAIN = /^\w+([\.-]?\w+)*@wolox\.co/;
const CHILE_WOLOX_DOMAIN = /^\w+([\.-]?\w+)*@wolox\.cl/;

const hasValidDomain = email =>
  ARGENTINA_WOLOX_DOMAIN.test(email) || COLOMBIA_WOLOX_DOMAIN.test(email) || CHILE_WOLOX_DOMAIN.test(email);

const isValidPassword = password => password.length >= MIN_PASSWORD_LENGTH;

const validUser = user =>
  new Promise((resolve, reject) => {
    if (hasValidDomain(user.email) && isValidPassword(user.password)) {
      resolve();
    } else {
      reject(errors.invalidEmailDomain());
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

  validUser(user)
    .then(() => hasUniqueEmail(user.email))
    .then(() => encryptPassword(user.password))
    .then(hash => {
      user.password = hash;
      return users.addUser(user);
    }) // Store the user into the database
    .then(() => res.status(200).send('User created!'))
    .catch(next);
};
