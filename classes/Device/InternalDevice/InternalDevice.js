const Device = require("../Device");
const { joiSchema } = require("../../../models/Device/InternalDevice");

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
}

module.exports = InternalDevice;

//TODO - test this class
