const Alert = require("./Alert");

class LowLimitAlert extends Alert {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);
  }

  //#endregion ========= CONSTRUCTOR =========
}

module.exports = LowLimitAlert;
