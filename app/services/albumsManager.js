const errors = require('../errors');
const request = require('request-promise');
const albums = require('../models').albums;

const allAlbumsoptions = {
  url: 'https://jsonplaceholder.typicode.com/albums',
  method: 'GET',
  json: true
};

exports.getAllAlbums = () =>
  request(allAlbumsoptions).catch(err => {
    throw errors.dependencyFailure(err);
  });

exports.getAllAlbumsbyOwnerId = ownerId =>
  albums.findAlbumsByOwnerId(ownerId).catch(err => {
    throw errors.databaseError(err.detail);
  });

exports.getAlbumByParams = params =>
  albums.findOne({ where: params }).catch(err => {
    throw errors.databaseError(err.detail);
  });

exports.addAlbum = album =>
  albums.create(album).catch(err => {
    throw errors.databaseError(err.detail);
  });

exports.getAllAlbumsbyOwnerId = ownerId => albums.findAlbumsByOwnerId(ownerId);

exports.findAlbumById = albumId =>
  albums.findOne({ where: albumId }).catch(err => {
    throw errors.databaseError(err.detail);
  });
