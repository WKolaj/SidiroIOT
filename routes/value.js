const express = require("express");
const router = express.Router();
const {
  getElement,
  getElements,
  getDevice,
  getDevices,
} = require("../services/projectService");
const { exists, applyJSONParsingToRoute } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isUser = require("../middleware/auth/isUser");

applyJSONParsingToRoute(express, router);

const generateValueTickPair = (element) => {
  return { lastValueTick: element.LastValueTick, value: element.Value };
};

//#region ========== GET ==========

//Route for getting all values
//Only users can get a list of values
router.get("/", [hasUser, isUser], async (req, res) => {
  let payloadToReturn = {};
  let devicesId = [];

  //Getting device ids to get elements from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting elements from devices
  for (let deviceId of devicesId) {
    let elements = getElements(deviceId);
    if (exists(elements)) {
      for (let element of Object.values(elements)) {
        payloadToReturn[element.ID] = generateValueTickPair(element);
      }
    }
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting value of element
//Only users can get values
router.get("/:id", [hasUser, isUser], async (req, res) => {
  let devicesId = [];

  //Getting device ids to get element from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting element from devices
  for (let deviceId of devicesId) {
    let element = getElement(deviceId, req.params.id);
    if (exists(element))
      return res.status(200).send(generateValueTickPair(element));
  }

  //Variable not found - return 404
  return res.status(404).send("Element not found");
});

//#endregion ========== GET ==========

module.exports = router;
