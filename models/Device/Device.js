const Joi = require("joi");
const BandwidthLimitAlert = require("../../classes/Element/Alerts/BandwidthLimitAlert");
const ExactValuesAlert = require("../../classes/Element/Alerts/ExactValuesAlert");
const HighLimitAlert = require("../../classes/Element/Alerts/HighLimitAlert");
const LowLimitAlert = require("../../classes/Element/Alerts/LowLimitAlert");
const AverageCalculator = require("../../classes/Element/CalcElement/AverageCalculator");
const FactorCalculator = require("../../classes/Element/CalcElement/FactorCalculator");
const IncreaseCalculator = require("../../classes/Element/CalcElement/IncreaseCalculator");
const SumCalculator = require("../../classes/Element/CalcElement/SumCalculator");
const ValueFromByteArrayCalculator = require("../../classes/Element/CalcElement/ValueFromByteArrayCalculator");

const validateVariablesPayload = (variablesPayload, helpers) => {
  const { message } = helpers;

  if (variablesPayload === null) return message(`"variables" cannot be null`);

  for (let variableID of Object.keys(variablesPayload)) {
    let variablePayload = variablesPayload[variableID];

    let variableType = variablePayload.type;
    let validationMessage = null;

    switch (variableType) {
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

    switch (alertType) {
      case "HighLimitAlert":
        alertMessage = HighLimitAlert.validatePayload(alertPayload);
        break;
      case "LowLimitAlert":
        alertMessage = LowLimitAlert.validatePayload(alertPayload);
        break;
      case "BandwidthLimitAlert":
        alertMessage = BandwidthLimitAlert.validatePayload(alertPayload);
        break;
      case "ExactValuesAlert":
        alertMessage = ExactValuesAlert.validatePayload(alertPayload);
        break;
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

const schemaContent = {
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().required(),
  variables: Joi.any()
    .custom(validateVariablesPayload, "custom validation")
    .required(),
  calcElements: Joi.any()
    .custom(validateCalcElementsPayload, "custom validation")
    .required(),
  alerts: Joi.any()
    .custom(validateAlertsPayload, "custom validation")
    .required(),
  isActive: Joi.boolean().required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.validateVariablesPayload = validateVariablesPayload;
module.exports.validateCalcElementsPayload = validateCalcElementsPayload;
module.exports.validateAlertsPayload = validateAlertsPayload;

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
