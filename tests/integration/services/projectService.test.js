const {
  createNewProjectFile,
  getProjectContentFromFile,
  deactivateDevice,
} = require("../../../services/projectService");

const AgentsDirPath = "__testDir/settings/agentsData";

describe("projectService", () => {
  let _;
  let path;
  let request;
  let config;
  let jsonWebToken;
  let readFileAsync;
  let checkIfFileExistsAsync;
  let writeFileAsync;
  let roundToPrecision;
  let removeFileIfExistsAsync;
  let exists;
  let settingsDirFilePath;
  let socketFilePath;
  let projectFilePath;
  let logger;
  let projectService;
  let netplanService;
  let runIPConfigServer;
  let ipConfigMockServer;
  let initialIPServerContent;
  let logActionMock;
  let logErrorMock;

  beforeEach(async () => {
    jest.setTimeout(30000);
    jest.resetAllMocks();
    jest.resetModules();
    ipConfigMockServer = require("../../utilities/fakeIPService");
    _ = require("lodash");
    path = require("path");
    request = require("supertest");
    config = require("config");
    jsonWebToken = require("jsonwebtoken");
    projectService = require("../../../services/projectService");
    netplanService = require("../../../services/netplanService");
    logger = require("../../../logger/logger");
    let utilities = require("../../../utilities/utilities");
    readFileAsync = utilities.readFileAsync;
    writeFileAsync = utilities.writeFileAsync;
    checkIfFileExistsAsync = utilities.checkIfFileExistsAsync;
    roundToPrecision = utilities.roundToPrecision;
    removeFileIfExistsAsync = utilities.removeFileIfExistsAsync;
    exists = utilities.exists;
    settingsDirFilePath = config.get("settingsPath");
    let projectFileName = (projectFilePath = config.get("projectFileName"));
    socketFilePath = config.get("netplanConfigSocketFilePath");
    projectFilePath = path.join(settingsDirFilePath, projectFileName);

    //Clearing socket file if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Initializing netplan service
    await require("../../../startup/netplan")();

    //Overwriting logger action method
    logActionMock = jest.fn();
    logger.action = logActionMock;

    //Overwriting logger error method
    logErrorMock = jest.fn();
    logger.error = logErrorMock;

    runIPConfigServer = true;

    initialIPServerContent = [
      {
        name: "eth1",
        dhcp: true,
        optional: true,
      },
      {
        name: "eth2",
        dhcp: true,
        optional: false,
      },
      {
        name: "eth3",
        dhcp: false,
        optional: true,
        ipAddress: "10.10.10.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.10.1",
        dns: ["10.10.10.1", "1.1.1.1"],
      },
    ];
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();

    //Clearing socket file if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    if (ipConfigMockServer) {
      await ipConfigMockServer.Stop();
      ipConfigMockServer = null;
    }
  });

  const initTest = async () => {
    if (runIPConfigServer) {
      await ipConfigMockServer.Start();
      ipConfigMockServer._setContent(initialIPServerContent);
    }
  };

  const generateInitialProjectPayload = () => {
    return JSON.parse(
      JSON.stringify({
        ipConfig: {
          eth1: {
            name: "eth1",
            dhcp: true,
            optional: true,
          },
          eth2: {
            name: "eth2",
            dhcp: true,
            optional: true,
          },
        },
        data: {
          connectableDevices: {
            connectableDeviceID1: {
              id: "connectableDeviceID1",
              name: "connectableDeviceName1",
              type: "MBDevice",
              variables: {
                connectableDeviceID1Variable1ID: {
                  id: "connectableDeviceID1Variable1ID",
                  name: "connectableDeviceID1Variable1Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID1Variable2ID: {
                  id: "connectableDeviceID1Variable2ID",
                  name: "connectableDeviceID1Variable2Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID1Variable3ID: {
                  id: "connectableDeviceID1Variable3ID",
                  name: "connectableDeviceID1Variable3Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID1Variable4ID: {
                  id: "connectableDeviceID1Variable4ID",
                  name: "connectableDeviceID1Variable4Name",
                  type: "DeviceConnectionVariable",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: false,
                },
              },
              calcElements: {
                connectableDeviceID1CalcElement1ID: {
                  id: "connectableDeviceID1CalcElement1ID",
                  name: "connectableDeviceID1CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID1Variable1ID",
                  factor: 10,
                },
                connectableDeviceID1CalcElement2ID: {
                  id: "connectableDeviceID1CalcElement2ID",
                  name: "connectableDeviceID1CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID1Variable2ID",
                  factor: 20,
                },
                connectableDeviceID1CalcElement3ID: {
                  id: "connectableDeviceID1CalcElement3ID",
                  name: "connectableDeviceID1CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID1Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID1Alert1ID: {
                  id: "connectableDeviceID1Alert1ID",
                  name: "connectableDeviceID1Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID1Variable1ID",
                  highLimit: 100,
                },
                connectableDeviceID1Alert2ID: {
                  id: "connectableDeviceID1Alert2ID",
                  name: "connectableDeviceID1Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID1Variable2ID",
                  lowLimit: 100,
                },
                connectableDeviceID1Alert3ID: {
                  id: "connectableDeviceID1Alert3ID",
                  name: "connectableDeviceID1Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID1Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: false,
              ipAddress: "192.168.0.1",
              portNumber: 502,
              timeout: 500,
            },
            connectableDeviceID2: {
              id: "connectableDeviceID2",
              name: "connectableDeviceName2",
              type: "MBDevice",
              variables: {
                connectableDeviceID2Variable1ID: {
                  id: "connectableDeviceID2Variable1ID",
                  name: "connectableDeviceID2Variable1Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID2Variable2ID: {
                  id: "connectableDeviceID2Variable2ID",
                  name: "connectableDeviceID2Variable2Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID2Variable3ID: {
                  id: "connectableDeviceID2Variable3ID",
                  name: "connectableDeviceID2Variable3Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID2Variable4ID: {
                  id: "connectableDeviceID2Variable4ID",
                  name: "connectableDeviceID2Variable4Name",
                  type: "DeviceConnectionVariable",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: false,
                },
              },
              calcElements: {
                connectableDeviceID2CalcElement1ID: {
                  id: "connectableDeviceID2CalcElement1ID",
                  name: "connectableDeviceID2CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID2Variable1ID",
                  factor: 10,
                },
                connectableDeviceID2CalcElement2ID: {
                  id: "connectableDeviceID2CalcElement2ID",
                  name: "connectableDeviceID2CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID2Variable2ID",
                  factor: 20,
                },
                connectableDeviceID2CalcElement3ID: {
                  id: "connectableDeviceID2CalcElement3ID",
                  name: "connectableDeviceID2CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID2Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID2Alert1ID: {
                  id: "connectableDeviceID2Alert1ID",
                  name: "connectableDeviceID2Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID2Variable1ID",
                  highLimit: 100,
                },
                connectableDeviceID2Alert2ID: {
                  id: "connectableDeviceID2Alert2ID",
                  name: "connectableDeviceID2Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID2Variable2ID",
                  lowLimit: 100,
                },
                connectableDeviceID2Alert3ID: {
                  id: "connectableDeviceID2Alert3ID",
                  name: "connectableDeviceID2Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID2Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: false,
              ipAddress: "192.168.0.2",
              portNumber: 502,
              timeout: 500,
            },
            connectableDeviceID3: {
              id: "connectableDeviceID3",
              name: "connectableDeviceName3",
              type: "MBDevice",
              variables: {
                connectableDeviceID3Variable1ID: {
                  id: "connectableDeviceID3Variable1ID",
                  name: "connectableDeviceID3Variable1Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID3Variable2ID: {
                  id: "connectableDeviceID3Variable2ID",
                  name: "connectableDeviceID3Variable2Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID3Variable3ID: {
                  id: "connectableDeviceID3Variable3ID",
                  name: "connectableDeviceID3Variable3Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID3Variable4ID: {
                  id: "connectableDeviceID3Variable4ID",
                  name: "connectableDeviceID3Variable4Name",
                  type: "DeviceConnectionVariable",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: false,
                },
              },
              calcElements: {
                connectableDeviceID3CalcElement1ID: {
                  id: "connectableDeviceID3CalcElement1ID",
                  name: "connectableDeviceID3CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID3Variable1ID",
                  factor: 10,
                },
                connectableDeviceID3CalcElement2ID: {
                  id: "connectableDeviceID3CalcElement2ID",
                  name: "connectableDeviceID3CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID3Variable2ID",
                  factor: 20,
                },
                connectableDeviceID3CalcElement3ID: {
                  id: "connectableDeviceID3CalcElement3ID",
                  name: "connectableDeviceID3CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID3Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID3Alert1ID: {
                  id: "connectableDeviceID3Alert1ID",
                  name: "connectableDeviceID3Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID3Variable1ID",
                  highLimit: 100,
                },
                connectableDeviceID3Alert2ID: {
                  id: "connectableDeviceID3Alert2ID",
                  name: "connectableDeviceID3Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID3Variable2ID",
                  lowLimit: 100,
                },
                connectableDeviceID3Alert3ID: {
                  id: "connectableDeviceID3Alert3ID",
                  name: "connectableDeviceID3Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID3Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: false,
              ipAddress: "192.168.0.3",
              portNumber: 502,
              timeout: 500,
            },
            connectableDeviceID4: {
              id: "connectableDeviceID4",
              name: "connectableDeviceName3",
              type: "S7Device",
              variables: {
                connectableDeviceID4Variable1ID: {
                  id: "connectableDeviceID4Variable1ID",
                  name: "connectableDeviceID4Variable1Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID4Variable2ID: {
                  id: "connectableDeviceID4Variable2ID",
                  name: "connectableDeviceID4Variable2Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID4Variable3ID: {
                  id: "connectableDeviceID4Variable3ID",
                  name: "connectableDeviceID4Variable3Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID4Variable4ID: {
                  id: "connectableDeviceID4Variable4ID",
                  name: "connectableDeviceID4Variable4Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 7,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
              },
              calcElements: {
                connectableDeviceID4CalcElement1ID: {
                  id: "connectableDeviceID4CalcElement1ID",
                  name: "connectableDeviceID4CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID4Variable1ID",
                  factor: 10,
                },
                connectableDeviceID4CalcElement2ID: {
                  id: "connectableDeviceID4CalcElement2ID",
                  name: "connectableDeviceID4CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID4Variable2ID",
                  factor: 20,
                },
                connectableDeviceID4CalcElement3ID: {
                  id: "connectableDeviceID4CalcElement3ID",
                  name: "connectableDeviceID4CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID4Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID4Alert1ID: {
                  id: "connectableDeviceID4Alert1ID",
                  name: "connectableDeviceID4Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID4Variable1ID",
                  highLimit: 100,
                },
                connectableDeviceID4Alert2ID: {
                  id: "connectableDeviceID4Alert2ID",
                  name: "connectableDeviceID4Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID4Variable2ID",
                  lowLimit: 100,
                },
                connectableDeviceID4Alert3ID: {
                  id: "connectableDeviceID4Alert3ID",
                  name: "connectableDeviceID4Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID4Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: false,
              ipAddress: "192.168.0.4",
              rack: 0,
              slot: 1,
              timeout: 500,
            },
            connectableDeviceID5: {
              id: "connectableDeviceID5",
              name: "connectableDeviceName3",
              type: "S7Device",
              variables: {
                connectableDeviceID5Variable1ID: {
                  id: "connectableDeviceID5Variable1ID",
                  name: "connectableDeviceID5Variable1Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID5Variable2ID: {
                  id: "connectableDeviceID5Variable2ID",
                  name: "connectableDeviceID5Variable2Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID5Variable3ID: {
                  id: "connectableDeviceID5Variable3ID",
                  name: "connectableDeviceID5Variable3Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID5Variable4ID: {
                  id: "connectableDeviceID5Variable4ID",
                  name: "connectableDeviceID5Variable4Name",
                  type: "S7Int",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 7,
                  length: 2,
                  read: true,
                  write: false,
                  memoryType: "DB",
                  dbNumber: 3,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
              },
              calcElements: {
                connectableDeviceID5CalcElement1ID: {
                  id: "connectableDeviceID5CalcElement1ID",
                  name: "connectableDeviceID5CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID5Variable1ID",
                  factor: 10,
                },
                connectableDeviceID5CalcElement2ID: {
                  id: "connectableDeviceID5CalcElement2ID",
                  name: "connectableDeviceID5CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID5Variable2ID",
                  factor: 20,
                },
                connectableDeviceID5CalcElement3ID: {
                  id: "connectableDeviceID5CalcElement3ID",
                  name: "connectableDeviceID5CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID5Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID5Alert1ID: {
                  id: "connectableDeviceID5Alert1ID",
                  name: "connectableDeviceID5Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID5Variable1ID",
                  highLimit: 100,
                },
                connectableDeviceID5Alert2ID: {
                  id: "connectableDeviceID5Alert2ID",
                  name: "connectableDeviceID5Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID5Variable2ID",
                  lowLimit: 100,
                },
                connectableDeviceID5Alert3ID: {
                  id: "connectableDeviceID5Alert3ID",
                  name: "connectableDeviceID5Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID5Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: false,
              ipAddress: "192.168.0.5",
              rack: 2,
              slot: 3,
              timeout: 500,
            },
          },
          internalDevices: {
            internalDeviceID1: {
              id: "internalDeviceID1",
              name: "internalDeviceName1",
              type: "InternalDevice",
              variables: {
                internalDeviceID1Variable1ID: {
                  id: "internalDeviceID1Variable1ID",
                  name: "internalDeviceID1Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID1",
                  associatedElementID: "connectableDeviceID1Variable1ID",
                },
                internalDeviceID1Variable2ID: {
                  id: "internalDeviceID1Variable2ID",
                  name: "internalDeviceID1Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID1",
                  associatedElementID: "connectableDeviceID1Variable2ID",
                },
                internalDeviceID1Variable3ID: {
                  id: "internalDeviceID1Variable3ID",
                  name: "internalDeviceID1Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID1",
                  associatedElementID: "connectableDeviceID1Variable3ID",
                },
              },
              calcElements: {
                internalDeviceID1CalcElement1ID: {
                  id: "internalDeviceID1CalcElement1ID",
                  name: "internalDeviceID1CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID1Variable1ID",
                  factor: 10,
                },
                internalDeviceID1CalcElement2ID: {
                  id: "internalDeviceID1CalcElement2ID",
                  name: "internalDeviceID1CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID1Variable2ID",
                  factor: 20,
                },
                internalDeviceID1CalcElement3ID: {
                  id: "internalDeviceID1CalcElement3ID",
                  name: "internalDeviceID1CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID1Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                internalDeviceID1Alert1ID: {
                  id: "internalDeviceID1Alert1ID",
                  name: "internalDeviceID1Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID1Variable1ID",
                  highLimit: 100,
                },
                internalDeviceID1Alert2ID: {
                  id: "internalDeviceID1Alert2ID",
                  name: "internalDeviceID1Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID1Variable2ID",
                  lowLimit: 100,
                },
                internalDeviceID1Alert3ID: {
                  id: "internalDeviceID1Alert3ID",
                  name: "internalDeviceID1Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID1Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: true,
            },
            internalDeviceID2: {
              id: "internalDeviceID2",
              name: "internalDeviceName2",
              type: "InternalDevice",
              variables: {
                internalDeviceID2Variable1ID: {
                  id: "internalDeviceID2Variable1ID",
                  name: "internalDeviceID2Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID2",
                  associatedElementID: "connectableDeviceID2Variable1ID",
                },
                internalDeviceID2Variable2ID: {
                  id: "internalDeviceID2Variable2ID",
                  name: "internalDeviceID2Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID2",
                  associatedElementID: "connectableDeviceID2Variable2ID",
                },
                internalDeviceID2Variable3ID: {
                  id: "internalDeviceID2Variable3ID",
                  name: "internalDeviceID2Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID2",
                  associatedElementID: "connectableDeviceID2Variable3ID",
                },
              },
              calcElements: {
                internalDeviceID2CalcElement1ID: {
                  id: "internalDeviceID2CalcElement1ID",
                  name: "internalDeviceID2CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID2Variable1ID",
                  factor: 10,
                },
                internalDeviceID2CalcElement2ID: {
                  id: "internalDeviceID2CalcElement2ID",
                  name: "internalDeviceID2CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID2Variable2ID",
                  factor: 20,
                },
                internalDeviceID2CalcElement3ID: {
                  id: "internalDeviceID2CalcElement3ID",
                  name: "internalDeviceID2CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID2Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                internalDeviceID2Alert1ID: {
                  id: "internalDeviceID2Alert1ID",
                  name: "internalDeviceID2Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID2Variable1ID",
                  highLimit: 100,
                },
                internalDeviceID2Alert2ID: {
                  id: "internalDeviceID2Alert2ID",
                  name: "internalDeviceID2Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID2Variable2ID",
                  lowLimit: 100,
                },
                internalDeviceID2Alert3ID: {
                  id: "internalDeviceID2Alert3ID",
                  name: "internalDeviceID2Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID2Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: true,
            },
            internalDeviceID3: {
              id: "internalDeviceID3",
              name: "internalDeviceName3",
              type: "InternalDevice",
              variables: {
                internalDeviceID3Variable1ID: {
                  id: "internalDeviceID3Variable1ID",
                  name: "internalDeviceID3Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID3",
                  associatedElementID: "connectableDeviceID3Variable1ID",
                },
                internalDeviceID3Variable2ID: {
                  id: "internalDeviceID3Variable2ID",
                  name: "internalDeviceID3Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID3",
                  associatedElementID: "connectableDeviceID3Variable2ID",
                },
                internalDeviceID3Variable3ID: {
                  id: "internalDeviceID3Variable3ID",
                  name: "internalDeviceID3Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID3",
                  associatedElementID: "connectableDeviceID3Variable3ID",
                },
              },
              calcElements: {
                internalDeviceID3CalcElement1ID: {
                  id: "internalDeviceID3CalcElement1ID",
                  name: "internalDeviceID3CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID3Variable1ID",
                  factor: 10,
                },
                internalDeviceID3CalcElement2ID: {
                  id: "internalDeviceID3CalcElement2ID",
                  name: "internalDeviceID3CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID3Variable2ID",
                  factor: 20,
                },
                internalDeviceID3CalcElement3ID: {
                  id: "internalDeviceID3CalcElement3ID",
                  name: "internalDeviceID3CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID3Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                internalDeviceID3Alert1ID: {
                  id: "internalDeviceID3Alert1ID",
                  name: "internalDeviceID3Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID3Variable1ID",
                  highLimit: 100,
                },
                internalDeviceID3Alert2ID: {
                  id: "internalDeviceID3Alert2ID",
                  name: "internalDeviceID3Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID3Variable2ID",
                  lowLimit: 100,
                },
                internalDeviceID3Alert3ID: {
                  id: "internalDeviceID3Alert3ID",
                  name: "internalDeviceID3Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID3Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: true,
            },
          },
          agentDevices: {
            agentDeviceID1: {
              id: "agentDeviceID1",
              name: "agentDeviceID1Name",
              type: "MSAgentDevice",
              variables: {
                agentDeviceID1Variable1ID: {
                  id: "agentDeviceID1Variable1ID",
                  name: "agentDeviceID1Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID1",
                  associatedElementID: "connectableDeviceID1Variable1ID",
                },
                agentDeviceID1Variable2ID: {
                  id: "agentDeviceID1Variable2ID",
                  name: "agentDeviceID1Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID1",
                  associatedElementID: "connectableDeviceID1Variable2ID",
                },
                agentDeviceID1Variable3ID: {
                  id: "agentDeviceID1Variable3ID",
                  name: "agentDeviceID1Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID1",
                  associatedElementID: "connectableDeviceID1Variable3ID",
                },
              },
              calcElements: {
                agentDeviceID1CalcElement1ID: {
                  id: "agentDeviceID1CalcElement1ID",
                  name: "agentDeviceID1CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "agentDeviceID1Variable1ID",
                  factor: 10,
                },
                agentDeviceID1CalcElement2ID: {
                  id: "agentDeviceID1CalcElement2ID",
                  name: "agentDeviceID1CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "agentDeviceID1Variable2ID",
                  factor: 20,
                },
                agentDeviceID1CalcElement3ID: {
                  id: "agentDeviceID1CalcElement3ID",
                  name: "agentDeviceID1CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "agentDeviceID1Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                agentDeviceID1Alert1ID: {
                  id: "agentDeviceID1Alert1ID",
                  name: "agentDeviceID1Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "agentDeviceID1Variable1ID",
                  highLimit: 100,
                },
                agentDeviceID1Alert2ID: {
                  id: "agentDeviceID1Alert2ID",
                  name: "agentDeviceID1Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "agentDeviceID1Variable2ID",
                  lowLimit: 100,
                },
                agentDeviceID1Alert3ID: {
                  id: "agentDeviceID1Alert3ID",
                  name: "agentDeviceID1Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "agentDeviceID1Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                },
              },
              isActive: true,
              sendDataFileInterval: 60,
              sendEventFileInterval: 5,
              dataStorageSize: 100,
              eventStorageSize: 100,
              numberOfDataFilesToSend: 3,
              numberOfEventFilesToSend: 3,
              dataToSendConfig: {
                connectableDeviceID1Variable1ID: {
                  elementId: "connectableDeviceID1Variable1ID",
                  deviceId: "connectableDeviceID1",
                  datapointId: "connectableDeviceID1Variable1IDdpID1",
                  sendingInterval: 60,
                  qualityCodeEnabled: true,
                  dataConverter: { conversionType: "fixed", precision: 3 },
                },
                connectableDeviceID2Variable1ID: {
                  elementId: "connectableDeviceID2Variable1ID",
                  deviceId: "connectableDeviceID2",
                  datapointId: "connectableDeviceID2Variable1IDdpID1",
                  sendingInterval: 60,
                  qualityCodeEnabled: true,
                  dataConverter: { conversionType: "fixed", precision: 3 },
                },
                connectableDeviceID1Variable2ID: {
                  elementId: "connectableDeviceID1Variable2ID",
                  deviceId: "connectableDeviceID1",
                  datapointId: "connectableDeviceID1Variable2IDdpID1",
                  sendingInterval: 60,
                  qualityCodeEnabled: true,
                  dataConverter: { conversionType: "fixed", precision: 3 },
                },
              },
              eventsToSendConfig: {},
              numberOfSendDataRetries: 3,
              numberOfSendEventRetries: 3,
              boardingKey: {
                content: {
                  baseUrl: "https://southgate.eu1.mindsphere.io",
                  iat: "fakeIAT",
                  clientCredentialProfile: ["SHARED_SECRET"],
                  clientId: "fakeClientID",
                  tenant: "fakeTenantName",
                },
                expiration: "2020-12-18T11:15:08.000Z",
              },
            },
          },
        },
      })
    );
  };

  describe("validateProjectPayload", () => {
    let payload;

    beforeEach(async () => {
      payload = generateInitialProjectPayload();
    });

    let exec = async () => {
      return projectService.validateProjectPayload(payload);
    };

    it("should return null if payload of project is valid", async () => {
      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return message if ipConfig is not present", async () => {
      delete payload.ipConfig;

      let result = await exec();

      expect(result).toEqual(`"ipConfig" is required`);
    });

    it("should return null if payload of project is valid - ipConfig is empty", async () => {
      payload.ipConfig = {};

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return message if payload of project is invalid - ipConfig is null", async () => {
      payload.ipConfig = null;

      let result = await exec();

      expect(result).toEqual(`"ipConfig" cannot be null`);
    });

    it("should return message if payload of project is invalid - one of ipConfig interface is invalid", async () => {
      payload.ipConfig = {
        eth1: {
          dhcp: true,
          optional: true,
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };

      let result = await exec();

      expect(result).toEqual(`"name" is required`);
    });

    it("should return message if payload of project is invalid - one of ipConfig interface is invalid - key does not fit", async () => {
      payload.ipConfig = {
        eth1: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };

      let result = await exec();

      expect(result).toEqual(`interface name as key and in payload differ!`);
    });

    it("should return message if payload of project is invalid - data is not present", async () => {
      delete payload.data;

      let result = await exec();

      expect(result).toEqual(`"data" is required`);
    });

    it("should return message if payload of project is invalid - data is null", async () => {
      payload.data = null;

      let result = await exec();

      expect(result).toEqual(
        `Invalid project data: "value" must be of type object`
      );
    });

    it("should return message if payload of project is invalid - data.connectableDevices is not present", async () => {
      delete payload.data.connectableDevices;

      let result = await exec();

      expect(result).toEqual(
        `Invalid project data: "connectableDevices" is required`
      );
    });

    it("should return message if payload of project is invalid - data.internalDevices is not present", async () => {
      delete payload.data.internalDevices;

      let result = await exec();

      expect(result).toEqual(
        `Invalid project data: "internalDevices" is required`
      );
    });

    it("should return message if payload of project is invalid - data.agentDevices is not present", async () => {
      delete payload.data.agentDevices;

      let result = await exec();

      expect(result).toEqual(
        `Invalid project data: "agentDevices" is required`
      );
    });

    it("should return message if payload of project is invalid - one of variables payload is invalid", async () => {
      payload.data.internalDevices.internalDeviceID2.variables.internalDeviceID2Variable2ID.type =
        "FakeType";

      let result = await exec();

      expect(result).toEqual(
        `Invalid project data: variable type not recognized`
      );
    });

    it("should return message if payload of project is invalid - device payload is invalid", async () => {
      payload.data.internalDevices.internalDeviceID2.type = "FakeType";

      let result = await exec();

      expect(result).toEqual(
        `Invalid project data: internal device type not recognized`
      );
    });
  });

  describe("getProjectContentFromFile", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);

      return projectService.getProjectContentFromFile();
    };

    it("should return project content from file", async () => {
      let result = await exec();

      expect(result).toEqual(initialProjectFileContent);
    });

    it("should return project content from file - if content is empty", async () => {
      initialProjectFileContent = {};

      let result = await exec();

      expect(result).toEqual(initialProjectFileContent);
    });

    it("should throw if there is no file", async () => {
      createInitialProjectFile = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("no such file or directory");
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("project service not initialized");
    });
  });

  describe("saveProjectContentToFile", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let contentToSaveProjectFile;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = {
        ipConfig: {
          eth1: {
            name: "eth1",
            dhcp: true,
            optional: true,
          },
          eth2: {
            name: "eth2",
            dhcp: true,
            optional: true,
          },
        },
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      };
      contentToSaveProjectFile = generateInitialProjectPayload();
      contentToSaveProjectFile.ipConfig = {
        eth2: {
          name: "eth2",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.10.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.10.1",
          dns: ["10.10.10.1", "1.1.1.1"],
        },
        eth3: {
          name: "eth3",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1", "2.2.2.2"],
        },
      };
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);

      return projectService.saveProjectContentToFile(contentToSaveProjectFile);
    };

    it("should edit project file content", async () => {
      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(contentToSaveProjectFile);
    });

    it("should edit project file content - if initial content is empty", async () => {
      //In the future it can change - after adding project content validation
      initialProjectFileContent = {};

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(contentToSaveProjectFile);
    });

    it("should not throw if there is no file", async () => {
      createInitialProjectFile = false;

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(contentToSaveProjectFile);
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("project service not initialized");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is undefined", async () => {
      contentToSaveProjectFile = undefined;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("project content must exists!");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is null", async () => {
      contentToSaveProjectFile = null;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("project content must exists!");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - data is an empty object", async () => {
      contentToSaveProjectFile.data = {};

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(
        `Invalid project data: "connectableDevices" is required`
      );

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - no ipConfig", async () => {
      delete contentToSaveProjectFile.ipConfig;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(`"ipConfig" is required`);

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - no data", async () => {
      delete contentToSaveProjectFile.data;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(`"data" is required`);

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - invalid data", async () => {
      //Overriding type of one of variable
      contentToSaveProjectFile.data.internalDevices.internalDeviceID2.variables.internalDeviceID2Variable2ID.type =
        "FakeType";

      let error = null;
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(
        `Invalid project data: variable type not recognized`
      );

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - ipConfig is null", async () => {
      contentToSaveProjectFile.ipConfig = null;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(`"ipConfig" cannot be null`);

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - invalid ipConfig - null", async () => {
      //Overriding type of one of variable
      contentToSaveProjectFile.ipConfig = null;

      let error = null;
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(`"ipConfig" cannot be null`);

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - invalid one of interfaces of ipConfig", async () => {
      //Overriding type of one of variable
      contentToSaveProjectFile.ipConfig = {
        eth1: {
          dhcp: true,
          optional: true,
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };

      let error = null;
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(`"name" is required`);

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is not a valid content of project - invalid one of interfaces of ipConfig - key does not fit", async () => {
      //Overriding type of one of variable
      contentToSaveProjectFile.ipConfig = {
        eth1: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };

      let error = null;
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(
        `interface name as key and in payload differ!`
      );

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });

  describe("createNewProjectFile", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let ipConfigContent;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      initialProjectFileContent.ipConfig = {
        eth1: {
          name: "eth1",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.13.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.13.1",
          dns: ["10.10.13.1", "1.1.1.1"],
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);

      await projectService.createNewProjectFile();
    };

    it("should create completely new project file with content from ipConfig - if project file already exists", async () => {
      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      };

      for (let inter of initialIPServerContent) {
        expectedContent.ipConfig[inter.name] = inter;
      }

      expect(fileContent).toEqual(expectedContent);
    });

    it("should create completely new project file with content from ipConfig - if project file doen't exist", async () => {
      createInitialProjectFile = false;

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      };

      for (let inter of initialIPServerContent) {
        expectedContent.ipConfig[inter.name] = inter;
      }

      expect(fileContent).toEqual(expectedContent);
    });

    it("should create completely new project file with content from ipConfig - even if netplan service is down", async () => {
      runIPConfigServer = false;

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should create completely new project file with content from ipConfig - if netplan service contains empty array of interfaces", async () => {
      initialIPServerContent = [];

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should throw and not create new project file - if project service was not initialized", async () => {
      createInitialProjectFile = false;
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");

      //Project file should not have been created
      let fileExists = await checkIfFileExistsAsync(projectFilePath);

      expect(fileExists).toEqual(false);
    });
  });

  describe("checkIfProjFileExistsAndIsValid", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      initialProjectFileContent.ipConfig = {
        eth1: {
          name: "eth1",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.13.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.13.1",
          dns: ["10.10.13.1", "1.1.1.1"],
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);

      return projectService.checkIfProjFileExistsAndIsValid();
    };

    it("should return true if project file exists and is valid", async () => {
      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return true if project file exists and ipConfig is empty", async () => {
      initialProjectFileContent.ipConfig = {};

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false if project file does not exist", async () => {
      createInitialProjectFile = false;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains not valid project payload - lack of data", async () => {
      delete initialProjectFileContent.data;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains not valid project payload - lack of connectableDevices", async () => {
      delete initialProjectFileContent.data.connectableDevices;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains not valid project payload - lack of internalDevices", async () => {
      delete initialProjectFileContent.data.internalDevices;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains not valid project payload - lack of agentDevices", async () => {
      delete initialProjectFileContent.data.agentDevices;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains not valid project payload - invalid device payload", async () => {
      //Overriding type of one of variable
      initialProjectFileContent.data.internalDevices.internalDeviceID2.type =
        "FakeType";

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains not valid project payload - invalid variable payload", async () => {
      //Overriding type of one of variable
      initialProjectFileContent.data.internalDevices.internalDeviceID2.variables.internalDeviceID2Variable2ID.type =
        "FakeType";

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains the same ids in devices", async () => {
      let internalDevice2 =
        initialProjectFileContent.data.internalDevices.internalDeviceID2;
      delete initialProjectFileContent.data.internalDevices.internalDeviceID2;

      internalDevice2.id = "connectableDeviceID2";
      initialProjectFileContent.data.internalDevices.connectableDeviceID2 = internalDevice2;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file contains the same ids in devices and elements", async () => {
      //Overriding type of one of variable
      let internalDevice2Variable2 =
        initialProjectFileContent.data.internalDevices.internalDeviceID2
          .variables.internalDeviceID2Variable2ID;

      delete initialProjectFileContent.data.internalDevices.internalDeviceID2
        .variables.internalDeviceID2Variable2ID;

      internalDevice2Variable2.id = "connectableDeviceID2";
      initialProjectFileContent.data.internalDevices.internalDeviceID2.variables.connectableDeviceID2 = internalDevice2Variable2;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file is not a valid JSON", async () => {
      createInitialProjectFile = false;
      //lack of ""

      await writeFileAsync(projectFilePath, "{ abcd: 1234}", "utf8");

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file is empty", async () => {
      createInitialProjectFile = false;

      await writeFileAsync(projectFilePath, "");

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getIPConfig", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      initialProjectFileContent.ipConfig = {
        eth1: {
          name: "eth1",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.13.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.13.1",
          dns: ["10.10.13.1", "1.1.1.1"],
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);

      return projectService.getIPConfig();
    };

    it("should return valid ipConfig", async () => {
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(initialProjectFileContent.ipConfig);
    });

    it("should return valid ipConfig - if ipConfig is empty", async () => {
      initialProjectFileContent = {
        ipConfig: {},
        data: {},
      };

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual({});
    });

    it("should throw if project file does not exists", async () => {
      createInitialProjectFile = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("no such file or directory");
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("setIPConfig", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let ipConfigToSetContent;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      initialProjectFileContent.ipConfig = {
        eth1: {
          name: "eth1",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.13.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.13.1",
          dns: ["10.10.13.1", "1.1.1.1"],
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };
      ipConfigToSetContent = {
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth3",
          dhcp: true,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      };
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);

      return projectService.setIPConfig(ipConfigToSetContent);
    };

    it("should set new ipConfig and not change other project data", async () => {
      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ...initialProjectFileContent,
        ipConfig: ipConfigToSetContent,
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should set new ipConfig - if it is an empty object", async () => {
      ipConfigToSetContent = {};

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ...initialProjectFileContent,
        ipConfig: ipConfigToSetContent,
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should throw and not set new ipConfig - if it is null", async () => {
      ipConfigToSetContent = null;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(`"ipConfig" cannot be null`);

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw and not set new ipConfig - if one of interfaces is invalid", async () => {
      ipConfigToSetContent = {
        eth2: {
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth3",
          dhcp: true,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      };

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(`"name" is required`);

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw and not set new ipConfig - if one of interfaces is invalid - keys does not fit", async () => {
      ipConfigToSetContent = {
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth4",
          dhcp: true,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      };

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain(
        `interface name as key and in payload differ!`
      );

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if project file does not exist", async () => {
      createInitialProjectFile = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("no such file or directory");

      //File should not have been created
      let fileExists = await checkIfFileExistsAsync(projectFilePath);

      expect(fileExists).toEqual(false);
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });

  describe("setIPConfigFromProjectToNetplan", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let ipConfigToSetContent;
    let setIPContent;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      initialProjectFileContent.ipConfig = {
        eth1: {
          name: "eth1",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.13.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.13.1",
          dns: ["10.10.13.1", "1.1.1.1"],
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };

      ipConfigToSetContent = {
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth3",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      };
      setIPContent = true;
    });

    let exec = async () => {
      await initTest();
      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );
      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);
      if (setIPContent) await projectService.setIPConfig(ipConfigToSetContent);
      await projectService.setIPConfigFromProjectToNetplan();
    };

    it("should set ipConfig from projectFile to netplanFile", async () => {
      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(Object.values(ipConfigToSetContent));

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should set ipConfig from projectFile to netplanFile - if ipConfig is empty", async () => {
      ipConfigToSetContent = {};

      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(Object.values(ipConfigToSetContent));

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should throw and not set ipConfig from projectFile to netplanFile - if ipConfig file does not exist", async () => {
      createInitialProjectFile = false;
      setIPContent = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("no such file or directory");

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();
    });

    it("should set ipConfig from projectFile to netplanFile - if ipConfig in netplan does not exists", async () => {
      initialIPServerContent = [];

      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(Object.values(ipConfigToSetContent));

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should not set ipConfig from projectFile to netplanFile once again - if ipConfigToSet is the same as actual ipConfig in netplan", async () => {
      initialIPServerContent = [
        {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        {
          name: "eth3",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      ];

      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should not throw if netplanService is not active", async () => {
      runIPConfigServer = false;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).resolves.toBeDefined();
    });

    it("should throw if project has not been initialized", async () => {
      initProjectService = false;
      setIPContent = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });

  describe("setIPConfigFromNetplanToProject", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      initialProjectFileContent.ipConfig = {
        eth1: {
          name: "eth1",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.13.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.13.1",
          dns: ["10.10.13.1", "1.1.1.1"],
        },
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
      };
      ipConfigToSetContent = {
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth3",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      };
      setIPContent = true;
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService)
        await projectService.init(projectFilePath, AgentsDirPath);

      await projectService.setIPConfigFromNetplanToProject();
    };

    it("should set ipConfig from netplan to project file and not change other data", async () => {
      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }

      expect(projectFileContent.ipConfig).toEqual(expectedPayload);
      expect(projectFileContent.data).toEqual(initialProjectFileContent.data);
    });

    it("should set ipConfig from netplan to project file and not change other data - if netplan content is empty", async () => {
      initialIPServerContent = [];

      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(projectFileContent.ipConfig).toEqual({});

      expect(projectFileContent.data).toEqual(initialProjectFileContent.data);
    });

    it("should set ipConfig to empty object and not change other data - if netplan service has not started", async () => {
      runIPConfigServer = false;

      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(projectFileContent.ipConfig).toEqual({});

      expect(projectFileContent.data).toEqual(initialProjectFileContent.data);
    });

    it("should not set ipConfig - if netplan ip config is the same as ipConfig", async () => {
      initialProjectFileContent.ipConfig = {};

      for (let inter of initialIPServerContent) {
        initialProjectFileContent.ipConfig[inter.name] = inter;
      }

      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }

      expect(projectFileContent.ipConfig).toEqual(expectedPayload);
    });

    it("should throw and not set ipConfig if project file does not exists", async () => {
      createInitialProjectFile = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("no such file or directory,");

      let fileExists = await checkIfFileExistsAsync(projectFilePath);

      expect(fileExists).toEqual(false);
    });

    it("should throw and not set ipConfig if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("project service not initialized");

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });

  describe("getDevices", () => {
    let initialProjectFileContent;
    let initProjectService;

    beforeEach(async () => {
      initProjectService = true;
      initialProjectFileContent = generateInitialProjectPayload();
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getDevices();
    };

    it("should return object with all devices", async () => {
      let result = await exec();

      let project = projectService._getProject();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return object with all devices - if there are no connectableDevices", async () => {
      initialProjectFileContent.data.connectableDevices = {};

      let result = await exec();

      let project = projectService._getProject();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return object with all devices - if there are no internalDevices", async () => {
      initialProjectFileContent.data.internalDevices = {};

      let result = await exec();

      let project = projectService._getProject();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return object with all devices - if there are no agentDevices", async () => {
      initialProjectFileContent.data.agentDevices = {};

      let result = await exec();

      let project = projectService._getProject();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return empty object - if there are no devices", async () => {
      initialProjectFileContent.data.connectableDevices = {};
      initialProjectFileContent.data.internalDevices = {};
      initialProjectFileContent.data.agentDevices = {};

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual({});
    });

    it("should throw if projectSerice has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getDevice", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceId;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getDevice(deviceId);
    };

    it("should return object of device of given id - if device is connectableDevice", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = project.ConnectableDevices["connectableDeviceID2"];

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of device of given id - if device is internalDevice", async () => {
      deviceId = "internalDeviceID2";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = project.InternalDevices["internalDeviceID2"];

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of device of given id - if device is agentDevice", async () => {
      deviceId = "agentDeviceID1";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = project.AgentDevices["agentDeviceID1"];

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no device of given id", async () => {
      deviceId = "fakeDeviceID";

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getElements", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceIds;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getElements(deviceIds);
    };

    it("should return object of all elements associated with devices from argument", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements,
        ...project.InternalDevices["internalDeviceID2"].Elements,
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all elements of all devices - if devicesIds is null", async () => {
      deviceIds = null;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.Elements };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all elements of all devices - if devicesIds is undefined (default argument null)", async () => {
      deviceIds = undefined;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.Elements };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if devicesIds there are no devices of given id", async () => {
      deviceIds = ["fakeDevice1", "fakeDevice2"];

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no elements", async () => {
      initialProjectFileContent.data.connectableDevices.connectableDeviceID2.variables = {};
      initialProjectFileContent.data.connectableDevices.connectableDeviceID2.calcElements = {};
      initialProjectFileContent.data.connectableDevices.connectableDeviceID2.alerts = {};
      initialProjectFileContent.data.internalDevices.internalDeviceID2.variables = {};
      initialProjectFileContent.data.internalDevices.internalDeviceID2.calcElements = {};
      initialProjectFileContent.data.internalDevices.internalDeviceID2.alerts = {};

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getElement", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceId;
    let elementId;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID2Variable2ID";
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getElement(deviceId, elementId);
    };

    it("should return element from given device of given id - if element is variable, device is connectableDevice", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is calcElement, device is connectableDevice", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID2CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is alert, device is connectableDevice", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is variable, device is internalDevice", async () => {
      deviceId = "internalDeviceID2";
      elementId = "internalDeviceID2Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is calcElement, device is internalDevice", async () => {
      deviceId = "internalDeviceID2";
      elementId = "internalDeviceID2CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is alert, device is internalDevice", async () => {
      deviceId = "internalDeviceID2";
      elementId = "internalDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is variable, device is agentDevice", async () => {
      deviceId = "agentDeviceID1";
      elementId = "agentDeviceID1Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is calcElement, device is agentDevice", async () => {
      deviceId = "agentDeviceID1";
      elementId = "agentDeviceID1CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element from given device of given id - if element is alert, device is agentDevice", async () => {
      deviceId = "agentDeviceID1";
      elementId = "agentDeviceID1Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element even if deviceId is null - searching for all devices, device is connectableDevice", async () => {
      deviceId = null;
      elementId = "connectableDeviceID2Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element even if deviceId is null - searching for all devices, device is internalDevice", async () => {
      deviceId = null;
      elementId = "internalDeviceID2Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element even if deviceId is null - searching for all devices, device is agentDevice", async () => {
      deviceId = null;
      elementId = "agentDeviceID1Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element even if deviceId is null - searching for all devices, element is calcElement", async () => {
      deviceId = null;
      elementId = "connectableDeviceID2CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return element even if deviceId is null - searching for all devices, element is alert", async () => {
      deviceId = null;
      elementId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no device of given id", async () => {
      deviceId = "fakeID";
      elementId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no element of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID3Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no element of given id", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no element of given id and deviceID is null", async () => {
      deviceId = null;
      elementId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getVariables", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceIds;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getVariables(deviceIds);
    };

    it("should return object of all variables associated with devices from argument", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Variables,
        ...project.InternalDevices["internalDeviceID2"].Variables,
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all variables of all devices - if devicesIds is null", async () => {
      deviceIds = null;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.Variables };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all variables of all devices - if devicesIds is undefined (default argument null)", async () => {
      deviceIds = undefined;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.Variables };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if devicesIds there are no devices of given id", async () => {
      deviceIds = ["fakeDevice1", "fakeDevice2"];

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no variables", async () => {
      initialProjectFileContent.data.connectableDevices.connectableDeviceID2.variables = {};
      initialProjectFileContent.data.internalDevices.internalDeviceID2.variables = {};

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getVariable", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceId;
    let variableId;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      variableId = "connectableDeviceID2Variable2ID";
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getVariable(deviceId, variableId);
    };

    it("should return variable from given device of given id - if device is connectableDevice", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return variable from given device of given id - if device is internalDevice", async () => {
      deviceId = "internalDeviceID2";
      variableId = "internalDeviceID2Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return variable even if deviceId is null - device is connectableDevice", async () => {
      deviceId = null;
      variableId = "connectableDeviceID2Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return variable even if deviceId is null - device is internalDevice", async () => {
      deviceId = null;
      variableId = "internalDeviceID2Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return variable even if deviceId is null - device is agentDevice", async () => {
      deviceId = null;
      variableId = "agentDeviceID1Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1Variable2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no device of given id", async () => {
      deviceId = "fakeID";
      variableId = "connectableDeviceID2Variable2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no variable of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      variableId = "connectableDeviceID3Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no variable of given id", async () => {
      deviceId = "connectableDeviceID2";
      variableId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no variable of given id and deviceID is null", async () => {
      deviceId = null;
      variableId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getCalcElements", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceIds;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getCalcElements(deviceIds);
    };

    it("should return object of all calcElements associated with devices from argument", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].CalcElements,
        ...project.InternalDevices["internalDeviceID2"].CalcElements,
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all calcElements of all devices - if devicesIds is null", async () => {
      deviceIds = null;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.CalcElements };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all calcElements of all devices - if devicesIds is undefined (default argument null)", async () => {
      deviceIds = undefined;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.CalcElements };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if devicesIds there are no devices of given id", async () => {
      deviceIds = ["fakeDevice1", "fakeDevice2"];

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no calcElements", async () => {
      initialProjectFileContent.data.connectableDevices.connectableDeviceID2.calcElements = {};
      initialProjectFileContent.data.internalDevices.internalDeviceID2.calcElements = {};

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getCalcElement", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceId;
    let calcElementId;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      calcElementId = "connectableDeviceID2CalcElement2ID";
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getCalcElement(deviceId, calcElementId);
    };

    it("should return calcElement from given device of given id - if device is connectableDevice", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return calcElement from given device of given id - if device is internalDevice", async () => {
      deviceId = "internalDeviceID2";
      calcElementId = "internalDeviceID2CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return calcElement from given device of given id - if device is agentDevice", async () => {
      deviceId = "agentDeviceID1";
      calcElementId = "agentDeviceID1CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return calcElement even if deviceId is null - device is connectableDevice", async () => {
      deviceId = null;
      calcElementId = "connectableDeviceID2CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return calcElement even if deviceId is null - device is internalDevice", async () => {
      deviceId = null;
      calcElementId = "internalDeviceID2CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return calcElement even if deviceId is null - device is agentDevice", async () => {
      deviceId = null;
      calcElementId = "agentDeviceID1CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1CalcElement2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no device of given id", async () => {
      deviceId = "fakeID";
      calcElementId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no calcElement of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      calcElementId = "connectableDeviceID3CalcElement2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no calcElement of given id", async () => {
      deviceId = "connectableDeviceID2";
      calcElementId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no calcElement of given id and deviceID is null", async () => {
      deviceId = null;
      calcElementId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getAlerts", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceIds;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getAlerts(deviceIds);
    };

    it("should return object of all alerts associated with devices from argument", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Alerts,
        ...project.InternalDevices["internalDeviceID2"].Alerts,
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all alerts of all devices - if devicesIds is null", async () => {
      deviceIds = null;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.Alerts };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of all alerts of all devices - if devicesIds is undefined (default argument null)", async () => {
      deviceIds = undefined;

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      for (let device of Object.values(project.Devices)) {
        expectedResult = { ...expectedResult, ...device.Alerts };
      }

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if devicesIds there are no devices of given id", async () => {
      deviceIds = ["fakeDevice1", "fakeDevice2"];

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no alerts", async () => {
      initialProjectFileContent.data.connectableDevices.connectableDeviceID2.alerts = {};
      initialProjectFileContent.data.internalDevices.internalDeviceID2.alerts = {};

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getAlert", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceId;
    let alertId;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      alertId = "connectableDeviceID2Alert2ID";
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.getAlert(deviceId, alertId);
    };

    it("should return alert from given device of given id - if device is connectableDevice", async () => {
      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return alert from given device of given id - if device is internalDevice", async () => {
      deviceId = "internalDeviceID2";
      alertId = "internalDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return alert from given device of given id - if device is agentDevice", async () => {
      deviceId = "agentDeviceID1";
      alertId = "agentDeviceID1Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return alert even if deviceId is null - device is connectableDevice", async () => {
      deviceId = null;
      alertId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.ConnectableDevices["connectableDeviceID2"].Elements[
          "connectableDeviceID2Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return alert even if deviceId is null - device is internalDevice", async () => {
      deviceId = null;
      alertId = "internalDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.InternalDevices["internalDeviceID2"].Elements[
          "internalDeviceID2Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return alert even if deviceId is null - device is agentDevice", async () => {
      deviceId = null;
      alertId = "agentDeviceID1Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = {
        ...project.AgentDevices["agentDeviceID1"].Elements[
          "agentDeviceID1Alert2ID"
        ],
      };

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no device of given id", async () => {
      deviceId = "fakeID";
      alertId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no alert of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      alertId = "connectableDeviceID3Alert2ID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no alert of given id", async () => {
      deviceId = "connectableDeviceID2";
      alertId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no alert of given id and deviceID is null", async () => {
      deviceId = null;
      alertId = "fakeID";

      let result = await exec();

      let project = projectService._getProject();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should throw - if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getLastCycleDuration", () => {
    let initialProjectFileContent;
    let initProjectService;
    let lastCycleDuration;

    beforeEach(async () => {
      initProjectService = true;
      lastCycleDuration = 1234;
      initialProjectFileContent = generateInitialProjectPayload();
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();

        //Setting last cycle duration
        let project = projectService._getProject();
        project._lastCycleDuration = lastCycleDuration;
      }

      return projectService.getLastCycleDuration();
    };

    it("should return lastCycleDuration of project", async () => {
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(lastCycleDuration);
    });

    it("should not throw and return null - if project has not been initialized", async () => {
      initProjectService = false;

      let result = await exec();

      expect(result).toEqual(null);
    });
  });

  describe("activateDevice", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceId;

    beforeEach(async () => {
      deviceId = "internalDeviceID2";
      initProjectService = true;
      initialProjectFileContent = generateInitialProjectPayload();
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.activateDevice(deviceId);
    };

    it("should activate device if it was not active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.data.internalDevices.internalDeviceID2.isActive = false;

      await exec();

      let device = projectService.getDevice(deviceId);

      expect(device.IsActive).toEqual(true);
    });

    it("should leave device activated if it was active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.data.internalDevices.internalDeviceID2.isActive = true;

      await exec();

      let device = projectService.getDevice(deviceId);

      expect(device.IsActive).toEqual(true);
    });

    it("should not throw if device has not been found", async () => {
      deviceId = "fakeDeviceID2";

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            return reject(err);
          }
        })
      ).resolves.toBeDefined();
    });

    it("should throw if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("deactivateDevice", () => {
    let initialProjectFileContent;
    let initProjectService;
    let deviceId;

    beforeEach(async () => {
      deviceId = "internalDeviceID2";
      initProjectService = true;
      initialProjectFileContent = generateInitialProjectPayload();
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();
      }

      return projectService.deactivateDevice(deviceId);
    };

    it("should deactivate device if it was active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.data.internalDevices.internalDeviceID2.isActive = true;

      await exec();

      let device = projectService.getDevice(deviceId);

      expect(device.IsActive).toEqual(false);
    });

    it("should leave device deactivated if it was not active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.data.internalDevices.internalDeviceID2.isActive = false;

      await exec();

      let device = projectService.getDevice(deviceId);

      expect(device.IsActive).toEqual(false);
    });

    it("should not throw if device has not been found", async () => {
      deviceId = "fakeDeviceID2";

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            return reject(err);
          }
        })
      ).resolves.toBeDefined();
    });

    it("should throw if project service has not been initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("loadProject", () => {
    let initialProjectFileContent;
    let newProjectFileContent;
    let initProjectService;
    let project;
    let deactiveMockFunc;

    beforeEach(async () => {
      deviceId = "internalDeviceID2";
      initProjectService = true;
      initialProjectFileContent = generateInitialProjectPayload();
      newProjectFileContent = {
        ipConfig: {
          eth2: {
            name: "eth2",
            dhcp: true,
            optional: true,
          },
          eth3: {
            name: "eth3",
            dhcp: false,
            optional: true,
            ipAddress: "10.10.11.2",
            subnetMask: "255.255.255.0",
            gateway: "10.10.11.1",
            dns: ["10.10.11.1"],
          },
        },
        data: {
          connectableDevices: {
            connectableDeviceID4: {
              id: "connectableDeviceID4",
              name: "connectableDeviceName1",
              type: "MBDevice",
              variables: {
                connectableDeviceID4Variable1ID: {
                  id: "connectableDeviceID4Variable1ID",
                  name: "connectableDeviceID4Variable1Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID4Variable2ID: {
                  id: "connectableDeviceID4Variable2ID",
                  name: "connectableDeviceID4Variable2Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID4Variable3ID: {
                  id: "connectableDeviceID4Variable3ID",
                  name: "connectableDeviceID4Variable3Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
              },
              calcElements: {
                connectableDeviceID4CalcElement1ID: {
                  id: "connectableDeviceID4CalcElement1ID",
                  name: "connectableDeviceID4CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID4Variable1ID",
                  factor: 10,
                },
                connectableDeviceID4CalcElement2ID: {
                  id: "connectableDeviceID4CalcElement2ID",
                  name: "connectableDeviceID4CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID4Variable2ID",
                  factor: 20,
                },
                connectableDeviceID4CalcElement3ID: {
                  id: "connectableDeviceID4CalcElement3ID",
                  name: "connectableDeviceID4CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID4Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID4Alert1ID: {
                  id: "connectableDeviceID4Alert1ID",
                  name: "connectableDeviceID4Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID4Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID4Alert2ID: {
                  id: "connectableDeviceID4Alert2ID",
                  name: "connectableDeviceID4Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID4Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID4Alert3ID: {
                  id: "connectableDeviceID4Alert3ID",
                  name: "connectableDeviceID4Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID4Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
                },
              },
              isActive: false,
              ipAddress: "192.168.0.1",
              portNumber: 502,
              timeout: 500,
            },
            connectableDeviceID5: {
              id: "connectableDeviceID5",
              name: "connectableDeviceName2",
              type: "MBDevice",
              variables: {
                connectableDeviceID5Variable1ID: {
                  id: "connectableDeviceID5Variable1ID",
                  name: "connectableDeviceID5Variable1Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID5Variable2ID: {
                  id: "connectableDeviceID5Variable2ID",
                  name: "connectableDeviceID5Variable2Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID5Variable3ID: {
                  id: "connectableDeviceID5Variable3ID",
                  name: "connectableDeviceID5Variable3Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
              },
              calcElements: {
                connectableDeviceID5CalcElement1ID: {
                  id: "connectableDeviceID5CalcElement1ID",
                  name: "connectableDeviceID5CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID5Variable1ID",
                  factor: 10,
                },
                connectableDeviceID5CalcElement2ID: {
                  id: "connectableDeviceID5CalcElement2ID",
                  name: "connectableDeviceID5CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID5Variable2ID",
                  factor: 20,
                },
                connectableDeviceID5CalcElement3ID: {
                  id: "connectableDeviceID5CalcElement3ID",
                  name: "connectableDeviceID5CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID5Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID5Alert1ID: {
                  id: "connectableDeviceID5Alert1ID",
                  name: "connectableDeviceID5Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID5Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID5Alert2ID: {
                  id: "connectableDeviceID5Alert2ID",
                  name: "connectableDeviceID5Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID5Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID5Alert3ID: {
                  id: "connectableDeviceID5Alert3ID",
                  name: "connectableDeviceID5Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID5Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
                },
              },
              isActive: false,
              ipAddress: "192.168.0.2",
              portNumber: 502,
              timeout: 500,
            },
            connectableDeviceID6: {
              id: "connectableDeviceID6",
              name: "connectableDeviceName3",
              type: "MBDevice",
              variables: {
                connectableDeviceID6Variable1ID: {
                  id: "connectableDeviceID6Variable1ID",
                  name: "connectableDeviceID6Variable1Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID6Variable2ID: {
                  id: "connectableDeviceID6Variable2ID",
                  name: "connectableDeviceID6Variable2Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 3,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
                connectableDeviceID6Variable3ID: {
                  id: "connectableDeviceID6Variable3ID",
                  name: "connectableDeviceID6Variable3Name",
                  type: "MBSwappedFloat",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 2,
                  read: true,
                  write: false,
                  readFCode: 3,
                  writeFCode: 16,
                  unitID: 1,
                  readAsSingle: false,
                  writeAsSingle: false,
                },
              },
              calcElements: {
                connectableDeviceID6CalcElement1ID: {
                  id: "connectableDeviceID6CalcElement1ID",
                  name: "connectableDeviceID6CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID6Variable1ID",
                  factor: 10,
                },
                connectableDeviceID6CalcElement2ID: {
                  id: "connectableDeviceID6CalcElement2ID",
                  name: "connectableDeviceID6CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID6Variable2ID",
                  factor: 20,
                },
                connectableDeviceID6CalcElement3ID: {
                  id: "connectableDeviceID6CalcElement3ID",
                  name: "connectableDeviceID6CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID6Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID6Alert1ID: {
                  id: "connectableDeviceID6Alert1ID",
                  name: "connectableDeviceID6Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID6Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID6Alert2ID: {
                  id: "connectableDeviceID6Alert2ID",
                  name: "connectableDeviceID6Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID6Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID6Alert3ID: {
                  id: "connectableDeviceID6Alert3ID",
                  name: "connectableDeviceID6Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID6Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
                },
              },
              isActive: false,
              ipAddress: "192.168.0.3",
              portNumber: 502,
              timeout: 500,
            },
          },
          internalDevices: {
            internalDeviceID4: {
              id: "internalDeviceID4",
              name: "internalDeviceName1",
              type: "InternalDevice",
              variables: {
                internalDeviceID4Variable1ID: {
                  id: "internalDeviceID4Variable1ID",
                  name: "internalDeviceID4Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID4",
                  associatedElementID: "connectableDeviceID4Variable1ID",
                },
                internalDeviceID4Variable2ID: {
                  id: "internalDeviceID4Variable2ID",
                  name: "internalDeviceID4Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID4",
                  associatedElementID: "connectableDeviceID4Variable2ID",
                },
                internalDeviceID4Variable3ID: {
                  id: "internalDeviceID4Variable3ID",
                  name: "internalDeviceID4Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID4",
                  associatedElementID: "connectableDeviceID4Variable3ID",
                },
              },
              calcElements: {
                internalDeviceID4CalcElement1ID: {
                  id: "internalDeviceID4CalcElement1ID",
                  name: "internalDeviceID4CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID4Variable1ID",
                  factor: 10,
                },
                internalDeviceID4CalcElement2ID: {
                  id: "internalDeviceID4CalcElement2ID",
                  name: "internalDeviceID4CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID4Variable2ID",
                  factor: 20,
                },
                internalDeviceID4CalcElement3ID: {
                  id: "internalDeviceID4CalcElement3ID",
                  name: "internalDeviceID4CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID4Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                internalDeviceID4Alert1ID: {
                  id: "internalDeviceID4Alert1ID",
                  name: "internalDeviceID4Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID4Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                internalDeviceID4Alert2ID: {
                  id: "internalDeviceID4Alert2ID",
                  name: "internalDeviceID4Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID4Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                internalDeviceID4Alert3ID: {
                  id: "internalDeviceID4Alert3ID",
                  name: "internalDeviceID4Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID4Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
                },
              },
              isActive: true,
            },
            internalDeviceID5: {
              id: "internalDeviceID5",
              name: "internalDeviceName2",
              type: "InternalDevice",
              variables: {
                internalDeviceID5Variable1ID: {
                  id: "internalDeviceID5Variable1ID",
                  name: "internalDeviceID5Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID5",
                  associatedElementID: "connectableDeviceID5Variable1ID",
                },
                internalDeviceID5Variable2ID: {
                  id: "internalDeviceID5Variable2ID",
                  name: "internalDeviceID5Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID5",
                  associatedElementID: "connectableDeviceID5Variable2ID",
                },
                internalDeviceID5Variable3ID: {
                  id: "internalDeviceID5Variable3ID",
                  name: "internalDeviceID5Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID5",
                  associatedElementID: "connectableDeviceID5Variable3ID",
                },
              },
              calcElements: {
                internalDeviceID5CalcElement1ID: {
                  id: "internalDeviceID5CalcElement1ID",
                  name: "internalDeviceID5CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID5Variable1ID",
                  factor: 10,
                },
                internalDeviceID5CalcElement2ID: {
                  id: "internalDeviceID5CalcElement2ID",
                  name: "internalDeviceID5CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID5Variable2ID",
                  factor: 20,
                },
                internalDeviceID5CalcElement3ID: {
                  id: "internalDeviceID5CalcElement3ID",
                  name: "internalDeviceID5CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID5Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                internalDeviceID5Alert1ID: {
                  id: "internalDeviceID5Alert1ID",
                  name: "internalDeviceID5Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID5Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                internalDeviceID5Alert2ID: {
                  id: "internalDeviceID5Alert2ID",
                  name: "internalDeviceID5Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID5Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                internalDeviceID5Alert3ID: {
                  id: "internalDeviceID5Alert3ID",
                  name: "internalDeviceID5Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID5Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
                },
              },
              isActive: true,
            },
            internalDeviceID6: {
              id: "internalDeviceID6",
              name: "internalDeviceName3",
              type: "InternalDevice",
              variables: {
                internalDeviceID6Variable1ID: {
                  id: "internalDeviceID6Variable1ID",
                  name: "internalDeviceID6Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID6",
                  associatedElementID: "connectableDeviceID6Variable1ID",
                },
                internalDeviceID6Variable2ID: {
                  id: "internalDeviceID6Variable2ID",
                  name: "internalDeviceID6Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID6",
                  associatedElementID: "connectableDeviceID6Variable2ID",
                },
                internalDeviceID6Variable3ID: {
                  id: "internalDeviceID6Variable3ID",
                  name: "internalDeviceID6Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID6",
                  associatedElementID: "connectableDeviceID6Variable3ID",
                },
              },
              calcElements: {
                internalDeviceID6CalcElement1ID: {
                  id: "internalDeviceID6CalcElement1ID",
                  name: "internalDeviceID6CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID6Variable1ID",
                  factor: 10,
                },
                internalDeviceID6CalcElement2ID: {
                  id: "internalDeviceID6CalcElement2ID",
                  name: "internalDeviceID6CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID6Variable2ID",
                  factor: 20,
                },
                internalDeviceID6CalcElement3ID: {
                  id: "internalDeviceID6CalcElement3ID",
                  name: "internalDeviceID6CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "internalDeviceID6Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                internalDeviceID6Alert1ID: {
                  id: "internalDeviceID6Alert1ID",
                  name: "internalDeviceID6Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID6Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                internalDeviceID6Alert2ID: {
                  id: "internalDeviceID6Alert2ID",
                  name: "internalDeviceID6Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID6Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                internalDeviceID6Alert3ID: {
                  id: "internalDeviceID6Alert3ID",
                  name: "internalDeviceID6Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "internalDeviceID6Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
                },
              },
              isActive: true,
            },
          },
          agentDevices: {},
        },
      };
      deactiveMockFunc = jest.fn();
    });

    let exec = async () => {
      await initTest();

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(initialProjectFileContent),
        "utf8"
      );

      if (initProjectService) {
        await projectService.init(projectFilePath, AgentsDirPath);
        await projectService.loadProjectFile();

        project = projectService._getProject();

        //assigning deactivateMockFunc to all devices
        for (let device of Object.values(project.Devices)) {
          device.deactivate = deactiveMockFunc;
        }
      }

      //Create new project file

      await writeFileAsync(
        projectFilePath,
        JSON.stringify(newProjectFileContent),
        "utf8"
      );

      return projectService.loadProjectFile();
    };

    //Method for checking if new project after loading is valid
    const checkProjectWithPayload = (payloadToCheck) => {
      //Checking devices from project
      let connectableDevices = Object.values(project.ConnectableDevices);
      let internalDevices = Object.values(project.InternalDevices);
      let agentDevices = Object.values(project.AgentDevices);

      let connectableDevicesPayload = Object.values(
        payloadToCheck.data.connectableDevices
      );
      let internalDevicesPayload = Object.values(
        payloadToCheck.data.internalDevices
      );
      let agentDevicesPayload = Object.values(payloadToCheck.data.agentDevices);

      //All devices from payload should have been created
      expect(connectableDevices.length).toEqual(
        connectableDevicesPayload.length
      );
      expect(internalDevices.length).toEqual(internalDevicesPayload.length);
      expect(agentDevices.length).toEqual(agentDevicesPayload.length);

      //Checking connectableDevices
      for (let device of connectableDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payloadToCheck.data.connectableDevices[device.ID],
        };
        for (let variablePayload of Object.values(expectedPayload.variables)) {
          variablePayload.value = variablePayload.defaultValue;
          variablePayload.lastValueTick = 0;
          variablePayload.deviceId = device.ID;
        }

        for (let calcElementPayload of Object.values(
          expectedPayload.calcElements
        )) {
          calcElementPayload.value = calcElementPayload.defaultValue;
          calcElementPayload.lastValueTick = 0;
          calcElementPayload.deviceId = device.ID;
        }

        for (let alertPayload of Object.values(expectedPayload.alerts)) {
          alertPayload.value = alertPayload.defaultValue;
          alertPayload.lastValueTick = 0;
          alertPayload.deviceId = device.ID;
        }

        //At first devices should not be connected - only after first refresh if is active is true
        expectedPayload.isConnected = false;

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }

      //Checking internal devices
      for (let device of internalDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payloadToCheck.data.internalDevices[device.ID],
        };
        for (let variablePayload of Object.values(expectedPayload.variables)) {
          //assigning default value - by default is not presented
          variablePayload.defaultValue =
            payloadToCheck.data.connectableDevices[
              variablePayload.associatedDeviceID
            ].variables[variablePayload.associatedElementID].defaultValue;
          variablePayload.value = variablePayload.defaultValue;
          variablePayload.lastValueTick = 0;
          variablePayload.deviceId = device.ID;
        }

        for (let calcElementPayload of Object.values(
          expectedPayload.calcElements
        )) {
          calcElementPayload.value = calcElementPayload.defaultValue;
          calcElementPayload.lastValueTick = 0;
          calcElementPayload.deviceId = device.ID;
        }

        for (let alertPayload of Object.values(expectedPayload.alerts)) {
          alertPayload.value = alertPayload.defaultValue;
          alertPayload.lastValueTick = 0;
          alertPayload.deviceId = device.ID;
        }

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }

      //Checking agent devices
      for (let device of agentDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payloadToCheck.data.agentDevices[device.ID],
          boarded: false,
        };

        //Boarding key should not have been in payload returned by generatePayload()
        delete expectedPayload.boardingKey;

        for (let variablePayload of Object.values(expectedPayload.variables)) {
          //assigning default value - by default is not presented
          variablePayload.defaultValue =
            payloadToCheck.data.connectableDevices[
              variablePayload.associatedDeviceID
            ].variables[variablePayload.associatedElementID].defaultValue;
          variablePayload.value = variablePayload.defaultValue;
          variablePayload.lastValueTick = 0;
          variablePayload.deviceId = device.ID;
        }

        for (let calcElementPayload of Object.values(
          expectedPayload.calcElements
        )) {
          calcElementPayload.value = calcElementPayload.defaultValue;
          calcElementPayload.lastValueTick = 0;
          calcElementPayload.deviceId = device.ID;
        }

        for (let alertPayload of Object.values(expectedPayload.alerts)) {
          alertPayload.value = alertPayload.defaultValue;
          alertPayload.lastValueTick = 0;
          alertPayload.deviceId = device.ID;
        }

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }
    };

    it("should initialize project with new content - based on new project file", async () => {
      await exec();

      checkProjectWithPayload(newProjectFileContent);
    });

    it("should initialize project with new content - if content is empty project content", async () => {
      newProjectFileContent = {
        ipConfig: {},
        data: { connectableDevices: {}, internalDevices: {}, agentDevices: {} },
      };
      await exec();

      checkProjectWithPayload(newProjectFileContent);
    });

    it("should post new ipConfig to netplan service", async () => {
      await exec();
      //First time during initialziation
      //Second during loading

      let expectedContent = JSON.stringify(
        Object.values(newProjectFileContent.ipConfig)
      );
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(2);
      expect(ipConfigMockServer.OnPostMockFn.mock.calls[1][1]).toEqual(
        expectedContent
      );
    });

    it("should not post new ipConfig to netplan service - if new ipConfig is the same as initial one", async () => {
      newProjectFileContent.ipConfig = initialProjectFileContent.ipConfig;

      await exec();

      let expectedContent = JSON.stringify(
        Object.values(initialProjectFileContent.ipConfig)
      );
      //Invoked only first time - during initialization
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);
      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );
    });

    it("should disconnect all devices before loading new project", async () => {
      await exec();

      //9 times - for 9 devices
      expect(deactiveMockFunc).toHaveBeenCalledTimes(9);
    });

    it("should not throw if netplan service is down", async () => {
      runIPConfigServer = false;

      await exec();

      checkProjectWithPayload(newProjectFileContent);

      //Despite fail during setting - ipConfig should be present in the file with the same form
      let result = JSON.parse(await readFileAsync(projectFilePath, "utf8"));
      expect(result.ipConfig).toEqual(newProjectFileContent.ipConfig);
    });

    it("should throw and do nothing - if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("project service not initialized");
    });
  });
});
