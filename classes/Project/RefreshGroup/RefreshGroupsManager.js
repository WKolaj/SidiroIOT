const { exists } = require("../../../utilities/utilities");
const RefreshGroup = require("./RefreshGroup");
const RefreshGroups = require("./RefreshGroups");

class RefreshGroupsManager {
  //#region ========= CONSTRUCTOR =========

  /**
   * @description Class for managing refreshing groups
   */
  constructor() {
    this._connectableDeviceGroups = null;
    this._internalDeviceGroups = null;
    this._agentDeviceGroups = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description All groups for connectable devices
   */
  get ConnectableDeviceGroups() {
    return this._connectableDeviceGroups;
  }

  /**
   * @description All groups for internal devices
   */
  get InternalDeviceGroups() {
    return this._internalDeviceGroups;
  }

  /**
   * @description All groups for agent devices
   */
  get AgentDeviceGroups() {
    return this._agentDeviceGroups;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  createRefreshGroups(connectDevices, internalDevices, agentDevices) {
    this._connectableDeviceGroups = new RefreshGroups(connectDevices);
    this._internalDeviceGroups = new RefreshGroups(internalDevices);
    this._agentDeviceGroups = new RefreshGroups(agentDevices);
  }

  /**
   * @description Method for refreshing all requestsGroups - all devices from seperate groups are refreshed simuntaneusly, all devices from one group are refreshed one by one
   * @param {Number} tickId tickId of actual date
   */
  async refresh(tickId) {
    //Devices should be refreshed in order: Connectable -> Internal -> Agent
    await this.ConnectableDeviceGroups.refresh(tickId);
    await this.InternalDeviceGroups.refresh(tickId);
    await this.AgentDeviceGroups.refresh(tickId);
  }

  //#endregion ========= PUBLIC METHODS =========
}

module.exports = RefreshGroupsManager;
