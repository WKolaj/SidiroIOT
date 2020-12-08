const Joi = require("joi");
const standardProtocolVariableSchema = require("../StandardProtocolVariable");

const schemaContent = {
  ...standardProtocolVariableSchema.schemaContent,
  memoryType: Joi.string().valid("I", "Q", "M", "DB").required(),
  dbNumber: Joi.when("memoryType", {
    is: "DB",
    then: Joi.number().integer().min(1).required(),
    otherwise: Joi.valid(null).optional(),
  }),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
