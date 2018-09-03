
/**
  * lib manager
  */
var config = require('../.conf/config.json');

// internal
var etherUnits            = require('./etherUnits.js');
var listenBlocks          = require('./' +config.nodeType+'-listenBlocks.js');
var writeBlockToDB        = require('./' +config.nodeType+'-writeBlockToDB.js');
var writeTransactionsToDB = require('./'+config.nodeType+'-writeTransactionsToDB.js');
var writeTransactionReceiptToDB = require('./'+config.nodeType+'-writeTransactionReceiptToDB.js');
var writeLogsToDB         = require('./'+config.nodeType+'-writeLogsToDB.js');
var web3tools             = require('./web3tools.js');
var logger                = require('./logger.js');

// external
var BigNumber             = require('bignumber.js');

var sleep = function(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

module.exports.BigNumber = BigNumber;
module.exports.etherUnits = etherUnits;
module.exports.listenBlocks = listenBlocks;
module.exports.writeBlockToDB = writeBlockToDB;
module.exports.writeTransactionsToDB = writeTransactionsToDB;
module.exports.web3tools = web3tools;
module.exports.writeTransactionReceiptToDB = writeTransactionReceiptToDB;
module.exports.writeLogsToDB= writeLogsToDB;
module.exports.sleep = sleep;
module.exports.logger = logger;
