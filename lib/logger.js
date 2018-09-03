
// Configure logger settings
var config = require('../config.json');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  format: combine(
    label({ label: config.title }),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.Console({level: config.logLevel})
  ]
})


module.exports = logger;
