const InternalVariable = require("./InternalVariable");
const {
  joiSchema,
} = require("../../../../models/Elements/Variable/InternalVariable/LastCycleDurationVariable");
const { exists } = require("../../../../utilities/utilities");

class LastCycleDurationVariable extends InternalVariable {
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
    return "LastCycleDurationVariable value is readonly";
  }

  /**
   * @description Method called every tick that suits sampleTime.
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //Getting cpu Data
    let lastCycleDuration = this._project.LastCycleDuration;

    //If lastCycleDuration is empty - return
    if (!exists(lastCycleDuration)) return;

    //Assign lastCycleReturn to value
    this._setValue(lastCycleDuration, tickId);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = LastCycleDurationVariable;
