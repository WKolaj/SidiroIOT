const Joi = require("joi");

/**
 * @description Schema for ipV4 withouth cidr
 */
const ipV4Schema = Joi.string().ip({
  version: ["ipv4"],
  cidr: "forbidden",
});

/**
 * @description Schema for netplan interface configuration
 */
module.exports.netplanInterfaceJoiSchema = Joi.object({
  name: Joi.string().min(1).required(),
  dhcp: Joi.boolean().required(),
  ipAddress: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  subnetMask: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  gateway: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  dns: Joi.any().when("dhcp", {
    is: true,
    then: Joi.array().items(ipV4Schema).optional(),
    otherwise: Joi.array().items(ipV4Schema).required(),
  }),
});

/**
 * @description method for validating netplan interface payload according to schema
 * @param {JSON} inter Payload to validate
 */
function validateNetplanInterface(inter) {
  return module.exports.netplanInterfaceJoiSchema.validate(inter);
}

exports.validateNetplanInterface = validateNetplanInterface;
