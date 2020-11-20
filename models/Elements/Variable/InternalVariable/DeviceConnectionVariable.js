const Joi = require("joi");
const elementSchema = require("../../Element");
const joiValueSchema = require("../../ElementsValues/Boolean").joiSchema;

const schemaContent = {
  ...elementSchema.schemaContent,
  type: Joi.string().valid("DeviceConnectionVariable").required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
