const Project = require("../../../../classes/Project/Project");
const RefreshGroupsManager = require("../../../../classes/RefreshGroup/RefreshGroupsManager");
const Sampler = require("../../../../classes/Sampler/Sampler");
const { createFakeDevice } = require("../../../utilities/testUtilities");
let logger = require("../../../../logger/logger");
const {
  snooze,
  createDirIfNotExists,
  clearDirectoryAsync,
  checkIfDirectoryExistsAsync,
} = require("../../../../utilities/utilities");
const config = require("config");
const SettingsDirPath = "__testDir/settings";
const ProjectFilePath = "__testDir/settings/projectSettings.json";
const AgentsDirPath = "__testDir/settings/agentsData";

const generateInitialProjectPayload = () => {
  return JSON.parse(
    JSON.stringify({
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
              defaultValue: 0,
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
              defaultValue: 0,
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
              defaultValue: 0,
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
        connectableDeviceID6: {
          id: "connectableDeviceID6",
          name: "connectableDeviceName1",
          type: "MBGatewayDevice",
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
              defaultValue: 0,
              unit: "Fake",
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
          ipAddress: "192.168.0.1",
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
            internalDeviceID1CalcElement4ID: {
              id: "internalDeviceID1CalcElement4ID",
              name: "internalDeviceID1CalcElement4ID",
              type: "ExpressionCalculator",
              unit: "Test",
              sampleTime: 1,
              defaultValue: 0,
              expression: "p1+p2+p3",
              parameters: {
                p1: {
                  type: "static",
                  value: 100,
                },
                p2: {
                  type: "dynamic",
                  elementId: "internalDeviceID3Variable1ID",
                },
                p3: {
                  type: "dynamic",
                  elementId: "internalDeviceID3Variable2ID",
                },
              },
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
            internalDeviceID2CalcElement4ID: {
              id: "internalDeviceID2CalcElement4ID",
              name: "internalDeviceID2CalcElement4ID",
              type: "ExpressionCalculator",
              unit: "Test",
              sampleTime: 1,
              defaultValue: 0,
              expression: "p1+p2+p3",
              parameters: {
                p1: {
                  type: "static",
                  value: 100,
                },
                p2: {
                  type: "dynamic",
                  elementId: "internalDeviceID3Variable1ID",
                },
                p3: {
                  type: "dynamic",
                  elementId: "internalDeviceID3Variable2ID",
                },
              },
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
            internalDeviceID3CalcElement4ID: {
              id: "internalDeviceID3CalcElement4ID",
              name: "internalDeviceID3CalcElement4ID",
              type: "ExpressionCalculator",
              unit: "Test",
              sampleTime: 1,
              defaultValue: 0,
              expression: "p1+p2+p3",
              parameters: {
                p1: {
                  type: "static",
                  value: 100,
                },
                p2: {
                  type: "dynamic",
                  elementId: "internalDeviceID3Variable1ID",
                },
                p3: {
                  type: "dynamic",
                  elementId: "internalDeviceID3Variable2ID",
                },
              },
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
    })
  );
};

const validateProjectAgainstPayload = (project, payloadToCheck) => {
  //Checking devices from project
  let connectableDevices = Object.values(project.ConnectableDevices);
  let internalDevices = Object.values(project.InternalDevices);
  let agentDevices = Object.values(project.AgentDevices);

  let connectableDevicesPayload = Object.values(
    payloadToCheck.connectableDevices
  );
  let internalDevicesPayload = Object.values(payloadToCheck.internalDevices);
  let agentDevicesPayload = Object.values(payloadToCheck.agentDevices);

  //All devices from payload should have been created
  expect(connectableDevices.length).toEqual(connectableDevicesPayload.length);
  expect(internalDevices.length).toEqual(internalDevicesPayload.length);
  expect(agentDevices.length).toEqual(agentDevicesPayload.length);

  //Checking connectableDevices
  for (let device of connectableDevices) {
    //Adjusting payload with every element - appending value and lastValueTicks
    let expectedPayload = {
      ...payloadToCheck.connectableDevices[device.ID],
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
      ...payloadToCheck.internalDevices[device.ID],
    };
    for (let variablePayload of Object.values(expectedPayload.variables)) {
      //assigning default value - by default is not presented
      variablePayload.defaultValue =
        payloadToCheck.connectableDevices[
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
      ...payloadToCheck.agentDevices[device.ID],
      boarded: false,
    };

    //Boarding key should not have been in payload returned by generatePayload()
    delete expectedPayload.boardingKey;

    for (let variablePayload of Object.values(expectedPayload.variables)) {
      //assigning default value - by default is not presented
      variablePayload.defaultValue =
        payloadToCheck.connectableDevices[
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

const validateRefreshGroupManager = (
  refreshGroupManager,
  connectableDevices,
  internalDevices,
  agentDevices
) => {
  expect(refreshGroupManager).toBeDefined();
  expect(refreshGroupManager.ConnectableDeviceGroups).toBeDefined();
  expect(refreshGroupManager.InternalDeviceGroups).toBeDefined();
  expect(refreshGroupManager.AgentDeviceGroups).toBeDefined();

  //Checking connectable devices
  let expectedConnectableDevicesGroups = {};
  for (let device of connectableDevices) {
    let groupId = device.getRefreshGroupID();
    if (!expectedConnectableDevicesGroups[groupId])
      expectedConnectableDevicesGroups[groupId] = [];

    expectedConnectableDevicesGroups[groupId].push(device);
  }

  expect(
    Object.keys(refreshGroupManager.ConnectableDeviceGroups.Groups)
  ).toEqual(Object.keys(expectedConnectableDevicesGroups));

  for (let groupId of Object.keys(
    refreshGroupManager.ConnectableDeviceGroups.Groups
  )) {
    let expectedGroup = expectedConnectableDevicesGroups[groupId];
    let group = refreshGroupManager.ConnectableDeviceGroups.Groups[groupId];

    expect(group.Devices).toEqual(expectedGroup);
  }

  //Checking internal devices
  let expectedInternalDevicesGroups = {};

  for (let device of internalDevices) {
    let groupId = device.getRefreshGroupID();
    if (!expectedInternalDevicesGroups[groupId])
      expectedInternalDevicesGroups[groupId] = [];

    expectedInternalDevicesGroups[groupId].push(device);
  }

  expect(Object.keys(refreshGroupManager.InternalDeviceGroups.Groups)).toEqual(
    Object.keys(expectedInternalDevicesGroups)
  );

  for (let groupId of Object.keys(
    refreshGroupManager.InternalDeviceGroups.Groups
  )) {
    let expectedGroup = expectedInternalDevicesGroups[groupId];
    let group = refreshGroupManager.InternalDeviceGroups.Groups[groupId];

    expect(group.Devices).toEqual(expectedGroup);
  }

  //Checking agent devices
  let expectedAgentDevicesGroups = {};

  for (let device of agentDevices) {
    let groupId = device.getRefreshGroupID();
    if (!expectedAgentDevicesGroups[groupId])
      expectedAgentDevicesGroups[groupId] = [];

    expectedAgentDevicesGroups[groupId].push(device);
  }

  expect(Object.keys(refreshGroupManager.AgentDeviceGroups.Groups)).toEqual(
    Object.keys(expectedAgentDevicesGroups)
  );

  for (let groupId of Object.keys(
    refreshGroupManager.AgentDeviceGroups.Groups
  )) {
    let expectedGroup = expectedAgentDevicesGroups[groupId];
    let group = refreshGroupManager.AgentDeviceGroups.Groups[groupId];

    expect(group.Devices).toEqual(expectedGroup);
  }
};

describe("Project", () => {
  let logWarnMock;

  beforeEach(async () => {
    jest.setTimeout(30000);

    //Overwriting logget action method
    logWarnMock = jest.fn();
    logger.warn = logWarnMock;

    await createDirIfNotExists(SettingsDirPath);
    await createDirIfNotExists(AgentsDirPath);
  });

  describe("constructor", () => {
    let projectFilePath;
    let agentsDirPath;

    beforeEach(() => {
      projectFilePath = ProjectFilePath;
      agentsDirPath = AgentsDirPath;
    });

    let exec = () => {
      return new Project(projectFilePath, agentsDirPath);
    };

    it("should create new Project and assign its project file path and agents dir path", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.ProjectFilePath).toEqual(projectFilePath);
      expect(result.AgentsDirPath).toEqual(agentsDirPath);
    });

    it("should set all devices to empty object", () => {
      let result = exec();

      expect(result.ConnectableDevices).toEqual({});
      expect(result.InternalDevices).toEqual({});
      expect(result.AgentDevices).toEqual({});
    });

    it("should create new RequestGroupManager", () => {
      let result = exec();

      expect(result.RefreshGroupManager).toBeDefined();
      expect(result.RefreshGroupManager instanceof RefreshGroupsManager);
    });

    it("should create new Sampler and assign its handleSampleTick", () => {
      let result = exec();
      expect(result.Sampler).toBeDefined();
      expect(result.Sampler instanceof Sampler);

      //Sample should not have been started
      expect(result.Sampler.Active).toEqual(false);

      //Samplers ExternalTickHandler should be assigned to _handleSamplerTick
      expect(result.Sampler.ExternalTickHandler).toEqual(
        result._handleSamplerTick
      );
    });

    it("should assing 0 to lastCycleInterval", () => {
      let result = exec();

      expect(result.LastCycleDuration).toEqual(0);
    });
  });

  describe("load", () => {
    let project;
    let projectFilePath;
    let agentsDirPath;
    let payload;
    let samplerStarted;
    let devicesConnected;
    let initialDevice1;
    let initialDevice2;
    let initialDevice3;
    let initialDevice4;
    let initialDevice5;
    let initialDevice6;
    let initialConnectableDevices;
    let initialInternalDevices;
    let initialAgentDevices;

    beforeEach(() => {
      projectFilePath = ProjectFilePath;
      agentsDirPath = AgentsDirPath;
      payload = generateInitialProjectPayload();
      samplerStarted = false;
      devicesConnected = false;
    });

    let exec = async () => {
      initialDevice1 = createFakeDevice(
        null,
        "deviceID1",
        "FakeDevice",
        "Device1Name",
        [],
        [],
        [],
        devicesConnected
      );
      initialDevice2 = createFakeDevice(
        null,
        "deviceID2",
        "FakeDevice",
        "Device2Name",
        [],
        [],
        [],
        devicesConnected
      );
      initialDevice3 = createFakeDevice(
        null,
        "deviceID3",
        "FakeDevice",
        "Device3Name",
        [],
        [],
        [],
        devicesConnected
      );
      initialDevice4 = createFakeDevice(
        null,
        "deviceID4",
        "FakeDevice",
        "Device4Name",
        [],
        [],
        [],
        devicesConnected
      );
      initialDevice5 = createFakeDevice(
        null,
        "deviceID5",
        "FakeDevice",
        "Device5Name",
        [],
        [],
        [],
        devicesConnected
      );
      initialDevice6 = createFakeDevice(
        null,
        "deviceID6",
        "FakeDevice",
        "Device6Name",
        [],
        [],
        [],
        devicesConnected
      );

      initialDevice1.deactivate = jest.fn(initialDevice1.deactivate);
      initialDevice2.deactivate = jest.fn(initialDevice2.deactivate);
      initialDevice3.deactivate = jest.fn(initialDevice3.deactivate);
      initialDevice4.deactivate = jest.fn(initialDevice4.deactivate);
      initialDevice5.deactivate = jest.fn(initialDevice5.deactivate);
      initialDevice6.deactivate = jest.fn(initialDevice6.deactivate);

      initialConnectableDevices = [initialDevice1, initialDevice2];
      initialInternalDevices = [initialDevice3, initialDevice4];
      initialAgentDevices = [initialDevice5, initialDevice6];

      project = new Project(projectFilePath, agentsDirPath);

      project.Sampler.start = jest.fn(project.Sampler.start);
      project.Sampler.stop = jest.fn(project.Sampler.stop);

      for (let device of initialConnectableDevices)
        project._connectableDevices[device.ID] = device;

      for (let device of initialInternalDevices)
        project._internalDevices[device.ID] = device;

      for (let device of initialAgentDevices)
        project._agentDevices[device.ID] = device;

      if (samplerStarted) project.Sampler.start();

      return project.load(payload);
    };

    it("should create and assign all internalDevice, connectableDevices and agentDevices", async () => {
      await exec();

      validateProjectAgainstPayload(project, payload);
    });

    // it("should create refreshGroups to refresh all devices", async () => {
    //   await exec();

    //   expect(project.RefreshGroupManager).toBeDefined();

    //   validateRefreshGroupManager(
    //     project.RefreshGroupManager,
    //     Object.values(project.ConnectableDevices),
    //     Object.values(project.InternalDevices),
    //     Object.values(project.AgentDevices)
    //   );
    // });

    // it("should start sampler at the end - if sampler has not been started", async () => {
    //   samplerStarted = false;

    //   await exec();

    //   expect(project.Sampler.start).toHaveBeenCalledTimes(1);
    //   expect(project.Sampler.Active).toEqual(true);
    // });

    // it("should not throw - if there are no devices", async () => {
    //   payload.connectableDevices = {};
    //   payload.internalDevices = {};
    //   payload.agentDevices = {};

    //   await exec();

    //   //Checking project devices
    //   validateProjectAgainstPayload(project, payload);

    //   //Checking project refresh groups

    //   expect(project.RefreshGroupManager).toBeDefined();

    //   validateRefreshGroupManager(project.RefreshGroupManager, [], [], []);
    // });

    // it("should throw and not initialize project - if project payload is invalid", async () => {
    //   //invalid type of connectableVariable
    //   payload.connectableDevices.connectableDeviceID1.type = "FakeDevice";

    //   let error = null;

    //   await expect(
    //     new Promise(async (resolve, reject) => {
    //       try {
    //         await exec();
    //         return resolve(true);
    //       } catch (err) {
    //         error = err;
    //         return reject(err);
    //       }
    //     })
    //   ).rejects.toBeDefined();

    //   expect(error.message).toEqual(
    //     `Invalid payload for initialization: connectable device type not recognized`
    //   );
    // });

    // it("should deactivate all initial devices - if they are active", async () => {
    //   devicesConnected = true;

    //   await exec();

    //   expect(initialDevice1.deactivate).toHaveBeenCalledTimes(1);
    //   expect(initialDevice2.deactivate).toHaveBeenCalledTimes(1);
    //   expect(initialDevice3.deactivate).toHaveBeenCalledTimes(1);
    //   expect(initialDevice4.deactivate).toHaveBeenCalledTimes(1);
    //   expect(initialDevice5.deactivate).toHaveBeenCalledTimes(1);
    //   expect(initialDevice6.deactivate).toHaveBeenCalledTimes(1);

    //   expect(initialDevice1.IsActive).toEqual(false);
    //   expect(initialDevice2.IsActive).toEqual(false);
    //   expect(initialDevice3.IsActive).toEqual(false);
    //   expect(initialDevice4.IsActive).toEqual(false);
    //   expect(initialDevice5.IsActive).toEqual(false);
    //   expect(initialDevice6.IsActive).toEqual(false);
    // });

    // it("should stop sampler at the begining and then start it", async () => {
    //   samplerStarted = true;

    //   await exec();

    //   //First time - at the begining, second time - at the end
    //   expect(project.Sampler.start).toHaveBeenCalledTimes(2);

    //   //One time - at reload
    //   expect(project.Sampler.stop).toHaveBeenCalledTimes(1);

    //   //Sampler should stay started at the end
    //   expect(project.Sampler.Active).toEqual(true);
    // });
  });

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = generateInitialProjectPayload();
    });

    let exec = () => {
      return Project.validatePayload(payload);
    };

    it("should return null if payload is valid", () => {
      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if connectableDevices is not defined", () => {
      delete payload.connectableDevices;

      let result = exec();

      expect(result).toEqual(`"connectableDevices" is required`);
    });

    it("should return message if connectableDevices is null", () => {
      payload.connectableDevices = null;

      let result = exec();

      expect(result).toEqual(`"connectableDevices" cannot be null`);
    });

    it("should return message if one of connectableDevice payload is invalid - id different than id inside payload", () => {
      payload.connectableDevices.device1ID = {
        id: "device99ID",
        name: "device1Name",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
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
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
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
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
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
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };

      let result = exec();

      expect(result).toEqual(
        `connectable device's id as key and in payload differ!`
      );
    });

    it("should return message if one of connectableDevices payload is invalid - MBDevice", () => {
      //invalid default value of one of variables
      payload.connectableDevices.device1ID = {
        id: "device99ID",
        name: "device1Name",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: "testFakeValue",
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
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
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
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
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
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of connectableDevices payload is invalid - MBGatewayDevice", () => {
      //invalid default value of one of variables
      payload.connectableDevices.device1ID = {
        id: "device99ID",
        name: "device1Name",
        type: "MBGatewayDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: "testFakeValue",
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
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
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
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
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
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of connectableDevices payload is invalid - S7Device", () => {
      //invalid default value of one of variables
      payload.connectableDevices.device1ID = {
        id: "device1ID",
        name: "connectableDeviceName3",
        type: "S7Device",
        variables: {
          connectableDeviceID5Variable1ID: {
            id: "connectableDeviceID5Variable1ID",
            name: "connectableDeviceID5Variable1Name",
            type: "S7Int",
            unit: "V",
            sampleTime: 1,
            defaultValue: true,
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
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of connectableDevice types is not recognized", () => {
      payload.connectableDevices.device1ID = {
        id: "device1ID",
        name: "device1Name",
        type: "FakeDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.321,
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
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
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
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
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
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };

      let result = exec();

      expect(result).toEqual(`connectable device type not recognized`);
    });

    it("should return message if devicesID are the same", () => {
      payload.internalDevices.connectableDeviceID2 = {
        id: "connectableDeviceID2",
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
      };

      let result = exec();

      expect(result).toEqual(
        `All ids inside project payload should be unique!`
      );
    });

    it("should return message if devicesID is the same with variable id", () => {
      payload.internalDevices.internalDeviceID2 = {
        id: "internalDeviceID2",
        name: "internalDeviceName2",
        type: "InternalDevice",
        variables: {
          internalDeviceID2: {
            id: "internalDeviceID2",
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
      };

      let result = exec();

      expect(result).toEqual(
        `All ids inside project payload should be unique!`
      );
    });

    it("should return message if variablesID are the same in the same device", () => {
      //variable1 has the same id as calcElement
      payload.internalDevices.internalDeviceID2 = {
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
          internalDeviceID2Variable2ID: {
            id: "internalDeviceID2Variable2ID",
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
      };

      let result = exec();

      expect(result).toEqual(
        `All ids inside project payload should be unique!`
      );
    });

    it("should return message if variablesID are the same in different devices", () => {
      //variable1 has the same id as calcElement
      payload.internalDevices.internalDeviceID2 = {
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
      };

      payload.connectableDevices.connectableDeviceID2 = {
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
          internalDeviceID2CalcElement2ID: {
            id: "internalDeviceID2CalcElement2ID",
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
            defaultValue: 0,
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
      };

      let result = exec();

      expect(result).toEqual(
        `All ids inside project payload should be unique!`
      );
    });

    it("should return message if internalDevices is not defined", () => {
      delete payload.internalDevices;

      let result = exec();

      expect(result).toEqual(`"internalDevices" is required`);
    });

    it("should return message if internalDevices is null", () => {
      payload.internalDevices = null;

      let result = exec();

      expect(result).toEqual(`"internalDevices" cannot be null`);
    });

    it("should return message if one of internalDevice types is not recognized", () => {
      payload.internalDevices.device1ID = {
        id: "device1ID",
        name: "device1Name",
        type: "FakeDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.321,
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
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
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
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
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
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };

      let result = exec();

      expect(result).toEqual(`internal device type not recognized`);
    });

    it("should return message if one of internalDevices payload is invalid - id different than id inside payload", () => {
      payload.internalDevices.device1ID = {
        id: "internalDeviceID8",
        name: "internalDeviceName2",
        type: "InternalDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
      };

      let result = exec();

      expect(result).toEqual(
        `internal device's id as key and in payload differ!`
      );
    });

    it("should return message if one of connectableDevices payload is invalid - InternalDevice", () => {
      //Lack of sample time in one of variables
      payload.internalDevices.device1ID = {
        id: "device1ID",
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
      };

      let result = exec();

      expect(result).toEqual(`"sampleTime" is required`);
    });

    it("should return message if agentDevices is not defined", () => {
      delete payload.agentDevices;

      let result = exec();

      expect(result).toEqual(`"agentDevices" is required`);
    });

    it("should return message if agentDevices is null", () => {
      payload.agentDevices = null;

      let result = exec();

      expect(result).toEqual(`"agentDevices" cannot be null`);
    });

    it("should return message if one of agentDevices types is not recognized", () => {
      payload.agentDevices.device1ID = {
        id: "device1ID",
        name: "device1Name",
        type: "FakeDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.321,
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
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
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
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
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
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };

      let result = exec();

      expect(result).toEqual(`agent device type not recognized`);
    });

    it("should return message if one of agentDevices payload is invalid - MSAgent", () => {
      //Lack of sample time for one of variables
      payload.agentDevices.device1ID = {
        id: "device1ID",
        name: "agentDeviceID1Name",
        type: "MSAgentDevice",
        variables: {
          agentDeviceID1Variable1ID: {
            id: "agentDeviceID1Variable1ID",
            name: "agentDeviceID1Variable1Name",
            type: "AssociatedVariable",
            unit: "V",
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
      };

      let result = exec();

      expect(result).toEqual(`"sampleTime" is required`);
    });
  });

  describe("_loadConnectableDevices", () => {
    let project;
    let projectFilePath;
    let agentsDirPath;
    let payload;
    let initialDevice1;
    let initialDevice2;
    let initialConnectableDevices;

    beforeEach(() => {
      projectFilePath = ProjectFilePath;
      agentsDirPath = AgentsDirPath;
      payload = generateInitialProjectPayload().connectableDevices;
    });

    let exec = async () => {
      initialDevice1 = createFakeDevice(
        null,
        "deviceID1",
        "FakeDevice",
        "Device1Name",
        [],
        [],
        [],
        false
      );
      initialDevice2 = createFakeDevice(
        null,
        "deviceID2",
        "FakeDevice",
        "Device2Name",
        [],
        [],
        [],
        false
      );

      initialConnectableDevices = [initialDevice1, initialDevice2];

      project = new Project(projectFilePath, agentsDirPath);

      for (let device of initialConnectableDevices)
        project._connectableDevices[device.ID] = device;

      return project._loadConnectableDevices(payload);
    };

    it("should create new connectable devices based on payload", async () => {
      await exec();

      //Checking devices from project
      let connectableDevices = Object.values(project.ConnectableDevices);

      let connectableDevicesPayload = Object.values(payload);

      //All devices from payload should have been created
      expect(connectableDevices.length).toEqual(
        connectableDevicesPayload.length
      );

      //Checking connectableDevices
      for (let device of connectableDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payload[device.ID],
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

        expectedPayload.isConnected = expectedPayload.isActive;

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }
    });

    it("should create new connectable devices based on payload - if payload is empty", async () => {
      payload = {};

      await exec();

      expect(project.ConnectableDevices).toEqual({});
    });

    it("should not throw and create other connectable devices based on payload - if creating of one throw", async () => {
      payload.connectableDeviceID2.type = "FakeType";

      await exec();

      //Checking payload of whole project - one connectable device should not have been assigned
      delete payload.connectableDeviceID2;

      //Checking devices from project
      let connectableDevices = Object.values(project.ConnectableDevices);

      let connectableDevicesPayload = Object.values(payload);

      //All devices from payload should have been created
      expect(connectableDevices.length).toEqual(
        connectableDevicesPayload.length
      );

      //Checking connectableDevices
      for (let device of connectableDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payload[device.ID],
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

        expectedPayload.isConnected = expectedPayload.isActive;

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }
      //Logger should have been called
      expect(logWarnMock).toHaveBeenCalledTimes(1);
      expect(logWarnMock.mock.calls[0][0]).toEqual(
        `Unrecognized Device type: FakeType`
      );
    });
  });

  describe("_loadInternalDevices", () => {
    let project;
    let projectFilePath;
    let agentsDirPath;
    let payload;
    let initialDevice1;
    let initialDevice2;
    let initialInternalDevices;

    beforeEach(() => {
      projectFilePath = ProjectFilePath;
      agentsDirPath = AgentsDirPath;
      payload = generateInitialProjectPayload().internalDevices;
    });

    let exec = async () => {
      initialDevice1 = createFakeDevice(
        null,
        "deviceID1",
        "FakeDevice",
        "Device1Name",
        [],
        [],
        [],
        false
      );
      initialDevice2 = createFakeDevice(
        null,
        "deviceID2",
        "FakeDevice",
        "Device2Name",
        [],
        [],
        [],
        false
      );

      initialInternalDevices = [initialDevice1, initialDevice2];

      project = new Project(projectFilePath, agentsDirPath);

      for (let device of initialInternalDevices)
        project._internalDevices[device.ID] = device;

      return project._loadInternalDevices(payload);
    };

    it("should create new internal devices based on payload", async () => {
      await exec();

      //Checking devices from project
      let internalDevices = Object.values(project.InternalDevices);

      let internalDevicesPayload = Object.values(payload);

      //All devices from payload should have been created
      expect(internalDevices.length).toEqual(internalDevicesPayload.length);

      //Checking internalDevices
      for (let device of internalDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payload[device.ID],
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

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }
    });

    it("should create new internal devices based on payload - if payload is empty", async () => {
      payload = {};

      await exec();

      expect(project.InternalDevices).toEqual({});
    });

    it("should not throw and create other internal devices based on payload - if creating of one throw", async () => {
      payload.internalDeviceID1.type = "FakeType";

      await exec();

      //Checking payload of whole project - one internal device should not have been assigned
      delete payload.internalDeviceID1;

      //Checking devices from project
      let internalDevices = Object.values(project.InternalDevices);

      let internalDevicesPayload = Object.values(payload);

      //All devices from payload should have been created
      expect(internalDevices.length).toEqual(internalDevicesPayload.length);

      //Checking internalDevices
      for (let device of internalDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payload[device.ID],
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

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }
    });
  });

  describe("_loadAgentDevices", () => {
    let project;
    let projectFilePath;
    let agentsDirPath;
    let payload;
    let initialDevice1;
    let initialDevice2;
    let initialAgentDevices;

    beforeEach(() => {
      projectFilePath = ProjectFilePath;
      agentsDirPath = AgentsDirPath;
      payload = generateInitialProjectPayload().internalDevices;
    });

    let exec = async () => {
      initialDevice1 = createFakeDevice(
        null,
        "deviceID1",
        "FakeDevice",
        "Device1Name",
        [],
        [],
        [],
        false
      );
      initialDevice2 = createFakeDevice(
        null,
        "deviceID2",
        "FakeDevice",
        "Device2Name",
        [],
        [],
        [],
        false
      );

      initialAgentDevices = [initialDevice1, initialDevice2];

      project = new Project(projectFilePath, agentsDirPath);

      for (let device of initialAgentDevices)
        project._agentDevices[device.ID] = device;

      return project._loadAgentDevices(payload);
    };

    it("should create new internal devices based on payload", async () => {
      await exec();

      //Checking devices from project
      let agentDevices = Object.values(project.AgentDevices);

      let agentDevicesPayload = Object.values(payload);

      //All devices from payload should have been created
      expect(agentDevices.length).toEqual(agentDevicesPayload.length);

      //Checking agentDevices
      for (let device of agentDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payload[device.ID],
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

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }
    });

    it("should create new internal devices based on payload - if payload is empty", async () => {
      payload = {};

      await exec();

      expect(project.AgentDevices).toEqual({});
    });

    it("should not throw and create other internal devices based on payload - if creating of one throw", async () => {
      payload.internalDeviceID1.type = "FakeType";

      await exec();

      //Checking payload of whole project - one internal device should not have been assigned
      delete payload.internalDeviceID1;

      //Checking devices from project
      let agentDevices = Object.values(project.AgentDevices);

      let agentDevicesPayload = Object.values(payload);

      //All devices from payload should have been created
      expect(agentDevices.length).toEqual(agentDevicesPayload.length);

      //Checking agentDevices
      for (let device of agentDevices) {
        //Adjusting payload with every element - appending value and lastValueTicks
        let expectedPayload = {
          ...payload[device.ID],
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

        //Checking device payload
        expect(device.generatePayload()).toEqual(expectedPayload);
      }
    });
  });

  describe("_disconnectAllDevices", () => {
    let project;
    let projectFilePath;
    let agentsDirPath;
    let activateDevices;
    let initialDevice1;
    let initialDevice2;
    let initialDevice3;
    let initialDevice4;
    let initialDevice5;
    let initialDevice6;
    let addInitialDevice1;
    let addInitialDevice2;
    let addInitialDevice3;
    let addInitialDevice4;
    let addInitialDevice5;
    let addInitialDevice6;
    let initialConnectableDevices;
    let initialInternalDevices;
    let initialAgentDevices;
    let initialDevice1DeactivateMockFunc;
    let initialDevice2DeactivateMockFunc;
    let initialDevice3DeactivateMockFunc;
    let initialDevice4DeactivateMockFunc;
    let initialDevice5DeactivateMockFunc;
    let initialDevice6DeactivateMockFunc;

    beforeEach(() => {
      addInitialDevice1 = true;
      addInitialDevice2 = true;
      addInitialDevice3 = true;
      addInitialDevice4 = true;
      addInitialDevice5 = true;
      addInitialDevice6 = true;

      activateDevices = true;
      projectFilePath = ProjectFilePath;
      agentsDirPath = AgentsDirPath;

      //Overriding with "function" key - to let this not be bound
      initialDevice1DeactivateMockFunc = jest.fn(async function () {
        this._isActive = false;
      });
      initialDevice2DeactivateMockFunc = jest.fn(async function () {
        this._isActive = false;
      });
      initialDevice3DeactivateMockFunc = jest.fn(async function () {
        this._isActive = false;
      });
      initialDevice4DeactivateMockFunc = jest.fn(async function () {
        this._isActive = false;
      });
      initialDevice5DeactivateMockFunc = jest.fn(async function () {
        this._isActive = false;
      });
      initialDevice6DeactivateMockFunc = jest.fn(async function () {
        this._isActive = false;
      });
    });

    let exec = async () => {
      initialDevice1 = createFakeDevice(
        null,
        "deviceID1",
        "FakeDevice",
        "Device1Name",
        [],
        [],
        [],
        activateDevices
      );
      initialDevice2 = createFakeDevice(
        null,
        "deviceID2",
        "FakeDevice",
        "Device2Name",
        [],
        [],
        [],
        activateDevices
      );
      initialDevice3 = createFakeDevice(
        null,
        "deviceID3",
        "FakeDevice",
        "Device3Name",
        [],
        [],
        [],
        activateDevices
      );
      initialDevice4 = createFakeDevice(
        null,
        "deviceID4",
        "FakeDevice",
        "Device4Name",
        [],
        [],
        [],
        activateDevices
      );
      initialDevice5 = createFakeDevice(
        null,
        "deviceID5",
        "FakeDevice",
        "Device5Name",
        [],
        [],
        [],
        activateDevices
      );
      initialDevice6 = createFakeDevice(
        null,
        "deviceID6",
        "FakeDevice",
        "Device6Name",
        [],
        [],
        [],
        activateDevices
      );

      initialDevice1.deactivate = initialDevice1DeactivateMockFunc;
      initialDevice2.deactivate = initialDevice2DeactivateMockFunc;
      initialDevice3.deactivate = initialDevice3DeactivateMockFunc;
      initialDevice4.deactivate = initialDevice4DeactivateMockFunc;
      initialDevice5.deactivate = initialDevice5DeactivateMockFunc;
      initialDevice6.deactivate = initialDevice6DeactivateMockFunc;

      initialConnectableDevices = [];
      if (addInitialDevice1) initialConnectableDevices.push(initialDevice1);
      if (addInitialDevice2) initialConnectableDevices.push(initialDevice2);

      initialInternalDevices = [];
      if (addInitialDevice3) initialInternalDevices.push(initialDevice3);
      if (addInitialDevice4) initialInternalDevices.push(initialDevice4);

      initialAgentDevices = [];
      if (addInitialDevice5) initialAgentDevices.push(initialDevice5);
      if (addInitialDevice6) initialAgentDevices.push(initialDevice6);

      project = new Project(projectFilePath, agentsDirPath);

      for (let device of initialConnectableDevices)
        project._connectableDevices[device.ID] = device;

      for (let device of initialInternalDevices)
        project._internalDevices[device.ID] = device;

      for (let device of initialAgentDevices)
        project._agentDevices[device.ID] = device;

      return project._disconnectAllDevices();
    };

    it("should call deactivate of all devices - if they are connected", async () => {
      activateDevices = true;

      await exec();

      expect(initialDevice1.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice2.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice3.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice4.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice5.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice6.deactivate).toHaveBeenCalledTimes(1);

      //All devices should be deactivated at the end - function mocked by with default functionality
      expect(initialDevice1.IsActive).toEqual(false);
      expect(initialDevice2.IsActive).toEqual(false);
      expect(initialDevice3.IsActive).toEqual(false);
      expect(initialDevice4.IsActive).toEqual(false);
      expect(initialDevice5.IsActive).toEqual(false);
      expect(initialDevice6.IsActive).toEqual(false);
    });

    it("should call deactivate of all devices - even if they are not connected", async () => {
      activateDevices = false;

      await exec();

      expect(initialDevice1.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice2.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice3.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice4.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice5.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice6.deactivate).toHaveBeenCalledTimes(1);

      //All devices should be deactivated at the end - function mocked by with default functionality
      expect(initialDevice1.IsActive).toEqual(false);
      expect(initialDevice2.IsActive).toEqual(false);
      expect(initialDevice3.IsActive).toEqual(false);
      expect(initialDevice4.IsActive).toEqual(false);
      expect(initialDevice5.IsActive).toEqual(false);
      expect(initialDevice6.IsActive).toEqual(false);
    });

    it("should not throw - if there are no devices", async () => {
      addInitialDevice1 = false;
      addInitialDevice2 = false;
      addInitialDevice3 = false;
      addInitialDevice4 = false;
      addInitialDevice5 = false;
      addInitialDevice6 = false;

      await exec();
    });

    it("should not throw - and continue with other devices - if disconnects throws for one connectableDevice, one internalDevice and one agentDevice", async () => {
      initialDevice1DeactivateMockFunc = jest.fn(async () => {
        throw Error("testError1");
      });
      initialDevice3DeactivateMockFunc = jest.fn(async () => {
        throw Error("testError2");
      });
      initialDevice5DeactivateMockFunc = jest.fn(async () => {
        throw Error("testError3");
      });

      await exec();

      //Other devices should also be deactivated
      expect(initialDevice2.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice4.deactivate).toHaveBeenCalledTimes(1);
      expect(initialDevice6.deactivate).toHaveBeenCalledTimes(1);

      //Devices should be deactivated at the end - function mocked by with default functionality
      expect(initialDevice2.IsActive).toEqual(false);
      expect(initialDevice4.IsActive).toEqual(false);
      expect(initialDevice6.IsActive).toEqual(false);

      //Logger should have been called 3 times - for every throw
      expect(logWarnMock).toHaveBeenCalledTimes(3);
      expect(logWarnMock.mock.calls[0][0]).toEqual("testError1");
      expect(logWarnMock.mock.calls[1][0]).toEqual("testError2");
      expect(logWarnMock.mock.calls[2][0]).toEqual("testError3");
    });
  });

  describe("getDevices", () => {
    let project;
    let initialProjectFileContent;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getDevices();
    };

    it("should return object with all devices", async () => {
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return object with all devices - if there are no connectableDevices", async () => {
      initialProjectFileContent.connectableDevices = {};

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return object with all devices - if there are no internalDevices", async () => {
      initialProjectFileContent.internalDevices = {};

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return object with all devices - if there are no agentDevices", async () => {
      initialProjectFileContent.agentDevices = {};

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(project.Devices);
    });

    it("should return empty object - if there are no devices", async () => {
      initialProjectFileContent.connectableDevices = {};
      initialProjectFileContent.internalDevices = {};
      initialProjectFileContent.agentDevices = {};

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual({});
    });
  });

  describe("getDevice", () => {
    let project;
    let initialProjectFileContent;
    let deviceId;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getDevice(deviceId);
    };

    it("should return object of device of given id - if device is connectableDevice", async () => {
      let result = await exec();

      let expectedResult = project.ConnectableDevices["connectableDeviceID2"];

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of device of given id - if device is internalDevice", async () => {
      deviceId = "internalDeviceID2";

      let result = await exec();

      let expectedResult = project.InternalDevices["internalDeviceID2"];

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return object of device of given id - if device is agentDevice", async () => {
      deviceId = "agentDeviceID1";

      let result = await exec();

      let expectedResult = project.AgentDevices["agentDeviceID1"];

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no device of given id", async () => {
      deviceId = "fakeDeviceID";

      let result = await exec();

      expect(result).toEqual(null);
    });
  });

  describe("getElements", () => {
    let project;
    let initialProjectFileContent;
    let deviceIds;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getElements(deviceIds);
    };

    it("should return object of all elements associated with devices from argument", async () => {
      let result = await exec();

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

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no elements", async () => {
      initialProjectFileContent.connectableDevices.connectableDeviceID2.variables = {};
      initialProjectFileContent.connectableDevices.connectableDeviceID2.calcElements = {};
      initialProjectFileContent.connectableDevices.connectableDeviceID2.alerts = {};
      initialProjectFileContent.internalDevices.internalDeviceID2.variables = {};
      initialProjectFileContent.internalDevices.internalDeviceID2.calcElements = {};
      initialProjectFileContent.internalDevices.internalDeviceID2.alerts = {};

      let result = await exec();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getVariables", () => {
    let project;
    let initialProjectFileContent;
    let deviceIds;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getVariables(deviceIds);
    };

    it("should return object of all variables associated with devices from argument", async () => {
      let result = await exec();

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

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no variables", async () => {
      initialProjectFileContent.connectableDevices.connectableDeviceID2.variables = {};
      initialProjectFileContent.internalDevices.internalDeviceID2.variables = {};

      let result = await exec();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getCalcElements", () => {
    let project;
    let initialProjectFileContent;
    let deviceIds;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getCalcElements(deviceIds);
    };

    it("should return object of all calcElements associated with devices from argument", async () => {
      let result = await exec();

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

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no calcElements", async () => {
      initialProjectFileContent.connectableDevices.connectableDeviceID2.calcElements = {};
      initialProjectFileContent.internalDevices.internalDeviceID2.calcElements = {};

      let result = await exec();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getAlerts", () => {
    let project;
    let initialProjectFileContent;
    let deviceIds;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceIds = ["connectableDeviceID2", "internalDeviceID2"];
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getAlerts(deviceIds);
    };

    it("should return object of all alerts associated with devices from argument", async () => {
      let result = await exec();

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

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should return empty object - if given devices have no alerts", async () => {
      initialProjectFileContent.connectableDevices.connectableDeviceID2.alerts = {};
      initialProjectFileContent.internalDevices.internalDeviceID2.alerts = {};

      let result = await exec();

      let expectedResult = {};

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getElement", () => {
    let project;
    let initialProjectFileContent;
    let deviceId;
    let elementId;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID2Variable2ID";
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getElement(deviceId, elementId);
    };

    it("should return element from given device of given id - if element is variable, device is connectableDevice", async () => {
      let result = await exec();

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

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no element of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "connectableDeviceID3Alert2ID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no element of given id", async () => {
      deviceId = "connectableDeviceID2";
      elementId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no element of given id and deviceID is null", async () => {
      deviceId = null;
      elementId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getVariable", () => {
    let project;
    let initialProjectFileContent;
    let deviceId;
    let variableId;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      variableId = "connectableDeviceID2Variable2ID";
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getVariable(deviceId, variableId);
    };

    it("should return variable from given device of given id - if device is connectableDevice", async () => {
      let result = await exec();

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

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no variable of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      variableId = "connectableDeviceID3Alert2ID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no variable of given id", async () => {
      deviceId = "connectableDeviceID2";
      variableId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no variable of given id and deviceID is null", async () => {
      deviceId = null;
      variableId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getCalcElement", () => {
    let project;
    let initialProjectFileContent;
    let deviceId;
    let calcElementId;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      calcElementId = "connectableDeviceID2CalcElement2ID";
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getCalcElement(deviceId, calcElementId);
    };

    it("should return calcElement from given device of given id - if device is connectableDevice", async () => {
      let result = await exec();

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

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no calcElement of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      calcElementId = "connectableDeviceID3CalcElement2ID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no calcElement of given id", async () => {
      deviceId = "connectableDeviceID2";
      calcElementId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no calcElement of given id and deviceID is null", async () => {
      deviceId = null;
      calcElementId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getAlert", () => {
    let project;
    let initialProjectFileContent;
    let deviceId;
    let calcElementId;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "connectableDeviceID2";
      alertId = "connectableDeviceID2Alert2ID";
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.getAlert(deviceId, alertId);
    };

    it("should return alert from given device of given id - if device is connectableDevice", async () => {
      let result = await exec();

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

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no alert of given id in this device", async () => {
      deviceId = "connectableDeviceID2";
      alertId = "connectableDeviceID3Alert2ID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no alert of given id", async () => {
      deviceId = "connectableDeviceID2";
      alertId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if there is no alert of given id and deviceID is null", async () => {
      deviceId = null;
      alertId = "fakeID";

      let result = await exec();

      let expectedResult = null;

      expect(result).toEqual(expectedResult);
    });
  });

  describe("activateDevice", () => {
    let project;
    let initialProjectFileContent;
    let deviceId;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "internalDeviceID2";
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.activateDevice(deviceId);
    };

    it("should activate device if it was not active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.internalDevices.internalDeviceID2.isActive = false;

      await exec();

      let device = project.getDevice(deviceId);

      expect(device.IsActive).toEqual(true);
    });

    it("should leave device activated if it was active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.internalDevices.internalDeviceID2.isActive = true;

      await exec();

      let device = project.getDevice(deviceId);

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
  });

  describe("deactivateDevice", () => {
    let project;
    let initialProjectFileContent;
    let deviceId;

    beforeEach(async () => {
      initialProjectFileContent = generateInitialProjectPayload();
      deviceId = "internalDeviceID2";
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      await project.load(initialProjectFileContent);

      return project.deactivateDevice(deviceId);
    };

    it("should deactivate device if it was active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.internalDevices.internalDeviceID2.isActive = true;

      await exec();

      let device = project.getDevice(deviceId);

      expect(device.IsActive).toEqual(false);
    });

    it("should leave device deactivated if it was not active before", async () => {
      deviceId = "internalDeviceID2";
      initialProjectFileContent.internalDevices.internalDeviceID2.isActive = false;

      await exec();

      let device = project.getDevice(deviceId);

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
  });

  describe("refresh", () => {
    let project;
    let refreshGroupManagerRefreshMockFunc;
    let tickId = 1234;

    beforeEach(async () => {
      refreshGroupManagerRefreshMockFunc = jest.fn();
    });

    let exec = async () => {
      project = new Project(ProjectFilePath, AgentsDirPath);

      project.RefreshGroupManager.refresh = refreshGroupManagerRefreshMockFunc;

      return project._handleSamplerTick(tickId);
    };

    it("should call refreshGroupManager refresh method - to refresh all devices", async () => {
      await exec();

      expect(refreshGroupManagerRefreshMockFunc).toHaveBeenCalledTimes(1);
      expect(refreshGroupManagerRefreshMockFunc.mock.calls[0][0]).toEqual(
        tickId
      );
    });

    it("should set LastCycleDuration based on the time of refresh of refreshGroupManager time", async () => {
      refreshGroupManagerRefreshMockFunc = jest.fn(async () => {
        await snooze(200);
      });

      let beginDate = Date.now();
      await exec();
      let endDate = Date.now();

      let timeInterval = endDate - beginDate;

      expect(project.LastCycleDuration).toBeDefined();

      //Last cycle duration should be for sure longer than snoozing time but shorter then all process
      expect(project.LastCycleDuration >= 200).toEqual(true);
      expect(project.LastCycleDuration <= timeInterval).toEqual(true);
    });
  });
});
