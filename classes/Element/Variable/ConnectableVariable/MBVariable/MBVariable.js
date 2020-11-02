const StandardProtocolVariable = require("../StandardProtocolVariable");

class MBVariable extends StandardProtocolVariable {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();

    this._readFCode = null;
    this._writeFCode = null;
    this._unitID = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Modbus function code for reading data
   */
  get ReadFCode() {
    return this._readFCode;
  }

  /**
   * @description Modbus function code for writing data
   */
  get WriteFCode() {
    return this._writeFCode;
  }

  /**
   * @description Modbus Unit ID (Modbus RTU slave) from which variable should be read
   */
  get UnitID() {
    return this._unitID;
  }

  //#endregion ========= PROPERTIES =========

  //#endregion ========= PUBLIC ABSTRACT METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._readFCode = payload.readFCode;
    this._writeFCode = payload.writeFCode;
    this._unitID = payload.unitID;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = MBVariable;
