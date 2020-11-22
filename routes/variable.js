const express = require("express");
const router = express.Router();
const {
  getVariable,
  getVariables,
  getDevice,
  getDevices,
} = require("../services/projectService");
const { exists, applyJSONParsingToRoute } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isUser = require("../middleware/auth/isUser");

applyJSONParsingToRoute(express, router);

//#region ========== GET ==========

//Route for getting all variables
//Only users can get a list of variables
router.get("/", [hasUser, isUser], async (req, res) => {
  let payloadToReturn = {};
  //null for getting all devices
  let devicesId = null;

  //Getting device ids to get varaibles from
  if (exists(req.query.deviceId)) devicesId = [req.query.deviceId];

  //Getting variables from devices
  let variables = getVariables(devicesId);
  for (let variable of Object.values(variables)) {
    payloadToReturn[variable.ID] = variable.generatePayload();
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting variable
//Only users can get variable
router.get("/:id", [hasUser, isUser], async (req, res) => {
  //null for getting all devices
  let deviceId = null;

  //Getting device ids to get elements from
  if (exists(req.query.deviceId)) deviceId = req.query.deviceId;

  let element = getVariable(deviceId, req.params.id);
  if (exists(element)) return res.status(200).send(element.generatePayload());

  //Variable not found - return 404
  return res.status(404).send("Variable not found");
});

//#endregion ========== GET ==========

module.exports = router;
