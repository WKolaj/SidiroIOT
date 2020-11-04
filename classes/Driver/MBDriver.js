const ModbusRTU = require("modbus-serial");
const MBRequest = require("../Request/MBRequest/MBRequest");
const Driver = require("./Driver");

class MBDriver extends Driver {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();

    this._client = new ModbusRTU();
    this._ipAddress = "192.168.0.1";
    this._portNumber = 502;
    this._readingFCodes = [2, 3, 4];
    this._writingFCodes = [16];
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

  /**
   * @description All accessible reading FCodes
   */
  get ReadingFCodes() {
    return this._readingFCodes;
  }

  /**
   * @description All accessible writing FCodes
   */
  get WriteFCodes() {
    return this._writingFCodes;
  }

  //#endregion ========= PROPERTIES =========

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
    return this.Client.close();
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
          `Invalid MB read function code ${protocolRequest.FCode}`
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
    let result = await this.Client.writeRegisters(protocolRequest.Offset, data);

    return result.data;
  }

  //#endregion ========= PRIVATE METHODS =========
}

module.exports = MBDriver;

//TODO - TEST MBDRIVER CLASS
