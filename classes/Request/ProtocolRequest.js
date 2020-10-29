const Sampler = require("../Sampler/Sampler");

class ProtocolRequest {
  //#region========= CONSTRUCTOR =========

  /**
   * @description Class representing ProtocolRequest
   * @param {Array} variables Variables associated with request
   * @param {Number} sampleTime sampleTime of request
   * @param {Boolean} writeRequest is request used for writing data to physical device
   */
  constructor(variables, sampleTime, writeRequest) {
    this._variables = variables;
    this._sampleTime = sampleTime;
    this._writeRequest = writeRequest;
    this._readRequest = !writeRequest;
  }

  //#endregion========= CONSTRUCTOR =========

  //#region========= PUBLIC METHODS =========

  /**
   * @description Is request used for writing data to physical device
   */
  get WriteRequest() {
    return this._writeRequest;
  }

  /**
   * @description Is request used for reading data from physical device
   */
  get ReadRequest() {
    return this._readRequest;
  }

  /**
   * @description Variables associated with request
   */
  get Variables() {
    return this._variables;
  }

  /**
   * @description SampleTime of protocol request
   */
  get SampleTime() {
    return this._sampleTime;
  }

  //#endregion========= PUBLIC METHODS =========

  //#region========= PUBLIC METHODS =========

  /**
   * @description Check whether protocol request should be invoked in actual period
   * @param {Number} tickNumber actual tick number
   */
  checkIfShouldBeInvoked(tickNumber) {
    return Sampler.doesSampleTimeMatchesTick(tickNumber, this.SampleTime);
  }

  //#endregion ========= PUBLIC METHODS =========

  //#region========= PUBLIC ABSTRACT METHODS =========

  /**
   * @@description Method for writing data retrieved from request to variables. MUST BE OVERRIDDEN IN CHILD CLASSES!
   * @param {Array} data data to write to variables
   * @param {Number} tickId actual tickId
   */
  async writeDataToVariableValues(data, tickId) {}

  //#endregion========= PUBLIC ABSTRACT METHODS =========
}

module.exports = ProtocolRequest;
