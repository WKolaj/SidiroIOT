const Device = require("../Device");
const { joiSchema } = require("../../../models/Device/InternalDevice");
const AssociatedVariable = require("../../Element/Variable/AssociatedVariable");
const CPULoadVariable = require("../../Element/Variable/InternalVariable/CPULoadVariable");
const CPUTemperatureVariable = require("../../Element/Variable/InternalVariable/CPUTemperatureVariable");
const DiskUsageVariable = require("../../Element/Variable/InternalVariable/DiskUsageVariable");
const RAMUsageVariable = require("../../Element/Variable/InternalVariable/RAMUsageVariable");

class InternalDevice extends Device {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);
  }

  //#endregion ========= CONSTRUCTOR =========

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

  //#region ========= OVERRIDE METHODS =========

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly.
   */
  getRefreshGroupID() {
    //internal devices can be refresh simuntaneusly - return seperate group for every internal device - unque ID
    return this.ID;
  }

  //#endregion ========= OVERRIDE METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for creating variables based on type - throws if type is not a valid type.
   * @param {String} type type of variable
   */
  _createVariableBasedOnPayload(type) {
    switch (type) {
      case "AssociatedVariable":
        return new AssociatedVariable(this._project, this);
      case "CPULoadVariable":
        return new CPULoadVariable(this._project, this);
      case "CPUTemperatureVariable":
        return new CPUTemperatureVariable(this._project, this);
      case "DiskUsageVariable":
        return new DiskUsageVariable(this._project, this);
      case "RAMUsageVariable":
        return new RAMUsageVariable(this._project, this);
      default:
        throw new Error(`Unrecognized Variable type: ${type}`);
    }
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = InternalDevice;

//TODO - test this class
