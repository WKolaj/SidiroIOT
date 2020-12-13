const Joi = require("joi");

const joiSchema = {
  type: Joi.string().valid("dynamic").required(),
  elementId: Joi.string().min(1).required(),
};

const schema = Joi.object(joiSchema);

module.exports.joiSchema = joiSchema;

module.exports.validatePayload = (payload) => {
  let result = schema.validate(payload);
  if (result.error) return result.error.details[0].message;
  else return null;
};
