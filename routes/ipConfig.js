const express = require("express");
const router = express.Router();
const { validateNetplanInterface } = require("../models/ipConfig");
const validate = require("../middleware/validation/joiValidate");
const {
  exists,
  hashString,
  hashedStringMatch,
  applyJSONParsingToRoute,
} = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isAdmin = require("../middleware/auth/isAdmin");
const isUser = require("../middleware/auth/isUser");
const _ = require("lodash");
const logger = require("../logger/logger");
const netplanService = require("../services/netplanService");

applyJSONParsingToRoute(express, router);

const getInterfacePayloadToReturn = (interPayload) => {
  let payloadToReturn = {
    name: interPayload.name,
    dhcp: interPayload.dhcp,
  };

  if (!interPayload.dhcp) {
    payloadToReturn.ipAddress = interPayload.ipAddress;
    payloadToReturn.subnetMask = interPayload.subnetMask;
    payloadToReturn.gateway = interPayload.gateway;
    payloadToReturn.dns = interPayload.dns;
  }

  return payloadToReturn;
};

//#region ========== GET ==========

//Route for getting all interfaces settings
router.get("/", [hasUser, isUser], async (req, res) => {
  //Getting all interfaces from netplan
  var allInterfaces = await netplanService.getInterfaces();

  if (allInterfaces === null)
    return res.status(500).send("Could not get interfaces - internal error!");

  //Converting interfaces to return - deleting optional property
  let interfacesToReturn = {};

  for (let interfaceName of Object.keys(allInterfaces)) {
    let interfacePayload = allInterfaces[interfaceName];
    interfacesToReturn[interfaceName] = getInterfacePayloadToReturn(
      interfacePayload
    );
  }

  return res.status(200).send(interfacesToReturn);
});

//Route for getting information about given interface
//Only users can get info about theirselves
router.get("/:interfaceName", [hasUser, isUser], async (req, res) => {
  let interfaceConfig = await netplanService.getInterface(
    req.params.interfaceName
  );

  if (!exists(interfaceConfig))
    return res.status(404).send("No interface of given name found!");

  return res.status(200).send(getInterfacePayloadToReturn(interfaceConfig));
});

//#region ========== PUT ==========

//Route for editing netplan interface
//Only admin get edit interfaces
router.put(
  "/:interfaceName",
  [hasUser, isAdmin, validate(validateNetplanInterface)],
  async (req, res) => {
    let interfaceConfig = await netplanService.getInterface(
      req.params.interfaceName
    );

    if (!exists(interfaceConfig))
      return res.status(404).send("No interface of given name found!");

    //Checking if there is an attempt to change name of interface
    if (interfaceConfig.name !== req.body.name)
      return res.status(400).send("Name of interface cannot be changed!");

    //Always setting optional to true in interfaces - cloudInit requirements
    req.body.optional = true;

    let newInterfacePayload = await netplanService.setInterface(
      req.params.interfaceName,
      req.body
    );

    if (!exists(newInterfacePayload))
      return res.status(500).send("Error during editing interface");

    return res
      .status(200)
      .send(getInterfacePayloadToReturn(newInterfacePayload));
  }
);

module.exports = router;
