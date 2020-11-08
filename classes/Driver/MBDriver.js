const ModbusRTU = require("modbus-serial");
const logger = require("../../logger/logger");
const { snooze } = require("../../utilities/utilities");
const MBRequest = require("../Request/MBRequest/MBRequest");
const Driver = require("./Driver");

class MBDriver extends Driver {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();

    this._client = new ModbusRTU();
    this._ipAddress = "192.168.0.1";
    this._portNumber = 502;
    this._enableConnectTimeout = false;
    this._disconnectOnConnectTimeout = false;
    this._disconnectOnConnectError = false;
    this._disconnectOnProcessTimeout = false;
    this._disconnectOnProcessError = false;
    this._enableProcessTimeout = false;
    this._connectWhenDisconnectedOnProcess = true;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Modbus TCP client
   */
  get Client() {
    return this._client;
  }

  /**
   * @description Address of physical device
   */
  get IPAddress() {
    return this._ipAddress;
  }

  /**
   * @description Port number of device
   */
  get PortNumber() {
    return this._portNumber;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description method for setting timeout. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  setTimeout(value) {
    this.Client.setTimeout(value);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting connection state of driver. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getIsConnectedState() {
    return this.Client.isOpen;
  }

  /**
   * @description Method for establishing TCP connection to device. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  async _connect() {
    return this.Client.connectTCP(this.IPAddress, {
      port: this.PortNumber,
    });
  }

  /**
   * @description Method for disconnecting TCP session with device. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  async _disconnect() {
    this.Client.close();
    //Waiting for the client to close - await timeout
    if (this.Timeout) await snooze(this.Timeout);
  }

  /**
   * @description Method for processing request by driver. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _processRequest(protocolRequest, tickId) {
    if (protocolRequest.ReadRequest) {
      return this._proccessReadingRequest(protocolRequest, tickId);
    } else if (protocolRequest.WriteRequest) {
      return this._proccessWritingRequest(protocolRequest, tickId);
    }
  }

  /**
   * @description method for getting timeout
   */
  _getTimeout() {
    return this.Client.getTimeout();
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for process reading request
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessReadingRequest(protocolRequest, tickId) {
    switch (protocolRequest.FCode) {
      case 1: {
        return this._proccessFCode1(protocolRequest, tickId);
      }
      case 2: {
        return this._proccessFCode2(protocolRequest, tickId);
      }
      case 3: {
        return this._proccessFCode3(protocolRequest, tickId);
      }
      case 4: {
        return this._proccessFCode4(protocolRequest, tickId);
      }
      default: {
        throw new Error(
          `Invalid MB read function code ${protocolRequest.FCode}`
        );
      }
    }
  }

  /**
   * @description Method for process writing request
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessWritingRequest(protocolRequest, tickId) {
    let data = protocolRequest.getTotalData();
    switch (protocolRequest.FCode) {
      case 16: {
        return this._proccessFCode16(protocolRequest, tickId, data);
      }
      default: {
        throw new Error(
          `Invalid MB write function code ${protocolRequest.FCode}`
        );
      }
    }
  }

  /**
   * @description Method for process read request of FCode 1
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessFCode1(protocolRequest, tickId) {
    this.Client.setID(protocolRequest.UnitID);
    let result = await this.Client.readCoils(
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return result.data;
  }

  /**
   * @description Method for process read request of FCode 2
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessFCode2(protocolRequest, tickId) {
    this.Client.setID(protocolRequest.UnitID);
    let result = await this.Client.readDiscreteInputs(
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return result.data;
  }

  /**
   * @description Method for process read request of FCode 3
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessFCode3(protocolRequest, tickId) {
    this.Client.setID(protocolRequest.UnitID);
    let result = await this.Client.readHoldingRegisters(
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return result.data;
  }

  /**
   * @description Method for process read request of FCode 4
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessFCode4(protocolRequest, tickId) {
    this.Client.setID(protocolRequest.UnitID);
    let result = await this.Client.readInputRegisters(
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return result.data;
  }

  /**
   * @description Method for process write request of FCode 16
   * @param {MBRequest} protocolRequest
   * @param {Number} tickId tickId of action
   * @param {Array} data data to be set
   */
  async _proccessFCode16(protocolRequest, tickId, data) {
    this.Client.setID(protocolRequest.UnitID);
    await this.Client.writeRegisters(protocolRequest.Offset, data);

    //after processing data end - there is no need to return anything - device should not process data if request was no read only
  }

  //#endregion ========= PRIVATE METHODS =========
}

module.exports = MBDriver;

//TODO - tests new driver refresh method - new values of _disconnectFlags

//TODO - tests new driver refresh method - new values of _enableTimeoutHandlerFlags

//TODO - tests new driver refresh method - new values of setTimeout and getTimeout
