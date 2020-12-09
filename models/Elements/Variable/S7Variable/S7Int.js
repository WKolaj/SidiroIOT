const Joi = require("joi");
const S7Variable = require("./S7Variable");
const joiValueSchema = require("../../ElementsValues/Int16").joiSchema;

const schemaContent = {
  ...S7Variable.schemaContent,
  type: Joi.string().valid("S7Int").required(),
  length: Joi.valid(2).required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
