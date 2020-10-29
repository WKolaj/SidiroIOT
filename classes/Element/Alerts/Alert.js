const Element = require("../Element");

class Alert extends Element {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for refreshing alert. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickNumber actual tick number
   */
  async refresh(tickNumber) {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========
}

module.exports = Alert;
