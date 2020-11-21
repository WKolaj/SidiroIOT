const express = require("express");
const router = express.Router();
const {
  getCalcElement,
  getCalcElements,
  getDevice,
  getDevices,
} = require("../services/projectService");
const { exists, applyJSONParsingToRoute } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isUser = require("../middleware/auth/isUser");

applyJSONParsingToRoute(express, router);

//#region ========== GET ==========

//Route for getting all calcElements
//Only users can get a list of calcElements
router.get("/", [hasUser, isUser], async (req, res) => {
  let payloadToReturn = {};
  let devicesId = [];

  //Getting device ids to get calcElements from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting calcElements from devices
  for (let deviceId of devicesId) {
    let calcElements = getCalcElements(deviceId);
    if (exists(calcElements)) {
      for (let calcElement of Object.values(calcElements)) {
        payloadToReturn[calcElement.ID] = calcElement.generatePayload();
      }
    }
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting calcElement
//Only users can get calcElement
router.get("/:id", [hasUser, isUser], async (req, res) => {
  let devicesId = [];

  //Getting device ids to get calcElement from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting calcElement from devices
  for (let deviceId of devicesId) {
    let calcElement = getCalcElement(deviceId, req.params.id);
    if (exists(calcElement))
      return res.status(200).send(calcElement.generatePayload());
  }

  //CalcElement not found - return 404
  return res.status(404).send("CalcElement not found");
});

//#endregion ========== GET ==========

module.exports = router;

//TODO - test this route
