const errors = require('../errors');
const request = require('request-promise');

exports.getPhotosByAlbumId = albumId =>
  request({
    url: `https://jsonplaceholer.typicode.com/users/albums/${albumId}/photos`,
    method: 'GET',
    json: true
  }).catch(err => {
    throw errors.dependencyFailure();
  });
