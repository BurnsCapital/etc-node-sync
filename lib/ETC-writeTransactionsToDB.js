/**
  Break transactions out of blocks and write to DB
**/
var mongoose        = require( 'mongoose' );
var Transaction     = mongoose.model( 'Transaction' );
const util = require('util')

var blockLib = require('./blockLib.js');

 module.exports = function(config, blockData, flush) {
  var self = this;
  if (!self.bulkOps) {
    self.bulkOps = [];
    self.blocks = 0;
  }
  if (blockData && blockData.transactions.length > 0) {
    for (d in blockData.transactions) {
      var txData = blockData.transactions[d];
      txData.timestamp = blockData.timestamp;
      txData.value = blockLib.etherUnits.toEther(new blockLib.BigNumber(txData.value), 'wei');
      blockLib.writeTransactionReceiptToDB(txData.hash);
      self.bulkOps.push(txData);
    }
    blockLib.logger.log('info',' block #' + blockData.number.toString() + ': ' + blockData.transactions.length.toString() + ' transactions recorded.');
  }
  self.blocks++;

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
