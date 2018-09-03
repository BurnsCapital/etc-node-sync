/**
  Break transactions out of blocks and write to DB
**/
//db
var mongoose        = require( 'mongoose' );
var Logs     = mongoose.model( 'Logs' );

var web3 = require('../tools/ethernode.js');
var blockLib = require('./blockLib.js');

 var writeLogsToDB = function(logs) {
        Logs.collection.insert(logs, function( err, tx ){
           if ( typeof err !== 'undefined' && err ) {
             if (err.code == 11000) {
                  blockLib.logger.log('warn','Skip: Duplicate transaction key ' + err);
             } else {
               blockLib.logger.log('error','Error: Aborted due to error on Transaction: ' + err);
               process.exit(9);
             }
           }else{
             blockLib.logger.log('verbose','* ' + tx.insertedCount + ' logs successfully recorded.');
           }
          });
         }


module.exports = writeLogsToDB;
