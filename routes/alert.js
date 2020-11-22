const express = require("express");
const router = express.Router();
const {
  getAlert,
  getAlerts,
  getDevice,
  getDevices,
} = require("../services/projectService");
const { exists, applyJSONParsingToRoute } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isUser = require("../middleware/auth/isUser");

applyJSONParsingToRoute(express, router);

//#region ========== GET ==========

//Route for getting all alerts
//Only users can get a list of alerts
router.get("/", [hasUser, isUser], async (req, res) => {
  let payloadToReturn = {};
  //null for getting all devices
  let devicesId = null;

  //Getting device ids to get alerts from
  if (exists(req.query.deviceId)) devicesId = [req.query.deviceId];

  //Getting alerts from devices
  let alerts = getAlerts(devicesId);
  for (let alert of Object.values(alerts)) {
    payloadToReturn[alert.ID] = alert.generatePayload();
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting alert
//Only users can get alert
router.get("/:id", [hasUser, isUser], async (req, res) => {
  //null for getting all devices
  let deviceId = null;

  //Getting device ids to get elements from
  if (exists(req.query.deviceId)) deviceId = req.query.deviceId;

  let element = getAlert(deviceId, req.params.id);
  if (exists(element)) return res.status(200).send(element.generatePayload());

  //CalcElement not found - return 404
  return res.status(404).send("Alert not found");
});

//#endregion ========== GET ==========

module.exports = router;
