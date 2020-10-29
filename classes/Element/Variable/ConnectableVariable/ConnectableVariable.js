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

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for setting new data - in order to ensure that new data cannot be set without setting new tickId
   * @param {Array} newData new data
   * @param {Number} tickId actual tickId
   */
  setData(newData, tickId) {
    this._data = newData;
    this._lastValueTick = tickId;
  }

  //#endregion ========= PUBLIC METHODS =========

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
   * @description Abstract method for getting value.
   */
  _getValue() {
    return this._convertDataToValue(this.Data);
  }

  /**
   * @description Abstract method for setting new value.
   * @param {Object} value value to set
   * @param {Number} tickId actual tickid
   */
  _setValue(value, tickId) {
    this._data = this._convertValueToData(value);
    this._lastValueTick = tickId;
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = ConnectableVariable;

//TODO - add tests for connectable variable
