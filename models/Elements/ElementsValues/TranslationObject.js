const Joi = require("joi");

const translationTextSchema = Joi.string().min(1).optional();

const joiSchema = Joi.object({
  pl: translationTextSchema,
  en: translationTextSchema,
});

module.exports.joiSchema = joiSchema;
module.exports.translationTextSchema = translationTextSchema;
