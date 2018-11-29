const nock = require('nock');

exports.expectedAlbumsResponse = {
  userId: 1,
  id: 1,
  title: 'quidem molestiae enim'
};

// Everytime a module makes a http request to the specified url, it will be intercepted and its response
// will be the following
exports.mockGetAlbumsRequest = () => {
  const jsonplaceholder = nock('https://jsonplaceholder.typicode.com')
    .get('/albums')
    .reply(200, exports.expectedAlbumsResponse);
};
