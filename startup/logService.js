const logger = require("../logger/logger");
const logService = require("../services/logService");
const { createDirIfNotExists } = require("../utilities/utilities");
const path = require("path");
const config = require("config");

module.exports = async function () {
  logger.info("initializing log service for routes...");

  let logInfoFilePath = config.get("logging.info.path");
  let parsedLogInfoFilePath = path.parse(logInfoFilePath);
  let logInfoDirPath = parsedLogInfoFilePath.dir;
  let logInfoExtension = parsedLogInfoFilePath.ext;
  let logInfoName = parsedLogInfoFilePath.name;

  await logService.init(logInfoDirPath, logInfoName, logInfoExtension);

  logger.info("log service for routes initialized");
};

//TODO - test this initialization
