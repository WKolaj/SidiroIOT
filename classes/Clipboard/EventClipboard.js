const Clipboard = require("./Clipboard");
const { exists } = require("../../utilities/utilities");

class EventClipboard extends Clipboard {
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
    this._data.push({
      tickId: tickId,
      elementId: elementId,
      value: value,
    });
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting default data of clipboard - set while clearing data.
   */
  _getDefaultData() {
    return [];
  }

  //#endregion ========= POVERRIDE RIVATE METHODS =========
}

module.exports = EventClipboard;
