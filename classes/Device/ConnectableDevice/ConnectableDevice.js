const Device = require("../Device");
const RequestManager = require("../../Request/RequestManager");
const { request } = require("express");
const logger = require("../../../logger/logger");

class ConnectableDevice extends Device {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
    this._requestManager = null;
    this._driver = null;

    //IMPORTANT! driver and request manager should be created in constructor in child classes
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
   * @description Method for getting connected state
   */
  _getIsConnectedState() {
    return this.Driver.IsConnected;
  }

  //#endregion ========= VIRTUAL PRIVATE METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting active state of device.
   */
  _getIsActiveState() {
    return this.Driver.IsActive;
  }

  /**
   * @description Method for refreshing variables
   * @param {Number} tickId tick id of actual refreshing date
   */
  async _refreshVariables(tickId) {
    //Inoking every request of request manager that suits actual tickId
    //After invoking the request, adjust variables values if they exits after invoking request
    for (let request of this.RequestManager.Requests) {
      if (request.checkIfShouldBeInvoked(tickId))
        try {
          let data = await this.Driver.invokeRequest(request, tickId);
          //writing data to variables only if request is read
          if (request.ReadRequest)
            await request.writeDataToVariableValues(data, tickId);
        } catch (err) {
          logger.warn(err.message, err);
        }
    }
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for activating the device - connecting the driver
   */
  async activate() {
    return this.Driver.activate();
  }

  /**
   * @description Method for deactivating the device - disconnecting the driver
   */
  async deactivate() {
    return this.Driver.deactivate();
  }

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    await super.init(payload);

    this.Driver._timeout = payload.timeout;

    //After initializing variables, protocol request should be created
    await this.RequestManager.createRequests(Object.values(this.Variables));
  }

  /**
   * @description Method for generating payload of device. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.isConnected = this.IsConnected;
    superPayload.timeout = this.Timeout;

    return superPayload;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = ConnectableDevice;
