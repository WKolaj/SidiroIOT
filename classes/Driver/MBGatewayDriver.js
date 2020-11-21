const MBDriver = require("./MBDriver");

class MBGatewayDriver extends MBDriver {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();

    this._includeLastProcessingFailInConnection = false;
  }

  //#endregion ========= CONSTRUCTOR =========
}

module.exports = MBGatewayDriver;
