const Joi = require("joi");
const elementProtocolVariableSchema = require("../Element");
const joiValueSchema = require("../ElementsValues/Double").joiSchema;

const schemaContent = {
  ...elementProtocolVariableSchema.schemaContent,
  type: Joi.string().valid("ValueFromByteArrayCalculator").required(),
  bitNumber: Joi.number().integer().min(0).max(7).required(),
  byteNumber: Joi.number().integer().min(0).required(),
  length: Joi.number()
    .integer()
    .min(1)
    .max(
      Joi.ref("bitNumber", {
        adjust: (value) => 8 - value,
      })
    )
    .required(),
  variableID: Joi.string().min(0).required(),
  defaultValue: joiValueSchema,
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
