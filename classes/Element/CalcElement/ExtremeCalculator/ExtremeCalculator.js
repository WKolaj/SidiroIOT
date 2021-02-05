const Joi = require("joi");
const { isNumber } = require("lodash");
const { exists } = require("../../../../utilities/utilities");
const CalcElement = require("../CalcElement");
const {
  joiSchema,
} = require("../../../../models/Elements/CalcElements/ExtremeCalculator/ExtremeCalculator");

class ExtremeCalculator extends CalcElement {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._variableId = null;
    this._calculationInterval = null;
    this._refreshedFirstTime = null;
    this._beginIntervalTick = null;
    this._endIntervalTick = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description
   */
  get VariableID() {
    return this._variableId;
  }

  /**
   * @description interval of to calculate max value from
   */
  get CalculationInterval() {
    return this._calculationInterval;
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
   * @description Method invoked during first refresh
   * @param {Number} tickId actual tick id
   * @param {variableValue} number Value of associated variable
   */
  _refreshFirstTime(tickId, variableValue) {
    //Calculating begin and end tick intervals
    this._beginIntervalTick = this._calculateIntervalBeginTick(tickId);
    this._endIntervalTick = this._calculateIntervalEndTick(tickId);

    //Initializing value of extreme
    this.setValue(variableValue, tickId);
  }

  /**
   * @description Method checking if new interval should start and actual one should be closed
   * @param {Number} tickId
   */
  _shouldStartNewInterval(tickId) {
    //Returning true if tick id is outside actual interval
    return tickId >= this._endIntervalTick;
  }

  /**
   * @description Method checking if new interval should start and actual one should be closed
   * @param {Number} tickId actual tick id
   * @param {Number} value actual value
   */
  _startNewCalculationInterval(tickId, value) {
    let newBeginInterval = this._calculateIntervalBeginTick(tickId);
    let newEndInterval = this._calculateIntervalEndTick(tickId);

    //Initializing value of extreme for new period
    this.setValue(value, tickId);

    this._beginIntervalTick = newBeginInterval;
    this._endIntervalTick = newEndInterval;
  }

  /**
   * @description Method for calculating the begin tick of interval
   * @param {Number} tickId actual tick id
   */
  _calculateIntervalBeginTick(tickId) {
    return tickId - (tickId % this.CalculationInterval);
  }

  /**
   * @description Method for calculating the end tick of interval
   * @param {Number} tickId actual tick id
   */
  _calculateIntervalEndTick(tickId) {
    return (
      tickId - (tickId % this.CalculationInterval) + this.CalculationInterval
    );
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= ABSTRACT PROTECTED METHODS =========

  /**
   * @description Method for checking if new value is an extreme or not. METHOD MUST BE IMPLEMENTED IN CHILD CLASSES
   * @param {Number} newValue actual value of associated variable
   */
  _checkIfValueIsExtreme(newValue) {}

  //#endregion ========= ABSTRACT PROTECTED METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._refreshedFirstTime = false;
    this._calculationStarted = false;
    this._variableId = payload.variableID;
    this._calculationInterval = payload.calculationInterval;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.calculationInterval = this.CalculationInterval;
    superPayload.variableID = this.VariableID;

    return superPayload;
  }

  /**
   * @description Method called every tick that suits sampleTime. Does nothing - connectable variables are refreshed via requests
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //Getting variable from device
    let variable = this._device.Variables[this.VariableID];

    //returning if value does not exist
    if (!exists(variable)) return;

    //Getting value from variable
    let value = variable.Value;

    //returning if value is not a number
    if (!isNumber(value)) return;

    //Checking lastTickId - LAST TICK ID IS THE BASE FOR ANY CALCULATION
    let lastTickId = variable.LastValueTick;
    if (!lastTickId) return;

    if (!this._refreshedFirstTime) {
      //checking if increase calculator has been invoked first time
      this._refreshFirstTime(lastTickId, value);
      this._refreshedFirstTime = true;
    } else if (this._shouldStartNewInterval(lastTickId)) {
      this._startNewCalculationInterval(lastTickId, value);
    }

    //Checking if new value is an extreme
    if (this._checkIfValueIsExtreme(value)) {
      //setting new value as an extreme
      this.setValue(value, lastTickId);
    }
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "ExtremeCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = ExtremeCalculator;
