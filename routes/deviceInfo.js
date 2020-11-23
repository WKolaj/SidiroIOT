const express = require("express");
const router = express.Router();
const devInfoService = require("../services/deviceInfo");
const projectService = require("../services/projectService");
const { applyJSONParsingToRoute, exists } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isUser = require("../middleware/auth/isUser");

//#region ========== GET ==========

//Route for getting device information
//Only User can get device info
router.get("/", [hasUser, isUser], async (req, res) => {
  let deviceInfo = await devInfoService.getDeviceInfo();

  //Adding last cycle interval
  deviceInfo.lastCycleInterval = null;

  try {
    let lastCycleInterval = projectService.getLastCycleDuration();
    if (exists(lastCycleInterval))
      deviceInfo.lastCycleInterval = lastCycleInterval;
  } catch (err) {}

  return res.status(200).send(deviceInfo);
});

//#endregion ========== GET ==========

module.exports = router;
