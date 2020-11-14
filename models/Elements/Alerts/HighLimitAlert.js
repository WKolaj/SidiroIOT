const Joi = require("joi");
const elementProtocolVariableSchema = require("../Element");
const joiTextSchema = require("../ElementsValues/TranslationObject").joiSchema;

const schemaContent = {
  ...elementProtocolVariableSchema.schemaContent,
  type: Joi.string().valid("HighLimitAlert").required(),
  defaultValue: Joi.valid(null).required(),
  variableID: Joi.string().min(1).required(),
  highLimit: Joi.number().required(),
  texts: joiTextSchema.optional(),
  severity: Joi.number().integer().required(),
  hysteresis: Joi.number().min(0).max(100).required(),
  timeOnDelay: Joi.number().integer().min(0).required(),
  timeOffDelay: Joi.number().integer().min(0).required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
