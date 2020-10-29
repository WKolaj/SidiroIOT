const Sampler = require("../Sampler/Sampler");

class Element {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._id = null;
    this._name = null;
    this._type = null;
    this._value = null;
    this._defaultValue = null;
    this._lastValueTick = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description ID of element
   */
  get ID() {
    return this._id;
  }

  /**
   * @description Name of element
   */
  get Name() {
    return this._name;
  }

  /**
   * @description Description of element
   */
  get Type() {
    return this._type;
  }

  /**
   * @description Value of element
   */
  get Value() {
    return this._value;
  }

  /**
   * @description Default value of element
   */
  get DefaultValue() {
    return this._defaultValue;
  }

  /**
   * @description Unit of element
   */
  get Unit() {
    return this._unit;
  }

  /**
   * @description Sample time of element
   */
  get SampleTime() {
    return this._sampleTime;
  }

  /**
   * @description Time when last time value was set - 0 by default with default value
   */
  get LastValueTick() {
    return this._lastValueTick;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    this._id = payload.id;
    this._name = payload.name;
    this._type = payload.type;
    this._defaultValue = payload.defaultValue;

    //Setting default value of element - by default tickId is 0
    this.Value = this.setValue(this.DefaultValue, 0);
  }

  /**
   * @description Method for setting value of Value - to ensure setting it with tickId
   * @param {Object} newValue new value to be set
   * @param {Number} tickId actual tickId
   */
  setValue(newValue, tickId) {
    this._setValue(newValue, tickId);
  }

  /**
   * @description Method for checking if element should be refreshed for given tickID
   * @param {Number} tickNumber tick number
   */
  checkIfShouldBeRefreshed(tickNumber) {
    return Sampler.doesSampleTimeMatchesTick(tickNumber, this.SampleTime);
  }

  //#endregion ========= PUBLIC METHODS =========

  //#region ========= PRIVATE ABSTRACT METHODS =========

  /**
   * @description Abstract method for getting value. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getValue() {
    return this._value;
  }

  /**
   * @description Abstract method for setting new value. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Object} value value to set
   * @param {Number} tickId actual tickid
   */
  _setValue(value, tickId) {
    this._value = value;
    this._lastValueTick = tickId;
  }

  //#endregion ========= PRIVATE ABSTRACT METHODS =========
}

module.exports = Element;

//TODO - add tests for element
