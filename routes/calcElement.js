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
  //null for getting all devices
  let devicesId = null;

  //Getting device ids to get alerts from
  if (exists(req.query.deviceId)) devicesId = [req.query.deviceId];

  //Getting calcElements from devices
  let calcElements = getCalcElements(devicesId);
  for (let calcElement of Object.values(calcElements)) {
    payloadToReturn[calcElement.ID] = calcElement.generatePayload();
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting calcElement
//Only users can get calcElement
router.get("/:id", [hasUser, isUser], async (req, res) => {
  //null for getting all devices
  let deviceId = null;

  //Getting device ids to get elements from
  if (exists(req.query.deviceId)) deviceId = req.query.deviceId;

  let element = getCalcElement(deviceId, req.params.id);
  if (exists(element)) return res.status(200).send(element.generatePayload());

  //CalcElement not found - return 404
  return res.status(404).send("CalcElement not found");
});

//#endregion ========== GET ==========

module.exports = router;
