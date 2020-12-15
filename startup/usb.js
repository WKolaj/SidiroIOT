const logger = require("../logger/logger");
const config = require("config");
const path = require("path");
const projectService = require("../services/projectService");
const usbService = require("../services/usbService");
const {
  exists,
  checkIfDirectoryExistsAsync,
  checkIfFileExistsAsync,
  readFileAsync,
  writeFileAsync,
  isStringAValidJSON,
  createDirAsync,
} = require("../utilities/utilities");

//Method for initializing database connection
module.exports = async function () {
  logger.info("initializing usb service..");

  //Initializing usb service
  usbService.init();

  //Starting usb service
  usbService.start();

  logger.info("usb service initialized");
};

//TODO - add tests for this startup
