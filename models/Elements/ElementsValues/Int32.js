const Joi = require("joi");

const joiSchema = Joi.number()
  .integer()
  .max(2147483647)
  .min(-2147483648)
  .required();
module.exports.joiSchema = joiSchema;

module.exports.checkInt32 = (value) => {
  let result = joiSchema.validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
