const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const { getBit, generateRandomString } = require("../utilities/utilities");
const jwt = require("jsonwebtoken");
const jwtPrivateKey = config.get("jwtPrivateKey");

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
  email: Joi.string().email().required(),
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

//#region ========== Mongoose model ==========

//Mongoose Schema of users data storing in database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  permissions: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
});

//Method for checking if user is super admin
userSchema.statics.isSuperAdmin = function (permissions) {
  return getBit(permissions, 2);
};

//Method for checking if user is admin
userSchema.statics.isAdmin = function (permissions) {
  return getBit(permissions, 1);
};

//Method for checking if user is user
userSchema.statics.isUser = function (permissions) {
  return getBit(permissions, 0);
};

//Method for generating random password for user
userSchema.statics.generateRandomPassword = function () {
  return generateRandomString(minPasswordLength);
};

//Method for generating JWT Token of user
userSchema.methods.generateJWT = async function () {
  let userPayload = {
    _id: this._id.toString(),
    email: this.email,
    name: this.name,
    permissions: this.permissions,
  };

  return jwt.sign(userPayload, jwtPrivateKey);
};

//SUCH METHOD SHOULD BE IMPLEMENTED IN EVERY MODEL - IN ORDER TO RETRIEVE PAYLOAD WHICH SHOULD BE RETURNED AFTER GET/CREATION/UPDATE/DELETE
//Method for generating payload of user
userSchema.methods.getPayload = async function () {
  let userPayload = {
    _id: this._id.toString(),
    email: this.email,
    name: this.name,
    permissions: this.permissions,
  };

  return userPayload;
};

exports.User = mongoose.model("User", userSchema);

//#endregion ========== Mongoose model ==========
