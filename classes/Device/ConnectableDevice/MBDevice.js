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

  //#region ========= PROPERTIES =========

  /**
   * @description Address of physical device
   */
  get IPAddress() {
    return this.Driver.IPAddress;
  }

  /**
   * @description Port number of device
   */
  get PortNumber() {
    return this.Driver.PortNumber;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    if (payload.type !== "MBDevice")
      throw new Error(`Trying to set type ${payload.type} to MBDevice!`);

    //Driver has to be initialized before - super init calls activate/deactivate based on isActive in payload
    this.Driver._ipAddress = payload.ipAddress;
    this.Driver._portNumber = payload.portNumber;
    this.Driver._timeout = payload.timeout;

    await super.init(payload);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = MBDevice;
