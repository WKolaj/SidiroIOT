const logger = require("../logger/logger");
const config = require("config");
const path = require("path");
const netplanSerive = require("../services/netplanService");
const projectService = require("../services/projectService");
const {
  exists,
  checkIfDirectoryExistsAsync,
  checkIfFileExistsAsync,
  readFileAsync,
  writeFileAsync,
  isStringAValidJSON,
} = require("../utilities/utilities");

//Method for initializing database connection
module.exports = async function () {
  logger.info("initializing project..");

  //Create project file if not exists
  let settingsDirPath = config.get("settingsPath");
  let projectFileName = config.get("projectFileName");
  let projectFilePath = path.join(settingsDirPath, projectFileName);

  //Checking if settings dir exists
  let settingsDirExists = await checkIfDirectoryExistsAsync(settingsDirPath);
  if (!settingsDirExists) {
    await createDirAsync(settingsDirPath);
    logger.info("Settings dir created");
  }

  //Initializing project service
  await projectService.init(projectFilePath);

  let projFileValid = await projectService.checkIfProjFileExistsAndIsValid();
  if (projFileValid) {
    //Updating netplan settings based on project content
    await projectService.updateNetplanSettingsAccordingToProject();
  } else {
    //Creating brand new project file if current one does not exists or is invalid
    await projectService.createAndSaveNewProjectFile();

    //Reading ipConfig from netplan file
    await projectService.updateNetplanSettingsAccordingToNetplanFile();
    logger.info("New project file created");
  }

  //TODO - here initialize project content based on projectFileContent

  logger.info("project initialized");
};
