const Joi = require("joi");

const joiSchema = Joi.number().integer().min(-128).max(127).required();
module.exports.joiSchema = joiSchema;

module.exports.checkInt8 = (value) => {
  let result = joiSchema.validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
