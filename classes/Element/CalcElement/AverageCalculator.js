const Joi = require("joi");
const { isNumber } = require("lodash");
const { exists } = require("../../../utilities/utilities");
const CalcElement = require("./CalcElement");

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("AverageCalculator").required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  defaultValue: Joi.number().required(),
  variableID: Joi.string().min(1).required(),
  factor: Joi.number().required(),
  calculationInterval: Joi.number().integer().min(1).required(),
});

class AverageCalculator extends CalcElement {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._factor = null;
    this._variableId = null;
    this._calculationInterval = null;
    this._valuesAndTicks = null;
    this._refreshedFirstTime = null;
    this._beginIntervalTick = null;
    this._endIntervalTick = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description
   */
  get Factor() {
    return this._factor;
  }

  /**
   * @description
   */
  get VariableID() {
    return this._variableId;
  }

  /**
   * @description variable id to calculate increase
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
   */
  _refreshFirstTime(tickId) {
    //Calculating begin and end tick intervals
    this._beginIntervalTick = this._calculateIntervalBeginTick(tickId);
    this._endIntervalTick = this._calculateIntervalEndTick(tickId);

    //Initializing values and ticks
    this._valuesAndTicks = {};
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

    //calculating and setting new average
    let average = this._calculateAverage(tickId, value);
    this.setValue(average, this._endIntervalTick);

    this._beginIntervalTick = newBeginInterval;
    this._endIntervalTick = newEndInterval;

    //Resetting values and ticks
    this._valuesAndTicks = {};
  }

  /**
   * @description Method for calculating average
   * @param {Number} tickId actual tick id
   * @param {Number} value value at the end of period
   */
  _calculateAverage(tickId, actualValue) {
    //Getting all ticks sorted from the smallest to the largest
    let allTicks = Object.keys(this._valuesAndTicks).sort((a, b) => a - b);
    if (allTicks.length === 0) {
      return actualValue;
    }

    let valueSum = 0;
    let tickSum = 0;

    for (let i = 0; i < allTicks.length; i++) {
      let tick = allTicks[i];
      let value = this._valuesAndTicks[tick];

      let tickDelta = 0;
      //value for first tick - calculating detla as difference between begin interval and actual tickValue
      if (i === 0) tickDelta = tick - this._beginIntervalTick;
      else tickDelta = allTicks[i] - allTicks[i - 1];

      valueSum += value * this.Factor * tickDelta;
      tickSum += tickDelta;
    }

    //calculating last fragment to add;
    let value = actualValue;
    let tickDelta = this._endIntervalTick - allTicks[allTicks.length - 1];

    valueSum += value * this.Factor * tickDelta;
    tickSum += tickDelta;

    return valueSum / tickSum;
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

  /**
   * @description method for adding new value to _valuesAndTicks
   * @param {Number} tickId tickId to be set
   * @param {Number} value value to be set
   */
  _registerNewValue(tickId, value) {
    this._valuesAndTicks[tickId] = value;
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._refreshedFirstTime = false;
    this._calculationStarted = false;
    this._factor = payload.factor;
    this._variableId = payload.variableID;
    this._calculationInterval = payload.calculationInterval;
    this._valuesAndTicks = {};
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.calculationInterval = this.CalculationInterval;
    superPayload.factor = this.Factor;
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

    //checking if increase calculator has been invoked first time
    if (!this._refreshedFirstTime) {
      this._refreshFirstTime(tickId);
      this._refreshedFirstTime = true;
    } else if (this._shouldStartNewInterval(tickId)) {
      this._startNewCalculationInterval(tickId, value);
    }

    //Assigning new value to valuesAndTicks
    this._registerNewValue(tickId, value);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "AverageCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = AverageCalculator;
