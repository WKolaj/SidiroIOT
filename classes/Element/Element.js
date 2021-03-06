const Sampler = require("../Sampler/Sampler");
const Joi = require("joi");
const { exists } = require("../../utilities/utilities");

class Element {
  //#region ========= CONSTRUCTOR =========

  /**
   * @description Class representing element
   * @param {Object} project project associated with element
   * @param {Object} device device associated with variable
   */
  constructor(project, device) {
    this._project = project;
    this._device = device;
    this._id = null;
    this._name = null;
    this._type = null;
    this._value = null;
    this._defaultValue = null;
    this._lastValueTick = null;
    this._sampleTime = null;
    this._unit = null;
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
    return this._getValue();
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
    this._sampleTime = payload.sampleTime;
    this._unit = payload.unit;

    //Setting default value of element - by default tickId is 0
    this.setValue(this.DefaultValue, 0);
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

  /**
   * @description Method called every tick that suits sampleTime. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {}

  //#endregion ========= PUBLIC METHODS =========

  //#region ========= PRIVATE VIRTUAL METHODS =========

  /**
   * @description Virtual method for getting value. By default value is stored in _value field. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _getValue() {
    return this._value;
  }

  /**
   * @description Virtual method for setting new value. By default value is stored in _value field. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Object} value value to set
   * @param {Number} tickId actual tickid
   */
  _setValue(value, tickId) {
    this._value = value;
    this._lastValueTick = tickId;
  }

  /**
   * @description Method for generating payload of element. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  generatePayload() {
    let deviceId = exists(this._device) ? this._device.ID : null;

    return {
      id: this.ID,
      name: this.Name,
      type: this.Type,
      value: this.Value,
      defaultValue: this.DefaultValue,
      unit: this.Unit,
      sampleTime: this.SampleTime,
      lastValueTick: this.LastValueTick,
      deviceId: deviceId,
    };
  }

  //#endregion ========= PRIVATE VIRTUAL METHODS =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========
}

module.exports = Element;
