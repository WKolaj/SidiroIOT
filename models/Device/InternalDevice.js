const Joi = require("joi");
const deviceSchema = require("./Device");
const AssociatedVariable = require("../../classes/Element/Variable/AssociatedVariable");
const CPULoadVariable = require("../../classes/Element/Variable/InternalVariable/CPULoadVariable");
const CPUTemperatureVariable = require("../../classes/Element/Variable/InternalVariable/CPUTemperatureVariable");
const DiskUsageVariable = require("../../classes/Element/Variable/InternalVariable/DiskUsageVariable");
const RAMUsageVariable = require("../../classes/Element/Variable/InternalVariable/RAMUsageVariable");
const LastCycleDurationVariable = require("../../classes/Element/Variable/InternalVariable/LastCycleDurationVariable");

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
      case "CPULoadVariable":
        validationMessage = CPULoadVariable.validatePayload(variablePayload);
        break;
      case "CPUTemperatureVariable":
        validationMessage = CPUTemperatureVariable.validatePayload(
          variablePayload
        );
        break;
      case "RAMUsageVariable":
        validationMessage = RAMUsageVariable.validatePayload(variablePayload);
        break;
      case "DiskUsageVariable":
        validationMessage = DiskUsageVariable.validatePayload(variablePayload);
        break;
      case "LastCycleDurationVariable":
        validationMessage = LastCycleDurationVariable.validatePayload(
          variablePayload
        );
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

const schemaContent = {
  ...deviceSchema.schemaContent,

  variables: Joi.any()
    .custom(validateVariablesPayload, "custom validation")
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;

module.exports.validateVariablesPayload = validateVariablesPayload;
