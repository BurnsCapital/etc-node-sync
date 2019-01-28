//* Web3 information *//
var Web3 = require('zsl-web3.js');
const { config } = require('./config');
const { logger } = require('./logger');

logger.log('debug', 'ethernode loaded');

module.exports = new Web3(new Web3.providers.HttpProvider(config.uri.url, config.uri.timeout, config.uri.userName, config.uri.password));
