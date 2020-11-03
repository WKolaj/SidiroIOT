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
}

module.exports = MBByteArray;
