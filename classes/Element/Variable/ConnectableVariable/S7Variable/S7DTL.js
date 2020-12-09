const S7Variable = require("./S7Variable");
const {
  checkUnixInt,
} = require("../../../../../models/Elements/ElementsValues/UnixInt");
const {
  joiSchema,
} = require("../../../../../models/Elements/Variable/S7Variable/S7DTL");

class S7DTL extends S7Variable {
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
   * @description Method for converting data (byte array) to value of variable.
   * @param {Array} data
   */
  _convertDataToValue(data) {
    //Reading year
    var buf = new ArrayBuffer(2);
    var view = new DataView(buf);
    view.setUint8(0, data[0]);
    view.setUint8(1, data[1]);
    let year = view.getUint16(0);

    //Reading month
    buf = new ArrayBuffer(1);
    view = new DataView(buf);
    view.setUint8(0, data[2]);
    let month = view.getUint8(0);

    //Converting month to JS format (0-January, 11-December)
    //Month 0 is should not be set to -1
    month > 0 ? month-- : month;

    //Reading day
    buf = new ArrayBuffer(1);
    view = new DataView(buf);
    view.setUint8(0, data[3]);
    let day = view.getUint8(0);

    //Reading hour
    buf = new ArrayBuffer(1);
    view = new DataView(buf);
    view.setUint8(0, data[5]);
    let hour = view.getUint8(0);

    //Reading minute
    buf = new ArrayBuffer(1);
    view = new DataView(buf);
    view.setUint8(0, data[6]);
    let minute = view.getUint8(0);

    //Reading second
    buf = new ArrayBuffer(1);
    view = new DataView(buf);
    view.setUint8(0, data[7]);
    let second = view.getUint8(0);

    //Reading nano
    buf = new ArrayBuffer(4);
    view = new DataView(buf);
    view.setUint8(0, data[8]);
    view.setUint8(1, data[9]);
    view.setUint8(2, data[10]);
    view.setUint8(3, data[11]);
    let miliseconds = Math.round(view.getUint32(0) / 1000000);

    let date = Date.UTC(year, month, day, hour, minute, second, miliseconds);

    return date;
  }

  /**
   * @description Method for converting value to data (byte array) of variable.
   * @param {Number} value
   */
  _convertValueToData(value) {
    let unixTime = new Date(value);

    let year = unixTime.getUTCFullYear();
    let month = unixTime.getUTCMonth();
    //Converting month from JS format to DTL format
    month++;
    let day = unixTime.getUTCDate();
    //In JS day of week is stored starting from 0 but in SIMATIC from 1
    let dayNumber = unixTime.getUTCDay() + 1;
    let hour = unixTime.getUTCHours();
    let minute = unixTime.getUTCMinutes();
    let second = unixTime.getUTCSeconds();
    let milisecond = unixTime.getUTCMilliseconds();

    //Setting years
    let yearArray = new Uint16Array(1);
    yearArray[0] = year;
    let yearBytes = new Uint8Array(yearArray.buffer);

    //Setting month
    let monthArray = new Uint8Array(1);
    monthArray[0] = month;
    let monthBytes = new Uint8Array(monthArray.buffer);

    //Setting day
    let dayArray = new Uint8Array(1);
    dayArray[0] = day;
    let dayBytes = new Uint8Array(dayArray.buffer);

    //Setting dayNumber
    let dayNumberArray = new Uint8Array(1);
    dayNumberArray[0] = dayNumber;
    let dayNumberBytes = new Uint8Array(dayNumberArray.buffer);

    //Setting hour
    let hourArray = new Uint8Array(1);
    hourArray[0] = hour;
    let hourBytes = new Uint8Array(hourArray.buffer);

    //Setting minute
    let minuteArray = new Uint8Array(1);
    minuteArray[0] = minute;
    let minuteBytes = new Uint8Array(minuteArray.buffer);

    //Setting second
    let secondArray = new Uint8Array(1);
    secondArray[0] = second;
    let secondBytes = new Uint8Array(secondArray.buffer);

    //Setting nanoseconds
    let nanosecondsArray = new Uint32Array(1);
    nanosecondsArray[0] = milisecond * 1000 * 1000;
    let nanosecondBytes = new Uint8Array(nanosecondsArray.buffer);

    return [
      yearBytes[1],
      yearBytes[0],
      monthBytes[0],
      dayBytes[0],
      dayNumberBytes[0],
      hourBytes[0],
      minuteBytes[0],
      secondBytes[0],
      nanosecondBytes[3],
      nanosecondBytes[2],
      nanosecondBytes[1],
      nanosecondBytes[0],
    ];
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    if (payload.type !== "S7DTL")
      throw new Error("Invalid type in payload of S7DTL");
    if (payload.length !== 12)
      throw new Error("Invalid length in payload of S7DTL");

    await super.init(payload);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return checkUnixInt(value);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = S7DTL;
