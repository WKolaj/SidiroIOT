const netplanService = require("../services/netplanService");
const {
  exists,
  checkIfFileExistsAsync,
  readFileAsync,
  writeFileAsync,
  isStringAValidJSON,
  statAsync,
} = require("../utilities/utilities");
const _ = require("lodash");

/**
 * @description project file path
 */
let projectFilePath = null;

/**
 * @description Method for getting project file path
 */
module.exports.getProjectFilePath = () => {
  return projectFilePath;
};

/**
 * @description Method for initializing project service
 * @param {String} filePath Path to project file
 */
module.exports.init = async (filePath) => {
  projectFilePath = filePath;
};

/**
 * @description Method for getting content from project file - THROWS IF CONTENT IS INVALID!
 */
module.exports.getProjectContentFromFile = async () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //Reading and parsing file content
  return JSON.parse(await readFileAsync(projectFilePath, "utf8"));
};

/**
 * @description Method for saving project content to file
 * @param {JSON} projectContent new project content
 */
module.exports.saveProjectContentToFile = async (projectContent) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  if (!exists(projectContent)) throw new Error("project content must exists!");

  //TODO - add validation in the future

  //Writing new project content to file
  return writeFileAsync(
    projectFilePath,
    JSON.stringify(projectContent),
    "utf8"
  );
};

/**
 * @description Method for getting initial project content payload - newly created
 */
const getInitialProjectContent = async () => {
  let payloadToReturn = {
    ipConfig: {},
  };

  return payloadToReturn;
};

/**
 * @description Method for creating new empty project file
 */
module.exports.createNewProjectFile = async () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  let initialFileContent = await getInitialProjectContent();

  //Appending project file content with actual interfaces from netplan - if the exists
  let ipConfig = await netplanService.getInterfaces();
  if (exists(ipConfig)) initialFileContent.ipConfig = ipConfig;

  await module.exports.saveProjectContentToFile(initialFileContent);
};

/**
 * @description Method for checking id project file exists and is valid
 */
module.exports.checkIfProjFileExistsAndIsValid = async () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //Checking if file exists
  let fileExists = await checkIfFileExistsAsync(projectFilePath);
  if (!fileExists) return false;

  //Checking if file is a valid JSON
  let fileContent = await readFileAsync(projectFilePath, "utf8");
  if (!isStringAValidJSON(fileContent)) {
    return false;
  }

  //TODO - add validation of project

  return true;
};

/**
 * @description Method for getting ip config from project file
 */
module.exports.getIPConfig = async () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  fileContent = await module.exports.getProjectContentFromFile();

  return fileContent.ipConfig;
};

/**
 * @description Method for saving new ip config to project file - DOES NOT CHANGE IP IN NETPLAN
 * @param {JSON} ipConfig ipConfig to save
 */
module.exports.setIPConfig = async (ipConfig) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  fileContent = await module.exports.getProjectContentFromFile();
  fileContent.ipConfig = ipConfig;

  await module.exports.saveProjectContentToFile(fileContent);
};

/**
 * @description Method for setting ip config from project file to netplan service
 */
module.exports.setIPConfigFromProjectToNetplan = async () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //Getting and comparing ipConfig from netplan and from project file
  let ipConfigFromFile = await module.exports.getIPConfig();
  let ipConfigFromNetplan = await netplanService.getInterfaces();

  //If there is no ipConfig from netplan -> set empty object
  if (!exists(ipConfigFromNetplan)) ipConfigFromNetplan = {};

  //Setting new netplan settings if there is a difference
  if (!_.isEqual(ipConfigFromFile, ipConfigFromNetplan)) {
    await netplanService.setInterfaces(ipConfigFromFile);

    let ipConfigFile = await netplanService.getInterfaces();
  }
};

/**
 * @description Method for setting ip config from netplan service to project file
 */
module.exports.setIPConfigFromNetplanToProject = async () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //Getting and comparing ipConfig from netplan and from project file
  let ipConfigFromFile = await module.exports.getIPConfig();
  let ipConfigFromNetplan = await netplanService.getInterfaces();

  //If there is no ipConfig from netplan -> set empty object
  if (!exists(ipConfigFromNetplan)) ipConfigFromNetplan = {};

  //Setting new netplan settings if there is a difference
  if (!_.isEqual(ipConfigFromFile, ipConfigFromNetplan)) {
    await module.exports.setIPConfig(ipConfigFromNetplan);
  }
};

/**
 * @description Method for loading project file to memory - creating devices, variables, etc.
 */
module.exports.loadProjectFile = async () => {
  //Setting new ip from project file
  await module.exports.setIPConfigFromProjectToNetplan();

  //Getting new content from project file
  let projectContent = await module.exports.getProjectContentFromFile();

  //TODO - add mechanism for loading project - creating devices, variables etc.
};
