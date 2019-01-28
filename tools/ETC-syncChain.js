/**
  If full sync is checked this function will start syncing the block chain from lastSynced param see README
**/

// DB
var db              = require( '../database/db.js' );
var Block           = db.Block;
var Transaction     = db.Transaction;

// tools
var { web3, logger, writeBlockToDB, writeTransactionsToDB, sleep } = require('../common');

var syncChain = function(config, nextBlock){
  if(web3.isConnected()) {
    if (typeof nextBlock === 'undefined') {
      prepareSync(config, function(error, startBlock) {
        if(error) {
          logger.log('error','error: ' + error);
          return;
        }
        syncChain(config, startBlock);
      });
      return;
    }

    if( nextBlock == null ) {
      logger.log('info','nextBlock is null');
      return;
    } else if ( nextBlock < config.startBlock ) {
      writeBlockToDB(config, null, true);
      writeTransactionsToDB(config, null, true);
      logger.log('info','*** Sync Finsihed ***');
      config.syncAll = false;
      return;
    }

    var count = config.bulkSize;
    while(nextBlock >= config.startBlock && count > 0) {
      web3.eth.getBlock(nextBlock, true, function(error,blockData) {
        if(error) {
          logger.log('warn','error on getting block with hash/number: ' + nextBlock + ': ' + error);
        }else if(blockData == null) {
          logger.log('warn', 'null block data received from the block with hash/number: ' + nextBlock);
        }else{
          writeBlockToDB(config, blockData);
          writeTransactionsToDB(config, blockData);
        }
      });
      nextBlock--;
      count--;
    }

    setTimeout(function() { syncChain(config, nextBlock); }, 500);
  } else {
    logger.log('error', 'Web3 connection time out trying to get block ' + nextBlock + ' retrying connection now');
    sleep(500);
    syncChain(config, nextBlock);
  }
}

/**
  //check oldest block or starting block then callback
**/
var prepareSync = function(config, callback) {
  var blockNumber = null;
  var oldBlockFind = Block.find({}, "number").lean(true).sort('number').limit(1);
  oldBlockFind.exec(function (err, docs) {
    if(err || !docs || docs.length < 1) {
      // not found in db. sync from config.endBlock or 'latest'
      if(web3.isConnected()) {
        var currentBlock = web3.eth.blockNumber;
        var latestBlock = config.endBlock || currentBlock || 'latest';
        if(latestBlock === 'latest') {
          web3.eth.getBlock(latestBlock, true, function(error, blockData) {
            if(error) {
              logger.log('warn','Warning: error on getting block with hash/number: ' +   latestBlock + ': ' + error);
            } else if(blockData == null) {
              logger.log('warn','Warning: null block data received from the block with hash/number: ' + latestBlock);
            } else {
              logger.log('info','Starting block number = ' + blockData.number);
              blockNumber = blockData.number - 1;
              callback(null, blockNumber);
            }
          });
        } else {
          logger.log('info','Starting block number = ' + latestBlock);
          blockNumber = latestBlock - 1;
          callback(null, blockNumber);
        }
      } else {
        logger.log('error','Error: Web3 connection error');
        callback(err, null);
      }
    }else{
      blockNumber = docs[0].number - 1;
      logger.log('info','Old block found. Starting block number = ' + blockNumber);
      callback(null, blockNumber);
    }
  });
}

module.exports = syncChain;
