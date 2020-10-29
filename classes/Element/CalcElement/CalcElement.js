const Element = require("../Element");

class CalcElement extends Element {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for refreshing calcElement. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickNumber actual tick number
   */
  async refresh(tickNumber) {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========
}

module.exports = CalcElement;
