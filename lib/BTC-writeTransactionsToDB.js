/**
  Break transactions out of blocks and write to DB
**/
var mongoose        = require( 'mongoose' );
var Transaction     = mongoose.model( 'Transaction' );
const util = require('util')
var client = require('../tools/BTC-node.js');
var blockLib = require('./blockLib.js');

 module.exports = function(config, blockData, flush) {
  var self = this;
  if (!self.bulkOps) {
    self.bulkOps = [];
    self.blocks = 0;
  }
  if (blockData.tx.length > 0) {
    for (d in blockData.tx) {
      blockLib.sleep(1000);
      var txData = blockData.tx[d];
      client.getRawTransaction(txData,true).then( tx =>{
      console.log("transaction"+tx);
      //txData.timestamp = blockData.timestamp;
      //txData.value = blockLib.etherUnits.toEther(new blockLib.BigNumber(txData.value), 'wei');
      self.bulkOps.push(tx);

    blockLib.logger.log('info',' block #' + blockData.height.toString() + ': ' + blockData.tx.length.toString() + ' transactions recorded.');
    self.blocks++;
    })
   }
  }


  if (flush && self.blocks > 0 || self.blocks >= config.bulkSize) {
    var bulk = self.bulkOps;
    self.bulkOps = [];
    self.blocks = 0;
    if(bulk.length == 0) return;

    Transaction.collection.insert(bulk, function( err, tx ){
      if ( typeof err !== 'undefined' && err ) {
        if (err.code == 11000) {
            blockLib.logger.log('error','Skip: Duplicate transaction key ' + err);
        }else{
          blockLib.logger.log('error','Error: Aborted due to error on Transaction: ' + err);
          process.exit(9);
        }
      }else{
        blockLib.logger.log('verbose','* ' + tx.insertedCount + ' transactions successfully recorded.');
      }
    });
  }
}
