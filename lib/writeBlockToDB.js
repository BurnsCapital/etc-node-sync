/**
  Write the whole block object to DB
**/
var mongoose        = require( 'mongoose' );
var Block           = mongoose.model( 'Block' );
var blockLib = require('./blockLib.js');


module.exports = (config, blockData, flush)=> {
  var self = this;
  if (!self.bulkOps) {
    self.bulkOps = [];
  }
  if (blockData && blockData.number >= 0) {
    self.bulkOps.push(new Block(blockData));
    blockLib.logger.log('verbose','- block #' + blockData.number.toString() + ' inserted.');
  }

  if(flush && self.bulkOps.length > 0 || self.bulkOps.length >= config.bulkSize) {
    var bulk = self.bulkOps;
    self.bulkOps = [];
    if(bulk.length == 0) return;

    Block.collection.insert(bulk, function( err, blocks ){
      if ( typeof err !== 'undefined' && err ) {
        if (err.code == 11000) {
          if(!('quiet' in config && config.quiet === true)) {
            blockLib.logger.log('info','Skip: Duplicate DB key : ' +err);
          }
        }else{
          blockLib.logger.log('error','Error: Aborted due to error on DB: ' + err);
          process.exit(9);
        }
      }else{
        blockLib.logger.log('verbose','* ' + blocks.insertedCount + ' blocks successfully written.');
      }
    });
  }
}
