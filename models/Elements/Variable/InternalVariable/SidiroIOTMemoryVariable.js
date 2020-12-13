const Joi = require("joi");
const elementSchema = require("../../Element");
const joiValueSchema = require("../../ElementsValues/Double").joiSchema;

const schemaContent = {
  ...elementSchema.schemaContent,
  type: Joi.string().valid("SidiroIOTMemoryVariable").required(),
  defaultValue: joiValueSchema,
  unit: Joi.string().valid("B").required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
