const Joi = require("joi");

const connectableDeviceSchema = require("./ConnectableDevice");
const DeviceConnectionVariable = require("../../classes/Element/Variable/InternalVariable/DeviceConnectionVariable");
const S7Int = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7Int");
const S7DInt = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7DInt");
const S7SInt = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7SInt");
const S7UInt = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7UInt");
const S7UDInt = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7UDInt");
const S7USInt = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7USInt");
const S7Real = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7Real");
const S7DTL = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7DTL");
const S7ByteArray = require("../../classes/Element/Variable/ConnectableVariable/S7Variable/S7ByteArray");
const ipV4Schema = require("./PropertiesValues/IPAddress").ipV4Schema;

const validateS7VariablesPayload = (variablesPayload, helpers) => {
  const { message } = helpers;

  if (variablesPayload === null) return message(`"variables" cannot be null`);

  for (let variableID of Object.keys(variablesPayload)) {
    let variablePayload = variablesPayload[variableID];

    let variableType = variablePayload.type;
    let validationMessage = null;

    switch (variableType) {
      case "DeviceConnectionVariable":
        validationMessage = DeviceConnectionVariable.validatePayload(
          variablePayload
        );
        break;
      case "S7Int":
        validationMessage = S7Int.validatePayload(variablePayload);
        break;
      case "S7DInt":
        validationMessage = S7DInt.validatePayload(variablePayload);
        break;
      case "S7SInt":
        validationMessage = S7SInt.validatePayload(variablePayload);
        break;
      case "S7UInt":
        validationMessage = S7UInt.validatePayload(variablePayload);
        break;
      case "S7UDInt":
        validationMessage = S7UDInt.validatePayload(variablePayload);
        break;
      case "S7USInt":
        validationMessage = S7USInt.validatePayload(variablePayload);
        break;
      case "S7Real":
        validationMessage = S7Real.validatePayload(variablePayload);
        break;
      case "S7DTL":
        validationMessage = S7DTL.validatePayload(variablePayload);
        break;
      case "S7ByteArray":
        validationMessage = S7ByteArray.validatePayload(variablePayload);
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
  ...connectableDeviceSchema.schemaContent,
  type: Joi.string().valid("S7Device").required(),
  ipAddress: ipV4Schema.required(),
  rack: Joi.number().integer().min(0).required(),
  slot: Joi.number().integer().min(1).required(),
  variables: Joi.any()
    .custom(validateS7VariablesPayload, "custom validation")
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.validateS7VariablesPayload = validateS7VariablesPayload;
module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
