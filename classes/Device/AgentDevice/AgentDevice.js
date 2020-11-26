const Device = require("../Device");

class AgentDevice extends Device {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);

    this._dataBuffer = null;
    this._eventBuffer = null;
    this._tryBoardOnSendData = null;
    this._tryBoardOnSendEvent = null;
    this._boarded = null;
    this._boardingKey = null;
    this._sendDataInternval = null;
    this._sendEventInterval = null;
    this._dataStorage = null;
    this._eventStorage = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  get Boarded() {
    return this._boarded;
  }

  get BoardingKey() {
    return this._boardingKey;
  }

  get SendDataInterval() {
    return this._sendDataInternval;
  }

  get SendEventInterval() {
    return this._sendEventInterval;
  }

  get DataStorage() {
    return this._dataStorage;
  }

  get EventStorage() {
    return this._eventStorage;
  }

  //#endregion ========= PROPERTIES ========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly.
   */
  getRefreshGroupID() {
    return this.ID;
  }

  /**
   * @description Method for generating payload of device. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  generatePayload() {
    let superPayload = super.generatePayload();
    //TODO - implement this method
  }
  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = AgentDevice;
