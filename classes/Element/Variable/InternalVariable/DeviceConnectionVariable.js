const InternalVariable = require("./InternalVariable");
const {
  joiSchema,
} = require("../../../../models/Elements/Variable/InternalVariable/DeviceConnectionVariable");
const { exists } = require("../../../../utilities/utilities");

class DeviceConnectionVariable extends InternalVariable {
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
    return "DeviceConnectionVariable value is readonly";
  }

  /**
   * @description Method called every tick that suits sampleTime.
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //If device is not present - return
    if (!exists(this._device)) return;

    //If device has no IsConnected flag - return
    if (!exists(this._device.IsConnected)) return;

    let convertedValue = this._device.IsConnected ? 1 : 0;

    this._setValue(convertedValue, tickId);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = DeviceConnectionVariable;
