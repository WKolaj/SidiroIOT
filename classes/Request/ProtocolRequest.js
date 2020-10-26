const Sampler = require("../Sampler/Sampler");

class ProtocolRequest {
  //#region========= CONSTRUCTOR =========

  constructor(variables, sampleTime) {
    this._variables = variables;
    this._sampleTime = sampleTime;
  }

  //#endregion========= CONSTRUCTOR =========

  //#region========= PUBLIC METHODS =========

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
   */
  async writeDataToVariableValues(data) {}

  //#endregion========= PUBLIC ABSTRACT METHODS =========
}

module.exports = ProtocolRequest;
