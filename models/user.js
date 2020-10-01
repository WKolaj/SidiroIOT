const Joi = require("joi");
const { getBit, generateRandomString } = require("../utilities/utilities");

//There are 3 users group
//users - can perform standard operation
//admins - can add/edit/delete users
//superAdmins - can add/edit/delete admins (not users!)

//Every user permission have its own bit in permissions
//If you want to eg. create superAdmin that controls also normal user, you can set also a bit of admin permissions for such superAdmin

//#region ========== Joi validation ==========

//Minimal password length
const minPasswordLength = 8;

//Schema for user - Used also for auth validation
//Schema payload should be exported in order for other models to use it
exports.usersJoiSchemaPayload = {
  name: Joi.string().min(3).max(100).required(),
  permissions: Joi.number().integer().min(0).max(255).required(),
  password: Joi.string().min(minPasswordLength).max(100),
  oldPassword: Joi.string(),
};

//A joi schema generated from schema payload
const usersJoiSchema = Joi.object(exports.usersJoiSchemaPayload);

/**
 * @description method for validating users payload according to schema
 * @param {JSON} user Payload to validate
 */
function validateUser(user) {
  return usersJoiSchema.validate(user);
}

exports.validateUser = validateUser;

//#endregion ========== Joi validation ==========
