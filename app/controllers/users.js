const users = require('../models').users;
const bcrypt = require('bcryptjs');
const errors = require('../errors');
const logger = require('../logger');
const tokenManager = require('../services/tokenManager');
const constants = require('../constants');
const albumsManager = require('../services/albumsManager');
const photosManager = require('../services/photosManager');
const moment = require('moment');

// Regex for Email domain validation
const ARGENTINA_WOLOX_DOMAIN = new RegExp('@wolox.com.ar');
const COLOMBIA_WOLOX_DOMAIN = new RegExp('@wolox.co');
const CHILE_WOLOX_DOMAIN = new RegExp('@wolox.cl');

const hasNoEmptyFields = user => user.email && user.password && user.firstName && user.lastName;

const hasValidDomain = email =>
  ARGENTINA_WOLOX_DOMAIN.test(email) || COLOMBIA_WOLOX_DOMAIN.test(email) || CHILE_WOLOX_DOMAIN.test(email);

const hasValidPassword = password => password.length >= constants.MIN_PASSWORD_LENGTH;

const hasValidFields = user =>
  new Promise((resolve, reject) => {
    if (!hasNoEmptyFields(user)) {
      reject(errors.missingUserInformation());
    }

    if (!hasValidPassword(user.password)) {
      reject(errors.invalidPasswordFormat());
    }

    if (!hasValidDomain(user.email)) {
      reject(errors.invalidEmailDomain());
    }

    resolve();
  });

const hasUniqueEmail = email =>
  users.findUserByEmail(email).then(
    foundUser =>
      new Promise((resolve, reject) => {
        if (!foundUser) return resolve();
        logger.error(errors.EMAIL_ALREADY_USED);
        return reject(errors.emailAlreadyUsed());
      })
  );

const encryptPassword = password =>
  bcrypt.hash(password, constants.SALT).catch(err => {
    logger.error(err);
    throw errors.defaultError(err);
  });

const generateCurrentSessionKey = () =>
  bcrypt.hash(moment().toISOString(), constants.SALT).catch(err => {
    logger.error(err);
    throw errors.defaultError(err);
  });

const addUser = (user, role) => {
  user.role = role;

  const encryptPasswordPromise = encryptPassword(user.password);
  const generateCurrentSessionKeyPromise = generateCurrentSessionKey();
  return hasValidFields(user)
    .then(() => hasUniqueEmail(user.email))
    .then(() => Promise.all([encryptPasswordPromise, generateCurrentSessionKeyPromise]))
    .then(([hashedPassword, currentSessionKey]) => {
      user.password = hashedPassword;
      user.currentSessionKey = currentSessionKey;
      return users.addUser(user);
    });
};

exports.signUp = (req, res, next) => {
  const user = req.body;
  return addUser(user, constants.REGULAR_ROLE)
    .then(() =>
      res.status(200).send({
        message: 'User created'
      })
    )
    .catch(next);
};

exports.signIn = (req, res, next) => {
  let user = req.body;

  if (!hasValidDomain(user.email)) return next(errors.invalidEmailDomain());

  return users
    .findUserByEmail(user.email)
    .then(foundUser => {
      const tempPassword = user.password;
      if (!foundUser) throw errors.invalidCredentials();
      user = foundUser.dataValues;
      return bcrypt.compare(tempPassword, foundUser.password);
    })
    .then(valid => {
      if (!valid) throw errors.invalidCredentials();
      const token = tokenManager.createToken(user);
      res.status(200).send({ token });
    })
    .catch(next);
};

exports.listUsers = (req, res, next) => {
  const limit = req.query.limit || constants.LIMIT_DEFAULT;
  const page = req.query.page || constants.PAGE_DEFAULT;

  return users
    .getAllUsers(page, limit)
    .then(allUsers => {
      res.status(200).send(allUsers);
    })
    .catch(next);
};

// Only an admin can add another admin
exports.addAdmin = (req, res, next) =>
  users
    .findUserByEmail(req.body.email)
    .then(foundUser => {
      if (foundUser) return users.updateUserRole(foundUser, constants.ADMIN_ROLE);
      return addUser(req.body, constants.ADMIN_ROLE);
    })
    .then(() => res.status(200).send({ message: 'Admin added' }))
    .catch(next);

exports.addAdmin = (req, res, next) => {
  const user = req.body;

  return users
    .findUserByEmail(user.email)
    .then(foundUser => {
      if (foundUser) return users.updateUserRole(foundUser, constants.ADMIN_ROLE);
      return addUser(user, constants.ADMIN_ROLE);
    })
    .then(() => res.status(200).send({ message: 'Admin added' }))
    .catch(next);
};

exports.listAlbums = (req, res, next) =>
  albumsManager
    .getAllAlbums()
    .then(allAlbums => res.status(200).send({ allAlbums }))
    .catch(next);

exports.listUserAlbums = (req, res, next) =>
  albumsManager
    .getAllAlbumsbyOwnerId(req.params.user_id)
    .then(allAlbums => res.status(200).send({ allAlbums }))
    .catch(next);

exports.listPhotos = (req, res, next) =>
  photosManager
    .getPhotosByAlbumId(req.params.id)
    .then(photos => res.status(200).send({ photos }))
    .catch(next);

exports.buyAlbum = (req, res, next) => {
  const boughtAlbum = {
    id: parseInt(req.params.id),
    ownerId: parseInt(req.user.id)
  };

  return albumsManager
    .findAlbumById(req.params.id)
    .then(foundAlbum => {
      if (!foundAlbum) throw errors.notFoundFailure();

      boughtAlbum.title = foundAlbum.title;
      return albumsManager.addAlbum(boughtAlbum).then(() => {
        res.status(200).send({ boughtAlbum });
      });
    })
    .catch(next);
};

exports.invalidateAllSessions = (req, res, next) =>
  generateCurrentSessionKey()
    .then(newCurrentSessionKey => users.updateCurrentSessionKey(req.user, newCurrentSessionKey))
    .then(() =>
      res.status(200).send({
        message: 'Invalidated all sessions'
      })
    );
