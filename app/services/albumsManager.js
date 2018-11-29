const request = require('request');
const errors = require('../errors');

const allAlbumsoptions = {
  url: 'https://jsonplaceholder.typicode.com/albums',
  method: 'GET',
  json: true
};

exports.getAllAlbums = () =>
  new Promise((resolve, reject) => {
    request(allAlbumsoptions, (error, response, body) => {
      if (error) reject(errors.dependencyFailure());
      resolve(body);
    });
  });
