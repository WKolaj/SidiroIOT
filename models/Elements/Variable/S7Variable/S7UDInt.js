const Joi = require("joi");
const S7Variable = require("./S7Variable");
const joiValueSchema = require("../../ElementsValues/UInt32").joiSchema;

const schemaContent = {
  ...S7Variable.schemaContent,
  type: Joi.string().valid("S7UDInt").required(),
  length: Joi.valid(4).required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
