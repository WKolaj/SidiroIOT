const Joi = require("joi");

const joiSchema = Joi.number().integer().min(-32768).max(32767).required();
module.exports.joiSchema = joiSchema;

module.exports.checkInt16 = (value) => {
  let result = joiSchema.validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
