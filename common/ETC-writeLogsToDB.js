/**
  Break transactions out of blocks and write to DB
**/
//db
var mongoose   = require( 'mongoose' );
var Logs       = mongoose.model( 'Logs' );
//common
var { logger } = require('./index.js');

var writeLogsToDB = function(logs) {
  Logs.collection.insert(logs, function( err, tx ){
    if ( typeof err !== 'undefined' && err ) {
      if (err.code == 11000) {
        logger.log('warn','Skip: Duplicate transaction key ' + err);
      } else {
        logger.log('error','Error: Aborted due to error on Transaction: ' + err);
        process.exit(9);
      }
    } else {
      logger.log('verbose','* ' + tx.insertedCount + ' logs successfully recorded.');
    }
  });
}


module.exports = writeLogsToDB;