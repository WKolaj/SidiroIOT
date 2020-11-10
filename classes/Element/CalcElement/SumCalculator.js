const Joi = require("joi");
const { exists } = require("../../../utilities/utilities");
const CalcElement = require("./CalcElement");

const variableSumObjectSchema = Joi.object({
  variableID: Joi.string().min(1).required(),
  factor: Joi.number().required(),
});

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("SumCalculator").required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  defaultValue: Joi.number().required(),
  variableIDs: Joi.array().items(variableSumObjectSchema).required(),
});

class SumCalculator extends CalcElement {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._variableIds = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description
   */
  get VariableIDs() {
    return this._variableIds;
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

    this._variableIds = [...payload.variableIDs];
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.variableIDs = [...this.VariableIDs];

    return superPayload;
  }

  /**
   * @description Method called every tick that suits sampleTime. Does nothing - connectable variables are refreshed via requests
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    let value = 0;

    for (let variableSumObject of this.VariableIDs) {
      let variableID = variableSumObject.variableID;
      let factor = variableSumObject.factor;

      //Getting variable from device
      let variable = this._device.Variables[variableID];

      //Returning and not setting value if one of variables does not exist
      if (!exists(variable)) return;

      let multipliedValue = variable.Value * factor;

      //Avoding setting NaN - eg. when variable value is not a valid float
      if (isNaN(multipliedValue)) return;

      value += multipliedValue;
    }

    //Setting new value
    this.setValue(value, tickId);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "SumCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = SumCalculator;
