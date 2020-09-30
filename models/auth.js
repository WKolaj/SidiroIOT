const Joi = require("joi");
const UserSchema = require("./user").usersJoiSchemaPayload;

//#region ========== Joi validation ==========

//Schema for credentials
//Schema payload should be exported in order for other models to use it
//Password is additionally required
exports.credentialsJoiSchemaPayload = {
  name: UserSchema.name,
  password: UserSchema.password.required(),
};

//A joi schema generated from schema payload
const credentialsJoiSchema = Joi.object(exports.credentialsJoiSchemaPayload);

/**
 * @description method for validating credentials payload according to schema
 * @param {JSON} user Payload to validate
 */
function validateCredentials(credentials) {
  return credentialsJoiSchema.validate(credentials);
}

exports.validateCredentials = validateCredentials;

//#endregion ========== Joi validation ==========
