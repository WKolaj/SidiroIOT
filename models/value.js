const Joi = require("joi");

//#region ========== Joi validation ==========

//Schema for value
exports.valueSchemaPayload = {
  value: Joi.any().required(),
};

//A joi schema generated from schema payload
const valueJoiSchema = Joi.object(exports.valueSchemaPayload);

//A joi schema generated fro
/**
 * @description method for validating valuePayload
 * @param {JSON} valuePayload Payload to validate
 */
function validateValuePayload(valuePayload) {
  return valueJoiSchema.validate(valuePayload);
}

exports.validateValue = validateValuePayload;

//#endregion ========== Joi validation ==========
