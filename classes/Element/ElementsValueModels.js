const Joi = require("joi");

module.exports.checkBoolean = (value) => {
  let result = Joi.boolean().required().validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkFloat = (value) => {
  let result = Joi.number().required().validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkDouble = (value) => {
  let result = Joi.number().required().validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkByte = (value) => {
  let result = Joi.number()
    .integer()
    .min(0)
    .max(255)
    .required()
    .validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkByteArray = (value, expectedLength) => {
  const byteSchema = Joi.number().integer().min(0).max(255).required();
  let result = Joi.array()
    .items(byteSchema)
    .length(expectedLength)
    .required()
    .validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkInt16 = (value) => {
  let result = Joi.number()
    .integer()
    .min(-32768)
    .max(32767)
    .required()
    .validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkInt32 = (value) => {
  let result = Joi.number()
    .integer()
    .max(2147483647)
    .min(-2147483648)
    .required()
    .validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkUInt16 = (value) => {
  let result = Joi.number()
    .integer()
    .min(0)
    .max(65535)
    .required()
    .validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};

module.exports.checkUInt32 = (value) => {
  let result = Joi.number()
    .integer()
    .min(0)
    .max(4294967295)
    .required()
    .validate(value);
  if (result.error) return result.error.details[0].message;
  else return null;
};
