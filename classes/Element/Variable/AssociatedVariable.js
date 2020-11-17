const { exists } = require("../../../utilities/utilities");
const Variable = require("./Variable");
const {
  joiSchema,
} = require("../../../models/Elements/Variable/AssociatedVariable");

//TODO - test this class

class AssociatedVariable extends Variable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._associatedDeviceID = null;
    this._associatedElementID = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for checking if payload is a valid device payload. Returns null if yes. Returns message if not.
   * @param {JSON} payload Payload to check
   */
  static validatePayload(payload) {
    let result = joiSchema.validate(payload);
    if (result.error) return result.error.details[0].message;
    else return null;
  }

  //#endregion  ========= PUBLIC STATIC METHODS =========

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
    //Getting element - getting null if device or element of given id does not exist
    let element = this._project.getElement(
      this.AssociatedDeviceID,
      this.AssociatedElementID
    );

    //Setting elements defaultValue based on variables default value
    if (exists(element)) payload.defaultValue = element.DefaultValue;
    else payload.defaultValue = 0;

    await super.init(payload);

    this._associatedDeviceID = payload.associatedDeviceID;
    this._associatedElementID = payload.associatedElementID;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.associatedDeviceID = this.AssociatedDeviceID;
    superPayload.associatedElementID = this.AssociatedElementID;

    return superPayload;
  }
  /**
   * @description Method called every tick that suits sampleTime.
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //Getting element - getting null if device or element of given id does not exist
    let element = this._project.getElement(
      this.AssociatedDeviceID,
      this.AssociatedElementID
    );

    //Setting elements value and last value tick if element exists
    if (exists(element)) this.setValue(element.Value, element.LastValueTick);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set.
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "AssociatedVariable value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = AssociatedVariable;
