const jwt = require('jwt-simple');
const moment = require('moment');

const KEY = 'secret';

exports.createToken = data => {
  data.creationTime = moment();
  //   console.log(data);
  const encode = jwt.encode(data, KEY);
  return jwt.encode(data, KEY);
};

exports.decodeToken = token => jwt.decode(token, KEY);
