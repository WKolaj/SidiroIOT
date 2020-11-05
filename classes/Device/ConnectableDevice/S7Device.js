const ConnectableDevice = require("./ConnectableDevice");

const S7ByteArray = require("../../Element/Variable/ConnectableVariable/S7Variable/S7ByteArray");
const S7DTL = require("../../Element/Variable/ConnectableVariable/S7Variable/S7DTL");
const S7Float = require("../../Element/Variable/ConnectableVariable/S7Variable/S7Float");
const S7Int8 = require("../../Element/Variable/ConnectableVariable/S7Variable/S7Int8");
const S7Int16 = require("../../Element/Variable/ConnectableVariable/S7Variable/S7Int16");
const S7Int32 = require("../../Element/Variable/ConnectableVariable/S7Variable/S7Int32");
const S7UInt8 = require("../../Element/Variable/ConnectableVariable/S7Variable/S7UInt8");
const S7UInt16 = require("../../Element/Variable/ConnectableVariable/S7Variable/S7UInt16");
const S7UInt32 = require("../../Element/Variable/ConnectableVariable/S7Variable/S7UInt32");

class MBDevice extends ConnectableDevice {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
    //TODO - add creation of S7RequestManager and S7Driver
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  //#endregion ========= PROPERTIES =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    if (payload.type !== "S7Device")
      throw new Error(`Trying to set type ${payload.type} to MBDevice!`);

    //initialize properties of S7Device and S7Driver

    await super.init(payload);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for creating, assigining and initializing variable based on its type and payload.
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
      case "S7ByteArray":
        variable = new S7ByteArray();
        break;
      case "S7DTL":
        variable = new S7DTL();
        break;
      case "S7Float":
        variable = new S7Float();
        break;
      case "S7Int8":
        variable = new S7Int8();
        break;
      case "S7Int16":
        variable = new S7Int16();
        break;
      case "S7Int32":
        variable = new S7Int32();
        break;
      case "S7UInt8":
        variable = new S7UInt8();
        break;
      case "S7UInt16":
        variable = new S7UInt16();
        break;
      case "S7UInt32":
        variable = new S7UInt32();
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
