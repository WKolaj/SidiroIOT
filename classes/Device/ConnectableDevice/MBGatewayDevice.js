const MBDevice = require("./MBDevice");

const MBBoolean = require("../../Element/Variable/ConnectableVariable/MBVariable/MBBoolean");
const MBByteArray = require("../../Element/Variable/ConnectableVariable/MBVariable/MBByteArray");
const MBDouble = require("../../Element/Variable/ConnectableVariable/MBVariable/MBDouble");
const MBFloat = require("../../Element/Variable/ConnectableVariable/MBVariable/MBFloat");
const MBInt16 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBInt16");
const MBInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBInt32");
const MBSwappedFloat = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedFloat");
const MBSwappedDouble = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedDouble");
const MBSwappedInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedInt32");
const MBSwappedUInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBSwappedUInt32");
const MBUInt16 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBUInt16");
const MBUInt32 = require("../../Element/Variable/ConnectableVariable/MBVariable/MBUInt32");
const AssociatedVariable = require("../../Element/Variable/AssociatedVariable");
const InternalVariable = require("../../Element/Variable/InternalVariable");
const FactorCalculator = require("../../Element/CalcElement/FactorCalculator");
const SumCalculator = require("../../Element/CalcElement/SumCalculator");
const Joi = require("joi");
const ValueFromByteArrayCalculator = require("../../Element/CalcElement/ValueFromByteArrayCalculator");
const IncreaseCalculator = require("../../Element/CalcElement/IncreaseCalculator");
const AverageCalculator = require("../../Element/CalcElement/AverageCalculator");

//#region ========= PAYLOAD VALIDATION =========

const validateVariablesPayload = (variablesPayload, helpers) => {
  const { message } = helpers;

  if (variablesPayload === null) return message(`"variables" cannot be null`);

  for (let variableID of Object.keys(variablesPayload)) {
    let variablePayload = variablesPayload[variableID];

    let variableType = variablePayload.type;
    let validationMessage = null;

    switch (variableType) {
      case "AssociatedVariable":
        validationMessage = AssociatedVariable.validatePayload(variablePayload);
        break;
      case "InternalVariable":
        validationMessage = InternalVariable.validatePayload(variablePayload);
        break;
      case "MBBoolean":
        validationMessage = MBBoolean.validatePayload(variablePayload);
        break;
      case "MBByteArray":
        validationMessage = MBByteArray.validatePayload(variablePayload);
        break;
      case "MBDouble":
        validationMessage = MBDouble.validatePayload(variablePayload);
        break;
      case "MBFloat":
        validationMessage = MBFloat.validatePayload(variablePayload);
        break;
      case "MBInt16":
        validationMessage = MBInt16.validatePayload(variablePayload);
        break;
      case "MBInt32":
        validationMessage = MBInt32.validatePayload(variablePayload);
        break;
      case "MBSwappedFloat":
        validationMessage = MBSwappedFloat.validatePayload(variablePayload);
        break;
      case "MBSwappedDouble":
        validationMessage = MBSwappedDouble.validatePayload(variablePayload);
        break;
      case "MBSwappedInt32":
        validationMessage = MBSwappedInt32.validatePayload(variablePayload);
        break;
      case "MBSwappedUInt32":
        validationMessage = MBSwappedUInt32.validatePayload(variablePayload);
        break;
      case "MBUInt16":
        validationMessage = MBUInt16.validatePayload(variablePayload);
        break;
      case "MBUInt32":
        validationMessage = MBUInt32.validatePayload(variablePayload);
        break;
      default:
        validationMessage = "variable type not recognized";
    }

    if (validationMessage !== null) return message(validationMessage);

    let variableIDFromPayload = variablePayload.id;

    if (variableID !== variableIDFromPayload)
      return message("variable's id as key and in payload differs!");
  }

  return variablesPayload;
};

const validateCalcElementsPayload = (calcElementsPayload, helpers) => {
  const { message } = helpers;

  if (calcElementsPayload === null)
    return message(`"calcElements" cannot be null`);

  for (let calcElementID of Object.keys(calcElementsPayload)) {
    let calcElementPayload = calcElementsPayload[calcElementID];

    let calcElementType = calcElementPayload.type;
    let calcElementMessage = null;

    //TODO - add calcElement types
    switch (calcElementType) {
      case "FactorCalculator":
        calcElementMessage = FactorCalculator.validatePayload(
          calcElementPayload
        );
        break;
      case "SumCalculator":
        calcElementMessage = SumCalculator.validatePayload(calcElementPayload);
        break;
      case "ValueFromByteArrayCalculator":
        calcElementMessage = ValueFromByteArrayCalculator.validatePayload(
          calcElementPayload
        );
        break;
      case "IncreaseCalculator":
        calcElementMessage = IncreaseCalculator.validatePayload(
          calcElementPayload
        );
        break;
      case "AverageCalculator":
        calcElementMessage = AverageCalculator.validatePayload(
          calcElementPayload
        );
        break;
      default:
        calcElementMessage = "calcElement type not recognized";
    }
    console.log(calcElementMessage);
    if (calcElementMessage) return message(calcElementMessage);

    let calcElementIDFromPayload = calcElementPayload.id;

    if (calcElementID !== calcElementIDFromPayload)
      return message("calcElement's id as key and in payload differs!");
  }

  return calcElementsPayload;
};

const validateAlertsPayload = (alertsPayload, helpers) => {
  const { message } = helpers;

  if (alertsPayload === null) return message(`"alerts" cannot be null`);

  for (let alertID of Object.keys(alertsPayload)) {
    let alertPayload = alertsPayload[alertID];

    let alertType = alertPayload.type;
    let alertMessage = null;

    //TODO - add alert types
    switch (alertType) {
      default:
        alertMessage = "alert type not recognized";
    }

    if (alertMessage) return message(alertMessage);

    let alertIDFromPayload = alertPayload.id;

    if (alertID !== alertIDFromPayload)
      return message("alert's id as key and in payload differs!");
  }

  return alertsPayload;
};

const ipV4Schema = Joi.string().ip({
  version: ["ipv4"],
  cidr: "forbidden",
});

const joiSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("MBGatewayDevice").required(),
  variables: Joi.any()
    .custom(validateVariablesPayload, "custom validation")
    .required(),
  calcElements: Joi.any()
    .custom(validateCalcElementsPayload, "custom validation")
    .required(),
  alerts: Joi.any()
    .custom(validateAlertsPayload, "custom validation")
    .required(),
  ipAddress: ipV4Schema.required(),
  portNumber: Joi.number().integer().min(1).required(),
  timeout: Joi.number().integer().min(1).required(),
  isActive: Joi.boolean().required(),
});

//#endregion ========= PAYLOAD VALIDATION =========

class MBGatewayDevice extends MBDevice {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);

    //Gateway has the same functionality as MBDevice but with _continueIfRequestThrows set to true

    this._continueIfRequestThrows = true;
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
}

module.exports = MBGatewayDevice;
