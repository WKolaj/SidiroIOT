const config = require("config");
const usb = require("usb");
const path = require("path");
const {
  checkIfFileExistsAsync,
  readFileAsync,
  isStringAValidJSON,
  exists,
  snooze,
} = require("../utilities/utilities");
const logger = require("../logger/logger");
const projectService = require("./projectService");

let projectFileName = null;
let usbDirectories = null;
let numberOfRetries = null;
let timeDelay = null;
let projectFilePaths = null;

//Was service started
let started = false;
let busy = false;
let initialized = false;

/**
 * Method for handling finding of new file - loading new content
 * @param {JSON} projectContent new content read from file and parsed to JSON
 */
const tryLoadNewProjectContent = async (projectContent) => {
  try {
    let validationResult = projectService.validateProjectPayload(
      projectContent
    );
    if (validationResult)
      return logger.warn("Invalid project file read from usb!");

    logger.action(`Reading project from usb file!`);

    //Save new content to project file
    await projectService.saveProjectContentToFile(projectContent);

    //Load project file to memory
    await projectService.loadProjectFile();

    logger.action(`Project loaded from usb successfully!`);
  } catch (err) {
    logger.error(err.message, err);
  }
};

/**
 * @description Method for searching for project file in given directories. Returns content of file found
 */
const searchForFile = async () => {
  //For each filepath = checking if file exists, and checking if its content is a valid JSON - if so return it
  for (let filePath of projectFilePaths) {
    let fileExists = await checkIfFileExistsAsync(filePath);
    if (fileExists) {
      let fileContent = await readFileAsync(filePath, "utf8");
      if (isStringAValidJSON(fileContent)) return JSON.parse(fileContent);
    }
  }

  //if file not found or content invalid - return null
  return null;
};

/**
 * @description Method invoked when USB is plugged in
 */
const onUSBAttachHandler = async () => {
  //Retruning if not initialized
  if (!initialized) return;

  //locking in order not to invoke once again
  if (busy) return;

  busy = true;

  try {
    for (let i = 0; i < numberOfRetries; i++) {
      //Waiting for time delay to elapse
      await snooze(timeDelay);

      //Searching for file
      let fileContent = await searchForFile();

      //Invoke handler if it is not null and if file was found
      if (exists(fileContent)) {
        busy = false;
        return tryLoadNewProjectContent(fileContent);
      }
    }
  } catch (err) {
    logger.warn(err.message, err);
  }

  busy = false;
  return null;
};

/**
 * @description Method for staring check of usb
 */
const start = () => {
  //Retruning if not initialized
  if (!initialized) return;

  if (!started) {
    usb.on("attach", onUSBAttachHandler);
  }

  started = true;
};

/**
 * @description Method for stopping check of usb
 */
const stop = () => {
  //Retruning if not initialized
  if (!initialized) return;

  if (started) usb.removeListener("attach", onUSBAttachHandler);

  started = false;
};

/**
 * @description Method for initializing service
 */
const init = () => {
  projectFileName = config.get("usbLoader.projectFileName");
  usbDirectories = config.get("usbLoader.dirPaths");
  numberOfRetries = config.get("usbLoader.numberOfRetries");
  timeDelay = config.get("usbLoader.timeDelay");

  projectFilePaths = usbDirectories.map((directory) =>
    path.join(directory, projectFileName)
  );

  //Was service started
  started = false;
  busy = false;
  initialized = true;
};

module.exports.start = start;
module.exports.stop = stop;
module.exports.init = init;
