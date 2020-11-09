const MBVariable = require("./MBVariable");
const Joi = require("joi");

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("MBUInt16").required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  offset: Joi.number().integer().min(0).required(),
  length: Joi.valid(1).required(),
  defaultValue: Joi.number().integer().min(0).max(65535).required(),
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

class MBUInt16 extends MBVariable {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for checking if payload is a valid device payload. Returns null if yes. Returns message if not.
   * @param {JSON} payload Payload to check
   */
  static async validatePayload(payload) {
    let result = joiSchema.validate(payload);
    if (result.error) return result.error.details[0].message;
    else return null;
  }

  //#region  ========= PUBLIC STATIC METHODS =========

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

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    if (payload.type !== "MBUInt16")
      throw new Error("Invalid type in payload of MBUInt16");
    if (payload.length !== 1)
      throw new Error("Invalid length in payload of MBUInt16");

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

module.exports = MBUInt16;
