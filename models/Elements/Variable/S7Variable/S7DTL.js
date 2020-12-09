const Joi = require("joi");
const S7Variable = require("./S7Variable");
const joiValueSchema = require("../../ElementsValues/UnixInt").joiSchema;

const schemaContent = {
  ...S7Variable.schemaContent,
  type: Joi.string().valid("S7DTL").required(),
  length: Joi.valid(12).required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
