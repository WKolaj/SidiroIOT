const MBDevice = require("./MBDevice");

const { joiSchema } = require("../../../models/Device/MBGatewayDevice");
const MBGatewayDriver = require("../../Driver/MBGatewayDriver");

class MBGatewayDevice extends MBDevice {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);

    //Gateway has the same functionality as MBDevice but with _continueIfRequestThrows set to true

    this._continueIfRequestThrows = true;
    this._driver = new MBGatewayDriver();
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
}

module.exports = MBGatewayDevice;
