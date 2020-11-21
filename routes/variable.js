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
  let devicesId = [];

  //Getting device ids to get variables from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting variables from devices
  for (let deviceId of devicesId) {
    let variables = getVariables(deviceId);
    if (exists(variables)) {
      for (let variable of Object.values(variables)) {
        payloadToReturn[variable.ID] = variable.generatePayload();
      }
    }
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting variable
//Only users can get variable
router.get("/:id", [hasUser, isUser], async (req, res) => {
  let devicesId = [];

  //Getting device ids to get variable from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting variable from devices
  for (let deviceId of devicesId) {
    let variable = getVariable(deviceId, req.params.id);
    if (exists(variable))
      return res.status(200).send(variable.generatePayload());
  }

  //Variable not found - return 404
  return res.status(404).send("Variable not found");
});

//#endregion ========== GET ==========

module.exports = router;

//TODO - test this route
