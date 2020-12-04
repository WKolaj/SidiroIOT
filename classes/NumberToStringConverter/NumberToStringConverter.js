const { isBoolean, isNumber, isString, isObject } = require("lodash");
const { exists } = require("../../utilities/utilities");

class NumberToStringConverter {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._conversionType = null;
    this._precision = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Type of coversion - precision/fixed
   */
  get ConversionType() {
    return this._conversionType;
  }

  /**
   * @description Value of precision - number of signs to use
   */
  get Precision() {
    return this._precision;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHOD =========

  /**
   * @description Method for initializing converter
   * @param {JSON} payload Payload to initialize.
   */
  init(payload) {
    this._conversionType = payload.conversionType;
    this._precision = payload.precision;
  }

  /**
   * @description Method for converting value. Returns value if it is null or not a number
   * @param {Object} value value to convert.
   */
  convertValue(value) {
    if (!exists(value)) return null;

    if (isNumber(value)) {
      switch (this.ConversionType) {
        case "precision": {
          return value.toPrecision(this.Precision);
        }
        case "fixed": {
          return value.toFixed(this.Precision);
        }
        default: {
          //In any different case - return value
          return value.toString();
        }
      }
    }

    if (isBoolean(value)) return value.toString();
    if (isString(value)) return value;

    //Value is not a number, boolean or string - stringify it as JSON
    return JSON.stringify(value);
  }

  /**
   * @description Method for generting payload of converter
   */
  generatePayload() {
    return {
      conversionType: this.ConversionType,
      precision: this.Precision,
    };
  }

  //#endregion ========= PUBLIC METHOD =========
}

module.exports = NumberToStringConverter;
