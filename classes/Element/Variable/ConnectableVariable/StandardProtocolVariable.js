const ConnectableVariable = require("./ConnectableVariable");

class StandardProtocolVariable extends ConnectableVariable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._offset = null;
    this._length = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Offset of variable
   */
  get Offset() {
    return this._offset;
  }

  /**
   * @description Length (in bytes) of variable
   */
  get Length() {
    return this._length;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._offset = payload.offset;
    this._length = payload.length;
  }

  /**
   * @description Method for generating payload of element. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.offset = this.Offset;
    superPayload.length = this.Length;

    return superPayload;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = StandardProtocolVariable;
