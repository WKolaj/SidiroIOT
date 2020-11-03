const MBVariable = require("./MBVariable");

class MBUInt16 extends MBVariable {
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
    let int16Array = new Uint16Array(1);
    int16Array[0] = data[0];
    let bytes = new Int8Array(int16Array.buffer);

    //Bytes swap
    let byteData = [bytes[1], bytes[0]];

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
    var num = view.getUint16(0);

    return num;
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Array} data
   */
  _convertValueToData(value) {
    //Split float into bytes
    let int16Array = new Uint16Array(1);
    int16Array[0] = value;
    let bytes = new Int8Array(int16Array.buffer);

    //swap bytes
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

    return [int2];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = MBUInt16;
