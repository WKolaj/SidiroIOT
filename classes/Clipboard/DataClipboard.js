const { exists, cloneObject } = require("../../utilities/utilities");

class DataClipboard {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._data = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for initializing data clipboard
   * @param {JSON} payload payload to initialize. null if dataclipboard should be empty
   */
  init(payload = null) {
    this._data = {};

    if (exists(payload)) {
      this._data = cloneObject(payload);
    }
  }

  /**
   * @description Method for clearing all data
   */
  clearAllData() {
    this._data = {};
  }

  /**
   * @description Method for inserting new data into clipboard
   * @param {Number} tickId tick id of value
   * @param {String} elementId element id
   * @param {Object} value value to set
   */
  addData(tickId, elementId, value) {
    if (exists(this._data[tickId])) {
      this._data[tickId] = { ...this._data[tickId], [elementId]: value };
    } else {
      this._data[tickId] = { [elementId]: value };
    }
  }

  /**
   * @description Method for returning all data
   */
  getAllData() {
    return cloneObject(this._data);
  }

  //#endregion ========= PUBLIC METHODS =========
}

module.exports = DataClipboard;
