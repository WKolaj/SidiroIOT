const Variable = require("../Variable");

class ConnectableVariable extends Variable {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();

    this._data = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Value represented as byte array
   */
  get Data() {
    return this._data;
  }

  /**
   * @description Value represented as byte array
   */
  set Data(value) {
    this._data = value;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for converting data (byte array) to value of variable. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Array} data
   */
  _convertDataToValue(data) {
    return data;
  }

  /**
   * @description Method for converting value to data (byte array) of variable. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Array} data
   */
  _convertValueToData(value) {
    return value;
  }

  //#endregion ========= PUBLIC ABSTRACT METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Abstract method for getting value. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getValue() {
    return this._convertDataToValue(this.Data);
  }

  /**
   * @description Abstract method for setting new value. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Object} value value to set
   */
  _setValue(value) {
    this._data = this._convertValueToData(value);
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = ConnectableVariable;

//TODO - add tests for connectable variable
