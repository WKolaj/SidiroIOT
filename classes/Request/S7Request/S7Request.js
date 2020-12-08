const StandardProtocolRequest = require("../StandardProtocolRequest");

class S7Request extends StandardProtocolRequest {
  //#region ========= CONSTRUCTOR =========

  /**
   * @description Class representing modbus request that can be processed by S7 driver
   * @param {Array} variables variables assigned to request
   * @param {Number} sampleTime sampleTime of variables
   * @param {Boolean} writeRequest is request associated with writing data to physical device or to gather data from device to S7Request
   * @param {String} memoryType type of memory to read/write data by request
   * @param {Number} dbNumber Number of db - only valid if memory type is DB, default value - null
   */
  constructor(
    variables,
    sampleTime,
    writeRequest,
    memoryType,
    dbNumber = null
  ) {
    super(variables, sampleTime, writeRequest);

    //Setting dbNumber as null - if memory type is not DB
    if (memoryType !== "DB") dbNumber = null;

    this._memoryType = memoryType;
    this._dbNumber = dbNumber;

    //Checking properties
    for (let variable of variables) {
      if (variable.MemoryType !== memoryType)
        throw new Error(
          "Trying to assing variable with different MemoryType to S7 request"
        );

      if (memoryType === "DB" && variable.DBNumber !== dbNumber)
        throw new Error(
          "Trying to assing variable with different DBNumber to S7 request"
        );
    }
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Type of memory area - I, Q, M or DB
   */
  get MemoryType() {
    return this._memoryType;
  }

  /**
   * @description Number of datablock of request - null if memory type is different than DB
   */
  get DBNumber() {
    return this._dbNumber;
  }

  //#endregion ========= PROPERTIES =========
}

module.exports = S7Request;
