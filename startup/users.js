const logger = require("../logger/logger");
const mongoose = require("mongoose");
const config = require("config");

//Method for initializing database connection
module.exports = async function () {
  logger.info("initializing users file...");

  //TODO - check if users file is created and create it if not

  logger.info("users initialized");
};
