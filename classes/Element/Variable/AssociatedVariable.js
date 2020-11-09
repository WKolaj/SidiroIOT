const Variable = require("./Variable");

//TODO - test this class

class AssociatedVariable extends Variable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._associatedDeviceID = null;
    this._associatedElementID = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Device ID associated with variable
   */
  get AssociatedDeviceID() {
    return this._associatedDeviceID;
  }

  /**
   * @description Element ID associated with variable
   */
  get AssociatedElementID() {
    return this._associatedElementID;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._associatedDeviceID = payload.associatedDeviceId;
    this._associatedDeviceID = payload.associatedElementId;
  }

  /**
   * @description Method called every tick that suits sampleTime.
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //Getting element
    let element = this._project.getElement(
      this.AssociatedDeviceID,
      this.AssociatedElementID
    );

    //Setting elements value and last value tick
    this.setValue(element.Value, element.LastValueTick);
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = AssociatedVariable;
