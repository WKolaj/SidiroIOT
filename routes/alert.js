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
  let devicesId = [];

  //Getting device ids to get alerts from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting alerts from devices
  for (let deviceId of devicesId) {
    let alerts = getAlerts(deviceId);
    if (exists(alerts)) {
      for (let alert of Object.values(alerts)) {
        payloadToReturn[alert.ID] = alert.generatePayload();
      }
    }
  }

  return res.status(200).send(payloadToReturn);
});

//Route for getting alert
//Only users can get alert
router.get("/:id", [hasUser, isUser], async (req, res) => {
  let devicesId = [];

  //Getting device ids to get alert from
  if (exists(req.query.deviceId)) {
    devicesId = [req.query.deviceId];
  } else {
    let devices = getDevices();
    if (exists(devices)) {
      devicesId = Object.keys(devices);
    }
  }

  //Getting alert from devices
  for (let deviceId of devicesId) {
    let alert = getAlert(deviceId, req.params.id);
    if (exists(alert)) return res.status(200).send(alert.generatePayload());
  }

  //CalcElement not found - return 404
  return res.status(404).send("Alert not found");
});

//#endregion ========== GET ==========

module.exports = router;

//TODO - test this route
