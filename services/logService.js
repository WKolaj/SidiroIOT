const {
  readDirAsync,
  checkIfDirectoryExistsAsync,
  statAsync,
  readFileAsync,
  exists,
} = require("../utilities/utilities");
const path = require("path");

let logsDirPath = null;
let logFileName = null;
let logFileExtension = null;

/**
 * @description Method for initializing log service
 * @param {String} logsPath path for logs directory
 * @param {String} logName part of name of log files
 * @param {String} logExtensions extension of logs files
 */
module.exports.init = async (logsPath, logName, logExtensions) => {
  logsDirPath = logsPath;
  logFileName = logName;
  logFileExtension = logExtensions;
};

/**
 * @description Method for getting last log file content
 */
module.exports.getLastLogFileContent = async () => {
  if (!exists(logsDirPath) || !exists(logFileName) || !exists(logFileExtension))
    throw new Error("Log service not initialized or not initialized properly!");
  let dirExists = await checkIfDirectoryExistsAsync(logsDirPath);
  if (!dirExists) return null;

  let allFiles = await readDirAsync(logsDirPath);

  let logFilesPath = allFiles
    .filter(
      (file) => file.includes(logFileName) && file.includes(logFileExtension)
    )
    .map((file) => path.join(logsDirPath, file));

  if (logFilesPath.length <= 0) return null;

  let youngestFile = logFilesPath[0];
  let youngestFileModificationDate = (await statAsync(logFilesPath[0])).mtimeMs;

  for (let logFilePath of logFilesPath) {
    let logFileModificationDate = (await statAsync(logFilePath)).mtimeMs;
    if (logFileModificationDate > youngestFileModificationDate) {
      youngestFile = logFilePath;
      youngestFileModificationDate = logFileModificationDate;
    }
  }

  let fileContent = await readFileAsync(youngestFile, "utf8");

  return fileContent;
};
