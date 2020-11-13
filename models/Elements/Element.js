const Joi = require("joi");

const schemaContent = {
  id: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  type: Joi.string().required(),
  unit: Joi.string().min(1).required(),
  sampleTime: Joi.number().integer().min(1).required(),
  defaultValue: Joi.any().required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
