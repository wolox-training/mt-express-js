const errors = require('../errors');
const request = require('request-promise');
const albums = require('../models');

const allAlbumsoptions = {
  url: 'https://jsonplaceholder.typicode.com/albums',
  method: 'GET',
  json: true
};

exports.getAllAlbums = () =>
  request(allAlbumsoptions).catch(err => {
    throw errors.defaultError(err);
  });

exports.getAllAlbumsbyOwnerId = ownerId =>
  albums.findAlbumsByOwnerId(ownerId).catch(err => {
    throw errors.defaultError(err);
  });
