const Joi = require("joi");
const elementProtocolVariableSchema = require("../Element");
const joiValueSchema = require("../ElementsValues/Double").joiSchema;

const variableSumObjectSchema = Joi.object({
  variableID: Joi.string().min(1).required(),
  factor: Joi.number().required(),
});

const schemaContent = {
  ...elementProtocolVariableSchema.schemaContent,
  type: Joi.string().valid("SumCalculator").required(),
  variableIDs: Joi.array().items(variableSumObjectSchema).required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.variableSumObjectSchema = variableSumObjectSchema;
module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
