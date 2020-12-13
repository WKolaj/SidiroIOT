const {
  snooze,
  writeFileAsync,
  readFileAsync,
  removeFileIfExistsAsync,
  removeDirectoryIfExists,
} = require("../../../utilities/utilities");
const _ = require("lodash");
const path = require("path");
const request = require("supertest");
const bcrypt = require("bcrypt");
const config = require("config");
const jsonWebToken = require("jsonwebtoken");
let {
  generateTestAdmin,
  generateTestUser,
  generateTestAdminAndUser,
  generateUselessUser,
  generateTestSuperAdmin,
  generateTestAdminAndSuperAdmin,
  generateTestUserAndAdminAndSuperAdmin,
  generateStringOfGivenLength,
  testAdminAndSuperAdminID,
  testAdminID,
  testSuperAdminID,
  testUselessUserID,
  testUserAndAdminAndSuperAdminID,
  testUserAndAdminID,
  testUserID,
  testAdminAndSuperAdminPassword,
  testAdminPassword,
  testSuperAdminPassword,
  testUselessUserPassword,
  testUserAndAdminAndSuperAdminPassword,
  testUserAndAdminPassword,
  testUserPassword,
  testAdminAndSuperAdminName,
  testAdminName,
  testSuperAdminName,
  testUselessUserName,
  testUserAndAdminAndSuperAdminName,
  testUserAndAdminName,
  testUserName,
} = require("../../utilities/testUtilities");

const privateKey = config.get("jwtPrivateKey");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);
const netplanService = require("../../../services/netplanService");
const projectService = require("../../../services/projectService");

let { exists } = require("../../../utilities/utilities");
let server;
let logger = require("../../../logger/logger");
const netplan = require("../../../startup/netplan");
const projectFileName = config.get("projectFileName");
const projectFilePath = path.join(settingsDirPath, projectFileName);
const AgentsDirPath = "__testDir/settings/agentsData";

const socketFilePath = config.get("netplanConfigSocketFilePath");

