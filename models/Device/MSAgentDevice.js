const Joi = require("joi");
const deviceSchema = require("./AgentDevice");
const { boardingKeySchema } = require("./PropertiesValues/MCBoardingKey");
const { dataConverterSchema } = require("./PropertiesValues/DataConverter");

const dataToSendConfigSchemaContent = {
  elementId: Joi.string().min(1).required(),
  deviceId: Joi.string().min(1).required(),
  sendingInterval: Joi.number().integer().min(1).required(),
  qualityCodeEnabled: Joi.boolean().required(),
  datapointId: Joi.string().required(),
  dataConverter: dataConverterSchema.allow(null).required(),
};

const dataToSendConfigSchema = Joi.object({
  ...dataToSendConfigSchemaContent,
});

const eventsToSendConfigSchemaContent = {
  elementId: Joi.string().min(1).required(),
  deviceId: Joi.string().min(1).required(),
  sendingInterval: Joi.number().integer().min(1).required(),
  entityId: Joi.string().required(),
  sourceType: Joi.string().valid("Event").required(),
  sourceId: Joi.string().valid("application").required(),
  source: Joi.string().valid("SidiroIOT").required(),
  severity: Joi.number().integer().min(0).max(99).required(),
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
  numberOfSendDataRetries: Joi.number().integer().min(1).required(),
  numberOfSendEventRetries: Joi.number().integer().min(1).required(),
  boardingKey: boardingKeySchema,
  dataToSendConfig: Joi.any()
    .custom(validateDataToSendConfigPayload, "custom validation")
    .required(),
  eventsToSendConfig: Joi.any()
    .custom(validateEventsToSendConfigPayload, "custom validation")
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
