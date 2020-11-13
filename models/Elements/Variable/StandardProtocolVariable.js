const Joi = require("joi");
const connectableVariableSchema = require("./ConnectableVariables");

const schemaContent = {
  ...connectableVariableSchema.schemaContent,
  offset: Joi.number().integer().min(0).required(),
  length: Joi.number().integer().min(1).required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
