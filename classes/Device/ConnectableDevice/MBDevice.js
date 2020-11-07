const ConnectableDevice = require("./ConnectableDevice");
const MBRequestManager = require("../../Request/MBRequest/MBRequestManager");
const MBDriver = require("../../Driver/MBDriver");

const MBBoolean = require("../../Element/Variable/ConnectableVariable/MBVariable/MBBoolean");
const MBByteArray = require("../../Element/Variable/ConnectableVariable/MBVariable/MBByteArray");
const MBDouble = require("../../Element/Variable/ConnectableVariable/MBVariable/MBDouble");
const MBFloat = require("../../Element/Variable/ConnectableVariable/MBVariable/MBFloat");
const MBInt16 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBInt16");
const MBInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBInt32");
const MBSwappedFloat = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedFloat");
const MBSwappedDouble = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedDouble");
const MBSwappedInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedInt32");
const MBSwappedUInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedUInt32");
const MBUInt16 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBUInt16");
const MBUInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBUInt32");

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

    await super.init(payload);
  }

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly.
   */
  getRefreshGroupID() {
    return `${this.IPAddress}:${this.PortNumber}`;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for creating variables based on type - throws if type is not a valid type.
   * @param {String} type type of variable
   */
  _createVariableBasedOnPayload(type) {
    switch (type) {
      case "AssociatedVariable":
        return new AssociatedVariable();
      case "InternalVariable":
        return new InternalVariable();
      case "MBBoolean":
        return new MBBoolean();
      case "MBByteArray":
        return new MBByteArray();
      case "MBDouble":
        return new MBDouble();
      case "MBFloat":
        return new MBFloat();
      case "MBInt16":
        return new MBInt16();
      case "MBInt32":
        return new MBInt32();
      case "MBSwappedFloat":
        return new MBSwappedFloat();
      case "MBSwappedDouble":
        return new MBSwappedDouble();
      case "MBSwappedInt32":
        return new MBSwappedInt32();
      case "MBSwappedUInt32":
        return new MBSwappedUInt32();
      case "MBUInt16":
        return new MBUInt16();
      case "MBUInt32":
        return new MBUInt32();
      default:
        throw new Error(`Unrecognized Variable type: ${type}`);
    }
  }

  /**
   * @description Method for generating payload of device.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.ipAddress = this.IPAddress;
    superPayload.portNumber = this.PortNumber;

    return superPayload;
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = MBDevice;
