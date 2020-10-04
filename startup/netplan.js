const logger = require("../logger/logger");
const config = require("config");
const netplanService = require("../services/netplanService");

//Method for initializing database connection
module.exports = async function () {
  logger.info("initializing netplan config mechanism...");

  let netplanConfigSocketFilePath = config.get("netplanConfigSocketFilePath");
  let netplanConfigAuthToken = config.get("netplanConfigAuthToken");

  await netplanService.init(
    netplanConfigSocketFilePath,
    netplanConfigAuthToken
  );

  logger.info("netplan config mechanism initialized");
};
