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

class S7Device extends ConnectableDevice {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);
    //TODO - add creation of S7RequestManager and S7Driver

    //Standard device - invoking other requests is unneccessary after throwing of one
    this._continueIfRequestThrows = false;
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
    //initialize properties of S7Device and S7Driver

    await super.init(payload);
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
      case "S7ByteArray":
        return new S7ByteArray();
      case "S7DTL":
        return new S7DTL();
      case "S7Float":
        return new S7Float();
      case "S7Int8":
        return new S7Int8();
      case "S7Int16":
        return new S7Int16();
      case "S7Int32":
        return new S7Int32();
      case "S7UInt8":
        return new S7UInt8();
      case "S7UInt16":
        return new S7UInt16();
      case "S7UInt32":
        return new S7UInt32();

      default:
        throw new Error(`Unrecognized Variable type: ${type}`);
    }
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = S7Device;
