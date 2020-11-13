const Joi = require("joi");
const MBVariableSchema = require("./MBVariable");
const byteSchema = require("../../ElementsValues/Byte").joiSchema;

const schemaContent = {
  ...MBVariableSchema.schemaContent,
  type: Joi.string().valid("MBByteArray").required(),
  length: Joi.number().integer().min(1).required(),
  defaultValue: Joi.array()
    .items(byteSchema)
    .length(
      Joi.ref("length", {
        adjust: (value) => value * 2,
      })
    )
    .required(),
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
