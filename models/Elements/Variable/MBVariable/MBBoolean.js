const Joi = require("joi");
const MBVariableSchema = require("./MBVariable");
const booleanValueSchema = require("../../ElementsValues/Boolean").joiSchema;

//writeFCode should be disabled
const schemaContent = {
  ...MBVariableSchema.schemaContent,
  type: Joi.string().valid("MBBoolean").required(),
  length: Joi.number().integer().valid(1).required(),
  readFCode: Joi.when("read", {
    is: true,
    then: Joi.number().valid(1, 2).required(),
    otherwise: Joi.number().valid(1, 2).optional(),
  }),
  writeFCode: undefined,
  defaultValue: booleanValueSchema,
};

//write is disabled
delete schemaContent.writeFCode;

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
