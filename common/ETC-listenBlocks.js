/**
  //Just listen for latest blocks and sync from the start of the app.
**/

var { web3, logger, writeBlockToDB, writeTransactionsToDB, sleep, listenBlocks } = require('./index.js');

module.exports = (config) => {
    var newBlocks = web3.eth.filter("latest");
    newBlocks.watch(function (error,latestBlock) {
    if(error) {
        logger.log('error','Error: ' + error);
    } else if (latestBlock == null) {
        logger.log('warn','Warning: null block hash');
    } else {
      logger.log('verbose','Found new block: ' + latestBlock);
      if(web3.isConnected()) {
        web3.eth.getBlock(latestBlock, true, function(error,blockData) {
          if(error) {
            logger.log('warn','Warning: error on getting block with hash/number: ' +   latestBlock + ': ' + error);
          } else if (blockData == null) {
            logger.log('warn','Warning: null block data received from the block with hash/number: ' + latestBlock);
          } else {
            writeBlockToDB(config, blockData, true);
            writeTransactionsToDB(config, blockData, true);
          }
        });
      } else {
        logger.log('error','Error: Web3 connection time out trying to get block ' + latestBlock + ' retrying connection now');
        sleep(500);
        listenBlocks(config);
      }
    }
  });
}
