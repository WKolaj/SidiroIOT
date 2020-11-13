const Joi = require("joi");
const MBVariableSchema = require("./MBVariable");
const joiValueSchema = require("../../ElementsValues/Double").joiSchema;

const schemaContent = {
  ...MBVariableSchema.schemaContent,
  type: Joi.string().valid("MBSwappedDouble").required(),
  length: Joi.valid(4).required(),
  defaultValue: joiValueSchema,
  readFCode: Joi.when("read", {
    is: true,
    then: Joi.number().valid(3, 4).required(),
    otherwise: Joi.number().valid(3, 4).optional(),
  }),
  writeFCode: Joi.when("write", {
    is: true,
    then: Joi.number().valid(16).required(),
    otherwise: Joi.number().valid(16).optional(),
  }),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
