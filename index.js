/*
Name: Ethereum Blockchain syncer
Version: 0.2.0
This file will start syncing the blockchain from the node address you provide in the conf.json file.
Please read the README in the root directory that explains the parameters of this code
*/

// DB
require( './database/db.js' );

//common functions.
const { config, logger } = require('./common');

// tools
var syncChain = require('./tools/'+ config.nodeType+'-syncChain.js');
var runPatcher = require('./tools/'+ config.nodeType+'-patcher.js');
var blockStats = require('./tools/'+ config.nodeType+'-stats.js')


// patch missing blocks
if (config.patch === true){
  logger.log('info','Checking for missing blocks');
  runPatcher(config);
}

// Starts full sync when set to true in config
if (config.syncAll === true){
  logger.log('info','Starting Full Sync');
  syncChain(config);
}

// Start listening for latest blocks
if (!config.syncAll && !config.patch ){
  logger.log('info','Starting Listen Sync');
  blockStats.listenBlocks(config);
}
