const Joi = require("joi");
const elementSchema = require("../../Element");

const schemaContent = {
  ...elementSchema.schemaContent,
  type: Joi.string().valid("DeviceConnectionVariable").required(),
  defaultValue: Joi.number().integer().valid(0, 1).required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
