const express = require("express");
const router = express.Router();
const {
  getDevice,
  activateDevice,
  deactivateDevice,
} = require("../services/projectService");
const { exists, applyJSONParsingToRoute } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isUser = require("../middleware/auth/isUser");
const validate = require("../middleware/validation/joiValidate");
const { validateActivate } = require("../models/activate");

applyJSONParsingToRoute(express, router);

//#region ========== GET ==========

//Route for setting device to be active or inactive
//Only users can get device
router.post(
  "/:id",
  [hasUser, isUser, validate(validateActivate)],
  async (req, res) => {
    //Checking if device exists
    let device = getDevice(req.params.id);
    if (!exists(device)) return res.status(404).send("Device not found");

    let shouldBeActivate = req.body.isActive;
    if (shouldBeActivate) await activateDevice(req.params.id);
    else await deactivateDevice(req.params.id);

    //Building payload to return
    let payloadToReturn = device.generatePayload();

    return res.status(200).send(payloadToReturn);
  }
);

//#endregion ========== GET ==========

module.exports = router;

//TODO - test this route
