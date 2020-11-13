const MBVariable = require("./MBVariable");
const Joi = require("joi");
const {
  checkInt32,
} = require("../../../../../models/Elements/ElementsValues/Int32");
const {
  joiSchema,
} = require("../../../../../models/Elements/Variable/MBVariable/MBInt32");

class MBInt32 extends MBVariable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for checking if payload is a valid device payload. Returns null if yes. Returns message if not.
   * @param {JSON} payload Payload to check
   */
  static validatePayload(payload) {
    let result = joiSchema.validate(payload);
    if (result.error) return result.error.details[0].message;
    else return null;
  }

  //#endregion  ========= PUBLIC STATIC METHODS =========

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
    const Joi = require("joi");

    const joiSchema = Joi.object({
      id: Joi.string().min(1).required(),
      name: Joi.string().min(1).required(),
      type: Joi.string().valid("MBFloat").required(),
      unit: Joi.string().min(1).required(),
      sampleTime: Joi.number().integer().min(1).required(),
      offset: Joi.number().integer().min(0).required(),
      length: Joi.valid(2).required(),
      defaultValue: Joi.number().required(),
      unitID: Joi.number().integer().min(1).max(255).required(),
      read: Joi.boolean().required(),
      write: Joi.when("read", {
        is: true,
        then: Joi.valid(false).required(),
        otherwise: Joi.valid(true).required(),
      }),
      readFCode: Joi.when("read", {
        is: true,
        then: Joi.number().valid(3, 4).required(),
        otherwise: Joi.number().valid(3, 4).optional(),
      }),
      writeFCode: Joi.when("write", {
        is: true,
        then: Joi.number().valid(16).required(),
        otherwise: Joi.number().valid(16).optional(),
      }),
      readAsSingle: Joi.boolean().required(),
      writeAsSingle: Joi.boolean().required(),
    });

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

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    if (payload.type !== "MBInt32")
      throw new Error("Invalid type in payload of MBInt32");
    if (payload.length !== 2)
      throw new Error("Invalid length in payload of MBInt32");

    await super.init(payload);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return checkInt32(value);
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

module.exports = MBInt32;
