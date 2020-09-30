const express = require("express");
const router = express.Router();
const config = require("config");
const _ = require("lodash");
const User = require("../models/user").User;
const validate = require("../middleware/validation/joiValidate");
const { validateCredentials } = require("../models/auth");
const {
  existsAndIsNotEmpty,
  hashedStringMatch,
  applyJSONParsingToRoute,
  snooze,
} = require("../utilities/utilities");
const headerName = config.get("tokenHeader");
const logger = require("../logger/logger");

//For this route body should be send as a JSON
applyJSONParsingToRoute(express, router);

//#region ========== POST ==========

//Route for posting authorization credentials
//User sends login and password and gets jwt in header
//Validation of payload should be applied (validating credentials according to Joi schema)
router.post("/", [validate(validateCredentials)], async (req, res) => {
  //Searching for user
  let user = await User.findOne({ email: req.body.email });

  //If user does not exsts or password given in body does not match - return 400
  if (!existsAndIsNotEmpty(user))
    return res.status(400).send("Invalid email or password");

  if (!(await hashedStringMatch(req.body.password, user.password)))
    return res.status(400).send("Invalid email or password");

  //If user exists and password matches - return users payload as a body and jwt as header

  //Creating payload to return
  let payloadToReturn = await user.getPayload();

  //assigning jwt to payload to return
  let jwt = await user.generateJWT();

  //Logging method action that user logged in
  logger.action(`User ${req.body.email} logged in`);

  return res.status(200).set(headerName, jwt).send(payloadToReturn);
});

//#endregion ========== POST ==========

module.exports = router;
