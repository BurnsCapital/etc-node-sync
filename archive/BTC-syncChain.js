/**
  If full sync is checked this function will start syncing the block chain from lastSynced param see README
**/

// DB
var db              = require( '../database/db.js' );
var Block           = db.Block;
var Transaction     = db.Transaction;

// tools
var client = require('../tools/BTC-node.js');

// lib
//lib functions.
var blockLib = require('../lib/blockLib.js');


var syncChain = function(config, nextBlock){
    if (typeof nextBlock === 'undefined') {
      prepareSync(config, function(error, startBlock) {
        if(error) {
          blockLib.logger.log('error','error: ' + error);
          return;
        }
        syncChain(config, startBlock);
      });
      return;
    }

    if( nextBlock == null ) {
      blockLib.logger.log('info','nextBlock is null');
      return;
    } else if ( nextBlock < config.startBlock ) {
      blockLib.writeBlockToDB(config, null, true);
      blockLib.writeTransactionsToDB(config, null, true);
      blockLib.logger.log('info','*** Sync Finsihed ***');
      config.syncAll = false;
      return;
    }

    var count = config.bulkSize;
  //client.getBlockHash(nextBlock).then( res => {
    //console.log("nblock" + nblock);
    while(nextBlock >= config.startBlock && count > 0) {
      blockLib.sleep(1000);
      client.getBlockHash(nextBlock).then( res => {
      client.getBlock(res).then(blockData => {
        if(blockData == null) {
          blockLib.logger.log('warn', 'null block data received from the block with hash/number: ' + nextBlock);
        }else{
          //console.log("writing to db" + blockData);
          blockLib.writeBlockToDB(config, blockData);
          blockLib.writeTransactionsToDB(config, blockData);
        }
       })
     })
      nextBlock--;
      count--;
    }



  setTimeout(function() { syncChain(config, nextBlock); }, 1000);

}

/**
  //check oldest block or starting block then callback
**/
var prepareSync =  function(config, callback) {
  var blockNumber = null;
  var oldBlockFind = Block.find({}, "height").lean(true).sort('height').limit(1);
   oldBlockFind.exec(function (err, docs) {
    if(err || !docs || docs.length < 1) {
      // not found in db. sync from config.endBlock or 'latest'

        var currentBlock = client.getBlockCount();
        var latestBlock = client.getBlockCount().then(res => {
        //console.log(latestBlock+currentBlock);
        if(res === res) {
          client.getBlockHash(res).then( blkhash => {
          client.getBlock(blkhash).then(blockData => {
            if(blockData == null) {
              blockLib.logger.log('warn','Warning: null block data received from the block with hash/number: ' + latestBlock);
            } else {
              blockLib.logger.log('info','Starting block number = ' + blockData.height);
              blockNumber = blockData.height - 1;
              callback(null, blockNumber);
            }
          });
        });
          } else {
          blockLib.logger.log('info','Starting block number = ' + res);
          blockNumber = res - 1;
          callback(null, blockNumber);
        }
      })
    }else{
      blockNumber = docs[0].height - 1;
      blockLib.logger.log('info','Old block found. Starting block number = ' + blockNumber);
      callback(null, blockNumber);
    }
  });
}

module.exports = syncChain;
