const Joi = require("joi");
const elementProtocolVariableSchema = require("../Element");
const joiValueSchema = require("../ElementsValues/Double").joiSchema;

const schemaContent = {
  ...elementProtocolVariableSchema.schemaContent,
  type: Joi.string().valid("FactorCalculator").required(),
  variableID: Joi.string().min(1).required(),
  factor: Joi.number().required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
