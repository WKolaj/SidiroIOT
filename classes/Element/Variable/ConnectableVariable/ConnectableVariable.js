const Joi = require("joi");
const Variable = require("../Variable");

class ConnectableVariable extends Variable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._data = null;
    this._read = null;
    this._write = null;
    this._readSeperately = null;
    this._writeSeperately = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Value represented as byte array
   */
  get Data() {
    return this._data;
  }

  /**
   * @description Is Variable used for getting data from physical device
   */
  get Read() {
    return this._read;
  }

  /**
   * @description Is Variable used for setting data to physical device
   */
  get Write() {
    return this._write;
  }

  /**
   * @description Should variable be processed seperately (in seperate request) when read from physical device
   */
  get ReadSeperately() {
    return this._readSeperately;
  }

  /**
   * @description Should variable be processed seperately (in seperate request) when write to physical device
   */
  get WriteSeperately() {
    return this._writeSeperately;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for setting new data - in order to ensure that new data cannot be set without setting new tickId
   * @param {Array} newData new data
   * @param {Number} tickId actual tickId
   */
  setData(newData, tickId) {
    this._data = newData;
    this._lastValueTick = tickId;
  }

  //#endregion ========= PUBLIC METHODS =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for converting data (byte array) to value of variable. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Array} data
   */
  _convertDataToValue(data) {}

  /**
   * @description Method for converting value to data (byte array) of variable. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Array} data
   */
  _convertValueToData(value) {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._read = payload.read;
    this._write = payload.write;
    this._readSeperately = payload.readAsSingle;
    this._writeSeperately = payload.writeAsSingle;
  }

  /**
   * @description Method for generating payload of element. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.read = this.Read;
    superPayload.write = this.Write;
    superPayload.readAsSingle = this.ReadSeperately;
    superPayload.writeAsSingle = this.WriteSeperately;

    return superPayload;
  }

  /**
   * @description Method called every tick that suits sampleTime. Does nothing - connectable variables are refreshed via requests
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {}

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Abstract method for getting value.
   */
  _getValue() {
    return this._convertDataToValue(this.Data);
  }

  /**
   * @description Abstract method for setting new value.
   * @param {Object} value value to set
   * @param {Number} tickId actual tickid
   */
  _setValue(value, tickId) {
    this._data = this._convertValueToData(value);
    this._lastValueTick = tickId;
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = ConnectableVariable;
