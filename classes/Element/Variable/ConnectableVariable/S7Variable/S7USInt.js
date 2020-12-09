const S7Variable = require("./S7Variable");
const {
  checkUInt8,
} = require("../../../../../models/Elements/ElementsValues/UInt8");
const {
  joiSchema,
} = require("../../../../../models/Elements/Variable/S7Variable/S7USInt");

class S7USInt extends S7Variable {
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
    var buf = new ArrayBuffer(1);

    var view = new DataView(buf);

    view.setUint8(0, data[0]);

    return view.getUint8(0);
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Number} value
   */
  _convertValueToData(value) {
    //Split int16 into bytes
    let uint8Array = new Uint8Array(1);
    uint8Array[0] = value;
    let bytes = new Uint8Array(uint8Array.buffer);

    return [bytes[0]];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    if (payload.type !== "S7USInt")
      throw new Error("Invalid type in payload of S7USInt");
    if (payload.length !== 1)
      throw new Error("Invalid length in payload of S7USInt");

    await super.init(payload);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return checkUInt8(value);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = S7USInt;
