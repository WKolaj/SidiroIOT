const Joi = require("joi");
const deviceSchema = require("./Device");

const schemaContent = {
  ...deviceSchema.schemaContent,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
