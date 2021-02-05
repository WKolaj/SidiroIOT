const Joi = require("joi");
const calcElementSchema = require("../../Element");
const joiValueSchema = require("../../ElementsValues/Double").joiSchema;

const schemaContent = {
  ...calcElementSchema.schemaContent,
  type: Joi.string().valid("ExtremeCalculator").required(),
  variableID: Joi.string().min(1).required(),
  calculationInterval: Joi.number().integer().min(1).required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
