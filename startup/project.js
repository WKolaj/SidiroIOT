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
  createDirAsync,
} = require("../utilities/utilities");

//Method for initializing database connection
module.exports = async function () {
  logger.info("initializing project..");

  //Create project file if not exists
  let settingsDirPath = config.get("settingsPath");
  let agentsDirName = config.get("agentsDirName");
  let projectFileName = config.get("projectFileName");
  let projectFilePath = path.join(settingsDirPath, projectFileName);
  let agentsDirPath = path.join(settingsDirPath, agentsDirName);

  //Checking if settings dir exists
  let settingsDirExists = await checkIfDirectoryExistsAsync(settingsDirPath);
  if (!settingsDirExists) {
    await createDirAsync(settingsDirPath);
    logger.info("Settings dir created");
  }

  //Checking if agentsData dir exists
  let agentsDirExists = await checkIfDirectoryExistsAsync(agentsDirPath);
  if (!agentsDirExists) {
    await createDirAsync(agentsDirPath);
    logger.info("Agents dir created");
  }

  //Initializing project service
  await projectService.init(projectFilePath, agentsDirPath);

  //Checking if project file exists - if exists and is valid - set ipconfig from proj to netplan
  //Otherwise - create new project file and load ipConfig from netplan to project file
  let projFileValid = await projectService.checkIfProjFileExistsAndIsValid();
  if (projFileValid) {
    //Updating netplan settings based on project content
    await projectService.setIPConfigFromProjectToNetplan();
  } else {
    //Creating brand new project file if current one does not exists or is invalid
    await projectService.createNewProjectFile();

    //Reading ipConfig from netplan file
    await projectService.setIPConfigFromNetplanToProject();
    logger.info("New project file created");
  }

  //Loading project - creating devices, variables etc.
  await projectService.loadProjectFile();

  logger.info("project initialized");
};