describe("api/configFile", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let testUserAndAdmin;
  let testAdminAndSuperAdmin;
  let testUserAndAdminAndSuperAdmin;
  let logActionMock;
  let ipConfigMockServer;
  let initialIPServerContent;

  beforeEach(async () => {
    jest.setTimeout(30000);
    jest.resetAllMocks();

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    await removeDirectoryIfExists(AgentsDirPath);

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

    ipConfigMockServer = require("../../utilities/fakeIPService");
    ipConfigMockServer._setContent(initialIPServerContent);
    await ipConfigMockServer.Start();

    server = await require("../../../startup/app")();

    //Clearing users in database before each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //generating uslessUser, user, admin and adminUser
    uselessUser = await generateUselessUser();
    testAdmin = await generateTestAdmin();
    testUser = await generateTestUser();
    testSuperAdmin = await generateTestSuperAdmin();
    testUserAndAdmin = await generateTestAdminAndUser();
    testAdminAndSuperAdmin = await generateTestAdminAndSuperAdmin();
    testUserAndAdminAndSuperAdmin = await generateTestUserAndAdminAndSuperAdmin();

    //Overwriting logget action method
    logActionMock = jest.fn();
    logger.action = logActionMock;
  });

  afterEach(async () => {
    jest.resetAllMocks();

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing users in database after each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    if (ipConfigMockServer) {
      await ipConfigMockServer.Stop();
      ipConfigMockServer = null;
    }

    await server.close();
  });

  const generateInitialProjectPayload = () => {
    return JSON.parse(
      JSON.stringify({
        ipConfig: {
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
                  sampleTime: 1,
                  defaultValue: false,
                  unit: "Fake",
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  sampleTime: 1,
                  defaultValue: false,
                  unit: "Fake",
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  sampleTime: 1,
                  defaultValue: false,
                  unit: "Fake",
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
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
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
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

  describe("GET/", () => {
    let projectFileContent;
    let createProjectFile;
    let jwt;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
      createProjectFile = true;
      projectFileContent = generateInitialProjectPayload();
    });

    let exec = async () => {
      if (createProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(projectFileContent),
          "utf8"
        );

      if (exists(jwt))
        return request(server)
          .get("/api/configFile")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/configFile").send();
    };

    it("should return 200 and config file containt projectFile", async () => {
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      let responseBody = JSON.parse(response.body);

      expect(responseBody).toBeDefined();
      expect(responseBody).toEqual(projectFileContent);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 404 - if there is no project file", async () => {
      await removeFileIfExistsAsync(projectFilePath);

      createProjectFile = false;
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
      expect(response.text).toEqual(
        "Project file does not exists or is invalid..."
      );

      //#endregion CHECKING_RESPONSE
    });

    it("should return 404 - if file content is invalid", async () => {
      projectFileContent = "asdad9asd8asd8;a'd;asd";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
      expect(response.text).toEqual(
        "Project file does not exists or is invalid..."
      );

      //#endregion CHECKING_RESPONSE
    });

    it("should return 404 - if project file content is empty", async () => {
      projectFileContent = "";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
      expect(response.text).toEqual(
        "Project file does not exists or is invalid..."
      );

      //#endregion CHECKING_RESPONSE
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any interface and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - USER", async () => {
      jwt = await testUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if jwt from different private key was provided", async () => {
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

  describe("POST/", () => {
    let projectFileContent;
    let createProjectFile;
    let postProjectFileContent;
    let postProjectFilePath;
    let jwt;
    let project;
    let deactiveMockFunc;
    let saveProjectFileContentWithoutStringify;

    beforeEach(async () => {
      saveProjectFileContentWithoutStringify = false;
      jwt = await testAdmin.generateJWT();
      createProjectFile = true;
      projectFileContent = generateInitialProjectPayload();

      postProjectFileContent = {
        ipConfig: {
          eth3: {
            name: "eth3",
            dhcp: true,
            optional: true,
          },
          eth4: {
            name: "eth4",
            dhcp: false,
            optional: true,
            ipAddress: "10.10.13.2",
            subnetMask: "255.255.255.0",
            gateway: "10.10.13.1",
            dns: ["10.10.13.1", "1.1.1.1"],
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
                connectableDeviceID4Variable4ID: {
                  id: "connectableDeviceID4Variable4ID",
                  name: "connectableDeviceID4Variable4Name",
                  type: "DeviceConnectionVariable",
                  sampleTime: 1,
                  unit: "Test",
                  defaultValue: false,
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
                connectableDeviceID5Variable4ID: {
                  id: "connectableDeviceID5Variable4ID",
                  name: "connectableDeviceID5Variable4Name",
                  type: "DeviceConnectionVariable",
                  sampleTime: 1,
                  unit: "Test",
                  defaultValue: false,
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
                connectableDeviceID6Variable4ID: {
                  id: "connectableDeviceID6Variable4ID",
                  name: "connectableDeviceID6Variable4Name",
                  type: "DeviceConnectionVariable",
                  sampleTime: 1,
                  unit: "Test",
                  defaultValue: false,
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
            connectableDeviceID7: {
              id: "connectableDeviceID7",
              name: "connectableDeviceName3",
              type: "S7Device",
              variables: {
                connectableDeviceID7Variable1ID: {
                  id: "connectableDeviceID7Variable1ID",
                  name: "connectableDeviceID7Variable1Name",
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
                connectableDeviceID7Variable2ID: {
                  id: "connectableDeviceID7Variable2ID",
                  name: "connectableDeviceID7Variable2Name",
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
                connectableDeviceID7Variable3ID: {
                  id: "connectableDeviceID7Variable3ID",
                  name: "connectableDeviceID7Variable3Name",
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
                connectableDeviceID7Variable4ID: {
                  id: "connectableDeviceID7Variable4ID",
                  name: "connectableDeviceID7Variable4Name",
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
                connectableDeviceID7CalcElement1ID: {
                  id: "connectableDeviceID7CalcElement1ID",
                  name: "connectableDeviceID7CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID7Variable1ID",
                  factor: 10,
                },
                connectableDeviceID7CalcElement2ID: {
                  id: "connectableDeviceID7CalcElement2ID",
                  name: "connectableDeviceID7CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID7Variable2ID",
                  factor: 20,
                },
                connectableDeviceID7CalcElement3ID: {
                  id: "connectableDeviceID7CalcElement3ID",
                  name: "connectableDeviceID7CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID7Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID7Alert1ID: {
                  id: "connectableDeviceID7Alert1ID",
                  name: "connectableDeviceID7Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID7Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID7Alert2ID: {
                  id: "connectableDeviceID7Alert2ID",
                  name: "connectableDeviceID7Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID7Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID7Alert3ID: {
                  id: "connectableDeviceID7Alert3ID",
                  name: "connectableDeviceID7Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID7Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
                },
              },
              isActive: false,
              ipAddress: "192.168.0.4",
              rack: 0,
              slot: 1,
              timeout: 500,
            },
            connectableDeviceID8: {
              id: "connectableDeviceID8",
              name: "connectableDeviceName3",
              type: "S7Device",
              variables: {
                connectableDeviceID8Variable1ID: {
                  id: "connectableDeviceID8Variable1ID",
                  name: "connectableDeviceID8Variable1Name",
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
                connectableDeviceID8Variable2ID: {
                  id: "connectableDeviceID8Variable2ID",
                  name: "connectableDeviceID8Variable2Name",
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
                connectableDeviceID8Variable3ID: {
                  id: "connectableDeviceID8Variable3ID",
                  name: "connectableDeviceID8Variable3Name",
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
                connectableDeviceID8Variable4ID: {
                  id: "connectableDeviceID8Variable4ID",
                  name: "connectableDeviceID8Variable4Name",
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
                connectableDeviceID8CalcElement1ID: {
                  id: "connectableDeviceID8CalcElement1ID",
                  name: "connectableDeviceID8CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID8Variable1ID",
                  factor: 10,
                },
                connectableDeviceID8CalcElement2ID: {
                  id: "connectableDeviceID8CalcElement2ID",
                  name: "connectableDeviceID8CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID8Variable2ID",
                  factor: 20,
                },
                connectableDeviceID8CalcElement3ID: {
                  id: "connectableDeviceID8CalcElement3ID",
                  name: "connectableDeviceID8CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "connectableDeviceID8Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                connectableDeviceID8Alert1ID: {
                  id: "connectableDeviceID8Alert1ID",
                  name: "connectableDeviceID8Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID8Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID8Alert2ID: {
                  id: "connectableDeviceID8Alert2ID",
                  name: "connectableDeviceID8Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID8Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                connectableDeviceID8Alert3ID: {
                  id: "connectableDeviceID8Alert3ID",
                  name: "connectableDeviceID8Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "connectableDeviceID8Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
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
          agentDevices: {
            agentDeviceID2: {
              id: "agentDeviceID2",
              name: "agentDeviceID2Name",
              type: "MSAgentDevice",
              variables: {
                agentDeviceID2Variable1ID: {
                  id: "agentDeviceID2Variable1ID",
                  name: "agentDeviceID2Variable1Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID4",
                  associatedElementID: "connectableDeviceID4Variable1ID",
                },
                agentDeviceID2Variable2ID: {
                  id: "agentDeviceID2Variable2ID",
                  name: "agentDeviceID2Variable2Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID4",
                  associatedElementID: "connectableDeviceID4Variable2ID",
                },
                agentDeviceID2Variable3ID: {
                  id: "agentDeviceID2Variable3ID",
                  name: "agentDeviceID2Variable3Name",
                  type: "AssociatedVariable",
                  unit: "V",
                  sampleTime: 1,
                  associatedDeviceID: "connectableDeviceID4",
                  associatedElementID: "connectableDeviceID4Variable3ID",
                },
              },
              calcElements: {
                agentDeviceID2CalcElement1ID: {
                  id: "agentDeviceID2CalcElement1ID",
                  name: "agentDeviceID2CalcElement1Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "agentDeviceID2Variable1ID",
                  factor: 10,
                },
                agentDeviceID2CalcElement2ID: {
                  id: "agentDeviceID2CalcElement2ID",
                  name: "agentDeviceID2CalcElement2Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "agentDeviceID2Variable2ID",
                  factor: 20,
                },
                agentDeviceID2CalcElement3ID: {
                  id: "agentDeviceID2CalcElement3ID",
                  name: "agentDeviceID2CalcElement3Name",
                  type: "FactorCalculator",
                  unit: "V",
                  sampleTime: 1,
                  defaultValue: 0,
                  variableID: "agentDeviceID2Variable3ID",
                  factor: 30,
                },
              },
              alerts: {
                agentDeviceID2Alert1ID: {
                  id: "agentDeviceID2Alert1ID",
                  name: "agentDeviceID2Alert1Name",
                  type: "HighLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 100,
                  defaultValue: null,
                  hysteresis: 10,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "agentDeviceID2Variable1ID",
                  highLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                agentDeviceID2Alert2ID: {
                  id: "agentDeviceID2Alert2ID",
                  name: "agentDeviceID2Alert2Name",
                  type: "LowLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 200,
                  defaultValue: null,
                  hysteresis: 20,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "agentDeviceID2Variable2ID",
                  lowLimit: 100,
                  texts: { pl: "fakeTextPL", en: "fakeTextEN" },
                },
                agentDeviceID2Alert3ID: {
                  id: "agentDeviceID2Alert3ID",
                  name: "agentDeviceID2Alert3Name",
                  type: "BandwidthLimitAlert",
                  unit: "V",
                  sampleTime: 1,
                  severity: 300,
                  defaultValue: null,
                  hysteresis: 30,
                  timeOnDelay: 100,
                  timeOffDelay: 200,
                  variableID: "agentDeviceID2Variable3ID",
                  highLimit: 100,
                  lowLimit: 100,
                  texts: {
                    highLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                    lowLimit: { pl: "fakeTextPL", en: "fakeTextEN" },
                  },
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
                connectableDeviceID4Variable1ID: {
                  elementId: "connectableDeviceID4Variable1ID",
                  deviceId: "connectableDeviceID4",
                  datapointId: "connectableDeviceID4Variable1IDdpID1",
                  sendingInterval: 60,
                  qualityCodeEnabled: true,
                  dataConverter: { conversionType: "fixed", precision: 3 },
                },
                connectableDeviceID5Variable1ID: {
                  elementId: "connectableDeviceID5Variable1ID",
                  deviceId: "connectableDeviceID5",
                  datapointId: "connectableDeviceID5Variable1IDdpID1",
                  sendingInterval: 60,
                  qualityCodeEnabled: true,
                  dataConverter: { conversionType: "fixed", precision: 3 },
                },
                connectableDeviceID4Variable2ID: {
                  elementId: "connectableDeviceID4Variable2ID",
                  deviceId: "connectableDeviceID4",
                  datapointId: "connectableDeviceID4Variable2IDdpID1",
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
      postProjectFilePath = path.join(settingsDirPath, "test.json");
      await removeFileIfExistsAsync(postProjectFilePath);
      deactiveMockFunc = jest.fn();
    });

    afterEach(async () => {
      await removeFileIfExistsAsync(postProjectFilePath);
    });

    let exec = async () => {
      project = projectService._getProject();

      if (createProjectFile) {
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(projectFileContent),
          "utf8"
        );

        //Loading project file after creation
        await projectService.loadProjectFile();

        //assigning deactivateMockFunc to all devices
        for (let device of Object.values(project.Devices)) {
          device.deactivate = deactiveMockFunc;
        }
      }

      if (saveProjectFileContentWithoutStringify) {
        await writeFileAsync(
          postProjectFilePath,
          postProjectFileContent,
          "utf8"
        );
      } else {
        await writeFileAsync(
          postProjectFilePath,
          JSON.stringify(postProjectFileContent),
          "utf8"
        );
      }
      if (exists(jwt))
        return request(server)
          .post("/api/configFile")
          .set(config.get("tokenHeader"), jwt)
          .attach("file", postProjectFilePath);
      else
        return request(server)
          .get("/api/configFile")
          .attach("file", postProjectFilePath);
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

    it("should return 200 and set new project file content", async () => {
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(postProjectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      expect(interfaces).toEqual(postProjectFileContent.ipConfig);

      //Called two time - first when loading the initial project
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(2);

      let expectedInterfaces = JSON.stringify(
        Object.values(postProjectFileContent.ipConfig)
      );
      expect(ipConfigMockServer.OnPostMockFn.mock.calls[1][1]).toEqual(
        expectedInterfaces
      );

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(postProjectFileContent);

      //All devices should have been disconnected before creating new project - 9 devices
      expect(deactiveMockFunc).toHaveBeenCalledTimes(9);

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 200 and set new project file content - if project is a brand new project", async () => {
      projectFileContent = {
        ipConfig: {},
        data: {
          connectableDevices: {},
          internalDevices: {},
          agentDevices: {},
        },
      };

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(postProjectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      expect(interfaces).toEqual(postProjectFileContent.ipConfig);

      //Called two time - first when loading the initial project
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(2);

      let expectedInterfaces = JSON.stringify(
        Object.values(postProjectFileContent.ipConfig)
      );
      expect(ipConfigMockServer.OnPostMockFn.mock.calls[1][1]).toEqual(
        expectedInterfaces
      );

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(postProjectFileContent);

      //No devices at the begining - no disconnecting
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 200 and set new project file content - if project file has not exists before", async () => {
      createProjectFile = false;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(postProjectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      expect(interfaces).toEqual(postProjectFileContent.ipConfig);

      //Called only one time - first when loading the new project
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedInterfaces = JSON.stringify(
        Object.values(postProjectFileContent.ipConfig)
      );
      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedInterfaces
      );

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(postProjectFileContent);

      //No devices at the begining - no disconnecting
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 200 and set new project file content - even if netplan service is down", async () => {
      await ipConfigMockServer.Stop();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(postProjectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(postProjectFileContent);

      //All devices should have been disconnected before creating new project - 9 devices
      expect(deactiveMockFunc).toHaveBeenCalledTimes(9);

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - lack of ipConfig", async () => {
      delete postProjectFileContent.ipConfig;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(`"ipConfig" is required`);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - same ids for multiple devices", async () => {
      let internalDevice4 =
        postProjectFileContent.data.internalDevices.internalDeviceID4;
      delete postProjectFileContent.data.internalDevices.internalDeviceID4;

      internalDevice4.id = "connectableDeviceID4";
      postProjectFileContent.data.internalDevices.connectableDeviceID4 = internalDevice4;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: All ids inside project payload should be unique!`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - same ids for devices and variables", async () => {
      let internalDevice4Variable2 =
        postProjectFileContent.data.internalDevices.internalDeviceID4.variables
          .internalDeviceID4Variable2ID;

      delete postProjectFileContent.data.internalDevices.internalDeviceID4
        .variables.internalDeviceID4Variable2ID;

      internalDevice4Variable2.id = "connectableDeviceID4";
      postProjectFileContent.data.internalDevices.internalDeviceID4.variables.connectableDeviceID4 = internalDevice4Variable2;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: All ids inside project payload should be unique!`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - ipConfig is null", async () => {
      postProjectFileContent.ipConfig = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(`"ipConfig" cannot be null`);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - lack of data", async () => {
      delete postProjectFileContent.data;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(`"data" is required`);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - data is null", async () => {
      postProjectFileContent.data = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: \"value\" must be of type object`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - data lacks connectableDevices", async () => {
      delete postProjectFileContent.data.connectableDevices;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: "connectableDevices" is required`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - data lacks internalDevices", async () => {
      delete postProjectFileContent.data.internalDevices;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: "internalDevices" is required`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - data lacks agentDevices", async () => {
      delete postProjectFileContent.data.agentDevices;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: "agentDevices" is required`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - connectableDevices is null", async () => {
      postProjectFileContent.data.connectableDevices = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: "connectableDevices" cannot be null`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - internalDevices is null", async () => {
      postProjectFileContent.data.internalDevices = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: "internalDevices" cannot be null`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - agentDevices is null", async () => {
      postProjectFileContent.data.agentDevices = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: "agentDevices" cannot be null`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - connectableDevices payload is invalid", async () => {
      postProjectFileContent.data.connectableDevices[
        "connectableDeviceID4"
      ].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: connectable device type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - internalDevices payload is invalid", async () => {
      postProjectFileContent.data.internalDevices["internalDeviceID4"].type =
        "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: internal device type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - agentDevices payload is invalid", async () => {
      postProjectFileContent.data.agentDevices["agentDeviceID2"].type =
        "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: agent device type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - connectableDevices variable's payload is invalid", async () => {
      postProjectFileContent.data.connectableDevices[
        "connectableDeviceID4"
      ].variables["connectableDeviceID4Variable2ID"].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: variable type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - internalDevices variable's payload is invalid", async () => {
      postProjectFileContent.data.internalDevices[
        "internalDeviceID4"
      ].variables["internalDeviceID4Variable2ID"].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: variable type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - agentDevices variable's payload is invalid", async () => {
      postProjectFileContent.data.agentDevices["agentDeviceID2"].variables[
        "agentDeviceID2Variable2ID"
      ].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: variable type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - connectableDevices calcElement's payload is invalid", async () => {
      postProjectFileContent.data.connectableDevices[
        "connectableDeviceID4"
      ].calcElements["connectableDeviceID4CalcElement2ID"].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: calcElement type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - internalDevices calcElement's payload is invalid", async () => {
      postProjectFileContent.data.internalDevices[
        "internalDeviceID4"
      ].calcElements["internalDeviceID4CalcElement2ID"].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: calcElement type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - agentDevices calcElement's payload is invalid", async () => {
      postProjectFileContent.data.agentDevices["agentDeviceID2"].calcElements[
        "agentDeviceID2CalcElement2ID"
      ].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: calcElement type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - connectableDevices alert's payload is invalid", async () => {
      postProjectFileContent.data.connectableDevices[
        "connectableDeviceID4"
      ].alerts["connectableDeviceID4Alert2ID"].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: alert type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - internalDevices alert's payload is invalid", async () => {
      postProjectFileContent.data.internalDevices["internalDeviceID4"].alerts[
        "internalDeviceID4Alert2ID"
      ].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: alert type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - agentDevices alert's payload is invalid", async () => {
      postProjectFileContent.data.agentDevices["agentDeviceID2"].alerts[
        "agentDeviceID2Alert2ID"
      ].type = "FakeType";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        `Invalid project data: alert type not recognized`
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - file is empty", async () => {
      saveProjectFileContentWithoutStringify = true;
      postProjectFileContent = "";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(`Content is not a valid JSON`);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should return 400 and leave project as it is - if project content is invalid - file is not a valid JSON", async () => {
      saveProjectFileContentWithoutStringify = true;
      postProjectFileContent = "{av..";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(`Content is not a valid JSON`);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      //Invoking only first time
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //Disconnect should not have been invoked
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not change project file settings and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      //Netplan interfaces should be set only during initialziation
      expect(interfaces).toEqual(projectFileContent.ipConfig);

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES

      //#region CHECKING_PROJECT_CONTENT

      checkProjectWithPayload(projectFileContent);

      //All devices should have been disconnected before creating new project - 9 devices
      expect(deactiveMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING_PROJECT_CONTENT
    });

    it("should not change project file settings and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      //Netplan interfaces should be set only during initialziation
      expect(interfaces).toEqual(projectFileContent.ipConfig);

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES
    });

    it("should not change project file settings and return 403 - USER", async () => {
      jwt = await testUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      //Netplan interfaces should be set only during initialziation
      expect(interfaces).toEqual(projectFileContent.ipConfig);

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES
    });

    it("should not change project file settings and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      //Netplan interfaces should be set only during initialziation
      expect(interfaces).toEqual(projectFileContent.ipConfig);

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES
    });

    it("should not change project file settings and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      //Netplan interfaces should be set only during initialziation
      expect(interfaces).toEqual(projectFileContent.ipConfig);

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES
    });

    it("should not change project file settings and return 400 if jwt from different private key was provided", async () => {
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

      //#region CHECKING_PROJECT_FILE_CONTENT

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(projectFileContent);

      //#endregion CHECKING_PROJECT_FILE_CONTENT

      //#region CHECKING_NETPLAN_INTERFACES

      let interfaces = await netplanService.getInterfaces();

      //Netplan interfaces should be set only during initialziation
      expect(interfaces).toEqual(projectFileContent.ipConfig);

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      //#endregion CHECKING_NETPLAN_INTERFACES
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });
});
