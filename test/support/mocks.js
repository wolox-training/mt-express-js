const nock = require('nock');

exports.expectedAlbumsResponse = {
  userId: 1,
  id: 1,
  title: 'quidem molestiae enim'
};

exports.expectedPhotosResponse = {
  albumId: 1,
  id: 1,
  title: 'accusamus beatae ad facilis cum similique qui sunt',
  url: 'https://via.placeholder.com/600/92c952',
  thumbnailUrl: 'https://via.placeholder.com/150/92c952'
};

// Everytime a module makes a http request to the specified url, it will be intercepted and its response
// will be the following
exports.mockAlbumsGetRequest = () =>
  nock('https://jsonplaceholder.typicode.com')
    .get('/albums')
    .reply(200, exports.expectedAlbumsResponse);

exports.mockPhotosGetRequest = albumId =>
  nock(`https://jsonplaceholer.typicode.com`)
    .get(`/users/albums/${albumId}/photos`)
    .reply(200, exports.expectedPhotosResponse);
