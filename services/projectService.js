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
    //TODO - remove earlier
    console.log(validationResult);
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
  //Setting new ip from project file
  await module.exports.setIPConfigFromProjectToNetplan();

  //Getting new content from project file
  let projectContent = await module.exports.getProjectContentFromFile();

  //Initializing project based on file content
  project.load(projectContent.data);
};

/**
 * @description Method for getting element from project. Throws if there is no element of given ids
 * @param {String} deviceId  deviceID of element
 * @param {String} elementId elementID
 */
module.exports.getElement = (deviceId, elementId) => {
  //TODO - test this method
  return project.getElement(deviceId, elementId);
};

//TODO - add tests with project validation
