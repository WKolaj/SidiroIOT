const ConnectableDevice = require("./ConnectableDevice");
const MBRequestManager = require("../../Request/MBRequest/MBRequestManager");
const MBDriver = require("../../Driver/MBDriver");

class MBDevice extends ConnectableDevice {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
    this._requestManager = new MBRequestManager();
    this._driver = new MBDriver();
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    await super.init(payload);

    this.Driver._ipAddress = payload.ipAddress;
    this.Driver._portNumber = payload.portNumber;
    this.Driver._timeout = payload.timeout;
    this.Driver._isActive = payload.isActive;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = MBDevice;

//TODO Test MBDevice
