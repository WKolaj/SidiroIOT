const { exists } = require("../../../../../utilities/utilities");
const StandardProtocolVariable = require("../StandardProtocolVariable");

class MBVariable extends StandardProtocolVariable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

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

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    //Checking all possible function codes before initialzing (even before initializng in base class to completly prevent initialization in case of error)
    let possibleReadFCodes = this._getReadPossibleFunctionCodes();
    if (payload.read && !possibleReadFCodes.includes(payload.readFCode))
      throw new Error("Trying to assign invalid read FCode for MBVariable");

    let possibleWriteFCodes = this._getWritePossibleFunctionCodes();
    if (payload.write && !possibleWriteFCodes.includes(payload.writeFCode))
      throw new Error("Trying to assign invalid write FCode for MBVariable");

    await super.init(payload);

    this._readFCode = payload.readFCode;
    this._writeFCode = payload.writeFCode;
    this._unitID = payload.unitID;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.unitID = this.UnitID;
    if (exists(this.ReadFCode)) superPayload.readFCode = this.ReadFCode;
    if (exists(this.WriteFCode)) superPayload.writeFCode = this.WriteFCode;

    return superPayload;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= PRIVATE ABSTRACT METHODS =========

  /**
   * @description Method for getting all possible function codes for this type of variable (when reading). MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getReadPossibleFunctionCodes() {}

  /**
   * @description Method for getting all possible function codes for this type of variable (when writing). MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getWritePossibleFunctionCodes() {}

  //#endregion ========= PRIVATE ABSTRACT METHODS =========
}

module.exports = MBVariable;
