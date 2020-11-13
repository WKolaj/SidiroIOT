const Joi = require("joi");
const MBVariableSchema = require("./MBVariable");
const joiValueSchema = require("../../ElementsValues/Int32").joiSchema;

const schemaContent = {
  ...MBVariableSchema.schemaContent,
  type: Joi.string().valid("MBInt32").required(),
  length: Joi.valid(2).required(),
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
