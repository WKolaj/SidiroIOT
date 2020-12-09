const ConnectableDevice = require("./ConnectableDevice");
const S7RequestManager = require("../../Request/S7Request/S7RequestManager");
const S7Driver = require("../../Driver/S7Driver");

const DeviceConnectionVariable = require("../../Element/Variable/InternalVariable/DeviceConnectionVariable");
const S7ByteArray = require("../../Element/Variable/ConnectableVariable/S7Variable/S7ByteArray");
const S7DTL = require("../../Element/Variable/ConnectableVariable/S7Variable/S7DTL");
const S7Real = require("../../Element/Variable/ConnectableVariable/S7Variable/S7Real");
const S7USInt = require("../../Element/Variable/ConnectableVariable/S7Variable/S7USInt");
const S7Int = require("../../Element/Variable/ConnectableVariable/S7Variable/S7Int");
const S7DInt = require("../../Element/Variable/ConnectableVariable/S7Variable/S7DInt");
const S7SInt = require("../../Element/Variable/ConnectableVariable/S7Variable/S7SInt");
const S7UInt = require("../../Element/Variable/ConnectableVariable/S7Variable/S7UInt");
const S7UDInt = require("../../Element/Variable/ConnectableVariable/S7Variable/S7UDInt");

const { joiSchema } = require("../../../models/Device/S7Device");

class S7Device extends ConnectableDevice {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);
    this._requestManager = new S7RequestManager();
    this._driver = new S7Driver();

    //Standard device - invoking other requests is unneccessary after throwing of one
    this._continueIfRequestThrows = false;
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
   * @description Rack of CPU
   */
  get Rack() {
    return this.Driver.Rack;
  }

  /**
   * @description Slot of CPU
   */
  get Slot() {
    return this.Driver.Slot;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for checking if payload is a valid device payload. Returns null if yes. Returns message if not.
   * @param {JSON} payload Payload to check
   */
  static validatePayload(payload) {
    let result = joiSchema.validate(payload);
    if (result.error) return result.error.details[0].message;
    else return null;
  }

  //#endregion  ========= PUBLIC STATIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    //initialize properties of S7Device and S7Driver
    //Driver has to be initialized before - super init calls activate/deactivate based on isActive in payload
    this.Driver._ipAddress = payload.ipAddress;
    this.Driver._rack = payload.rack;
    this.Driver._slot = payload.slot;

    await super.init(payload);
  }

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly.
   */
  getRefreshGroupID() {
    return `${this.IPAddress}`;
  }

  /**
   * @description Method for generating payload of device.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.ipAddress = this.IPAddress;
    superPayload.rack = this.Rack;
    superPayload.slot = this.Slot;

    return superPayload;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for creating variables based on type - throws if type is not a valid type.
   * @param {String} type type of variable
   */
  _createVariableBasedOnPayload(type) {
    switch (type) {
      case "DeviceConnectionVariable":
        return new DeviceConnectionVariable(this._project, this);
      case "S7ByteArray":
        return new S7ByteArray(this._project, this);
      case "S7DTL":
        return new S7DTL(this._project, this);
      case "S7Real":
        return new S7Real(this._project, this);
      case "S7SInt":
        return new S7SInt(this._project, this);
      case "S7Int":
        return new S7Int(this._project, this);
      case "S7DInt":
        return new S7DInt(this._project, this);
      case "S7USInt":
        return new S7USInt(this._project, this);
      case "S7UInt":
        return new S7UInt(this._project, this);
      case "S7UDInt":
        return new S7UDInt(this._project, this);

      default:
        throw new Error(`Unrecognized Variable type: ${type}`);
    }
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = S7Device;

//TODO - test this class
