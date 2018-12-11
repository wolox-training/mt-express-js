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
  albums.findOne({ where: { ownerId: parseInt(params.ownerId), id: parseInt(params.id) } }).catch(err => {
    throw errors.databaseError(err.detail);
  });

exports.addAlbum = album =>
  albums.create(album).catch(err => {
    throw errors.databaseError(err.detail);
  });

exports.findAlbumById = albumId =>
  request({
    url: `https://jsonplaceholder.typicode.com/albums/${albumId}`,
    method: 'GET',
    json: true
  }).catch(err => {
    throw errors.dependencyFailure();
  });

exports.getAllAlbumsbyOwnerId = ownerId =>
  albums.findAlbumsByOwnerId(ownerId).catch(err => {
    throw errors.databaseError();
  });
