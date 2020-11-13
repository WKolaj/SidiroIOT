const Joi = require("joi");

const joiSchema = Joi.number().required();
module.exports.joiSchema = joiSchema;

module.exports.checkFloat = (value) => {
  let result = joiSchema.validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
