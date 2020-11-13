const Joi = require("joi");
const { exists, getBit } = require("../../../utilities/utilities");
const CalcElement = require("./CalcElement");

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("ValueFromByteArrayCalculator").required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  defaultValue: Joi.number().integer().required(),
  bitNumber: Joi.number().integer().min(0).max(7).required(),
  byteNumber: Joi.number().integer().min(0).required(),
  length: Joi.number()
    .integer()
    .min(1)
    .max(
      Joi.ref("bitNumber", {
        adjust: (value) => 8 - value,
      })
    )
    .required(),
  variableID: Joi.string().min(0).required(),
});

class ValueFromByteArrayCalculator extends CalcElement {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._bitNumber = null;
    this._byteNumber = null;
    this._length = null;
    this._variableId = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description bit number starting range
   */
  get BitNumber() {
    return this._bitNumber;
  }

  /**
   * @description byte number starting range
   */
  get ByteNumber() {
    return this._byteNumber;
  }

  /**
   * @description length of range to read
   */
  get Length() {
    return this._length;
  }

  /**
   * @description ID of ByteArray variable
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

    this._bitNumber = payload.bitNumber;
    this._byteNumber = payload.byteNumber;
    this._length = payload.length;
    this._variableId = payload.variableID;
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.bitNumber = this.BitNumber;
    superPayload.byteNumber = this.ByteNumber;
    superPayload.length = this.Length;
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

    //if variable does no exist - return immediately
    if (!exists(variable)) return;

    //If value of variable is not an array - return immediately
    if (!Array.isArray(variable.Value)) return;

    //if byte of variable does no exist - return immediately
    let variableByte = variable.Value[this.ByteNumber];

    //if byte of variable does no exist - return immediately
    if (!exists(variableByte)) return;

    //Checking lastTickId - LAST TICK ID IS THE BASE FOR ANY CALCULATION
    let lastTickId = variable.LastValueTick;
    if (!lastTickId) return;

    //Getting values for byte array
    let newValue = 0;
    for (let i = 0; i < this.Length; i++) {
      let value = getBit(variableByte, this.BitNumber + i);
      if (value) newValue += Math.pow(2, i);
    }

    //Avoding setting NaN
    if (!isFinite(newValue)) return;

    this.setValue(newValue, lastTickId);
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "ValueFromByteArrayCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = ValueFromByteArrayCalculator;
