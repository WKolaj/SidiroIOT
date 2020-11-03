const MBVariable = require("./MBVariable");

class MBSwappedInt32 extends MBVariable {
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
    //Split 2 x 16 bit to bytes
    let int16Array = new Uint16Array(2);
    int16Array[0] = data[0];
    int16Array[1] = data[1];
    let bytes = new Int8Array(int16Array.buffer);

    //Bytes swap
    let byteData = [bytes[1], bytes[0], bytes[3], bytes[2]];

    // Create a buffer
    var buf = new ArrayBuffer(4);
    // Create a data view of it
    var view = new DataView(buf);

    // set bytes
    byteData.forEach(function (b, i) {
      view.setUint8(i, b);
    });

    // Read the bits as a float; note that by doing this, we're implicitly
    // converting it from a 32-bit int into JavaScript's native 64-bit double
    var num = view.getInt32(0);

    return num;
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Array} data
   */
  _convertValueToData(value) {
    //Split float into bytes
    let int32Array = new Int32Array(1);
    int32Array[0] = value;
    let bytes = new Int8Array(int32Array.buffer);

    //swap bytes
    let int1Buf = [bytes[3], bytes[2]];

    // Create a buffer
    var buf1 = new ArrayBuffer(4);
    // Create a data view of it
    var view1 = new DataView(buf1);

    // set bytes
    int1Buf.forEach(function (b, i) {
      view1.setUint8(i, b);
    });

    let int1 = view1.getUint16(0);

    //swap bytes
    let int2Buf = [bytes[1], bytes[0]];

    // Create a buffer
    var buf2 = new ArrayBuffer(4);
    // Create a data view of it
    var view2 = new DataView(buf2);

    // set bytes
    int2Buf.forEach(function (b, i) {
      view2.setUint8(i, b);
    });

    let int2 = view2.getUint16(0);

    return [int1, int2];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    //Setting fixed type of variable and length - before invoking init in parent class - for whole process of data check to work
    payload.type = "MBSwappedInt32";
    payload.length = 2;

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

module.exports = MBSwappedInt32;
