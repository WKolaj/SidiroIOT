const MBVariable = require("./MBVariable");

class MBBoolean extends MBVariable {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
  }

  //#endregion ========= CONSTRUCTOR =========

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
