const request = require('request');
const errors = require('../errors');

const options = {
  url: 'https://jsonplaceholder.typicode.com/albums',
  method: 'GET',
  json: true
};

exports.getAllAlbums = () =>
  new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) reject(errors.dependencyFailure());
      resolve(body);
    });
  });
