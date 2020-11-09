const MBVariable = require("./MBVariable");
const Joi = require("joi");

const byteSchema = Joi.number().integer().min(0).max(255);

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("MBByteArray").required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  offset: Joi.number().integer().min(0).required(),
  length: Joi.number().integer().min(1).required(),
  defaultValue: Joi.array()
    .items(byteSchema)
    .length(
      Joi.ref("length", {
        adjust: (value) => value * 2,
      })
    )
    .required(),
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

class MBByteArray extends MBVariable {
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
    if (payload.type !== "MBByteArray")
      throw new Error("Invalid type in payload of MBByteArray");

    if (payload.defaultValue.length !== payload.length * 2)
      throw new Error(
        "Length of default value (bytes) not valid - it should be two times length of variable (words)"
      );

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
