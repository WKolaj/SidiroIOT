const Joi = require("joi");

const joiSchema = Joi.number().integer().min(0).max(255).required();
module.exports.joiSchema = joiSchema;

module.exports.checkUInt8 = (value) => {
  let result = joiSchema.validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
