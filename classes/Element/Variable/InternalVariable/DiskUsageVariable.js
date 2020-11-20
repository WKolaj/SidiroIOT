const InternalVariable = require("./InternalVariable");
const {
  joiSchema,
} = require("../../../../models/Elements/Variable/InternalVariable/DiskUsageVariable");
const deviceInfoService = require("../../../../services/deviceInfo");
const { exists } = require("../../../../utilities/utilities");

class DiskUsageVariable extends InternalVariable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);
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

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "DiskUsageVariable value is readonly";
  }

  /**
   * @description Method called every tick that suits sampleTime.
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //Getting cpu Data
    let diskUsage = await deviceInfoService.calcDiskUsage();

    //If cpu data is empty or cpuUsage is emtpy - return immediatelly
    if (!exists(diskUsage)) return;

    //Assign diskUsage to value
    this._setValue(diskUsage, tickId);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = DiskUsageVariable;
