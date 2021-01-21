const Joi = require("joi");
const MSAgentDevice = require("../../classes/Device/AgentDevice/MSAgentDevice");
const MSMQTTAgentDevice = require("../../classes/Device/AgentDevice/MSMQTTAgentDevice");
const MBDevice = require("../../classes/Device/ConnectableDevice/MBDevice");
const MBGatewayDevice = require("../../classes/Device/ConnectableDevice/MBGatewayDevice");
const S7Device = require("../../classes/Device/ConnectableDevice/S7Device");
const InternalDevice = require("../../classes/Device/InternalDevice/InternalDevice");
const { hasDuplicates } = require("../../utilities/utilities");

const validateConnectableDevicesPayload = (devicesPayload, helpers) => {
  const { message } = helpers;

  if (devicesPayload === null)
    return message(`"connectableDevices" cannot be null`);

  for (let deviceID of Object.keys(devicesPayload)) {
    let devicePayload = devicesPayload[deviceID];

    let deviceType = devicePayload.type;
    let validationMessage = null;

    switch (deviceType) {
      case "MBDevice":
        validationMessage = MBDevice.validatePayload(devicePayload);
        break;
      case "MBGatewayDevice":
        validationMessage = MBGatewayDevice.validatePayload(devicePayload);
        break;
      case "S7Device":
        validationMessage = S7Device.validatePayload(devicePayload);
        break;
      default:
        validationMessage = "connectable device type not recognized";
    }

    if (validationMessage !== null) return message(validationMessage);

    let deviceIDFromPayload = devicePayload.id;

    if (deviceID !== deviceIDFromPayload)
      return message("connectable device's id as key and in payload differ!");
  }

  return devicesPayload;
};

const validateInternalDevicesPayload = (devicesPayload, helpers) => {
  const { message } = helpers;

  if (devicesPayload === null)
    return message(`"internalDevices" cannot be null`);

  for (let deviceID of Object.keys(devicesPayload)) {
    let devicePayload = devicesPayload[deviceID];

    let deviceType = devicePayload.type;
    let validationMessage = null;

    switch (deviceType) {
      case "InternalDevice":
        validationMessage = InternalDevice.validatePayload(devicePayload);
        break;
      default:
        validationMessage = "internal device type not recognized";
    }

    if (validationMessage !== null) return message(validationMessage);

    let deviceIDFromPayload = devicePayload.id;

    if (deviceID !== deviceIDFromPayload)
      return message("internal device's id as key and in payload differ!");
  }

  return devicesPayload;
};

const validateAgentDevicesPayload = (devicesPayload, helpers) => {
  const { message } = helpers;

  if (devicesPayload === null) return message(`"agentDevices" cannot be null`);

  for (let deviceID of Object.keys(devicesPayload)) {
    let devicePayload = devicesPayload[deviceID];

    let deviceType = devicePayload.type;
    let validationMessage = null;

    switch (deviceType) {
      case "MSAgentDevice":
        validationMessage = MSAgentDevice.validatePayload(devicePayload);
        break;
      case "MSMQTTAgentDevice":
        validationMessage = MSMQTTAgentDevice.validatePayload(devicePayload);
        break;
      default:
        validationMessage = "agent device type not recognized";
    }

    if (validationMessage !== null) return message(validationMessage);

    let deviceIDFromPayload = devicePayload.id;

    if (deviceID !== deviceIDFromPayload)
      return message("agent device's id as key and in payload differ!");
  }

  return devicesPayload;
};

/**
 * @description Method for checking whether there all project ids (Devices and elements) are uniq. Returns true if ids are uniq and false if uniq is true
 * @param {JSON} devicesPayload Project payload
 */
const checkIfProjectIdsAreUniq = (devicesPayload) => {
  //Creating an array with all ids

  let allIds = [];

  for (let connectableDevice of Object.values(
    devicesPayload.connectableDevices
  )) {
    allIds.push(connectableDevice.id);

    for (let variable of Object.values(connectableDevice.variables))
      allIds.push(variable.id);

    for (let calcElement of Object.values(connectableDevice.calcElements))
      allIds.push(calcElement.id);

    for (let agent of Object.values(connectableDevice.alerts))
      allIds.push(agent.id);
  }

  for (let internalDevice of Object.values(devicesPayload.internalDevices)) {
    allIds.push(internalDevice.id);

    for (let variable of Object.values(internalDevice.variables))
      allIds.push(variable.id);

    for (let calcElement of Object.values(internalDevice.calcElements))
      allIds.push(calcElement.id);

    for (let agent of Object.values(internalDevice.alerts))
      allIds.push(agent.id);
  }

  for (let agentDevice of Object.values(devicesPayload.agentDevices)) {
    allIds.push(agentDevice.id);

    for (let variable of Object.values(agentDevice.variables))
      allIds.push(variable.id);

    for (let calcElement of Object.values(agentDevice.calcElements))
      allIds.push(calcElement.id);

    for (let agent of Object.values(agentDevice.alerts)) allIds.push(agent.id);
  }

  //Returning wether array contains duplicates
  return !hasDuplicates(allIds);
};

const schemaContent = {
  connectableDevices: Joi.any()
    .custom(validateConnectableDevicesPayload, "custom validation")
    .required(),
  internalDevices: Joi.any()
    .custom(validateInternalDevicesPayload, "custom validation")
    .required(),
  agentDevices: Joi.any()
    .custom(validateAgentDevicesPayload, "custom validation")
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.validateConnectableDevicesPayload = validateConnectableDevicesPayload;
module.exports.validateInternalDevicesPayload = validateInternalDevicesPayload;
module.exports.validateAgentDevicesPayload = validateAgentDevicesPayload;
module.exports.checkIfProjectIdsAreUniq = checkIfProjectIdsAreUniq;
module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
