const Joi = require("joi");
const MBBoolean = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBBoolean");
const MBByteArray = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBByteArray");
const MBDouble = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBDouble");
const MBFloat = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBFloat");
const MBInt16 = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBInt16");
const MBInt32 = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBInt32");
const MBSwappedDouble = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedDouble");
const MBSwappedFloat = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedFloat");
const MBSwappedInt32 = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedInt32");
const MBSwappedUInt32 = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedUInt32");
const MBUInt16 = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBUInt16");
const MBUInt32 = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBUInt32");
const DeviceConnectionVariable = require("../../classes/Element/Variable/InternalVariable/DeviceConnectionVariable");
const connectableDeviceSchema = require("./ConnectableDevice");
const ipV4Schema = require("./PropertiesValues/IPAddress").ipV4Schema;

const validateMBVariablesPayload = (variablesPayload, helpers) => {
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

const schemaContent = {
  ...connectableDeviceSchema.schemaContent,
  type: Joi.string().valid("MBDevice").required(),
  ipAddress: ipV4Schema.required(),
  portNumber: Joi.number().integer().min(1).required(),
  variables: Joi.any()
    .custom(validateMBVariablesPayload, "custom validation")
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.validateMBVariablesPayload = validateMBVariablesPayload;
module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
