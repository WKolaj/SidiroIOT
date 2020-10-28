const ProtocolRequest = require("./ProtocolRequest");

class StandardProtocolRequest extends ProtocolRequest {
  //#region========= CONSTRUCTOR =========

  constructor(variables, sampleTime) {
    super(variables, sampleTime);

    //calculating total length
    this._length = 0;
    for (let variable of this.Variables) {
      this._length += variable.Length;
    }
  }

  //#endregion========= CONSTRUCTOR =========

  //#region========= PROPERTIES =========

  /**
   * @description Total length of all variables in request (in bytes)
   */
  get Length() {
    return this._length;
  }

  //#endregion========= PROPERTIES =========

  //#region========= OVERRIDE PUBLIC METHODS =========

  /**
   * @@description Method for writing data retrieved from request to variables.
   * @param {Array} data data to write to variables
   */
  async writeDataToVariableValues(data) {
    if (data.length != this.Length)
      throw new Error(
        "Length of data does not correspond to length of request"
      );

    let currentOffset = 0;

    //rewriting all byte from data into data of variables - based on their offsets and lengths
    for (let variable of this.Variables) {
      let nextOffset = currentOffset + variable.Length;

      variable.Data = data.slice(currentOffset, nextOffset);
      currentOffset = nextOffset;
    }
  }

  //#endregion========= OVERRIDE PUBLIC METHODS =========
}

module.exports = StandardProtocolRequest;
