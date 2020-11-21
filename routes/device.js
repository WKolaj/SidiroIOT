const express = require("express");
const router = express.Router();
const { getDevice, getDevices } = require("../services/projectService");
const { exists, applyJSONParsingToRoute } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isUser = require("../middleware/auth/isUser");

applyJSONParsingToRoute(express, router);

//#region ========== GET ==========

//Route for getting all devices
//Only users can get a list of devices
router.get("/", [hasUser, isUser], async (req, res) => {
  let devices = getDevices();

  let payloadToReturn = {};

  //Returning empty devices if devices not exist
  if (!exists(devices)) return res.status(200).send(payloadToReturn);

  for (let device of Object.values(devices)) {
    payloadToReturn[device.ID] = device.generatePayload();
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting device
//Only users can get device
router.get("/:id", [hasUser, isUser], async (req, res) => {
  let device = getDevice(req.params.id);

  if (!exists(device)) return res.status(404).send("Device not found");

  //Building payload to return
  let payloadToReturn = device.generatePayload();

  return res.status(200).send(payloadToReturn);
});

//#endregion ========== GET ==========

module.exports = router;

//TODO - test this route
