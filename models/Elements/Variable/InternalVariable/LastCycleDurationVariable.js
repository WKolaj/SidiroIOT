const Joi = require("joi");
const elementSchema = require("../../Element");
const joiValueSchema = require("../../ElementsValues/Int32").joiSchema;

const schemaContent = {
  ...elementSchema.schemaContent,
  type: Joi.string().valid("LastCycleDurationVariable").required(),
  defaultValue: joiValueSchema,
  unit: Joi.string().valid("ms").required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
