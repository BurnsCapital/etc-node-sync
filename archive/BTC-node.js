var config = require('../tools/config.js');

const Client = require('bitcoin-core');
const fs = require('fs');

module.exports = new Client({
  host: config.nodeAddr,
  port: config.gethPort,
  username: config.userName,
  password: config.password
});
