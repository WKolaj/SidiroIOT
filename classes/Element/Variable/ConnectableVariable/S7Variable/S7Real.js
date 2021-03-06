const S7Variable = require("./S7Variable");
const {
  checkFloat,
} = require("../../../../../models/Elements/ElementsValues/Float");
const {
  joiSchema,
} = require("../../../../../models/Elements/Variable/S7Variable/S7Real");

class S7Real extends S7Variable {
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
    var buf = new ArrayBuffer(4);

    var view = new DataView(buf);

    view.setUint8(0, data[0]);
    view.setUint8(1, data[1]);
    view.setUint8(2, data[2]);
    view.setUint8(3, data[3]);

    return view.getFloat32(0);
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Number} value
   */
  _convertValueToData(value) {
    //Split int32 into bytes
    let int32Array = new Float32Array(1);
    int32Array[0] = value;
    let bytes = new Uint8Array(int32Array.buffer);

    return [bytes[3], bytes[2], bytes[1], bytes[0]];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    if (payload.type !== "S7Real")
      throw new Error("Invalid type in payload of S7Real");
    if (payload.length !== 4)
      throw new Error("Invalid length in payload of S7Real");

    await super.init(payload);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return checkFloat(value);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = S7Real;
