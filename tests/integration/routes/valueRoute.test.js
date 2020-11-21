const {
  snooze,
  writeFileAsync,
  removeFileIfExistsAsync,
  exists,
} = require("../../../utilities/utilities");
const _ = require("lodash");
const request = require("supertest");
const config = require("config");
const path = require("path");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);
const projectService = require("../../../services/projectService");
const jsonWebToken = require("jsonwebtoken");
let {
  generateTestAdmin,
  generateTestUser,
  generateTestSuperAdmin,
  generateUselessUser,
} = require("../../utilities/testUtilities");
let server;
let logger = require("../../../logger/logger");

const projectFileName = config.get("projectFileName");
const projectFilePath = path.join(settingsDirPath, projectFileName);

const socketFilePath = config.get("netplanConfigSocketFilePath");

describe("api/variable", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let logActionMock;
  let ipConfigMockServer;

  beforeEach(async () => {
    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    ipConfigMockServer = require("../../utilities/fakeIPService");
    await ipConfigMockServer.Start();

    //Clearing users in database before each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //generating uslessUser, user, admin and adminUser
    uselessUser = await generateUselessUser();
    testAdmin = await generateTestAdmin();
    testUser = await generateTestUser();
    testSuperAdmin = await generateTestSuperAdmin();

    //Overwriting logget action method
    logActionMock = jest.fn();
    logger.action = logActionMock;
  });

  afterEach(async () => {
    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing users in database after each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //Stopping ipConfig mock server
    if (ipConfigMockServer) await ipConfigMockServer.Stop();

    //Stopping server
    if (server) await server.close();
  });

  describe("GET/", () => {
    let projectDataContent;
    let jwt;
    let deviceId;

    beforeEach(async () => {
      projectDataContent = {
        ipConfig: {},
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
      deviceId = null;

      jwt = await testUser.generateJWT();
    });

    let exec = async () => {
      await writeFileAsync(
        projectFilePath,
        JSON.stringify(projectDataContent),
        "utf8"
      );

      //starting the server
      server = await require("../../../startup/app")();

      let apiPath = "/api/value";

      if (deviceId) apiPath += `?deviceId=${deviceId}`;

      if (exists(jwt))
        return request(server)
          .get(apiPath)
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get(apiPath).send();
    };

    //TODO - add agents in payload after implementation

    it("should return 200 and values and tickIds of all elements", async () => {
      let result = await exec();

      expect(result.status).toEqual(200);

      let devices = projectService.getDevices();

      let expectedPayload = {};

      for (let device of Object.values(devices))
        for (let element of Object.values(device.Elements))
          expectedPayload[element.ID] = {
            value: element.Value,
            lastValueTick: element.LastValueTick,
          };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and values and tickIds of all elements from given device if deviceId is presented in payload - if device is connectableDevice", async () => {
      deviceId = "connectableDeviceID2";
      let result = await exec();

      expect(result.status).toEqual(200);

      let devices = projectService.getDevices();

      let expectedPayload = {};

      for (let element of Object.values(devices[deviceId].Elements))
        expectedPayload[element.ID] = {
          value: element.Value,
          lastValueTick: element.LastValueTick,
        };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and values and tickIds of all elements from given device if deviceId is presented in payload - if device is internalDevice", async () => {
      deviceId = "internalDeviceID2";
      let result = await exec();

      expect(result.status).toEqual(200);

      let devices = projectService.getDevices();

      let expectedPayload = {};

      for (let element of Object.values(devices[deviceId].Elements))
        expectedPayload[element.ID] = {
          value: element.Value,
          lastValueTick: element.LastValueTick,
        };

      expect(result.body).toEqual(expectedPayload);
    });

    //TODO - add test to agent

    it("should return 200 and an empty object if there are no device of given id", async () => {
      deviceId = "fakeDeviceID2";
      let result = await exec();

      expect(result.status).toEqual(200);

      expect(result.body).toEqual({});
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - ADMIN", async () => {
      jwt = await testAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("GET/:id", () => {
    let projectDataContent;
    let jwt;
    let deviceId;
    let elementId;

    beforeEach(async () => {
      projectDataContent = {
        ipConfig: {},
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
      deviceId = null;
      elementId = "connectableDeviceID2Variable2ID";
      jwt = await testUser.generateJWT();
    });

    let exec = async () => {
      await writeFileAsync(
        projectFilePath,
        JSON.stringify(projectDataContent),
        "utf8"
      );

      //starting the server
      server = await require("../../../startup/app")();

      let apiPath = `/api/value/${elementId}`;

      if (deviceId) apiPath += `?deviceId=${deviceId}`;

      if (exists(jwt))
        return request(server)
          .get(apiPath)
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get(apiPath).send();
    };

    //TODO - add agents in payload after implementation

    it("should return 200 and values and tickIds of given element - if device is connectableDevice, element is variable", async () => {
      elementId = "connectableDeviceID2Variable2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and values and tickIds of given element - if element value and element tickId is not 0", async () => {
      elementId = "connectableDeviceID2Variable2ID";

      await exec();

      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );

      element.setValue(1234.56, 87654321);

      let apiPath = `/api/value/${elementId}`;

      let result = await request(server)
        .get(apiPath)
        .set(config.get("tokenHeader"), jwt)
        .send();

      expect(result.status).toEqual(200);

      let expectedPayload = {
        value: 1234.56,
        lastValueTick: 87654321,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is connectableDevice, element is calcElement", async () => {
      elementId = "connectableDeviceID2CalcElement2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getCalcElement(
        "connectableDeviceID2",
        "connectableDeviceID2CalcElement2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is connectableDevice, element is alert", async () => {
      elementId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getAlert(
        "connectableDeviceID2",
        "connectableDeviceID2Alert2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is internalDevice, element is variable", async () => {
      elementId = "internalDeviceID2Variable2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getVariable(
        "internalDeviceID2",
        "internalDeviceID2Variable2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is internalDevice, element is calcElement", async () => {
      elementId = "internalDeviceID2CalcElement2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getCalcElement(
        "internalDeviceID2",
        "internalDeviceID2CalcElement2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is internalDevice, element is alert", async () => {
      elementId = "internalDeviceID2Alert2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getAlert(
        "internalDeviceID2",
        "internalDeviceID2Alert2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    //TODO - add tests with agent

    it("should return 200 and payload of given element - if device is connectableDevice - if deviceId filter exists, device exists and has given element, element is variable", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID2Variable2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is connectableDevice - if deviceId filter exists, device exists and has given element, element is calcElement", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID2CalcElement2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getCalcElement(
        "connectableDeviceID2",
        "connectableDeviceID2CalcElement2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is connectableDevice - if deviceId filter exists, device exists and has given element, element is alert", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID2Alert2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getAlert(
        "connectableDeviceID2",
        "connectableDeviceID2Alert2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is internalDevice - if deviceId filter exists, device exists and has given element, element is variable", async () => {
      deviceId = "internalDeviceID2";
      elementId = "internalDeviceID2Variable2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getVariable(
        "internalDeviceID2",
        "internalDeviceID2Variable2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is internalDevice - if deviceId filter exists, device exists and has given element, element is calcElement", async () => {
      deviceId = "internalDeviceID2";
      elementId = "internalDeviceID2CalcElement2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getCalcElement(
        "internalDeviceID2",
        "internalDeviceID2CalcElement2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 and payload of given element - if device is internalDevice - if deviceId filter exists, device exists and has given element, element is alert", async () => {
      deviceId = "internalDeviceID2";
      elementId = "internalDeviceID2Alert2ID";

      let result = await exec();

      expect(result.status).toEqual(200);

      let element = projectService.getAlert(
        "internalDeviceID2",
        "internalDeviceID2Alert2ID"
      );

      let expectedPayload = {
        value: element.Value,
        lastValueTick: element.LastValueTick,
      };

      expect(result.body).toEqual(expectedPayload);
    });

    //TODO - add tests for agent device

    it("should return 404 - if device is connectableDevice - if deviceId filter exists, but device does not exist and variable exists", async () => {
      deviceId = "fakeDeviceID2";
      elementId = "connectableDeviceID2Variable2ID";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toEqual("Element not found");
    });

    it("should return 404 - if device is internalDevice - if deviceId filter exists, but device does not exist and variable exists", async () => {
      deviceId = "fakeDeviceID2";
      elementId = "internalDeviceID2Variable2ID";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toEqual("Element not found");
    });

    //TODO - add tests for agent device

    it("should return 404 - if device is connectableDevice - if deviceId filter exists, but device exist but variable does not exist", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "fakeVariable2ID";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toEqual("Element not found");
    });

    it("should return 404 - if device is internalDevice - if deviceId filter exists, but device exist but variable does not exist", async () => {
      deviceId = "internalDeviceID2";
      elementId = "fakeVariable2ID";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toEqual("Element not found");
    });

    //TODO - add tests for agent device

    it("should return 404 - if device is internalDevice - if deviceId filter exists, but device does not exist and variable does not exist", async () => {
      deviceId = "fakeDeviceID";
      elementId = "fakeVariable2ID";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toEqual("Element not found");
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - ADMIN", async () => {
      jwt = await testAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("POST/:id", () => {
    let projectDataContent;
    let jwt;
    let deviceId;
    let elementId;
    let valuePayload;

    beforeEach(async () => {
      projectDataContent = {
        ipConfig: {},
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBInt32",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
                  type: "MBByteArray",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: [1, 2, 3, 4, 5, 6, 7, 8],
                  offset: 1,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 5,
                  length: 4,
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
                  type: "MBDouble",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  offset: 9,
                  length: 4,
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
      deviceId = null;
      elementId = "connectableDeviceID2Variable2ID";
      jwt = await testUser.generateJWT();
      valuePayload = { value: 1234.567 };
    });

    let exec = async () => {
      await writeFileAsync(
        projectFilePath,
        JSON.stringify(projectDataContent),
        "utf8"
      );

      //starting the server
      server = await require("../../../startup/app")();

      let apiPath = `/api/value/${elementId}`;

      if (deviceId) apiPath += `?deviceId=${deviceId}`;

      if (exists(jwt))
        return request(server)
          .post(apiPath)
          .set(config.get("tokenHeader"), jwt)
          .send(valuePayload);
      else return request(server).post(apiPath).send(valuePayload);
    };

    //TODO - add agents in payload after implementation

    it("should return 200 and values and tickIds of given element and set value and tick id - if device is connectableDevice, element is variable", async () => {
      elementId = "connectableDeviceID2Variable2ID";

      let beginDate = Math.floor(Date.now() / 1000);

      let result = await exec();

      let endDate = Math.ceil(Date.now() / 1000);

      expect(result.status).toEqual(200);

      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );

      expect(result.body.value).toEqual(valuePayload.value);
      expect(result.body.lastValueTick >= beginDate).toEqual(true);
      expect(result.body.lastValueTick <= endDate).toEqual(true);

      expect(element.Value).toEqual(valuePayload.value);
      expect(element.LastValueTick >= beginDate).toEqual(true);
      expect(element.LastValueTick <= endDate).toEqual(true);
    });

    it("should return 200 and values and tickIds of given element and set value and tick id - if device is connectableDevice, element is variable of MBByteArray type", async () => {
      //connectableDeviceID3Variable1ID is a MBByteArray
      elementId = "connectableDeviceID3Variable1ID";
      valuePayload = { value: [10, 11, 12, 13, 14, 15, 16, 17] };

      let beginDate = Math.floor(Date.now() / 1000);

      let result = await exec();

      let endDate = Math.ceil(Date.now() / 1000);

      expect(result.status).toEqual(200);

      let element = projectService.getVariable(
        "connectableDeviceID3",
        "connectableDeviceID3Variable1ID"
      );

      expect(result.body.value).toEqual(valuePayload.value);
      expect(result.body.lastValueTick >= beginDate).toEqual(true);
      expect(result.body.lastValueTick <= endDate).toEqual(true);

      expect(element.Value).toEqual(valuePayload.value);
      expect(element.LastValueTick >= beginDate).toEqual(true);
      expect(element.LastValueTick <= endDate).toEqual(true);
    });

    it("should return 400 and not change values and tickIds of given element - if element is read only", async () => {
      elementId = "internalDeviceID2Variable2ID";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(result.text).toEqual("AssociatedVariable value is readonly");

      let element = projectService.getVariable(
        "internalDeviceID2",
        "internalDeviceID2Variable2ID"
      );

      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should return 404  - if elementId does not exist", async () => {
      elementId = "fakeID";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toEqual("Element not found");
    });

    it("should return 400 - if valuePayload is invalid - value is not defined", async () => {
      valuePayload = {};

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(result.text).toEqual(`"value" is required`);

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should return 400 and not set value and tick id - if device is connectableDevice, element is variable of MBByteArray type but value is invalid - length", async () => {
      //connectableDeviceID3Variable1ID is a MBByteArray
      elementId = "connectableDeviceID3Variable1ID";
      valuePayload = { value: [10, 11, 12, 13, 14, 15, 16] };

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(result.text).toEqual(`"value" must contain 8 items`);

      let element = projectService.getVariable(
        "connectableDeviceID3",
        "connectableDeviceID3Variable1ID"
      );

      expect(element.Value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should return 400 - if valuePayload is invalid - there is another property", async () => {
      valuePayload = {
        ...valuePayload,
        fakeProperty: "fakeValue",
      };

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(result.text).toEqual(`"fakeProperty" is not allowed`);

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should return 400 - if valuePayload is invalid - value does not meet elements requirements", async () => {
      //connectableDeviceID1Variable3ID is a Int32
      elementId = "connectableDeviceID1Variable3ID";

      valuePayload = {
        value: 123.456,
      };

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(result.text).toEqual(`"value" must be an integer`);

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID1",
        "connectableDeviceID1Variable3ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should not return any user and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should not return any user and return 403 - ADMIN", async () => {
      jwt = await testAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should not return any user and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should not return any user and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    it("should not return any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //Element should not have been changed
      let element = projectService.getVariable(
        "connectableDeviceID2",
        "connectableDeviceID2Variable2ID"
      );
      expect(element.Value).toEqual(0);
      expect(element.LastValueTick).toEqual(0);
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });
});
