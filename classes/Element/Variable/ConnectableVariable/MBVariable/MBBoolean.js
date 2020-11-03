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
}

module.exports = MBBoolean;
