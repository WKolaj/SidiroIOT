const Alert = require("./Alert");
const {
  joiSchema,
} = require("../../../models/Elements/Alerts/ExactValuesAlert");
const { exists } = require("../../../utilities/utilities");

const defaultTranslationObject = {
  pl: "Osiągnięcie wartości: $VALUE",
  en: "Achieving value: $VALUE",
};

class ExactValuesAlert extends Alert {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._variableId = null;
    this._activeAlertID = null;
    this._texts = null;
    this._severity = null;
    this._timeOnDelay = null;
    this._timeOffDelay = null;
    this._tickIdOfStartingOnTimeDelay = null;
    this._tickIdOfStartingOffTimeDelay = null;
    this._onDelayTimeStarted = null;
    this._offDelayTimeStarted = null;
    this._alertValues = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description values of alert
   */
  get AlertValues() {
    return this._alertValues;
  }

  /**
   * @description variableId of variable
   */
  get VariableID() {
    return this._variableId;
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

  /**
   * @description ID of active alert - null if no alert is active
   */
  get ActiveAlertID() {
    return this._activeAlertID;
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
   * @description Method for activating given alert state
   * @param {Number} alertID alert id to set - can be null if alert should be deactivated
   */
  _activateAlertID(alertID) {
    this._activeAlertID = alertID;
  }

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
    this._alertValues = payload.alertValues;
    this._texts = exists(payload.texts)
      ? payload.texts
      : this._createDefaultTexts(this.AlertValues);
    this._severity = payload.severity;
    this._timeOnDelay = payload.timeOnDelay;
    this._timeOffDelay = payload.timeOffDelay;

    //Initializing other flags
    this._value = null;
    this._activeAlertID = null;
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
    superPayload.texts = this.Texts;
    superPayload.severity = this.Severity;
    superPayload.timeOnDelay = this.TimeOnDelay;
    superPayload.timeOffDelay = this.TimeOffDelay;
    superPayload.alertValues = this.AlertValues;

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

    //Checking if actve alert id is not null - in given state
    if (this.ActiveAlertID !== null) {
      //Checking if actual value is equal to alertID
      if (value !== this.ActiveAlertID) {
        //turning alert off
        //Start time off delay if not started
        if (!this._offDelayTimeStarted) this._startOffTimeDelay(lastTickId);

        //Calculating time from starting time off delay - even right after starting it - in case it is set to 0
        let timeDelta = lastTickId - this._tickIdOfStartingOffTimeDelay;

        //If time off delay elapsed
        if (timeDelta >= this.TimeOffDelay) {
          //stopping off time delay if active
          if (this._offDelayTimeStarted) this._stopOffTimeDelay(lastTickId);

          //deactivating alert
          this._activateAlertID(null);

          //setting value
          this.setValue(null, lastTickId);
        }
      } else {
        //turning off off delay - if active
        if (this._offDelayTimeStarted) this._stopOffTimeDelay(lastTickId);
      }
    }

    //Checking again if active alert id is not null - state to null can be set previously, and should be checked - for time delay is 0
    if (this.ActiveAlertID === null) {
      if (this.AlertValues.includes(value)) {
        //Start time on delay if not started
        if (!this._onDelayTimeStarted) this._startOnTimeDelay(lastTickId);

        //Calculating time from starting time on delay - even right after starting it - in case it is set to 0
        let timeDelta = lastTickId - this._tickIdOfStartingOnTimeDelay;

        //If time on delay elapsed
        if (timeDelta >= this.TimeOnDelay) {
          //stopping on time delay if active
          if (this._onDelayTimeStarted) this._stopOnTimeDelay(lastTickId);

          //activating alert
          this._activateAlertID(value);

          //setting value
          let alertContent = Alert.formatAlertTranslationObject(
            this.Texts[value],
            value,
            lastTickId,
            this._device.Name,
            this.Name
          );
          this.setValue(alertContent, lastTickId);
        }
      } else {
        //turning off on delay if active
        if (this._onDelayTimeStarted) this._stopOnTimeDelay(lastTickId);
      }
    }
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "ExactValuesAlert value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for getting alert active state. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _getAlertActiveState() {
    return this.ActiveAlertID !== null;
  }

  /**
   * @description Method for activating alert state. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _activateAlert() {}

  /**
   * @description Method for deactivating alert state. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _deactivateAlert() {}

  /**
   * @description Method for creating default texts for generating values
   * @param {Array} alertValues all values
   */
  _createDefaultTexts(alertValues) {
    let objectToReturn = {};

    for (let alertValue of alertValues) {
      objectToReturn[alertValue] = { ...defaultTranslationObject };
    }

    return objectToReturn;
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = ExactValuesAlert;
