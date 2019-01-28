
/**
  * lib manager
  */
require( '../database/db.js' );

// internal
var { config }            = require('./config');
var { logger }            = require('./logger');
var etherUnits            = require('./etherUnits');
var web3                  = require('./ethernode');
var listenBlocks          = require('./' +config.nodeType+'-listenBlocks.js');
var writeBlockToDB        = require('./' +config.nodeType+'-writeBlockToDB.js');
var writeTransactionsToDB = require('./'+config.nodeType+'-writeTransactionsToDB.js');
var writeTransactionReceiptToDB = require('./'+config.nodeType+'-writeTransactionReceiptToDB.js');
var writeLogsToDB         = require('./'+config.nodeType+'-writeLogsToDB.js');
var web3tools             = require('./web3tools');

// external
var BigNumber             = require('bignumber.js');

var sleep = function(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

module.exports = {
  BigNumber : BigNumber,
  
  logger : logger,
  config : config,
  etherUnits : etherUnits,
  web3 : web3,
  listenBlocks : listenBlocks,
  writeBlockToDB : writeBlockToDB,
  writeTransactionsToDB : writeTransactionsToDB,
  web3tools : web3tools,
  writeTransactionReceiptToDB : writeTransactionReceiptToDB,
  writeLogsToDB : writeLogsToDB,
  sleep : sleep,
  
}