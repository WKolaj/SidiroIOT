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

describe("api/device", () => {
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
      };

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

      if (exists(jwt))
        return request(server)
          .get("/api/device")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/device").send();
    };

    it("should return 200 with a valid payload of all devices", async () => {
      let result = await exec();

      expect(result.status).toEqual(200);

      let devices = projectService.getDevices();

      let expectedPayload = {};

      expectedPayload[
        "connectableDeviceID1"
      ] = devices.connectableDeviceID1.generatePayload();
      expectedPayload[
        "connectableDeviceID2"
      ] = devices.connectableDeviceID2.generatePayload();
      expectedPayload[
        "connectableDeviceID3"
      ] = devices.connectableDeviceID3.generatePayload();
      expectedPayload[
        "connectableDeviceID4"
      ] = devices.connectableDeviceID4.generatePayload();
      expectedPayload[
        "connectableDeviceID5"
      ] = devices.connectableDeviceID5.generatePayload();
      expectedPayload[
        "internalDeviceID1"
      ] = devices.internalDeviceID1.generatePayload();
      expectedPayload[
        "internalDeviceID2"
      ] = devices.internalDeviceID2.generatePayload();
      expectedPayload[
        "internalDeviceID3"
      ] = devices.internalDeviceID3.generatePayload();
      expectedPayload[
        "agentDeviceID1"
      ] = devices.agentDeviceID1.generatePayload();

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return 200 with and valid payload of all devices - if there are no devices", async () => {
      projectDataContent = {
        ipConfig: {},
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      };

      let result = await exec();

      expect(result.status).toEqual(200);

      let devices = projectService.getDevices();

      let expectedPayload = {};

      expect(result.body).toEqual(expectedPayload);
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
    let deviceId;
    let jwt;

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
      };
      deviceId = "connectableDeviceID2";
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

      if (exists(jwt))
        return request(server)
          .get(`/api/device/${deviceId}`)
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get(`/api/device/${deviceId}`).send();
    };

    it("should return 200 with a valid payload of device of given id", async () => {
      let result = await exec();

      expect(result.status).toEqual(200);

      let device = projectService.getDevice("connectableDeviceID2");

      expect(result.body).toEqual(device.generatePayload());
    });

    it("should return 200 with and valid payload of given device - if device is an connectable device", async () => {
      deviceId = "connectableDeviceID1";

      let result = await exec();

      expect(result.status).toEqual(200);

      let device = projectService.getDevice("connectableDeviceID1");

      expect(result.body).toEqual(device.generatePayload());
    });

    it("should return 200 with and valid payload of given device - if device is an internal device", async () => {
      deviceId = "internalDeviceID2";

      let result = await exec();

      expect(result.status).toEqual(200);

      let device = projectService.getDevice("internalDeviceID2");

      expect(result.body).toEqual(device.generatePayload());
    });

    it("should return 200 with and valid payload of given device - if device is an agent device", async () => {
      deviceId = "agentDeviceID1";

      let result = await exec();

      expect(result.status).toEqual(200);

      let device = projectService.getDevice("agentDeviceID1");

      expect(result.body).toEqual(device.generatePayload());
    });

    it("should return 404 if there is no device of given id", async () => {
      deviceId = "fakeDeviceID";

      let result = await exec();

      expect(result.status).toEqual(404);

      expect(result.text).toEqual("Device not found");
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
});
