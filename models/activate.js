const Joi = require("joi");

//#region ========== Joi validation ==========

//Schema for value
exports.activateSchemaPayload = {
  isActive: Joi.boolean().required(),
};

//A joi schema generated from schema payload
const activateJoiSchema = Joi.object(exports.activateSchemaPayload);

//A joi schema generated fro
/**
 * @description method for validating valuePayload
 * @param {JSON} valuePayload Payload to validate
 */
function validateActivatePayload(valuePayload) {
  return activateJoiSchema.validate(valuePayload);
}

exports.validateActivate = validateActivatePayload;

//#endregion ========== Joi validation ==========
