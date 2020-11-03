const MBVariable = require("./MBVariable");

class MBByteArray extends MBVariable {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for converting data (byte array) to value of variable.
   * @param {Array} data
   */
  _convertDataToValue(data) {
    let int16Array = new Uint16Array(data.length);

    for (let i in data) {
      int16Array[i] = data[i];
    }

    let dataBuffer = new Uint8Array(int16Array.buffer);

    let bytes = [];

    for (let i in dataBuffer) {
      bytes[i] = dataBuffer[i];
    }

    return bytes;
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Array} data
   */
  _convertValueToData(value) {
    let int8Array = new Uint8Array(value.length);

    for (let i in value) {
      int8Array[i] = value[i];
    }

    let dataBuffer = new Uint16Array(int8Array.buffer);

    let data = [];

    for (let i in dataBuffer) {
      data[i] = dataBuffer[i];
    }

    return data;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    //Setting fixed type of variable - before invoking init in parent class - for whole process of data check to work
    payload.type = "MBByteArray";

    await super.init(payload);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting all possible function codes for this type of variable (when reading)
   */
  _getReadPossibleFunctionCodes() {
    return [3, 4];
  }

  /**
   * @description Method for getting all possible function codes for this type of variable (when writing)
   */
  _getWritePossibleFunctionCodes() {
    return [16];
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = MBByteArray;
