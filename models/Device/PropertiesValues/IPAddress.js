const Joi = require("joi");

module.exports.ipV4Schema = Joi.string().ip({
  version: ["ipv4"],
  cidr: "forbidden",
});
