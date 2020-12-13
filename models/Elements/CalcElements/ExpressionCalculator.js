const Joi = require("joi");
const elementSchema = require("../Element");
const validateStaticExpressionParameterSchema = require("../ElementsValues/StaticExpressionParameter")
  .validatePayload;
const validateDynamicExpressionParameterSchema = require("../ElementsValues/DynamicExpressionParameter")
  .validatePayload;

const validateParametersPayload = (parametersPayload, helpers) => {
  const { message } = helpers;
  if (parametersPayload === null) return message(`"parameters" cannot be null`);
  for (let parameterValue of Object.keys(parametersPayload)) {
    let parameterPayload = parametersPayload[parameterValue];

    let parameterType = parameterPayload.type;
    let validationMessage = null;
    switch (parameterType) {
      case "dynamic":
        validationMessage = validateDynamicExpressionParameterSchema(
          parameterPayload
        );
        break;
      case "static":
        validationMessage = validateStaticExpressionParameterSchema(
          parameterPayload
        );
        break;
      default:
        validationMessage = "paramter object type not recognized";
    }

    if (validationMessage !== null) return message(validationMessage);
  }

  return parametersPayload;
};

const schemaContent = {
  ...elementSchema.schemaContent,
  defaultValue: Joi.alternatives(Joi.number(), Joi.boolean()).required(),
  type: Joi.string().valid("ExpressionCalculator").required(),
  expression: Joi.string().required(),
  parameters: Joi.object()
    .custom(validateParametersPayload, "custom validation")
    .required(),
};

const joiSchema = Joi.object(schemaContent);

module.exports.validateParametersPayload = validateParametersPayload;
module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
