const Project = require("../classes/Project/Project");
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
const Joi = require("joi");

/**
 * @description Method for validate projectDataPayload for Joi schema
 * @param {JSON} projectDataPayload payload to check
 * @param {Object} helpers joi helper
 */
const validateProjectDataPayload = (projectDataPayload, helpers) => {
  const { message } = helpers;

  let validationMessage = Project.validatePayload(projectDataPayload);
  if (validationMessage)
    return message(`Invalid project data: ${validationMessage}`);

  return projectDataPayload;
};

/**
 * @description Schema for ipV4 withouth cidr
 */
const ipV4Schema = Joi.string().ip({
  version: ["ipv4"],
  cidr: "forbidden",
});

/**
 * @description Schema for netplan interface configuration - extended with optional parameter
 */
const netplanInterfaceJoiSchemaWithOptional = Joi.object({
  name: Joi.string().min(1).required(),
  dhcp: Joi.boolean().required(),
  optional: Joi.boolean().required(),
  ipAddress: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  subnetMask: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  gateway: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  dns: Joi.any().when("dhcp", {
    is: true,
    then: Joi.array().items(ipV4Schema).optional(),
    otherwise: Joi.array().items(ipV4Schema).required(),
  }),
});

/**
 * @description Method for validate projectIPConfig payload for Joi schema
 * @param {JSON} ipConfig payload to check
 * @param {Object} helpers joi helper
 */
const validateIPConfigPayload = (ipConfig, helpers) => {
  const { message } = helpers;

  if (ipConfig === null) return message(`"ipConfig" cannot be null`);

  for (let interfaceName of Object.keys(ipConfig)) {
    let interfacePayload = ipConfig[interfaceName];

    let result = netplanInterfaceJoiSchemaWithOptional.validate(
      interfacePayload
    );
    if (result.error) return message(result.error.details[0].message);

    let interfaceNameFromPayload = interfacePayload.name;

    if (interfaceName !== interfaceNameFromPayload)
      return message("interface name as key and in payload differ!");
  }

  return ipConfig;
};

const joiSchema = Joi.object({
  ipConfig: Joi.any()
    .custom(validateIPConfigPayload, "custom validation")
    .required(),
  data: Joi.any()
    .custom(validateProjectDataPayload, "custom validation")
    .required(),
});

/**
 * @description Main project object
 */
let project = null;

/**
 * @description project file path
 */
let projectFilePath = null;

/**
 * @description Method for checking if payload is a valid project payload. Returns null if yes. Returns message if not.
 * @param {JSON} payload Payload to check
 */
module.exports.validateProjectPayload = (payload) => {
  let result = joiSchema.validate(payload);
  if (result.error) return result.error.details[0].message;
  else return null;
};

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
  project = new Project();
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

  //Validating project content
  let validationResult = module.exports.validateProjectPayload(projectContent);
  if (validationResult !== null) throw new Error(validationResult);

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
    data: {
      connectableDevices: {},
      internalDevices: {},
      agentDevices: {},
    },
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

  //Parsing content to JSON
  let jsonContent = JSON.parse(fileContent);

  //Validating project content
  let validationResult = module.exports.validateProjectPayload(jsonContent);
  if (validationResult !== null) {
    return false;
  }

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
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //Setting new ip from project file
  await module.exports.setIPConfigFromProjectToNetplan();

  //Getting new content from project file
  let projectContent = await module.exports.getProjectContentFromFile();

  //Initializing project based on file content
  await project.load(projectContent.data);
};

/**
 * @description Method for getting project object - only for tests
 */
module.exports._getProject = () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  return project;
};

/**
 * @description Method for getting all devices from the project
 */
module.exports.getDevices = () => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getDevices();
};

/**
 * @description Method for getting device from project. Returns null if there is no device
 * @param {String} deviceId  device ID
 */
module.exports.getDevice = (deviceId) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getDevice(deviceId);
};

/**
 * @description Method for getting element from project of given device. Returns empty object if devices or elements are not present
 * @param {Array} deviceIds  list of all devices to get elements from. NULL if all elements from all devices should be returned
 */
module.exports.getElements = (deviceIds = null) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getElements(deviceIds);
};

/**
 * @description Method for getting element from project. Returns null if there is no device or element
 * @param {String} deviceId  deviceID of element. NULL if all devices should be taken into account
 * @param {String} elementId elementID
 */
module.exports.getElement = (deviceId, elementId) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getElement(deviceId, elementId);
};

/**
 * @description Method for getting variables from project of given device. Returns empty object if devices or variables are not present
 * @param {Array} deviceIds  list of all devices to get variables from. NULL if all vairables from all devices should be returned
 */
module.exports.getVariables = (deviceIds = null) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getVariables(deviceIds);
};

/**
 * @description Method for getting element from project. Returns null if there is no device or variable
 * @param {String} deviceId  deviceID of variable. NULL if all devices should be taken into account
 * @param {String} variableID variableID
 */
module.exports.getVariable = (deviceId, variableID) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getVariable(deviceId, variableID);
};

/**
 * @description Method for getting calcElements from project of given device. Returns empty object if devices or calcElements are not present
 * @param {Array} deviceIds  list of all devices to get calcElements from. NULL if all calcElements from all devices should be returned
 */
module.exports.getCalcElements = (deviceIds = null) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getCalcElements(deviceIds);
};

/**
 * @description Method for getting caclElement from project. Returns null if there is no device or element
 * @param {String} deviceId  deviceID of calcElement. NULL if all devices should be taken into account
 * @param {String} calcElementID calcElement ID
 */
module.exports.getCalcElement = (deviceId, calcElementID) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getCalcElement(deviceId, calcElementID);
};

/**
 * @description Method for getting alerts from project of given device. Returns empty object if devices or alerts are not present
 * @param {Array} deviceIds  list of all devices to get alerts from. NULL if all alerts from all devices should be returned
 */
module.exports.getAlerts = (deviceIds = null) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getAlerts(deviceIds);
};

/**
 * @description Method for getting alert from project. Returns null if there is no device or alert
 * @param {String} deviceId  deviceID of alert. NULL if all devices should be taken into account
 * @param {String} alertID calcElement ID
 */
module.exports.getAlert = (deviceId, alertID) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.getAlert(deviceId, alertID);
};

/**
 * @description Method for activating device.
 * @param {String} deviceId  deviceID
 */
module.exports.activateDevice = async (deviceId) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.activateDevice(deviceId);
};

/**
 * @description Method for deactivating device.
 * @param {String} deviceId  deviceID
 */
module.exports.deactivateDevice = async (deviceId) => {
  //Checking if project service is initialized
  if (!exists(projectFilePath))
    throw new Error("project service not initialized");

  //TODO - test this method
  return project.deactivateDevice(deviceId);
};

//TODO - add tests with project validation
