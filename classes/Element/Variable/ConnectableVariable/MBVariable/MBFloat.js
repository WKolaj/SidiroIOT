const MBVariable = require("./MBVariable");

class MBFloat extends MBVariable {
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
    int16Array[0] = data[1];
    int16Array[1] = data[0];
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
    // converting it from a 32-bit float into JavaScript's native 64-bit double
    var num = view.getFloat32(0);

    return num;
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Array} data
   */
  _convertValueToData(value) {
    //Split float into bytes
    let floatArray = new Float32Array(1);
    floatArray[0] = value;
    let bytes = new Int8Array(floatArray.buffer);

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

    return [int2, int1];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = MBFloat;
