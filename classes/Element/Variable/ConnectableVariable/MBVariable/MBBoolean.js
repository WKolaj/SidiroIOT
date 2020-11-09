const MBVariable = require("./MBVariable");
const Joi = require("joi");

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("MBBoolean").required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  defaultValue: Joi.boolean().required(),
  offset: Joi.number().integer().min(0).required(),
  length: Joi.number().integer().valid(1).required(),
  unitID: Joi.number().integer().min(1).max(255).required(),
  read: Joi.boolean().required(),
  write: Joi.when("read", {
    is: true,
    then: Joi.valid(false).required(),
    otherwise: Joi.valid(true).required(),
  }),
  readFCode: Joi.when("read", {
    is: true,
    then: Joi.number().valid(1, 2).required(),
    otherwise: Joi.number().valid(1, 2).optional(),
  }),
  readAsSingle: Joi.boolean().required(),
  writeAsSingle: Joi.boolean().required(),
});

class MBBoolean extends MBVariable {
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
   * @description Method for converting data (byte array) to value of variable. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Array} data
   */
  _convertDataToValue(data) {
    return data[0] > 0;
  }

  /**
   * @description Method for converting value to data (byte array) of variable. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Array} data
   */
  _convertValueToData(value) {
    return [value];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    if (payload.type !== "MBBoolean")
      throw new Error("Invalid type in payload of MBBoolean");
    if (payload.length !== 1)
      throw new Error("Invalid length in payload of MBBoolean");

    await super.init(payload);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting all possible function codes for this type of variable (when reading)
   */
  _getReadPossibleFunctionCodes() {
    return [1, 2];
  }

  /**
   * @description Method for getting all possible function codes for this type of variable (when writing)
   */
  _getWritePossibleFunctionCodes() {
    return [];
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = MBBoolean;
