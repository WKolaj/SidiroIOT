const Clipboard = require("./Clipboard");
const { exists } = require("../../utilities/utilities");

class DataClipboard extends Clipboard {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for inserting new data into clipboard.
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

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting default data of clipboard - set while clearing data.
   */
  _getDefaultData() {
    return {};
  }

  //#endregion ========= POVERRIDE RIVATE METHODS =========
}

module.exports = DataClipboard;
