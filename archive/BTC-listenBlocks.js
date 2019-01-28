/**
  //Just listen for latest blocks and sync from the start of the app.
**/

var web3 = require('../tools/ethernode.js');
var blockLib = require('./blockLib.js');

module.exports = (config) => {
    var newBlocks = web3.eth.filter("latest");
    newBlocks.watch(function (error,latestBlock) {
    if(error) {
        blockLib.logger.log('error','Error: ' + error);
    } else if (latestBlock == null) {
        blockLib.logger.log('warn','Warning: null block hash');
    } else {
      blockLib.logger.log('verbose','Found new block: ' + latestBlock);
      if(web3.isConnected()) {
        web3.eth.getBlock(latestBlock, true, function(error,blockData) {
          if(error) {
            blockLib.logger.log('warn','Warning: error on getting block with hash/number: ' +   latestBlock + ': ' + error);
          }else if(blockData == null) {
            blockLib.logger.log('warn','Warning: null block data received from the block with hash/number: ' + latestBlock);
          }else{
            blockLib.writeBlockToDB(config, blockData, true);
            blockLib.writeTransactionsToDB(config, blockData, true);
          }
        });
      }else{
        blockLib.logger.log('error','Error: Web3 connection time out trying to get block ' + latestBlock + ' retrying connection now');
        blocklib.sleep(500);
        blockLib.listenBlocks(config);
      }
    }
  });
}
