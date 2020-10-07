const {
  sendHTTPGetToSocket,
  sendHTTPPostToSocket,
} = require("../utilities/utilities");
const logger = require("../logger/logger");

let netplanIpSocketPath = null;
let netplanIpAuthToken = null;

module.exports.init = async (socketPath, authToken) => {
  netplanIpSocketPath = socketPath;
  netplanIpAuthToken = authToken;
};

const normalizePayload = (ipContent) => {
  if (ipContent.dhcp) {
    return {
      name: ipContent.name,
      dhcp: ipContent.dhcp,
      optional: ipContent.optional,
    };
  } else {
    return {
      name: ipContent.name,
      dhcp: ipContent.dhcp,
      ipAddress: ipContent.ipAddress,
      subnetMask: ipContent.subnetMask,
      gateway: ipContent.gateway,
      dns: ipContent.dns,
      optional: ipContent.optional,
    };
  }
};

const convertInterfacesPayloadToObject = (interfacesPayload) => {
  let objectToReturn = {};

  for (let inter of interfacesPayload) {
    objectToReturn[inter.name] = normalizePayload(inter);
  }

  return objectToReturn;
};

const convertInterfacesObjectToPayload = (interfacesPayload) => {
  return Object.values(interfacesPayload);
};

module.exports.getInterfaces = async () => {
  try {
    //return null if not initialized
    if (!netplanIpSocketPath || !netplanIpAuthToken) return null;
    let response = await sendHTTPGetToSocket(netplanIpSocketPath, "/", {
      "x-auth-token": netplanIpAuthToken,
    });

    if (response.code !== 200) {
      //Invalid response code - return null
      return null;
    }

    let interfacesPayload = JSON.parse(response.message);

    return convertInterfacesPayloadToObject(interfacesPayload);
  } catch (err) {
    logger.error(err.message, err);
    //Error during communication - return null
    return null;
  }
};

module.exports.setInterfaces = async (interfacesObject) => {
  try {
    //return null if not initialized
    if (!netplanIpSocketPath || !netplanIpAuthToken) return null;

    let interfacesPayload = convertInterfacesObjectToPayload(interfacesObject);

    let response = await sendHTTPPostToSocket(
      netplanIpSocketPath,
      "/",
      {
        "x-auth-token": netplanIpAuthToken,
        "content-type": "application/json",
      },
      JSON.stringify(interfacesPayload)
    );

    if (response.code !== 200) {
      //Invalid response code - return null
      return null;
    }

    let responseInterfacesPayload = JSON.parse(response.message);

    return convertInterfacesPayloadToObject(responseInterfacesPayload);
  } catch (err) {
    logger.error(err.message, err);
    //Error during communication - return null
    return null;
  }
};

module.exports.getInterface = async (interfaceName) => {
  try {
    //return null if not initialized
    if (!netplanIpSocketPath || !netplanIpAuthToken) return null;

    let interfacesObject = await module.exports.getInterfaces();

    if (interfacesObject === null) return null;
    if (!interfacesObject[interfaceName]) return null;

    return interfacesObject[interfaceName];
  } catch (err) {
    logger.error(err.message, err);
    //Error during communication - return null
    return null;
  }
};

module.exports.setInterface = async (interfaceName, interfaceObject) => {
  try {
    //return null if not initialized
    if (!netplanIpSocketPath || !netplanIpAuthToken) return null;

    let interfacesObject = await module.exports.getInterfaces();
    if (interfacesObject === null) return null;

    let currentInterfaceSettings = interfacesObject[interfaceName];
    if (!currentInterfaceSettings) return null;

    if (interfaceName !== interfaceObject.name) return null;

    //Payload has to be normalized - in order to check parameters in case dhcp is true or false
    interfacesObject[interfaceName] = normalizePayload(interfaceObject);

    let response = await module.exports.setInterfaces(interfacesObject);

    if (response === null) return null;

    return response[interfaceName];
  } catch (err) {
    logger.error(err.message, err);
    //Error during communication - return null
    return null;
  }
};
