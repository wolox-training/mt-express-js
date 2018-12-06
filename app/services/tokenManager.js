const jwt = require('jwt-simple');

const KEY = 'secret';
const EXPIRATION_TIME = '1h';

exports.createToken = data => jwt.encode(data, KEY);

exports.decodeToken = token => jwt.decode(token, KEY);
