const errors = require('../errors');
const request = require('request-promise');

exports.getPhotosByAlbumId = albumId =>
  request({
    url: `https://jsonplaceholder.typicode.com/albums/${albumId}/photos`,
    method: 'GET',
    json: true
  }).catch(err => {
    throw errors.defaultError(err);
  });
