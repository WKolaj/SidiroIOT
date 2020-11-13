const Joi = require("joi");

const joiSchema = Joi.number().integer().min(0).max(65535).required();
module.exports.joiSchema = joiSchema;

module.exports.checkUInt16 = (value) => {
  let result = joiSchema.validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
