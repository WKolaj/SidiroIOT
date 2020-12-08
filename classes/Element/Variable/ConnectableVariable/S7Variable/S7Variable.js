const { exists } = require("../../../../../utilities/utilities");
const StandardProtocolVariable = require("../StandardProtocolVariable");

class S7Variable extends StandardProtocolVariable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._memoryType = null;
    this._dbNumber = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Type of memory where variable is stored: DB, M, I, Q
   */
  get MemoryType() {
    return this._memoryType;
  }

  /**
   * @description Data block number to get data from - only valid if memory type is DB
   */
  get DBNumber() {
    return this._dbNumber;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._memoryType = payload.memoryType;
    this._dbNumber = payload.dbNumber;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.memoryType = this.MemoryType;
    superPayload.dbNumber = this.DBNumber;

    return superPayload;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = S7Variable;

//TODO - test this class
