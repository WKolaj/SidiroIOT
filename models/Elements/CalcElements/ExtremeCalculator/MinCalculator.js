const Joi = require("joi");
const extremeCalculatorSchema = require("./ExtremeCalculator");

const schemaContent = {
  ...extremeCalculatorSchema.schemaContent,
  type: Joi.string().valid("MinCalculator").required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
