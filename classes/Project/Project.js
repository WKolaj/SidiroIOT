const RefreshGroupManager = require("./RefreshGroup/RefreshGroupsManager");
const Sampler = require("../Sampler/Sampler");
const ConnectableDevice = require("../Device/ConnectableDevice/ConnectableDevice");
const InternalDevice = require("../Device/InternalDevice/InternalDevice");
const AgentDevice = require("../Device/AgentDevice/AgentDevice");

//TODO - test this class

class Project {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._devices = {};
    this._refreshGroupManager = new RefreshGroupManager();
    this._sampler = new Sampler();

    //binding handler method - it can be invoked by another class
    this._handleSamplerTick.bind(this);

    //Connecting _handlerSamplerTick to sampler main method
    this.Sampler.ExternalTickHandler = this._handleSamplerTick;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description All Devices of the project
   */
  get Devices() {
    return this._devices;
  }

  /**
   * @description All connectable devices
   */
  get ConnectableDevices() {
    return this._getDevicesBasedOnOverallType(ConnectableDevice);
  }

  /**
   * @description All internal devices
   */
  get InternalDevices() {
    return this._getDevicesBasedOnOverallType(InternalDevice);
  }

  /**
   * @description All agent devices
   */
  get AgentDevices() {
    return this._getDevicesBasedOnOverallType(AgentDevice);
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
   * @description Method for getting only devices of given overall type - Agent, Connectable or Internal
   * @param {*} type Class to check
   */
  _getDevicesBasedOnOverallType(type) {
    let objectToReturn = {};
    for (let device of Object.values(this.Devices)) {
      if (device instanceof type) objectToReturn[device.ID] = device;
    }
    return objectToReturn;
  }

  /**
   * @description Method for creating refresh groups based on assigned devices
   */
  _createRefreshGroups() {
    this.RefreshGroupManager.createRefreshGroups(
      this.ConnectableDevices,
      this.InternalDevices,
      this.AgentDevices
    );
  }

  /**
   * @description Main method for handling tick of sampler
   */
  async _handleSamplerTick(tickNumber) {
    //Refreshing group manager on every tick
    await this.RefreshGroupManager.refresh(tickNumber);
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for loading whole configuration to a project
   * @param {JSON} payload Payload of the project configuration
   */
  async load(payload) {
    //stopping sampler temporarly
    this.Sampler.stop();

    //TODO - add initialzation of devices based on payload

    //Creating refresh groups based on new devices
    this._createRefreshGroups();

    //Start the sampler again
    this.Sampler.start();
  }

  //#endregion ========= PUBLIC METHODS =========
}

module.exports = Project;
