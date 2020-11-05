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
    this.Driver._timeout = payload.timeout;

    await super.init(payload);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for creating, assigining and initializing variable based on its type and payload. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {JSON} variablePayload payload of variable (including variable type)
   */
  async _initVariable(variablePayload) {
    let type = variablePayload.type;

    let variable = null;

    switch (type) {
      case "AssociatedVariable":
        variable = new AssociatedVariable();
        break;
      case "InternalVariable":
        variable = new InternalVariable();
        break;
      case "MBBoolean":
        variable = new MBBoolean();
        break;
      case "MBByteArray":
        variable = new MBByteArray();
        break;
      case "MBDouble":
        variable = new MBDouble();
        break;
      case "MBFloat":
        variable = new MBFloat();
        break;
      case "MBInt16":
        variable = new MBInt16();
        break;
      case "MBInt32":
        variable = new MBInt32();
        break;
      case "MBSwappedFloat":
        variable = new MBSwappedFloat();
        break;
      case "MBSwappedDouble":
        variable = new MBSwappedDouble();
        break;
      case "MBSwappedInt32":
        variable = new MBSwappedInt32();
        break;
      case "MBSwappedUInt32":
        variable = new MBSwappedUInt32();
        break;
      case "MBUInt16":
        variable = new MBUInt16();
        break;
      case "MBUInt32":
        variable = new MBUInt32();
        break;

      default:
        throw new Error(`Unrecognized Variable type: ${type}`);
    }

    //Initializing variables
    await variable.init(variablePayload);

    //Assigning variable to Variables
    this.Variables[variable.ID] = variable;
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = MBDevice;
