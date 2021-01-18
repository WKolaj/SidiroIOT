const { exists } = require("../../../utilities/utilities");
const Sampler = require("../../Sampler/Sampler");
const Element = require("../Element");

class Alert extends Element {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._alertActive = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Is alert in active state
   */
  get AlertActive() {
    return this._getAlertActiveState();
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for converting value to display in alert text
   * @param {Object} value Value to convert to string
   */
  static formatValueToDisplay(value) {
    if (!exists(value)) return "";
    if (typeof value === "number") {
      if (Number.isInteger(value)) return value.toString();
      else return value.toFixed(3);
    }

    return value.toString();
  }

  /**
   * @description Method for fromatting alert text - replacing $VALUE with real value and $TIME with real time formatted to data
   * @param {String} text
   * @param {Object} value
   * @param {Number} tickId
   * @param {String} deviceName
   * @param {String} elementName
   */
  static formatAlertText(text, value, tickId, deviceName, elementName) {
    return text
      .replace("$VALUE", Alert.formatValueToDisplay(value))
      .replace(
        "$TIME",
        new Date(Sampler.convertTickNumberToDate(tickId)).toISOString()
      )
      .replace("$DEVICE", deviceName)
      .replace("$ELEMENT", elementName);
  }

  /**
   * @description Method for fromatting alert translation object - replacing $VALUE with real value and $TIME with real time formatted to data
   * @param {Object} transObject
   * @param {Object} value
   * @param {Number} tickId
   * @param {String} deviceName
   * @param {String} elementName
   */
  static formatAlertTranslationObject(
    transObject,
    value,
    tickId,
    deviceName,
    elementName
  ) {
    let objectToReturn = {};

    for (let lang of Object.keys(transObject)) {
      let text = transObject[lang];
      objectToReturn[lang] = Alert.formatAlertText(
        text,
        value,
        tickId,
        deviceName,
        elementName
      );
    }

    return objectToReturn;
  }
  //#endregion  ========= PUBLIC STATIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._alertActive = false;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= PRIVATE VIRTUAL METHODS =========

  /**
   * @description Method for getting alert active state. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _getAlertActiveState() {
    return this._alertActive;
  }

  /**
   * @description Method for activating alert state. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _activateAlert() {
    this._alertActive = true;
  }

  /**
   * @description Method for deactivating alert state. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _deactivateAlert() {
    this._alertActive = false;
  }

  //#endregion ========= PRIVATE VIRTUAL METHODS =========
}

module.exports = Alert;
