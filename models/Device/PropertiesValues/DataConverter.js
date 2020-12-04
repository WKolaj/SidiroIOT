const Joi = require("joi");

module.exports.dataConverterSchema = Joi.object({
  conversionType: Joi.valid("precision", "fixed", "none").required(),
  precision: Joi.number().integer().min(0).required(),
});
