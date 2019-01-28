// db
var db              = require( '../database/db.js' );
var Block           = db.Block;
var Transaction     = db.Transaction;

var { web3, logger, writeBlockToDB, writeTransactionsToDB, config  } = require('../common');


/**
  Block Patcher(experimental)
**/

var runPatcher = function(config, startBlock, endBlock) {
  if(!web3 || !web3.isConnected()) {
    logger.log('error','Error: Web3 is not connected. Retrying connection shortly...');
    setTimeout(function() { runPatcher(config); }, 3000);
    return;
  }

  if(typeof startBlock === 'undefined' || typeof endBlock === 'undefined') {
    // get the last saved block
    var blockFind = Block.find({}, "number").lean(true).sort('-number').limit(1);
    blockFind.exec(function (err, docs) {
      if(err || !docs || docs.length < 1) {
        // no blocks found. terminate runPatcher()
        logger.log('info','No need to patch blocks.');
        return;
      }

      var lastMissingBlock = docs[0].number + 1;
      var currentBlock = web3.eth.blockNumber;
      runPatcher(config, lastMissingBlock, currentBlock - 1);
    });
    return;
  }

  var missingBlocks = endBlock - startBlock + 1;
  if (missingBlocks > 0) {
    logger.log('info','Patching from #' + startBlock + ' to #' + endBlock);
    var patchBlock = startBlock;
    var count = 0;
    while(count < config.patchBlocks && patchBlock <= endBlock) {
      if(!('quiet' in config && config.quiet === true)) {
        logger.log('debug','Patching Block: ' + patchBlock)
      }
      web3.eth.getBlock(patchBlock, true, function(error, patchData) {
        if(error) {
          logger.log('warn','Warning: error on getting block with hash/number: ' + patchBlock + ': ' + error);
        } else if(patchData == null) {
          logger.log('warn','Warning: null block data received from the block with hash/number: ' + patchBlock);
        } else {
          checkBlockDBExistsThenWrite(config, patchData)
        }
      });
      patchBlock++;
      count++;
    }
    // flush
    writeBlockToDB(config, null, true);
    writeTransactionsToDB(config, null, true);

    setTimeout(function() { runPatcher(config, patchBlock, endBlock); }, 1000);
  } else {
    // flush
    writeBlockToDB(config, null, true);
    writeTransactionsToDB(config, null, true);

    logger.log('info','*** Block Patching Completed ***');
  }
}

/**
  This will be used for the patcher(experimental)
**/

var checkBlockDBExistsThenWrite = function(config, patchData, flush) {
  Block.find({number: patchData.number}, function (err, b) {
    if (!b.length){
      writeBlockToDB(config, patchData, flush);
      writeTransactionsToDB(config, patchData, flush);
    }else if(!('quiet' in config && config.quiet === true)) {
      logger.log('info','Block number: ' +patchData.number.toString() + ' already exists in DB.');
    }
  });
};

module.exports = runPatcher;
