const ProtocolRequest = require("./ProtocolRequest");

class StandardProtocolRequest extends ProtocolRequest {
  //#region========= CONSTRUCTOR =========

  constructor(variables, sampleTime) {
    super(variables, sampleTime);
  }

  //#endregion========= CONSTRUCTOR =========

  //#region========= OVERRIDE PUBLIC METHODS =========

  /**
   * @@description Method for writing data retrieved from request to variables.
   * @param {Array} data data to write to variables
   */
  async writeDataToVariableValues(data) {
    let currentOffset = 0;

    //rewriting all byte from data into data of variables - based on their offsets and lengths
    for (let i in this.Variables) {
      let variable = this.Variables[i];

      let nextOffset = currentOffset + variable.Length;

      variable.Data = data.slice(currentOffset, nextOffset);
      currentOffset = nextOffset;
    }
  }

  //#endregion========= OVERRIDE PUBLIC METHODS =========
}

module.exports = StandardProtocolRequest;

//TODO - test standard protocol request
