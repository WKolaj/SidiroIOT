const StandardProtocolRequest = require("../StandardProtocolRequest");

class MBRequest extends StandardProtocolRequest {
  //#region ========= CONSTRUCTOR =========

  /**
   * @description Class representing modbus request that can be processed by driver
   * @param {Array} variables variables assigned to request
   * @param {Number} sampleTime sampleTime of variables
   * @param {Boolean} writeRequest is request associated with writing data to physical device or to gather data from device to MBRequest
   * @param {Number} fCode function code of Modbus
   * @param {Number} unitID unitID of Modbus device
   */
  constructor(variables, sampleTime, writeRequest, fCode, unitID) {
    super(variables, sampleTime, writeRequest);

    this._fCode = fCode;
    this._unitID = unitID;

    //Checking properties
    for (let variable of variables) {
      if (writeRequest && variable.WriteFCode !== fCode)
        throw new Error(
          "Trying to assing variable with different fCode to Modbus request"
        );

      if (!writeRequest && variable.ReadFCode !== fCode)
        throw new Error(
          "Trying to assing variable with different fCode to Modbus request"
        );

      if (variable.UnitID !== unitID)
        throw new Error(
          "Trying to assing variable with different UnitID to Modbus request"
        );
    }
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Function code od request
   */
  get FCode() {
    return this._fCode;
  }

  /**
   * @description Modbus Slave ID (Modbus RTU address)
   */
  get UnitID() {
    return this._unitID;
  }

  //#endregion ========= PROPERTIES =========
}

module.exports = MBRequest;

//TODO - TEST MBREQUEST CLASS
