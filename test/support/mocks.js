const nock = require('nock');

exports.expectedAlbumsResponse = {
  ownerId: 1,
  id: 1,
  title: 'quidem molestiae enim'
};

exports.expectedAlbumsResponse = (ownerId, albumId) => ({
  ownerId,
  id: albumId,
  title: 'distinctio laborum qui'
});

exports.expectedPhotosResponse = albumId => ({
  albumId,
  id: 1,
  title: 'accusamus beatae ad facilis cum similique qui sunt',
  url: 'https://via.placeholder.com/600/92c952',
  thumbnailUrl: 'https://via.placeholder.com/150/92c952'
});

exports.expectedAlbumsResponse = albumId => ({
  id: albumId,
  title: `${albumId}° sinfonia daddy yankee`,
  ownerId: 1000
});
// Everytime a module makes a http request to the specified url, it will be intercepted and its response
// will be the following
exports.mockAlbumsGetRequest = () =>
  nock('https://jsonplaceholder.typicode.com')
    .get('/albums')
    .reply(200, exports.expectedAlbumsResponse);

// Everytime a module makes a http request to the specified url, it will be intercepted and its response
// will be the following
exports.mockPhotosGetRequest = albumId =>
  nock(`https://jsonplaceholer.typicode.com`)
    .get(`/users/albums/${albumId}/photos`)
    .reply(200, exports.expectedPhotosResponse(albumId));

exports.mockAlbumsGetRequest = albumId =>
  nock(`https://jsonplaceholer.typicode.com`)
    .get(`/albums/${albumId}`)
    .reply(200, exports.expectedAlbumsResponse(albumId));
