const S7AsyncClient = require("./S7AsyncClient/S7AsyncClient");
const { snooze } = require("../../utilities/utilities");
const S7Request = require("../Request/S7Request/S7Request");
const Driver = require("./Driver");

class S7Driver extends Driver {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();

    this._client = new S7AsyncClient();
    this._ipAddress = "192.168.0.1";
    this._rack = 0;
    this._slot = 1;
    this._enableConnectTimeout = false;
    this._disconnectOnConnectTimeout = false;
    this._disconnectOnConnectError = false;
    this._disconnectOnProcessTimeout = false;
    this._disconnectOnProcessError = true;
    this._enableProcessTimeout = false;
    this._connectWhenDisconnectedOnProcess = true;
    this._includeLastProcessingFailInConnection = false;
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
   * @description Rack of CPU
   */
  get Rack() {
    return this._rack;
  }

  /**
   * @description Slot of CPU
   */
  get Slot() {
    return this._slot;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description method for setting timeout.
   */
  setTimeout(value) {
    //Setting timeout requires setting timeout of connection, send and recieve

    //connection timeout
    this.Client.setParam(3, value);
    //send timeout
    this.Client.setParam(4, value);
    //recieve timeout
    this.Client.setParam(5, value);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting connection state of driver.
   */
  _getIsConnectedState() {
    return this.Client.getConnectedState();
  }

  /**
   * @description Method for establishing TCP connection to device.
   */
  async _connect() {
    return this.Client.connectTCP(this.IPAddress, this.Rack, this.Slot);
  }

  /**
   * @description Method for disconnecting TCP session with device.
   */
  async _disconnect() {
    return this.Client.close();
  }

  /**
   * @description Method for processing request by driver.
   * @param {S7Request} protocolRequest
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
    //timeout of Recieve
    return this.Client.getParam(5);
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for process reading request
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessReadingRequest(protocolRequest, tickId) {
    switch (protocolRequest.MemoryType) {
      case "I": {
        return this._processReadFromInputs(protocolRequest, tickId);
      }
      case "Q": {
        return this._processReadFromOutputs(protocolRequest, tickId);
      }
      case "M": {
        return this._processReadFromMemory(protocolRequest, tickId);
      }
      case "DB": {
        return this._processReadFromDB(protocolRequest, tickId);
      }
      default: {
        throw new Error(`Invalid S7 memory type ${protocolRequest.MemoryType}`);
      }
    }
  }

  /**
   * @description Method for process writing request
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _proccessWritingRequest(protocolRequest, tickId) {
    let data = protocolRequest.getTotalData();
    switch (protocolRequest.MemoryType) {
      case "I": {
        return this._processWriteToInputs(protocolRequest, tickId, data);
      }
      case "Q": {
        return this._processWriteToOutputs(protocolRequest, tickId, data);
      }
      case "M": {
        return this._processWriteToMemory(protocolRequest, tickId, data);
      }
      case "DB": {
        return this._processWriteToDB(protocolRequest, tickId, data);
      }
      default: {
        throw new Error(`Invalid S7 memory type ${protocolRequest.MemoryType}`);
      }
    }
  }

  /**
   * @description Method for process read from datablock
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _processReadFromDB(protocolRequest, tickId) {
    let result = await this.Client.DBRead(
      protocolRequest.DBNumber,
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return [...result];
  }

  /**
   * @description Method for process read from I memory
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _processReadFromInputs(protocolRequest, tickId) {
    let result = await this.Client.EBRead(
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return [...result];
  }

  /**
   * @description Method for process read from Q memory
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _processReadFromOutputs(protocolRequest, tickId) {
    let result = await this.Client.ABRead(
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return [...result];
  }

  /**
   * @description Method for process read from M memory
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _processReadFromMemory(protocolRequest, tickId) {
    let result = await this.Client.MBRead(
      protocolRequest.Offset,
      protocolRequest.Length
    );

    return [...result];
  }

  /**
   * @description Method for process write to datablock
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   * @param {Array} data data to be set
   */
  async _processWriteToDB(protocolRequest, tickId, data) {
    await this.Client.DBWrite(
      protocolRequest.DBNumber,
      protocolRequest.Offset,
      protocolRequest.Length,
      Buffer.from(data)
    );

    //after processing data end - there is no need to return anything - device should not process data if request was no read only
  }

  /**
   * @description Method for process write to I memory
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   * @param {Array} data data to be set
   */
  async _processWriteToInputs(protocolRequest, tickId, data) {
    await this.Client.EBWrite(
      protocolRequest.Offset,
      protocolRequest.Length,
      Buffer.from(data)
    );

    //after processing data end - there is no need to return anything - device should not process data if request was no read only
  }

  /**
   * @description Method for process write to Q memory
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   * @param {Array} data data to be set
   */
  async _processWriteToOutputs(protocolRequest, tickId, data) {
    await this.Client.ABWrite(
      protocolRequest.Offset,
      protocolRequest.Length,
      Buffer.from(data)
    );

    //after processing data end - there is no need to return anything - device should not process data if request was no read only
  }

  /**
   * @description Method for process write to M memory
   * @param {S7Request} protocolRequest
   * @param {Number} tickId tickId of action
   * @param {Array} data data to be set
   */
  async _processWriteToMemory(protocolRequest, tickId, data) {
    await this.Client.MBWrite(
      protocolRequest.Offset,
      protocolRequest.Length,
      Buffer.from(data)
    );

    //after processing data end - there is no need to return anything - device should not process data if request was no read only
  }

  //#endregion ========= PRIVATE METHODS =========
}

module.exports = S7Driver;
