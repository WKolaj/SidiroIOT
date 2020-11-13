const Joi = require("joi");
const standardProtocolVariableSchema = require("../StandardProtocolVariable");

const schemaContent = {
  ...standardProtocolVariableSchema.schemaContent,
  readFCode: Joi.when("read", {
    is: true,
    then: Joi.number().valid(1, 2, 3, 4).required(),
    otherwise: Joi.number().valid(1, 2, 3, 4).optional(),
  }),
  writeFCode: Joi.when("write", {
    is: true,
    then: Joi.number().valid(16).required(),
    otherwise: Joi.number().valid(16).optional(),
  }),
  unitID: Joi.number().integer().min(1).max(255).required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
