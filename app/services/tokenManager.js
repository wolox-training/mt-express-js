const jwt = require('jwt-simple');

const KEY = 'secret';

exports.createToken = user => jwt.encode({ user: user.email, password: user.password, role: user.role }, KEY);

exports.decodeToken = token => jwt.decode(token, KEY);
