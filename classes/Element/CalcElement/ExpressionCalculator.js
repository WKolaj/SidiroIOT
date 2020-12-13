const Joi = require("joi");
const { exists, cloneObject } = require("../../../utilities/utilities");
const CalcElement = require("./CalcElement");

const {
  joiSchema,
} = require("../../../models/Elements/CalcElements/ExpressionCalculator");
const { exist } = require("joi");
const mathjs = require("mathjs");
const logger = require("../../../logger/logger");

class ExpressionCalculator extends CalcElement {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);

    this._parameters = null;
    this._expression = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description
   */
  get Parameters() {
    return cloneObject(this._parameters);
  }

  /**
   * @description
   */
  get Expression() {
    return this._expression;
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

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for calculating parameter object payload based on its type
   * @param {JSON} parameterObjectPayload Parameter's object payload
   */
  _getParameterValueBasedOnType(parameterObjectPayload) {
    if (!exists(parameterObjectPayload)) return null;

    let parameterType = parameterObjectPayload.type;
    if (!exists(parameterType)) return null;

    switch (parameterType) {
      case "static": {
        //Static parameter based on value
        let parameterValue = parameterObjectPayload.value;
        if (!exists(parameterValue)) return null;

        return parameterValue;
      }
      case "dynamic": {
        //dynamic parameter based on element's value
        let elementId = parameterObjectPayload.elementId;
        if (!exists(elementId)) return null;

        //Getting element from variables, calcElements or alerts
        let element =
          this._device.Variables[elementId] ||
          this._device.CalcElements[elementId] ||
          this._device.Alerts[elementId];
        if (!element) return null;

        return element.Value;
      }
      default: {
        return null;
      }
    }
  }

  /**
   * @description Method for creating parameters for expression to calculate
   */
  _createParametersForExpression() {
    let parametersToReturn = {};

    //Use this._paramters due to better performance - do not copy and parse string - clone object
    for (let parameterName of Object.keys(this._parameters)) {
      let parameterObject = this._parameters[parameterName];
      let parameterValue = this._getParameterValueBasedOnType(parameterObject);
      if (exists(parameterValue)) {
        parametersToReturn[parameterName] = parameterValue;
      }
    }

    return parametersToReturn;
  }

  //#endregion  ========= PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing element
   * @param {JSON} payload JSON Payload of element
   */
  async init(payload) {
    await super.init(payload);

    this._expression = payload.expression;
    this._parameters = cloneObject({ ...payload.parameters });
  }

  /**
   * @description Method for generating payload of element.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.expression = this.Expression;
    superPayload.parameters = this.Parameters;

    return superPayload;
  }

  /**
   * @description Method called every tick that suits sampleTime. Does nothing - connectable variables are refreshed via requests
   * @param {Number} tickId actual tick id
   */
  async refresh(tickId) {
    try {
      let parametersForExpression = this._createParametersForExpression();

      //Expression can throw - parameters or expression is invalid - try catch block
      let value = mathjs.evaluate(this.Expression, parametersForExpression);

      if (exists(value) && isFinite(value)) this.setValue(value, tickId);
    } catch (err) {
      logger.info(err.message);
    }
  }

  /**
   * @description Method for checking if value can be set to element. Used for checking formatting and also blocking assigning value to read only elements. Returns null if value can be set, or string with message why value cannot be set
   * @param {Object} value value to be set
   */
  checkIfValueCanBeSet(value) {
    return "ExpressionCalculator value is readonly";
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = ExpressionCalculator;
