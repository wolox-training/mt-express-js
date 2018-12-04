const errors = require('../errors');
const request = require('request-promise');

const allAlbumsoptions = {
  url: 'https://jsonplaceholder.typicode.com/albums',
  method: 'GET',
  json: true
};

exports.getAllAlbums = () =>
  request(allAlbumsoptions).catch(err => {
    throw errors.defaultError(err);
  });
