const Joi = require("joi");
const S7Variable = require("./S7Variable");
const byteSchema = require("../../ElementsValues/Byte").joiSchema;

const schemaContent = {
  ...S7Variable.schemaContent,
  type: Joi.string().valid("S7ByteArray").required(),
  length: Joi.number().integer().min(1).required(),
  defaultValue: Joi.array()
    .items(byteSchema)
    .length(Joi.ref("length"))
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
