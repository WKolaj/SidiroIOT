const Device = require("../Device");
const RequestManager = require("../../Request/RequestManager");
const { request } = require("express");
const logger = require("../../../logger/logger");

class ConnectableDevice extends Device {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._requestManager = null;
    this._driver = null;

    //TODO - driver and request manager should be created in constructor in child classes
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description request manager of device
   */
  get RequestManager() {
    return this._requestManager;
  }

  /**
   * @description driver associated with device
   */
  get Driver() {
    return this._driver;
  }

  /**
   * @description is device active
   */
  get IsActive() {
    return this._getIsActiveState();
  }

  /**
   * @description is device onnected
   */
  get IsConnected() {
    return this._getIsConnectedState();
  }

  /**
   * @description timeout of device's driver
   */
  get Timeout() {
    return this.Driver.Timeout;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= VIRTUAL PRIVATE METHODS =========

  /**
   * @description Method for connecting device - activating device driver
   */
  async connect() {
    return this.Driver.activate();
  }

  /**
   * @description Method for disconnecting device - deactivating device driver
   */
  async disconnect() {
    return this.Driver.deactive();
  }

  /**
   * @description Method for getting connected state
   */
  _getIsConnectedState() {
    return this.Driver.IsConnected;
  }

  /**
   * @description Method for getting activation state
   */
  _getIsActiveState() {
    return this.Driver.IsActive;
  }

  //#endregion ========= VIRTUAL PRIVATE METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for refreshing variables
   * @param {Number} tickId tick id of actual refreshing date
   */
  async _refreshVariables(tickId) {
    //Refreshing variables only if device is active
    if (!this.IsActive) return;

    //Inoking every request of request manager that suits actual tickId
    //After invoking the request, adjust variables values if they exits after invoking request
    for (let request of this.RequestManager.Requests) {
      if (request.checkIfShouldBeInvoked(tickId))
        try {
          let data = await this.Driver.invokeRequest(request);
          if (data !== null) await request.writeDataToVariableValues(data);
        } catch (err) {
          logger.warn(err.message, err);
        }
    }
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    await super.init(payload);

    //After initializing variables, protocol request should be created
    await this.RequestManager.createRequests(Object.values(this.Variables));
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = ConnectableDevice;
