const { exists, cloneObject } = require("../../utilities/utilities");

class Clipboard {
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
    this._data = this._getDefaultData();

    if (exists(payload)) {
      this._data = cloneObject(payload);
    }
  }

  /**
   * @description Method for clearing all data
   */
  clearAllData() {
    this._data = this._getDefaultData();
  }

  /**
   * @description Method for returning all data
   */
  getAllData() {
    return cloneObject(this._data);
  }

  //#endregion ========= PUBLIC METHODS =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for inserting new data into clipboard. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickId tick id of value
   * @param {String} elementId element id
   * @param {Object} value value to set
   */
  addData(tickId, elementId, value) {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========

  //#region ========= PRIVATE ABSTRACT METHODS =========

  /**
   * @description Method for getting default data of clipboard - set while clearing data. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getDefaultData() {}

  //#endregion ========= PRIVATE ABSTRACT METHODS =========
}

module.exports = Clipboard;
