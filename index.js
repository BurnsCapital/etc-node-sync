/*
Name: Ethereum Blockchain syncer
Version: .0.0.2
This file will start syncing the blockchain from the node address you provide in the conf.json file.
Please read the README in the root directory that explains the parameters of this code
*/

// DB
require( './database/db.js' );

// Sets address for RPC WEB3 to connect to, usually your node IP address defaults ot localhost
var web3 = require('./tools/ethernode.js');
var config = require('./tools/config.js');

// tools
var syncChain = require('./tools/syncChain.js');
var runPatcher = require('./tools/patcher.js');

//lib functions.
var blockLib = require('./lib/blockLib.js');

// patch missing blocks
if (config.patch === true){
  blockLib.logger.log('info','Checking for missing blocks');
  runPatcher(config);
}

// Starts full sync when set to true in config
if (config.syncAll === true){
  blockLib.logger.log('info','Starting Full Sync');
  syncChain(config);
}

// Start listening for latest blocks
if (!config.syncAll && !config.patch ){
  blockLib.logger.log('info','Starting Listen Sync');
  blockLib.listenBlocks(config);
}
