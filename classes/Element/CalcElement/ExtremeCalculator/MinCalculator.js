const Joi = require("joi");
const ExtremeCalculator = require("./ExtremeCalculator");
const {
  joiSchema,
} = require("../../../../models/Elements/CalcElements/ExtremeCalculator/MinCalculator");

class MinCalculator extends ExtremeCalculator {
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

  //#region ========= OVERRIDE PROTECTED METHODS =========

  /**
   * @description Method for checking if new value is an extreme or not. In case of min value - checking if new value is smaller than actual one
   * @param {Number} newValue actual value of associated variable
   */
  _checkIfValueIsExtreme(newValue) {
    return newValue < this.Value;
  }

  //#endregion ========= OVERRIDE PROTECTED METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "MinCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = MinCalculator;
