const Joi = require("joi");

const boardingKeyContentSchema = Joi.object().keys({
  baseUrl: Joi.string().uri().required(),
  iat: Joi.string().required(),
  clientCredentialProfile: Joi.array().required(),
  clientId: Joi.string().required(),
  tenant: Joi.string().required(),
});

const boardingKeySchema = Joi.object().keys({
  content: boardingKeyContentSchema.required(),
  expiration: Joi.string().required(),
});

module.exports.boardingKeyContentSchema = boardingKeyContentSchema;
module.exports.boardingKeySchema = boardingKeySchema;
