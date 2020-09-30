const logger = require("../logger/logger");

//Method used for returning error 500 in case something happened during route processing
//It can be used thanks to express-async-errors which automatically calls next if there was an error during route proccessing
module.exports = function (err, req, res, next) {
  //Loggining error and sending 500 to client
  logger.error(err.message, err);
  return res.status(500).send("Ups.. Something fails..");
};
