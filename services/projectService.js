const netplanSerive = require("../services/netplanService");
const {
  exists,
  checkIfFileExistsAsync,
  readFileAsync,
  writeFileAsync,
  isStringAValidJSON,
} = require("../utilities/utilities");
const _ = require("lodash");

let settingsFilePath = null;

const getInitialProjectContent = async () => {
  let payloadToReturn = {
    ipConfig: {},
  };

  let ipConfig = await netplanSerive.getInterfaces();

  if (exists(ipConfig)) payloadToReturn.ipConfig = ipConfig;

  return payloadToReturn;
};

module.exports.init = async (projectFilePath) => {
  settingsFilePath = projectFilePath;
};

module.exports.checkIfProjFileExistsAndIsValid = async () => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  //Checking if file exists
  let fileExists = await checkIfFileExistsAsync(settingsFilePath);
  if (!fileExists) return false;

  //Checking if file is a valid JSON
  let fileContent = await readFileAsync(settingsFilePath, "utf8");
  if (!isStringAValidJSON(fileContent)) {
    return false;
  }

  //TODO - add validation of project

  return true;
};

module.exports.createAndSaveNewProjectFile = async () => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  let initialFileContent = await getInitialProjectContent();

  await writeFileAsync(
    settingsFilePath,
    JSON.stringify(initialFileContent),
    "utf8"
  );
};

module.exports.setAndSaveNewIPConfig = async (ipConfig) => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  fileContent = await module.exports.getProjectContentFromFile();

  fileContent.ipConfig = ipConfig;

  await module.exports.saveProjectContentToFile(fileContent);
};

module.exports.getIPConfig = async () => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  fileContent = await module.exports.getProjectContentFromFile();

  return fileContent.ipConfig;
};

module.exports.getProjectContentFromFile = async () => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  return JSON.parse(await readFileAsync(settingsFilePath, "utf8"));
};

module.exports.saveProjectContentToFile = async (projectContent) => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  return writeFileAsync(
    settingsFilePath,
    JSON.stringify(projectContent),
    "utf8"
  );
};

module.exports.updateNetplanSettingsAccordingToProject = async () => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  let ipConfigFromFile = await module.exports.getIPConfig();
  let ipConfigFromNetplan = await netplanSerive.getInterfaces();

  //Setting new netplan settings if there is a difference
  if (!_.isEqual(ipConfigFromFile, ipConfigFromNetplan))
    await netplanSerive.setInterfaces(ipConfigFromFile);
};

module.exports.updateNetplanSettingsAccordingToNetplanFile = async (
  projectContent
) => {
  //Checking if project service is initialized
  if (!exists(settingsFilePath))
    throw new Error("project service not initialized");

  let ipConfigFromFile = await module.exports.getIPConfig();
  let ipConfigFromNetplan = await netplanSerive.getInterfaces();

  //If there is no ipConfigFromNetplan -> set empty object
  if (!exists(ipConfigFromNetplan)) ipConfigFromNetplan = {};

  //Setting new netplan settings if there is a difference
  if (!_.isEqual(ipConfigFromFile, ipConfigFromNetplan)) {
    await module.exports.setAndSaveNewIPConfig(ipConfigFromNetplan);
  }
};
