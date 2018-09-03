
// Configure logger settings
var config = require('../config.json');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  format: combine(
    label({ label: config.settings.title }),
    timestamp(),
    prettyPrint()
  ),
  transports: [new transports.Console({level: config.logLevel})]
})


module.exports = logger;
