const { exists } = require("../../../utilities/utilities");
const RefreshGroup = require("./RefreshGroup");

class RefreshGroups {
  //#region ========= CONSTRUCTOR =========

  /**
   * @description Class representing several refreshing groups
   * @param {Array} devices collection of devices to assign
   */
  constructor(devices) {
    //Creating devices to add - groupped by request group
    let grouppedDevices = RefreshGroups._splitDevicesToGroupsPayload(devices);

    //Creating connectDevicesRequestGroups
    this._groups = {};
    for (let groupID of Object.keys(grouppedDevices)) {
      let devicesOfGivenGroup = grouppedDevices[groupID];
      this._groups[groupID] = new RefreshGroup(groupID, devicesOfGivenGroup);
    }
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description All refreshing groups
   */
  get Groups() {
    return this._groups;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for refreshing all requestsGroups - all devices from seperate groups are refreshed simuntaneusly, all devices from one group are refreshed one by one
   * @param {Number} tickId tickId of actual date
   */
  async refresh(tickId) {
    //Creating refreshing promises
    let refreshPromises = [];
    for (let group of Object.values(this.Groups))
      refreshPromises.push(group.createRefreshPromise(tickId));

    //Refreshing groups
    return Promise.all(refreshPromises);
  }

  //#endregion ========= PUBLIC METHODS =========

  //#region ========= PRIVATE STATIC METHODS =========

  /**
   * @description Method for converting collection of devices into JSON containing their requstGroupID as key and all devices of given requestGroupID as value
   * @param {Array} devices Collection of devices to split
   */
  static _splitDevicesToGroupsPayload(devices) {
    let devicesJSONToReturn = {};
    for (let device of devices) {
      //getting group id and create it if not exists
      let deviceGroupId = device.getRefreshGroupID();
      if (!exists(devicesJSONToReturn[deviceGroupId]))
        devicesJSONToReturn[deviceGroupId] = [];

      //Adding device to group
      devicesJSONToReturn[deviceGroupId].push(device);
    }

    return devicesJSONToReturn;
  }

  //#endregion ========= PRIVATE STATIC METHODS =========
}

module.exports = RefreshGroups;
