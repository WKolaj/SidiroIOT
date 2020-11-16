const Alert = require("./Alert");
const { joiSchema } = require("../../../models/Elements/Alerts/LowLimitAlert");
const { exists } = require("../../../utilities/utilities");

const defaultLowAlertTranslationObject = {
  pl: "Przekroczenie dolnej granicy alarmowej: $VALUE",
  en: "Low limit alert: $VALUE",
};

class LowLimitAlert extends Alert {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._lowAlertTurnOffValue = null;
    this._variableId = null;
    this._lowLimit = null;
    this._texts = null;
    this._severity = null;
    this._hysteresis = null;
    this._timeOnDelay = null;
    this._timeOffDelay = null;
    this._tickIdOfStartingOnTimeDelay = null;
    this._tickIdOfStartingOffTimeDelay = null;
    this._onDelayTimeStarted = null;
    this._offDelayTimeStarted = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description variableId of variable
   */
  get VariableID() {
    return this._variableId;
  }

  /**
   * @description Limit of alert
   */
  get LowLimit() {
    return this._lowLimit;
  }

  /**
   * @description translation texts
   */
  get Texts() {
    return this._texts;
  }

  /**
   * @description severity of alert
   */
  get Severity() {
    return this._severity;
  }

  /**
   * @description hysteresys to turn alert off
   */
  get Hysteresis() {
    return this._hysteresis;
  }

  /**
   * @description time delay of turning alert on
   */
  get TimeOnDelay() {
    return this._timeOnDelay;
  }

  /**
   * @description time delay of turning alert off
   */
  get TimeOffDelay() {
    return this._timeOffDelay;
  }

  //#endregion ========= PROPERTIES =========

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

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for starting on time delay
   * @param {Number} actualTickId actual tick id
   */
  _startOnTimeDelay(actualTickId) {
    this._tickIdOfStartingOnTimeDelay = actualTickId;
    this._onDelayTimeStarted = true;
  }

  /**
   * @description Method for stopping on time delay
   * @param {Number} actualTickId actual tick id
   */
  _stopOnTimeDelay(actualTickId) {
    this._tickIdOfStartingOnTimeDelay = null;
    this._onDelayTimeStarted = false;
  }

  /**
   * @description Method for starting off time delay
   * @param {Number} actualTickId actual tick id
   */
  _startOffTimeDelay(actualTickId) {
    this._tickIdOfStartingOffTimeDelay = actualTickId;
    this._offDelayTimeStarted = true;
  }

  /**
   * @description Method for stopping off time delay
   * @param {Number} actualTickId actual tick id
   */
  _stopOffTimeDelay(actualTickId) {
    this._tickIdOfStartingOffTimeDelay = null;
    this._offDelayTimeStarted = false;
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._variableId = payload.variableID;
    this._lowLimit = payload.lowLimit;
    this._texts = exists(payload.texts)
      ? payload.texts
      : defaultLowAlertTranslationObject;
    this._severity = payload.severity;
    this._hysteresis = payload.hysteresis;
    this._timeOnDelay = payload.timeOnDelay;
    this._timeOffDelay = payload.timeOffDelay;

    //calculating real limit to turn alert off\
    this._lowAlertTurnOffValue =
      this.LowLimit + Math.abs((this.LowLimit * this.Hysteresis) / 100);

    //Initializing other flags
    this._value = null;
    this._tickIdOfStartingOnTimeDelay = null;
    this._tickIdOfStartingOffTimeDelay = null;
    this._onDelayTimeStarted = false;
    this._offDelayTimeStarted = false;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.variableID = this.VariableID;
    superPayload.lowLimit = this.LowLimit;
    superPayload.texts = this.Texts;
    superPayload.severity = this.Severity;
    superPayload.hysteresis = this.Hysteresis;
    superPayload.timeOnDelay = this.TimeOnDelay;
    superPayload.timeOffDelay = this.TimeOffDelay;

    return superPayload;
  }

  /**
   * @description Method called every tick that suits sampleTime. Does nothing - connectable variables are refreshed via requests
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //Getting variable from device
    let variable = this._device.Variables[this.VariableID];

    //if variable does not exist - checking calcElement
    if (!exists(variable)) {
      variable = this._device.CalcElements[this.VariableID];

      //If variable and calcElement does not exist - return;
      if (!exists(variable)) return;
    }

    //Getting value from variable
    let value = variable.Value;

    //returning if value is not a number
    if (!isFinite(value)) return;

    //Checking lastTickId - LAST TICK ID IS THE BASE FOR ANY CALCULATION
    let lastTickId = variable.LastValueTick;
    if (!lastTickId) return;

    if (this.AlertActive) {
      if (value >= this._lowAlertTurnOffValue) {
        //Start time off delay if not started
        if (!this._offDelayTimeStarted) this._startOffTimeDelay(lastTickId);

        //Calculating time from starting time off delay - even right after starting it - in case it is set to 0
        let timeDelta = lastTickId - this._tickIdOfStartingOffTimeDelay;

        //If time off delay elapsed
        if (timeDelta >= this.TimeOffDelay) {
          //stopping off time delay if active
          if (this._offDelayTimeStarted) this._stopOffTimeDelay(lastTickId);

          //deactivating alert
          this._deactivateAlert();

          //setting value
          this.setValue(null, lastTickId);
        }
      } else {
        //Stop time off delay if started
        if (this._offDelayTimeStarted) this._stopOffTimeDelay(lastTickId);
      }
    } else {
      if (value < this.LowLimit) {
        //Start time on delay if not started
        if (!this._onDelayTimeStarted) this._startOnTimeDelay(lastTickId);

        //Calculating time from starting time on delay - even right after starting it - in case it is set to 0
        let timeDelta = lastTickId - this._tickIdOfStartingOnTimeDelay;

        //If time on delay elapsed
        if (timeDelta >= this.TimeOnDelay) {
          //stopping on time delay if active
          if (this._onDelayTimeStarted) this._stopOnTimeDelay(lastTickId);

          //activating alert
          this._activateAlert();

          //setting value
          let alertContent = Alert.formatAlertTranslationObject(
            this.Texts,
            value,
            lastTickId
          );
          this.setValue(alertContent, lastTickId);
        }
      } else {
        //Stop time on delay if started
        if (this._onDelayTimeStarted) this._stopOnTimeDelay(lastTickId);
      }
    }
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "LowLimitAlert value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = LowLimitAlert;

//TODO - test this class
