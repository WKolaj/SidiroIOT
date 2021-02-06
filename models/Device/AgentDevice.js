const Joi = require("joi");
const {
  TickIdNormalizeType,
} = require("../../classes/Device/AgentDevice/TickIdNormalizer");
const deviceSchema = require("./Device");

const dataToSendConfigSchemaContent = {
  elementId: Joi.string().min(1).required(),
  deviceId: Joi.string().min(1).required(),
  sendingInterval: Joi.number().integer().min(1).required(),
  tickNormalization: Joi.string()
    .valid(...Object.values(TickIdNormalizeType))
    .optional(),
};

const dataToSendConfigSchema = Joi.object({
  ...dataToSendConfigSchemaContent,
});

const eventsToSendConfigSchemaContent = {
  elementId: Joi.string().min(1).required(),
  deviceId: Joi.string().min(1).required(),
  sendingInterval: Joi.number().integer().min(1).required(),
};

const eventsToSendConfigSchema = Joi.object({
  ...eventsToSendConfigSchemaContent,
});

const validateDataToSendConfigPayload = (dataToSendConfig, helpers) => {
  const { message } = helpers;

  if (dataToSendConfig === null)
    return message(`"dataToSendConfig" cannot be null`);

  for (let elementID of Object.keys(dataToSendConfig)) {
    let elementPayload = dataToSendConfig[elementID];

    let elementIDFromPayload = elementPayload.elementId;

    let result = dataToSendConfigSchema.validate(elementPayload);
    if (result.error)
      return message(
        `dataToSendConfig error: ${result.error.details[0].message}`
      );

    if (elementID !== elementIDFromPayload)
      return message(
        "dataToSendConfig elementId as key and in payload differs!"
      );
  }

  return dataToSendConfig;
};

const validateEventsToSendConfigPayload = (eventsToSendConfig, helpers) => {
  const { message } = helpers;

  if (eventsToSendConfig === null)
    return message(`"eventsToSendConfig" cannot be null`);

  for (let elementID of Object.keys(eventsToSendConfig)) {
    let elementPayload = eventsToSendConfig[elementID];

    let elementIDFromPayload = elementPayload.elementId;

    let result = eventsToSendConfigSchema.validate(elementPayload);
    if (result.error)
      return message(
        `eventsToSendConfig error: ${result.error.details[0].message}`
      );

    if (elementID !== elementIDFromPayload)
      return message(
        "eventsToSendConfig elementId as key and in payload differs!"
      );
  }

  return eventsToSendConfig;
};
const schemaContent = {
  ...deviceSchema.schemaContent,
  sendDataFileInterval: Joi.number().integer().min(1).required(),
  sendEventFileInterval: Joi.number().integer().min(1).required(),
  dataStorageSize: Joi.number().integer().min(0).required(),
  eventStorageSize: Joi.number().integer().min(0).required(),
  numberOfDataFilesToSend: Joi.number().integer().min(1).required(),
  numberOfEventFilesToSend: Joi.number().integer().min(1).required(),
  dataToSendConfig: Joi.any()
    .custom(validateDataToSendConfigPayload, "custom validation")
    .required(),
  eventsToSendConfig: Joi.any()
    .custom(validateEventsToSendConfigPayload, "custom validation")
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.dataToSendConfigSchemaContent = dataToSendConfigSchemaContent;
module.exports.dataToSendConfigSchema = dataToSendConfigSchema;
module.exports.eventsToSendConfigSchemaContent = eventsToSendConfigSchemaContent;
module.exports.eventsToSendConfigSchema = eventsToSendConfigSchema;
module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
