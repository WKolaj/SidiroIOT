const Joi = require("joi");
const mbDeviceSchema = require("./MBDevice");

const schemaContent = {
  ...mbDeviceSchema.schemaContent,
  type: Joi.string().valid("MBGatewayDevice").required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
