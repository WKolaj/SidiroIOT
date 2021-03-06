const S7Variable = require("./S7Variable");
const {
  checkByteArray,
} = require("../../../../../models/Elements/ElementsValues/ByteArray");
const {
  joiSchema,
} = require("../../../../../models/Elements/Variable/S7Variable/S7ByteArray");

class S7UInt extends S7Variable {
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
    return [...data];
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Number} value
   */
  _convertValueToData(value) {
    return [...value];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    if (payload.type !== "S7ByteArray")
      throw new Error("Invalid type in payload of S7ByteArray");

    if (payload.defaultValue.length !== payload.length)
      throw new Error(
        "Length of default value (bytes) not valid - it should be the length of byte array"
      );

    await super.init(payload);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return checkByteArray(value, this.Length);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = S7UInt;
