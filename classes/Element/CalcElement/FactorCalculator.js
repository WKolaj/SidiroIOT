const Joi = require("joi");
const { exists } = require("../../../utilities/utilities");
const CalcElement = require("./CalcElement");
const {
  joiSchema,
} = require("../../../models/Elements/CalcElements/FactorCalculator");

class FactorCalculator extends CalcElement {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._factor = null;
    this._variableId = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description
   */
  get Factor() {
    return this._factor;
  }

  /**
   * @description
   */
  get VariableID() {
    return this._variableId;
  }

  //#endregion ========= PROPERTIES =========

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

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._factor = payload.factor;
    this._variableId = payload.variableID;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.factor = this.Factor;
    superPayload.variableID = this.VariableID;

    return superPayload;
  }

  /**
   * @description Method called every tick that suits sampleTime. Does nothing - connectable variables are refreshed via requests
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    //Getting variable from device
    let variable = this._device.Variables[this.VariableID];

    //Setting new value if variable exists
    if (exists(variable)) {
      let newValue = variable.Value * this.Factor;
      let lastValueTick = variable.LastValueTick;

      //Avoding setting NaN - eg. when variable value is not a valid float
      if (!isFinite(newValue)) return;

      //Avoiding setting value if there is not value tick
      if (!lastValueTick) return;

      this.setValue(newValue, lastValueTick);
    }
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "FactorCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = FactorCalculator;
