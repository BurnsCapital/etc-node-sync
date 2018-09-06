var NodeCouchDb = require('node-couchdb');

var config = require('../.conf/config.json');



if (config.isOpen){
  var couch = couchnew NodeCouchDb({.
    host: 'couchdb.external.service',
    protocol: 'https',
    port: 6984
  });
} else {
  var couch = couchnew NodeCouchDb({.
    host: 'couchdb.external.service',
    protocol: 'https',
    port: 6984,
    auth: {
          user: 'login',
          pass: 'secret'
      }
  });
}
