const Joi = require("joi");
const deviceSchema = require("./Device");

const schemaContent = {
  ...deviceSchema.schemaContent,
  timeout: Joi.number().integer().min(1).required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
