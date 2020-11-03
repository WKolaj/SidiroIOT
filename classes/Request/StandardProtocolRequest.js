const { values } = require("lodash");
const ProtocolRequest = require("./ProtocolRequest");

class StandardProtocolRequest extends ProtocolRequest {
  //#region========= CONSTRUCTOR =========

  constructor(variables, sampleTime, writeRequest) {
    super(variables, sampleTime, writeRequest);

    //#region calculating total length and checking variables
    this._length = 0;
    this._offset = 0;

    //ordering variables based on their offsets
    let orderedVariables = this.Variables.sort((a, b) => a.Offset - b.Offset);

    let beginOffset = 0;
    let actualOffset = 0;

    for (let index = 0; index < orderedVariables.length; index++) {
      let variable = orderedVariables[index];

      //#region Check variable

      if (variable.SampleTime !== sampleTime) {
        throw new Error(
          "Trying to assign variable with different sample time to one request!"
        );
      }

      if (writeRequest && !variable.Write)
        throw new Error(
          "Trying to assign non write variable to write request!"
        );

      if (!writeRequest && !variable.Read)
        throw new Error("Trying to assign non read variable to read request!");

      if (
        writeRequest &&
        variable.WriteSeperately &&
        orderedVariables.length > 1
      )
        throw new Error(
          "Trying to assign writeSeperately variable to request with other variables!"
        );

      if (
        !writeRequest &&
        variable.ReadSeperately &&
        orderedVariables.length > 1
      )
        throw new Error(
          "Trying to assign readSeperately variable to request with other variables!"
        );

      //#endregion Check variable

      if (index === 0) {
        beginOffset = variable.Offset;
        actualOffset = variable.Offset + variable.Length;
      } else {
        if (actualOffset < variable.Offset)
          throw new Error(
            "There is a gap between variables in protocol request"
          );

        //if actualOffset is longer than variable length + actualVariableOffset (overlapped shorter variable inside longer one)
        let newOffset = variable.Offset + variable.Length;
        if (newOffset > actualOffset) actualOffset = newOffset;
      }
    }

    this._length = actualOffset - beginOffset;
    this._offset = beginOffset;

    //#endregion calculating total length and checking variables
  }

  //#endregion========= CONSTRUCTOR =========

  //#region========= PROPERTIES =========

  /**
   * @description Offset of protocol request (in bytes)
   */
  get Offset() {
    return this._offset;
  }

  /**
   * @description Total length of all variables in request (in bytes)
   */
  get Length() {
    return this._length;
  }

  //#endregion========= PROPERTIES =========

  //#region PUBLIC METHODS

  /**
   * @description Method for gathering all data from all variables
   */
  getTotalData() {
    //TODO - test this method!
    let dataToReturn = [];

    //Filling all data of variables with 0
    for (let index = 0; index < this.Length; index++) {
      dataToReturn.push(0);
    }

    //Filling data from variables based on their offset and data content
    for (let index = 0; index < this.Variables.length; index++) {
      {
        let variable = this.Variables[index];
        let beginIndex = variable.Offset - this.Offset;
        let endIndex = variable.Offset + variable.Length - this.Offset;

        let data = variable.Data;
        for (let index = beginIndex; index < endIndex; index++) {
          dataToReturn[index] = data[index - beginIndex];
        }
      }
    }

    return dataToReturn;
  }

  //#endregion PUBLIC METHODS

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @@description Method for writing data retrieved from request to variables.
   * @param {Array} data data to write to variables
   * @param {Number} tickId actual tickId
   */
  async writeDataToVariableValues(data, tickId) {
    //HAS TO CHECK ONLY IF LENGTH IS NOT LESSER - SOME FUNCTIONS LIKE 2 RETURNS DATA OF WHOLE BYTE!
    if (data.length < this.Length)
      throw new Error("Length of data is lesser then length of request");

    let currentOffset = 0;

    //rewriting all byte from data into data of variables - based on their offsets and lengths
    for (let variable of this.Variables) {
      let nextOffset = currentOffset + variable.Length;

      variable.setData(data.slice(currentOffset, nextOffset), tickId);
      currentOffset = nextOffset;
    }
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = StandardProtocolRequest;
