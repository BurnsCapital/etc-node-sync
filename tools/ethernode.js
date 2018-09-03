//* Web3 information *//
var Web3 = require('zsl-web3.js');
var config = require('../tools/config.js');
//lib
var blockLib = require('../lib/blockLib.js');

module.exports = new Web3(new Web3.providers.HttpProvider(config.uri.url, config.uri.timeout, config.uri.userName, config.uri.password));
