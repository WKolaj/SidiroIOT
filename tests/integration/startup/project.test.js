describe("projectService", () => {
  let _;
  let path;
  let request;
  let config;
  let jsonWebToken;
  let readFileAsync;
  let createDirAsync;
  let checkIfFileExistsAsync;
  let writeFileAsync;
  let roundToPrecision;
  let removeFileIfExistsAsync;
  let removeDirectoryIfExists;
  let checkIfDirectoryExistsAsync;
  let exists;
  let settingsDirFilePath;
  let socketFilePath;
  let projectFilePath;
  let agentsDirPath;
  let logger;
  let projectService;
  let netplanService;
  let runIPConfigServer;
  let ipConfigMockServer;
  let initialIPServerContent;
  let initNetplanService;
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
    createDirAsync = utilities.createDirAsync;
    checkIfDirectoryExistsAsync = utilities.checkIfDirectoryExistsAsync;
    exists = utilities.exists;
    removeDirectoryIfExists = utilities.removeDirectoryIfExists;
    settingsDirFilePath = config.get("settingsPath");
    let projectFileName = (projectFilePath = config.get("projectFileName"));
    socketFilePath = config.get("netplanConfigSocketFilePath");
    projectFilePath = path.join(settingsDirFilePath, projectFileName);
    agentsDirPath = path.join(settingsDirFilePath, config.get("agentsDirName"));

    //Clearing socket file if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing agetnsDirPath if exists
    await removeDirectoryIfExists(agentsDirPath);

    //Overwriting logger action method
    logActionMock = jest.fn();
    logger.action = logActionMock;

    //Overwriting logger error method
    logErrorMock = jest.fn();
    logger.error = logErrorMock;

    runIPConfigServer = true;

    initNetplanService = true;

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
    //Stopping current project
    await projectService._stopCurrentProject();

    jest.resetAllMocks();
    jest.resetModules();

    //Clearing socket file if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing agetnsDirPath if exists
    await removeDirectoryIfExists(agentsDirPath);

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

    if (initNetplanService) await require("../../../startup/netplan")();
  };

  describe("startup - project", () => {
    let initialProjectFileContent;
    let createInitialProjectFile;
    let createInitialAgentsDir;

    beforeEach(async () => {
      createInitialProjectFile = true;
      createInitialAgentsDir = true;
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
          agentDevices: {},
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

      if (createInitialAgentsDir) await createDirAsync(agentsDirPath);

      await require("../../../startup/project")();
    };

    it("should set ip to netplanService based on project file - if project file exists and is valid", async () => {
      await exec();

      //Testing post mock function

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(
        Object.values(initialProjectFileContent.ipConfig)
      );

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Testing ipConfig content

      let ipConfig = await netplanService.getInterfaces();

      expect(ipConfig).toEqual(initialProjectFileContent.ipConfig);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should set ip to netplanService based on project file but not invoke post - if project file exists and is valid and initial ipConfig is equal to netplan config", async () => {
      initialProjectFileContent.ipConfig = {};

      for (let inter of initialIPServerContent) {
        initialProjectFileContent.ipConfig[inter.name] = inter;
      }

      await exec();

      //Testing post mock function

      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Testing ipConfig content

      let ipConfig = await netplanService.getInterfaces();

      expect(ipConfig).toEqual(initialProjectFileContent.ipConfig);
    });

    it("should create new project file if not exists - together with setting ip from netplan", async () => {
      createInitialProjectFile = false;

      await exec();

      //Testing post mock function - post mock fn should not have been called
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Testing get mock function - get mock fn should have been called - CAN BE CALLED SEVERAL TIMES
      expect(ipConfigMockServer.OnGetMockFn).toHaveBeenCalled();

      //Testing interfaces in project
      let ipConfig = await projectService.getIPConfig();

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }
      expect(ipConfig).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual({
        ipConfig: { ...expectedPayload },
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      });

      //Testing netplan ipConfig

      let netplanIPConfig = await netplanService.getInterfaces();

      expect(netplanIPConfig).toEqual(expectedPayload);
    });

    it("should create new project file - if file is not valid - together with setting ip from netplan", async () => {
      delete initialProjectFileContent.data.connectableDevices
        .connectableDeviceID2.name;

      await exec();

      //Testing post mock function - post mock fn should not have been called
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Testing get mock function - get mock fn should have been called - CAN BE CALLED SEVERAL TIMES
      expect(ipConfigMockServer.OnGetMockFn).toHaveBeenCalled();

      //Testing interfaces in project file
      let ipConfig = await projectService.getIPConfig();

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }
      expect(ipConfig).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual({
        ipConfig: { ...expectedPayload },
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      });

      //Testing netplan ipConfig

      let netplanIPConfig = await netplanService.getInterfaces();

      expect(netplanIPConfig).toEqual(expectedPayload);
    });

    it("should create new agentDir - if not exists", async () => {
      createInitialAgentsDir = false;

      await exec();

      let agentsDirExists = await checkIfDirectoryExistsAsync(agentsDirPath);
      expect(agentsDirExists).toEqual(true);
    });

    it("should not call post on netplanService - if ipConfig in project and in netplan are the same", async () => {
      initialProjectFileContent.ipConfig = {};

      for (let inter of initialIPServerContent) {
        initialProjectFileContent.ipConfig[inter.name] = inter;
      }

      await exec();

      //Testing post mock function

      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Testing ipConfig content

      let ipConfig = await netplanService.getInterfaces();

      expect(ipConfig).toEqual(initialProjectFileContent.ipConfig);
    });

    it("should not throw and start project - if netplanService is not active and project file exists", async () => {
      runIPConfigServer = false;

      await exec();

      //Testing interfaces in project
      let ipConfig = await projectService.getIPConfig();

      let expectedPayload = initialProjectFileContent.ipConfig;
      expect(ipConfig).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should not throw and start project with newly created project file - if netplanService is not active and project file does not exist", async () => {
      runIPConfigServer = false;
      createInitialProjectFile = false;

      await exec();

      //Testing interfaces in project
      let projectContent = await projectService.getProjectContentFromFile();

      let expectedPayload = {
        ipConfig: {},
        data: { connectableDevices: {}, internalDevices: {}, agentDevices: {} },
      };
      expect(projectContent).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual(expectedPayload);
    });

    it("should not throw and start project with newly created project file - if netplanService is not active and project file is not valid", async () => {
      runIPConfigServer = false;
      initialProjectFileContent = "[asd]dasdlsf'asd]asd";
      await exec();

      //Testing interfaces in project
      let ipConfig = await projectService.getIPConfig();

      expect(ipConfig).toEqual({});

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual({
        ipConfig: {},
        data: { connectableDevices: {}, internalDevices: {}, agentDevices: {} },
      });
    });

    it("should not throw and start project - if netplanService is not active and project file is not valid - not valid devices payload", async () => {
      runIPConfigServer = false;
      delete initialProjectFileContent.data.connectableDevices
        .connectableDeviceID2.name;

      await exec();

      //Testing interfaces in project
      let ipConfig = await projectService.getIPConfig();

      expect(ipConfig).toEqual({});

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual({
        ipConfig: {},
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      });
    });
  });
});
