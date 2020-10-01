const logger = require("../logger/logger");
const config = require("config");
const path = require("path");
const {
  checkIfFileExistsAsync,
  createFileAsync,
  readFileAsync,
  isStringAValidJSON,
  writeFileAsync,
  checkIfDirectoryExistsAsync,
  createDirAsync,
} = require("../utilities/utilities");

//Method for initializing database connection
module.exports = async function () {
  logger.info("initializing users file...");

  let settingsDirPath = config.get("settingsPath");
  let userFileName = config.get("userFileName");
  let userFilePath = path.join(settingsDirPath, userFileName);

  //Checking if settings dir exists
  let settingsDirExists = await checkIfDirectoryExistsAsync(settingsDirPath);
  if (!settingsDirExists) {
    await createDirAsync(settingsDirPath);
    logger.info("Settings dir created");
  }

  //Checking if file exists
  let userFileExists = await checkIfFileExistsAsync(userFilePath);

  if (userFileExists) {
    let fileContent = await readFileAsync(userFilePath, "utf8");

    //Checking if file is a valid JSON
    if (!isStringAValidJSON(fileContent)) {
      logger.info("Invalid user file - creating new one");
      await writeFileAsync(userFilePath, "{}", "utf8");
      logger.info("New user file created");
    }
  } else {
    await writeFileAsync(userFilePath, "{}", "utf8");
    logger.info("New user file created");
  }

  logger.info("users initialized");
};
