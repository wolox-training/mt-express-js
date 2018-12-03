const request = require('request');
const errors = require('../errors');
const requestPromise = require('request-promise');

const allAlbumsoptions = {
  url: 'https://jsonplaceholder.typicode.com/albums',
  method: 'GET',
  json: true
};

exports.getAllAlbums = () =>
  requestPromise(allAlbumsoptions).catch(err => {
    throw errors.defaultError(err);
  });
