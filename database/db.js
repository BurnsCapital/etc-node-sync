var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var config = require('../.conf/config.json');


// Colllections
var Block              = require('./collections/'+ config.nodeType +'-Block.js');
var Contract           = require('./collections/'+ config.nodeType +'-Contract');
var Transaction        = require('./collections/'+ config.nodeType +'-Transaction.js');
var BlockStat          = require('./collections/'+ config.nodeType +'-BlockStat');
var Logs               = require('./collections/'+ config.nodeType +'-Logs.js');
var transactionReceipt = require('./collections/'+ config.nodeType +'-transactionReceipt.js');


// create indices
Transaction.index({blockNumber:-1});
Transaction.index({from:1, blockNumber:-1});
Transaction.index({to:1, blockNumber:-1});
Block.index({miner:1});

//models
mongoose.model('BlockStat', BlockStat);
mongoose.model('Block', Block);
mongoose.model('Contract', Contract);
mongoose.model('Transaction', Transaction);
mongoose.model('Logs', Logs);
mongoose.model('transactionReceipt', transactionReceipt);

//exports
module.exports.BlockStat = mongoose.model('BlockStat');
module.exports.Block = mongoose.model('Block');
module.exports.Contract = mongoose.model('Contract');
module.exports.Transaction = mongoose.model('Transaction');
module.exports.Logs = mongoose.model('Logs');
module.exports.transactionReceipt = mongoose.model('transactionReceipt');

if (config.isOpen){
  mongoose.connect(process.env.MONGO_URI || 'mongodb://'+ config.dbHost +":"+config.dbPort + '/blockmonsterDB-'+config.nodeType, { useNewUrlParser: true });
} else {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://'+ config.dbUser +":" + config.dbPass + "@" + config.dbHost +":"+config.dbPort + '/blockmonsterDB-'+config.nodeType, { useNewUrlParser: true });
}


// mongoose.set('debug', true);
