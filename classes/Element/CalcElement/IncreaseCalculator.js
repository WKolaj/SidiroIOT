const CalcElement = require("./CalcElement");
const Joi = require("joi");
const { isNumber } = require("lodash");
const { exists } = require("../../../utilities/utilities");

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("IncreaseCalculator").required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  defaultValue: Joi.number().required(),
  variableID: Joi.string().min(1).required(),
  factor: Joi.number().required(),
  calculationInterval: Joi.number().integer().min(1).required(),
  overflow: Joi.number().min(0).allow(null).required(),
});

class IncreaseCalculator extends CalcElement {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._refreshedFirstTime = null;
    this._calculationStarted = null;
    this._beginIntervalTick = null;
    this._endIntervalTick = null;
    this._beginValue = null;
    this._variableId = null;
    this._factor = null;
    this._calculationInterval = null;
    this._overflow = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description factor of calculated increase
   */
  get Factor() {
    return this._factor;
  }

  /**
   * @description variable id to calculate increase
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

  /**
   * @description Overflow of counter. IF NULL OVERFLOW CALCULATION IS DISABLED
   */
  get Overflow() {
    return this._overflow;
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
    //Blocking calucation procedure - in order not to calculate increase again
    this._calculationStarted = false;

    //Calculating begin and end tick intervals
    this._beginIntervalTick = this._calculateIntervalBeginTick(tickId);
    this._endIntervalTick = this._calculateIntervalEndTick(tickId);
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

    //calculating and setting new increase only if calculation has started and previous interval is valid - there was no skip
    if (
      this._calculationStarted &&
      this._shouldIncreaseBeSet(newBeginInterval)
    ) {
      let increase = this._calculateIncrease(tickId, value);
      this.setValue(increase, this._endIntervalTick);
    }

    this._beginIntervalTick = newBeginInterval;
    this._endIntervalTick = newEndInterval;
    this._beginValue = value;

    //Setting calculation as started - interval is valid
    this._calculationStarted = true;
  }

  /**
   * @description Method for checking whether interval should be closed and increase value should be set - checking if beginTick of new interval is an end tick for actual interval. METHOD IMPLEMENTED IN ORDER TO AVOID CALCULATING INCREASE WHEN ONE INTERVAL IS MISSING (IN BETWEEN ACTUAL ONE AND NEW ONE)
   * @param {Number} newBeginTick begin tick of new interval
   */
  _shouldIncreaseBeSet(newBeginTick) {
    return this._endIntervalTick === newBeginTick;
  }

  /**
   * @description Method for calculating increase - including overflow. IF OVERFLOW IS NULL, CALCULATION OF VALUE USING IT IS DISABLED
   * @param {Number} tickId actual tick id
   */
  _calculateIncrease(tickId, endValue) {
    if (endValue >= this._beginValue) {
      //Valid increase - counter's value rised
      return this.Factor * (endValue - this._beginValue);
    } else {
      //Invalid increase - counter's value dropped
      if (exists(this.Overflow)) {
        //Calculating with overflow
        return this.Factor * (this.Overflow - this._beginValue + endValue);
      } else {
        //Calculating without overflow - return 0
        return 0;
      }
    }
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
    this._overflow = payload.overflow;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.overflow = this.Overflow;
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

    //Checking lastTickId - LAST TICK ID IS THE BASE FOR ANY CALCULATION
    let lastTickId = variable.LastValueTick;
    if (!lastTickId) return;

    //checking if increase calculator has been invoked first time
    if (!this._refreshedFirstTime) {
      this._refreshFirstTime(lastTickId);
      this._refreshedFirstTime = true;
    }

    //Acting (calculating new increase) only when starting new interval and ending last one
    if (this._shouldStartNewInterval(lastTickId)) {
      //Starting calculation interval
      this._startNewCalculationInterval(lastTickId, value);
    }
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "IncreaseCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = IncreaseCalculator;
