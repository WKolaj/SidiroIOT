const RefreshGroupManager = require("../RefreshGroup/RefreshGroupsManager");
const Sampler = require("../Sampler/Sampler");
const ConnectableDevice = require("../Device/ConnectableDevice/ConnectableDevice");
const InternalDevice = require("../Device/InternalDevice/InternalDevice");
const AgentDevice = require("../Device/AgentDevice/AgentDevice");
const logger = require("../../logger/logger");
const MBDevice = require("../Device/ConnectableDevice/MBDevice");
const S7Device = require("../Device/ConnectableDevice/S7Device");
const Joi = require("joi");

//#region ========= PAYLOAD VALIDATION =========

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

    //TODO - add checking device payload based on type
    switch (deviceType) {
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

    //TODO - add checking device payload based on type
    switch (deviceType) {
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

const ipV4Schema = Joi.string().ip({
  version: ["ipv4"],
  cidr: "forbidden",
});

const joiSchema = Joi.object({
  connectableDevices: Joi.any()
    .custom(validateConnectableDevicesPayload, "custom validation")
    .required(),
  internalDevices: Joi.any()
    .custom(validateInternalDevicesPayload, "custom validation")
    .required(),
  agentDevices: Joi.any()
    .custom(validateAgentDevicesPayload, "custom validation")
    .required(),
});

//#endregion ========= PAYLOAD VALIDATION =========

//TODO - test this class

class Project {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._connectableDevices = {};
    this._internalDevices = {};
    this._agentDevices = {};
    this._refreshGroupManager = new RefreshGroupManager();
    this._sampler = new Sampler();

    //binding handler method - it can be invoked by another class
    this._handleSamplerTick = this._handleSamplerTick.bind(this);

    //Connecting _handlerSamplerTick to sampler main method
    this.Sampler.ExternalTickHandler = this._handleSamplerTick;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for checking if payload is a valid project payload. Returns null if yes. Returns message if not.
   * @param {JSON} payload Payload to check
   */
  static validatePayload(payload) {
    let result = joiSchema.validate(payload);
    if (result.error) return result.error.details[0].message;
    else return null;
  }

  //#endregion  ========= PUBLIC STATIC METHODS =========

  //#region ========= PROPERTIES =========

  /**
   * @description All Devices of the project
   */
  get Devices() {
    return {
      ...this.ConnectableDevices,
      ...this.InternalDevices,
      ...this.AgentDevices,
    };
  }

  /**
   * @description All connectable devices
   */
  get ConnectableDevices() {
    return this._connectableDevices;
  }

  /**
   * @description All internal devices
   */
  get InternalDevices() {
    return this._internalDevices;
  }

  /**
   * @description All agent devices
   */
  get AgentDevices() {
    return this._agentDevices;
  }

  /**
   * @description Refresh group manager - for refreshing all devices
   */
  get RefreshGroupManager() {
    return this._refreshGroupManager;
  }

  /**
   * @description Sampler object
   */
  get Sampler() {
    return this._sampler;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for creating refresh groups based on assigned devices
   */
  _createRefreshGroups() {
    this.RefreshGroupManager.createRefreshGroups(
      Object.values(this.ConnectableDevices),
      Object.values(this.InternalDevices),
      Object.values(this.AgentDevices)
    );
  }

  /**
   * @description Main method for handling tick of sampler
   */
  async _handleSamplerTick(tickNumber) {
    //Refreshing group manager on every tick
    await this.RefreshGroupManager.refresh(tickNumber);
  }

  /**
   * @description Method for disconnecting all devices in order - connectable, internal, agents
   */
  async _disconnectAllDevices() {
    for (let device of Object.values(this.ConnectableDevices)) {
      try {
        await device.deactivate();
      } catch (err) {
        logger.warn(err.message, err);
      }
    }

    for (let device of Object.values(this.InternalDevices)) {
      try {
        await device.deactivate();
      } catch (err) {
        logger.warn(err.message, err);
      }
    }

    for (let device of Object.values(this.AgentDevices)) {
      try {
        await device.deactivate();
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  /**
   * @description Method for loading all connectable devices from payload. Clears all existing connectable devices. REMEMBER TO DISCONNECT ALL DEVICES FIRST IF THERE ARE SOME
   * @param {JSON} devicesPayload payload of connectable devices
   */
  async _loadConnectableDevices(devicesPayload) {
    this._connectableDevices = {};

    for (let devicePayload of Object.values(devicesPayload)) {
      try {
        let device = this._createDeviceBasedOnType(devicePayload.type);
        await device.init(devicePayload);
        this.ConnectableDevices[device.ID] = device;
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  /**
   * @description Method for loading all internal devices from payload. Clears all existing internal devices. REMEMBER TO DISCONNECT ALL DEVICES FIRST IF THERE ARE SOME
   * @param {JSON} devicesPayload payload of internal devices
   */
  async _loadInternalDevices(devicesPayload) {
    this._internalDevices = {};

    for (let devicePayload of Object.values(devicesPayload)) {
      try {
        let device = this._createDeviceBasedOnType(devicePayload.type);
        await device.init(devicePayload);
        this.InternalDevices[device.ID] = device;
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  /**
   * @description Method for loading all agent devices from payload. Clears all existing agent devices. REMEMBER TO DISCONNECT ALL DEVICES FIRST IF THERE ARE SOME
   * @param {JSON} devicesPayload payload of agent devices
   */
  async _loadAgentDevices(devicesPayload) {
    this._agentDevices = {};

    for (let devicePayload of Object.values(devicesPayload)) {
      try {
        let device = this._createDeviceBasedOnType(devicePayload.type);
        await device.init(devicePayload);
        this.AgentDevices[device.ID] = device;
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  /**
   * @description Method for creating device based on device's type
   * @param {String} type type of device
   */
  _createDeviceBasedOnType(type) {
    switch (type) {
      case "MBDevice": {
        return new MBDevice();
      }
      case "S7Device": {
        return new S7Device();
      }
      case "InternalDevice": {
        return new InternalDevice();
      }
      case "AgentDevice": {
        return new AgentDevice();
      }
      default:
        throw new Error(`Unrecognized Device type: ${type}`);
    }
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for loading whole configuration to a project
   * @param {JSON} payload Payload of the project configuration
   */
  async load(payload) {
    //Checking payload
    let validatePayloadMessage = Project.validatePayload(payload);
    if (validatePayloadMessage !== null)
      throw new Error(`Invalid payload for initialization: ${validatePayload}`);

    //stopping sampler temporarly
    this.Sampler.stop();

    //Disconnecting all devices
    await this._disconnectAllDevices();

    //Creating and initializing all connecting devices
    await this._loadConnectableDevices(payload.connectableDevices);

    //Creating and initializing all internal devices
    await this._loadInternalDevices(payload.internalDevices);

    //Creating and initializing all agent devices
    await this._loadAgentDevices(payload.agentDevices);

    //Creating refresh groups based on new devices
    this._createRefreshGroups();

    //Start the sampler again
    this.Sampler.start();
  }

  //#endregion ========= PUBLIC METHODS =========
}

module.exports = Project;
