var _ = require('lodash');


/*Start config for node connection and sync*/
// load config.json
var config = { nodeAddr: 'localhost', gethPort: 8545 };

try {
  var local = require('../.conf/config.json');
  _.extend(config, local);
  console.log('config.json found.');
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    var local = require('../config.json');
    _.extend(config, local);
    console.log('No config file found. Using default configuration... (config.example.json)');
    } else {
      throw error;
     process.exit(1);
   }
}

// set defaults
// set the default geth port if it's not provided
if (!('gethPort' in config) || (typeof config.gethPort) !== 'number') {
    config.gethPort = 8545; // default
}
// set the default output directory if it's not provided
if (!('output' in config) || (typeof config.output) !== 'string') {
    config.output = '.'; // default this directory
}
// set the default blocks if it's not provided
if (!('blocks' in config) || !(Array.isArray(config.blocks))) {
    config.blocks = [];
    config.blocks.push({'start': 0, 'end': 'latest'});
}
// set the default size of array in block to use bulk operation.
if (!('bulkSize' in config) || (typeof config.bulkSize) !== 'number') {
  config.bulkSize = 100;
}
//avoid running patcher and fullsync
if (config.syncAll === true){
  config.patch = false;
}


// set the default NODE address to localhost if it's not provided
if (!('nodeAddr' in config) || !(config.nodeAddr)) {
  config.nodeAddr = 'localhost'; // default
}
// set the default geth port if it's not provided
if (!('gethPort' in config) || (typeof config.gethPort) !== 'number') {
  config.gethPort = 8545; // default
}

//set protocol
if (!('isSSL' in config) || !(config.isSSL)) {
  var protocol = "http://";
} else {
  var protocol = "https://";
}

  //true is using unsigned certs
if (!('unsafeTLS' in config) || (config.unsafeTLS)) {
  console.log("unsafely ignoring self signed certs!");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
  //timeout
if (!('timeout' in config) || (typeof config.timeout) !== 'number') {
  config.timeout = 0; // default
}
  // put it all together
if (!('userName' in config)) {
  config.uri = protocol
            + config.nodeAddr + ":" + config.gethPort.toString()
            + "," + config.timeout;
  //console.log('Connecting ' + protocol  + config.nodeAddr + ':' + config.gethPort + '...');
} else {
  config.uri = {"url" : protocol
          + config.nodeAddr + ":" + config.gethPort.toString()
          , "timeout" : config.timeout
          , "userName" : config.userName
          , "password" : config.password};
 //console.log('Connecting ' + protocol + config.nodeAddr + ':' + config.gethPort + ' with user: ' + config.userName + ' ...');
}
module.exports = config;
