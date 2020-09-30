const express = require("express");
const router = express.Router();
const { validateUser } = require("../models/user");
const User = require("../classes/User/User");
const validate = require("../middleware/validation/joiValidate");
const validateObjectId = require("../middleware/validation/validateObjectId");
const {
  exists,
  hashString,
  hashedStringMatch,
  applyJSONParsingToRoute,
} = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isAdmin = require("../middleware/auth/isAdmin");
const isUser = require("../middleware/auth/isUser");
const _ = require("lodash");
const logger = require("../logger/logger");

applyJSONParsingToRoute(express, router);

//For every route, that require authorization and authentication use midleware functions hasUser for authentication and eg. isAdmin for authorization
//eg. router.get("/", [hasUser, isAdmin], async (req, res) => { ...

//If you would like to apply also validation - use validate + joiSchema
//eg. router.post("/",[hasUser, isAdmin, validate(validateUser)],async (req, res) => {...

//#region ========== GET ==========

//Route for getting all users
//Only admin can get a list of all users
router.get("/", [hasUser, isAdmin], async (req, res) => {
  //Getting all users from database
  var allUsers = await User.GetAllUsersFromFile();

  let payloadToReturn = [];

  //Generating payload for each user
  for (let user of allUsers) {
    payloadToReturn.push(user.PayloadWithoutPassword);
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting information about logged user
//Only users can get info about theirselves
router.get("/me", [hasUser, isUser], async (req, res) => {
  //Searching for user of given id - fetched from jwt
  //If it doesn't exist - return 404
  let user = await User.GetUserFromFileById(req.user._id);

  if (!exists(user)) return res.status(404).send("User not found");

  //Building payload to return
  let payloadToReturn = await user.getPayload();

  return res.status(200).send(payloadToReturn);
});

//Route for getting specific user
//Only admin can get a user
router.get("/:id", [hasUser, isAdmin, validateObjectId], async (req, res) => {
  //Searching for user of given id
  //If it doesn't exist - return 404
  let user = await User.GetUserFromFileById(req.params.id);
  if (!exists(user)) return res.status(404).send("User not found");

  //Building payload to return
  let payloadToReturn = await user.getPayload();

  return res.status(200).send(payloadToReturn);
});

//#endregion ========== GET ==========

//#region ========== POST ==========

//Route for crfeating new users
//Only admin can create users, and only superAdmin can create admins and other superAdmins
//Users password will be automatically generated - if not specified in payload
router.post(
  "/",
  [hasUser, isAdmin, validate(validateUser)],
  async (req, res) => {
    //Checking if user already exists
    let user = await User.GetUserFromFileByName(req.body.name);
    if (exists(user)) return res.status(400).send("User already registered.");

    //Checking what user wants to create what user
    //Thanks to isAdmin validate method, we can be sure that user who wants to create new user is at least admin

    //Checking if created user is to be an admin or super admin
    //If so - user that creates such user has to be a super admin
    //If not - created user is to be normal user or lower - admin permissions are sufficient
    if (
      (User.isAdmin(req.body.permissions) ||
        User.isSuperAdmin(req.body.permissions)) &&
      !User.isSuperAdmin(req.user.permissions)
    )
      return res.status(403).send("Access forbidden.");

    //Setting password as random one if user's password do not exist
    if (!exists(req.body.password))
      return res
        .status(400)
        .send(`"password" is required when creating an user`);

    //Create and save new user
    user = User.CreateFromPayload(req.body);

    await user.Save();

    //Building payload to return
    let payloadToReturn = await user.PayloadWithoutPassword;

    //Logging action of creating user
    logger.action(`User ${req.user.name} created user ${user.name}`);

    return res.status(200).send(payloadToReturn);
  }
);

//#endregion ========== POST ==========

//#region ========== PUT ==========

//Route for editing my user
//Editing permissions via this route is forbidden
router.put("/me", [hasUser, validate(validateUser)], async (req, res) => {
  //Finding user of given id and return 404 if not found
  let user = await User.GetUserFromFileById(req.user._id);
  if (!exists(user)) return res.status(404).send("User not found");

  //Checking if given name is proper - cannot modify name
  if (req.body.name !== user.Name)
    return res.status(400).send("Invalid name for given user");

  //Checking if given permissions is proper - cannot modify permissions via this route
  if (req.body.permissions !== user.Permissions)
    return res.status(400).send("Invalid permissions for given user");

  //Assigning ID to users payload
  req.body._id = user.ID;

  //Checking if password exists - and edit it if exists
  if (exists(req.body.password)) {
    //old Password should also be defined and has to be valid
    if (!exists(req.body.oldPassword))
      return res.status(400).send("Old password should be provided");

    let oldPasswordMatches = await hashedStringMatch(
      req.body.oldPassword,
      user.Password
    );
    if (!oldPasswordMatches)
      return res.status(400).send("Invalid old password");
  }

  //Editing user
  user.EditWithPayload(req.body, true);

  //Saving changes
  await user.Save();

  let payloadToReturn = await user.PayloadWithoutPassword();

  logger.action(`User ${req.user.name} updated their profile data`);

  return res.status(200).send(payloadToReturn);
});

//Route for editing others users
//Only admin can edit others users, and only superAdmin can admins and other superAdmins
router.put(
  "/:id",
  [hasUser, isAdmin, validateObjectId, validate(validateUser)],
  async (req, res) => {
    //Id has to be defined
    let user = await User.GetUserFromFileById(req.params.id);
    if (!exists(user)) return res.status(404).send("User not found");

    //Checking if given name is proper
    if (req.body.name !== user.Name)
      return res.status(400).send("Invalid name for given user");

    //Checking if user permissions are admin - making it possible only for superAdmin to change admins or superAdmins users
    if (
      (User.isAdmin(user.Permissions) || User.isSuperAdmin(user.Permissions)) &&
      !User.isSuperAdmin(req.user.permissions)
    )
      return res.status(403).send("Access forbidden.");

    //Changing permissions if defined in body
    if (exists(req.body.permissions)) {
      //Checking if there is an attempt to upgrade permissions to admin or super admin and user is not a super admin
      if (
        (User.isAdmin(req.body.permissions) ||
          User.isSuperAdmin(req.body.permissions)) &&
        !User.isSuperAdmin(req.user.permissions)
      )
        return res.status(403).send("Access forbidden.");
    }

    user.EditWithPayload(req.body);

    //Saving changes
    await user.Save();

    logger.action(
      `User ${req.user.name} updated profile data of user ${user.name}`
    );

    let payloadToReturn = await user.PayloadWithoutPassword();

    return res.status(200).send(payloadToReturn);
  }
);

//#endregion ========== PUT ==========

//#region ========== DELETE ==========

//Route for deleting users
//Only admin can delete users and only superAdmin can delete admins and other superAdmins
router.delete(
  "/:id",
  [hasUser, isAdmin, validateObjectId],
  async (req, res) => {
    //Searching for users to delete
    let user = await User.GetUserFromFileById(req.params.id);
    if (!exists(user)) return res.status(404).send("User not found");

    //Checking if user permissions are admin - making it possible only for superAdmin to delete admins or superAdmins and superAdmin users
    if (
      (User.isAdmin(user.Permissions) || User.isSuperAdmin(user.Permissions)) &&
      !User.isSuperAdmin(req.user.permissions)
    )
      return res.status(403).send("Access forbidden.");

    let payloadToReturn = await user.Payload();

    //Deleting user
    await User.RemoveUserFromFile(req.params.id);

    //Logging action of deleting user
    logger.action(`User ${req.user.name} deleted user ${user.name}`);

    return res.status(200).send(payloadToReturn);
  }
);

//#endregion ========== DELETE ==========

module.exports = router;
