/**
  Break transactions out of blocks and write to DB
**/
//db
var mongoose           = require( 'mongoose' );
var TransactionReceipt = mongoose.model( 'transactionReceipt' );

var { web3, logger }   = require('./index.js');


module.exports = (txhash) => {
  web3.eth.getTransactionReceipt(txhash, function(error,receipt) {
    if(error) {
      logger.log('warn','Warning: error on getting tx receipt with hash/number: ' +   txhash + ': ' + error);
    } else if(receipt == null) {
      logger.log('warn','Warning: null receipt received from the transaction with hash/number: ' + txhash);
    } else {
      if(receipt.logs.length > 0 ){
        writeLogsToDB(receipt.logs);
      }
      TransactionReceipt.collection.insert(receipt, function( err, tx ){
        if ( typeof err !== 'undefined' && err ) {
          if (err.code == 11000) {
            logger.log('error','Skip: Duplicate transaction key ' + err);
          } else {
            logger.log('error','Error: Aborted due to error on Transaction: ' + err);
            process.exit(9);
          }
        } else {
          logger.log('verbose','* ' + tx.insertedCount + ' successfully recorded.');
        }
      });
    }
  })
}