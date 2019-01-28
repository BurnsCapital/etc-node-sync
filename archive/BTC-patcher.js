// db
var db              = require( '../database/db.js' );
var Block           = db.Block;
var Transaction     = db.Transaction;

//tools
var web3 = require('../tools/ethernode.js');
var config = require('../tools/config.js');

//lib
var blockLib = require('../lib/blockLib.js');


/**
  Block Patcher(experimental)
**/

var runPatcher = function(config, startBlock, endBlock) {

  if(typeof startBlock === 'undefined' || typeof endBlock === 'undefined') {
    // get the last saved block
    var blockFind = Block.find({}, "number").lean(true).sort('-number').limit(1);
    blockFind.exec(function (err, docs) {
      if(err || !docs || docs.length < 1) {
        // no blocks found. terminate runPatcher()
        blockLib.logger.log('info','No need to patch blocks.');
        return;
      }

      var lastMissingBlock = docs[0].number + 1;
      var currentBlock = client.getblockcount;
      runPatcher(config, lastMissingBlock, currentBlock - 1);
    });
    return;
  }

  var missingBlocks = endBlock - startBlock + 1;
  if (missingBlocks > 0) {
    blockLib.logger.log('info','Patching from #' + startBlock + ' to #' + endBlock);
    var patchBlock = startBlock;
    var count = 0;
    while(count < config.patchBlocks && patchBlock <= endBlock) {
      if(!('quiet' in config && config.quiet === true)) {
        blockLib.logger.log('debug','Patching Block: ' + patchBlock)
      }
    client.getBlock(client.getBlockHash(patchBlock), true, function(error, patchData) {
        if(error) {
          blockLib.logger.log('warn','Warning: error on getting block with hash/number: ' + patchBlock + ': ' + error);
        } else if(patchData == null) {
          blockLib.logger.log('warn','Warning: null block data received from the block with hash/number: ' + patchBlock);
        } else {
          checkBlockDBExistsThenWrite(config, patchData)
        }
      });
      patchBlock++;
      count++;
    }
    // flush
    blockLib.writeBlockToDB(config, null, true);
    blockLib.writeTransactionsToDB(config, null, true);

    setTimeout(function() { runPatcher(config, patchBlock, endBlock); }, 1000);
  } else {
    // flush
    blockLib.writeBlockToDB(config, null, true);
    blockLib.writeTransactionsToDB(config, null, true);

    blockLib.logger.log('info','*** Block Patching Completed ***');
  }
}

/**
  This will be used for the patcher(experimental)
**/

var checkBlockDBExistsThenWrite = function(config, patchData, flush) {
  Block.find({number: patchData.number}, function (err, b) {
    if (!b.length){
      blockLib.writeBlockToDB(config, patchData, flush);
      blockLib.writeTransactionsToDB(config, patchData, flush);
    }else if(!('quiet' in config && config.quiet === true)) {
      blockLib.logger.log('info','Block number: ' +patchData.number.toString() + ' already exists in DB.');
    }
  });
};

module.exports = runPatcher;
