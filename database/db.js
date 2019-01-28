var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

const { config } = require('../common/config');

// Colllections
var Block              = require('./collections/'+ config.nodeType +'-Block.js');
var Transaction        = require('./collections/'+ config.nodeType +'-Transaction.js');




switch (config.nodeType) {
  case "ETC":
    var Contract           = require('./collections/'+ config.nodeType +'-Contract');
    var BlockStat          = require('./collections/'+ config.nodeType +'-BlockStat');
    var Logs               = require('./collections/'+ config.nodeType +'-Logs.js');
    var transactionReceipt = require('./collections/'+ config.nodeType +'-transactionReceipt.js');
    mongoose.model('Contract', Contract);
    mongoose.model('BlockStat', BlockStat);
    mongoose.model('Logs', Logs);
    mongoose.model('transactionReceipt', transactionReceipt);

    // create indices
    Transaction.index({blockNumber:-1});
    Transaction.index({from:1, blockNumber:-1});
    Transaction.index({to:1, blockNumber:-1});
    Block.index({miner:1});


    module.exports.BlockStat = mongoose.model('BlockStat');
    module.exports.Contract = mongoose.model('Contract');
    module.exports.Logs = mongoose.model('Logs');
    module.exports.transactionReceipt = mongoose.model('transactionReceipt');

  break;

  case "BTC":
    // create indices
    Transaction.index({block:-1});
    Transaction.index({from:1, block:-1});
    Transaction.index({to:1, block:-1});
    Block.index({height:1});
  break;

}


//models
mongoose.model('Block', Block);
mongoose.model('Transaction', Transaction);

//exports
module.exports.Block = mongoose.model('Block');
module.exports.Transaction = mongoose.model('Transaction');


if (config.isOpen){
  mongoose.connect(process.env.MONGO_URI || 'mongodb://'+ config.dbHost +":"+config.dbPort + '/blockmonsterDB-'+config.nodeType +'-'+config.title, { useNewUrlParser: true });
} else {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://'+ config.dbUser +":" + config.dbPass + "@" + config.dbHost +":"+config.dbPort + '/blockmonsterDB-'+config.nodeType+'-'+config.title, { useNewUrlParser: true });
}


// mongoose.set('debug', true);
