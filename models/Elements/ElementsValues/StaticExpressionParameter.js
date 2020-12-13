const Joi = require("joi");

const joiSchema = {
  type: Joi.string().valid("static").required(),
  value: Joi.alternatives(Joi.number(), Joi.boolean()).required(),
};

const schema = Joi.object(joiSchema);

module.exports.joiSchema = joiSchema;
module.exports.validatePayload = (payload) => {
  let result = schema.validate(payload);
  if (result.error) return result.error.details[0].message;
  else return null;
};
