const Joi = require("joi");
const byteSchema = require("./Byte").joiSchema;

const generateJoiSchema = (expectedLength) => {
  return Joi.array().items(byteSchema).length(expectedLength).required();
};

module.exports.generateJoiSchema = generateJoiSchema;

module.exports.checkByteArray = (value, expectedLength) => {
  let result = generateJoiSchema(expectedLength).validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
