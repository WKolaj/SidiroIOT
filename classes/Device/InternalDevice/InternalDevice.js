const Device = require("../Device");

class InternalDevice extends Device {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    this._project = project;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= OVERRIDE METHODS =========
  //#endregion ========= OVERRIDE METHODS =========
}

module.exports = InternalDevice;
