const MSAgentDevice = require("../../../../../classes/Device/AgentDevice/MSAgentDevice");
const {
  createDirIfNotExists,
  clearDirectoryAsync,
  checkIfDirectoryExistsAsync,
  createDirAsync,
  writeFileAsync,
  checkIfFileExistsAsync,
  exists,
  generateRandomString,
} = require("../../../../../utilities/utilities");
const path = require("path");
const { MindConnectAgent, retry } = require("@mindconnect/mindconnect-nodejs");
const logger = require("../../../../../logger/logger");

const AgentsDirPath = "__testDir/settings/agentsData";

describe("MSAgentDevice", () => {
  let loggerWarnMock;

  beforeEach(() => {
    jest.setTimeout(30000);
    jest.clearAllMocks();
    loggerWarnMock = jest.fn();
    logger.warn = loggerWarnMock;
  });

  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "testProject";
    });

    let exec = () => {
      return new MSAgentDevice(project);
    };

    it("should create new MSAgentDevice and set all properties to null", () => {
      let device = exec();

      expect(device._dirPath).toEqual(null);
      expect(device._dataClipboard).toEqual(null);
      expect(device._eventClipboard).toEqual(null);
      expect(device._tryBoardOnSendData).toEqual(null);
      expect(device._tryBoardOnSendEvent).toEqual(null);
      expect(device._lastDataValues).toEqual(null);
      expect(device._dataStorage).toEqual(null);
      expect(device._eventStorage).toEqual(null);
      expect(device.SendDataFileInterval).toEqual(null);
      expect(device.SendEventFileInterval).toEqual(null);
      expect(device.DataStorageSize).toEqual(null);
      expect(device.EventStorageSize).toEqual(null);
      expect(device.NumberOfDataFilesToSend).toEqual(null);
      expect(device.NumberOfEventFilesToSend).toEqual(null);
      expect(device.DataToSendConfig).toEqual(null);
      expect(device.EventsToSendConfig).toEqual(null);
      expect(device.Boarded).toEqual(null);
      expect(device._busy).toEqual(null);
      expect(device._valueConverters).toEqual(null);
      expect(device._boardingKey).toEqual(null);
      expect(device._valueConverters).toEqual(null);
      expect(device._mindConnectAgent).toEqual(null);
      expect(device._numberOfSendDataRetries).toEqual(null);
      expect(device._numberOfSendEventRetries).toEqual(null);
    });

    it("should assign project to MSAgentDevice", () => {
      let result = exec();

      expect(result._project).toEqual(project);
    });
  });

  describe("init", () => {
    let project;
    let payload;
    let device;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
          },
          expessionCalculatorID: {
            id: "expessionCalculatorID",
            name: "expessionCalculatorName",
            type: "ExpressionCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            expression: "p1+p2+p3",
            parameters: {
              p1: { type: "static", value: 100 },
              p2: { type: "dynamic", elementId: "associatedVariableID" },
              p3: { type: "dynamic", elementId: "cpuLoadVariableID" },
            },
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
            source: "source1244",
            correlationId: "corelation124",
            code: "1244",
            acknowledged: false,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      activateMockFunc = jest.fn();
      deactivatMeockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      device = new MSAgentDevice(project);

      activateMockFunc = jest.fn(device.activate);
      deactivateMockFunc = jest.fn(device.deactivate);

      device.activate = activateMockFunc;
      device.deactivate = deactivateMockFunc;

      return device.init(payload);
    };

    it("should initialize device based on given payload", async () => {
      await exec();

      let expectedPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            deviceId: "deviceID",
            lastValueTick: 0,
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
            value: 987.321,
            defaultValue: 987.321,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 15,
          },
          expessionCalculatorID: {
            id: "expessionCalculatorID",
            name: "expessionCalculatorName",
            type: "ExpressionCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            expression: "p1+p2+p3",
            parameters: {
              p1: { type: "static", value: 100 },
              p2: { type: "dynamic", elementId: "associatedVariableID" },
              p3: { type: "dynamic", elementId: "cpuLoadVariableID" },
            },
            deviceId: "deviceID",
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
        },
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
            source: "source1244",
            correlationId: "corelation124",
            code: "1244",
            acknowledged: false,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boarded: false,
      };

      expect(device.generatePayload()).toEqual(expectedPayload);
    });

    it("should initialize device based on given payload - if one of event config does not have requried properties", async () => {
      payload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        severity: 30,
      };

      await exec();
      let expectedPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            deviceId: "deviceID",
            lastValueTick: 0,
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
            value: 987.321,
            defaultValue: 987.321,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 15,
          },
          expessionCalculatorID: {
            id: "expessionCalculatorID",
            name: "expessionCalculatorName",
            type: "ExpressionCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            expression: "p1+p2+p3",
            parameters: {
              p1: { type: "static", value: 100 },
              p2: { type: "dynamic", elementId: "associatedVariableID" },
              p3: { type: "dynamic", elementId: "cpuLoadVariableID" },
            },
            deviceId: "deviceID",
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
        },
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boarded: false,
      };

      expect(device.generatePayload()).toEqual(expectedPayload);
    });

    it("should create and assing MindConnectAgent - based on boarding key", async () => {
      await exec();

      expect(device._mindConnectAgent).toBeDefined();

      expect(device._mindConnectAgent instanceof MindConnectAgent).toEqual(
        true
      );

      expect(device._mindConnectAgent._credentials).toEqual(
        payload.boardingKey
      );
    });

    it("should set busy to false", async () => {
      await exec();

      expect(device._busy).toEqual(false);
    });

    it("should initialize storages, clipboards and paths", async () => {
      await exec();

      //Checking main dir path
      let mainDirPath = path.join(AgentsDirPath, "deviceID");
      expect(device._dirPath).toEqual(mainDirPath);
      //Checking clipboards
      let dataOfClipboard = device._dataClipboard.getAllData();
      expect(dataOfClipboard).toEqual({});
      let eventsOfClipboard = device._eventClipboard.getAllData();
      expect(eventsOfClipboard).toEqual([]);

      //Checking storages
      expect(device._dataStorage.DirPath).toEqual(
        path.join(mainDirPath, "dataToSend")
      );
      expect(device._dataStorage.BufferLength).toEqual(payload.dataStorageSize);

      //Checking storages
      expect(device._eventStorage.DirPath).toEqual(
        path.join(mainDirPath, "eventsToSend")
      );
      expect(device._eventStorage.BufferLength).toEqual(
        payload.eventStorageSize
      );
    });

    it("should create agents directories if they not exist", async () => {
      await exec();

      let agentDirPath = path.join(AgentsDirPath, "deviceID");

      //Checking if agents main dir exists
      let agentDirExists = await checkIfDirectoryExistsAsync(agentDirPath);
      expect(agentDirExists).toEqual(true);

      //Checking if agents file storage dir was created
      let fileStorageDirPath = path.join(agentDirPath, "dataToSend");
      let fileStorageDirExists = await checkIfDirectoryExistsAsync(
        fileStorageDirPath
      );
      expect(fileStorageDirExists).toEqual(true);

      //Checking if agents events storage dir was created
      let eventsStorageDirPath = path.join(agentDirPath, "eventsToSend");
      let eventsStorageDirExists = await checkIfDirectoryExistsAsync(
        eventsStorageDirPath
      );
      expect(eventsStorageDirExists).toEqual(true);
    });

    it("should not throw and create other directories - if agents dir alread exists", async () => {
      let agentDirPath = path.join(AgentsDirPath, "deviceID");

      await createDirAsync(agentDirPath);

      await exec();

      //Checking if agents main dir exists
      let agentDirExists = await checkIfDirectoryExistsAsync(agentDirPath);
      expect(agentDirExists).toEqual(true);

      //Checking if agents file storage dir was created
      let fileStorageDirPath = path.join(agentDirPath, "dataToSend");
      let fileStorageDirExists = await checkIfDirectoryExistsAsync(
        fileStorageDirPath
      );
      expect(fileStorageDirExists).toEqual(true);

      //Checking if agents events storage dir was created
      let eventsStorageDirPath = path.join(agentDirPath, "eventsToSend");
      let eventsStorageDirExists = await checkIfDirectoryExistsAsync(
        eventsStorageDirPath
      );
      expect(eventsStorageDirExists).toEqual(true);
    });

    it("should not throw and - if agents dir alread exists and dataStorage and eventStorage dirs exist", async () => {
      let agentDirPath = path.join(AgentsDirPath, "deviceID");
      let fileStorageDirPath = path.join(agentDirPath, "dataToSend");
      let eventsStorageDirPath = path.join(agentDirPath, "eventsToSend");

      await createDirAsync(agentDirPath);
      await createDirAsync(fileStorageDirPath);
      await createDirAsync(eventsStorageDirPath);

      await exec();

      //Checking if agents main dir exists
      let agentDirExists = await checkIfDirectoryExistsAsync(agentDirPath);
      expect(agentDirExists).toEqual(true);

      //Checking if agents file storage dir was created
      let fileStorageDirExists = await checkIfDirectoryExistsAsync(
        fileStorageDirPath
      );
      expect(fileStorageDirExists).toEqual(true);

      //Checking if agents events storage dir was created
      let eventsStorageDirExists = await checkIfDirectoryExistsAsync(
        eventsStorageDirPath
      );
      expect(eventsStorageDirExists).toEqual(true);
    });

    it("should not throw and not delete files in event and data dirs - if agents dir alread exists and dataStorage and eventStorage dirs exist and there are file inside storage dirs", async () => {
      let agentDirPath = path.join(AgentsDirPath, "deviceID");
      let fileStorageDirPath = path.join(agentDirPath, "dataToSend");
      let eventsStorageDirPath = path.join(agentDirPath, "eventsToSend");

      //Creating directories
      await createDirAsync(agentDirPath);
      await createDirAsync(fileStorageDirPath);
      await createDirAsync(eventsStorageDirPath);

      //Creating data files
      let storageDataFile1Path = path.join(
        fileStorageDirPath,
        "fileData1ID.data"
      );
      let storageDataFile2Path = path.join(
        fileStorageDirPath,
        "fileData2ID.data"
      );
      let storageDataFile3Path = path.join(
        fileStorageDirPath,
        "fileData3ID.data"
      );

      await writeFileAsync(
        storageDataFile1Path,
        JSON.stringify("testFileContentData1")
      );
      await writeFileAsync(
        storageDataFile2Path,
        JSON.stringify("testFileContentData2")
      );
      await writeFileAsync(
        storageDataFile3Path,
        JSON.stringify("testFileContentData3")
      );

      //Creating event files
      let storageEventFile1Path = path.join(
        fileStorageDirPath,
        "fileEvent1ID.data"
      );
      let storageEventFile2Path = path.join(
        fileStorageDirPath,
        "fileEvent2ID.data"
      );
      let storageEventFile3Path = path.join(
        fileStorageDirPath,
        "fileEvent3ID.data"
      );

      await writeFileAsync(
        storageEventFile1Path,
        JSON.stringify("testFileContentEvent1")
      );
      await writeFileAsync(
        storageEventFile2Path,
        JSON.stringify("testFileContentEvent2")
      );
      await writeFileAsync(
        storageEventFile3Path,
        JSON.stringify("testFileContentEvent3")
      );

      await exec();

      //Checking if agents main dir exists
      let agentDirExists = await checkIfDirectoryExistsAsync(agentDirPath);
      expect(agentDirExists).toEqual(true);

      //Checking if agents file storage dir was created
      let fileStorageDirExists = await checkIfDirectoryExistsAsync(
        fileStorageDirPath
      );
      expect(fileStorageDirExists).toEqual(true);

      //Checking if agents events storage dir was created
      let eventsStorageDirExists = await checkIfDirectoryExistsAsync(
        eventsStorageDirPath
      );
      expect(eventsStorageDirExists).toEqual(true);

      //Checking if data file exists
      let fileData1Exists = await checkIfFileExistsAsync(storageDataFile1Path);
      let fileData2Exists = await checkIfFileExistsAsync(storageDataFile2Path);
      let fileData3Exists = await checkIfFileExistsAsync(storageDataFile3Path);

      expect(fileData1Exists).toEqual(true);
      expect(fileData2Exists).toEqual(true);
      expect(fileData3Exists).toEqual(true);

      //Checking if event file exists
      let fileEvent1Exists = await checkIfFileExistsAsync(
        storageEventFile1Path
      );
      let fileEvent2Exists = await checkIfFileExistsAsync(
        storageEventFile2Path
      );
      let fileEvent3Exists = await checkIfFileExistsAsync(
        storageEventFile3Path
      );

      expect(fileEvent1Exists).toEqual(true);
      expect(fileEvent2Exists).toEqual(true);
      expect(fileEvent3Exists).toEqual(true);
    });

    it("should call activate if isActive is set to true in payload", async () => {
      await exec();

      expect(activateMockFunc).toHaveBeenCalledTimes(1);
      expect(deactivateMockFunc).not.toHaveBeenCalled();
    });

    it("should call deactivate if isActive is set to false in payload", async () => {
      payload.isActive = false;
      await exec();

      expect(deactivateMockFunc).toHaveBeenCalledTimes(1);
      expect(activateMockFunc).not.toHaveBeenCalled();
    });

    it("should throw if variable's type is not recognized", async () => {
      payload.variables["associatedVariableID"].type = "FakeVariable";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`Unrecognized Variable type: FakeVariable`);
    });

    it("should throw if calcElement's type is not recognized", async () => {
      payload.calcElements["averageCalculatorID"].type = "FakeCalcElement";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(
        `Unrecognized CalcElement type: FakeCalcElement`
      );
    });

    it("should throw if alert's type is not recognized", async () => {
      payload.alerts["bandwidthLimitAlertID"].type = "FakeAlert";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`Unrecognized Alert type: FakeAlert`);
    });

    it("should assing number of sending retries", async () => {
      await exec();

      expect(device.NumberOfSendDataRetries).toEqual(
        payload.numberOfSendDataRetries
      );
      expect(device.NumberOfSendEventRetries).toEqual(
        payload.numberOfSendEventRetries
      );
    });

    it("should assing boarding key to _boardingKey", async () => {
      await exec();

      expect(device._boardingKey).toEqual(payload.boardingKey);
    });

    it("set _tryBoardOnSendData and _tryBoardOnSendEvent to true", async () => {
      await exec();

      expect(device._tryBoardOnSendData).toEqual(true);
      expect(device._tryBoardOnSendEvent).toEqual(true);
    });

    it("should initialize converters based on payload - if some variables have converter and some not", async () => {
      await exec();

      expect(device._valueConverters).toBeDefined();

      //for each value in value converters in payload, a value converter should be created and assigned

      let allExpectedValueConvertersCount = 0;

      //Counting all converters and checking its properties
      for (let configPayload of Object.values(payload.dataToSendConfig)) {
        if (exists(configPayload.dataConverter)) {
          let elementId = configPayload.elementId;
          allExpectedValueConvertersCount++;

          let converter = device._valueConverters[elementId];
          expect(converter).toBeDefined();
          expect(converter.ConversionType).toEqual(
            configPayload.dataConverter.conversionType
          );
          expect(converter.Precision).toEqual(
            configPayload.dataConverter.precision
          );
        }
      }

      //There should be the same number of converters
      expect(Object.values(device._valueConverters).length).toEqual(
        allExpectedValueConvertersCount
      );
    });

    it("should initialize converters based on payload - if there are no conveters ", async () => {
      payload.dataToSendConfig.testElement1ID.dataConverter = null;
      payload.dataToSendConfig.testElement2ID.dataConverter = null;
      payload.dataToSendConfig.testElement3ID.dataConverter = null;

      await exec();

      expect(device._valueConverters).toBeDefined();
      expect(device._valueConverters).toEqual({});
    });
  });

  describe("generatePayload", () => {
    let project;
    let payload;
    let device;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      activateMockFunc = jest.fn();
      deactivatMeockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      device = new MSAgentDevice(project);

      activateMockFunc = jest.fn(device.activate);
      deactivateMockFunc = jest.fn(device.deactivate);

      device.activate = activateMockFunc;
      device.deactivate = deactivateMockFunc;

      await device.init(payload);

      return device.generatePayload();
    };

    it("should return a valid payload - without boarding key", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            deviceId: "deviceID",
            lastValueTick: 0,
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
            value: 987.321,
            defaultValue: 987.321,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 123456.654321,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            deviceId: "deviceID",
            lastValueTick: 0,
            value: 15,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            deviceId: "deviceID",
            lastValueTick: 0,
            value: null,
          },
        },
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boarded: false,
      };

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("validatePayload", () => {
    let project;
    let payload;

    beforeEach(() => {
      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
          },
          expessionCalculatorID: {
            id: "expessionCalculatorID",
            name: "expessionCalculatorName",
            type: "ExpressionCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            expression: "p1+p2+p3",
            parameters: {
              p1: { type: "static", value: 100 },
              p2: { type: "dynamic", elementId: "associatedVariableID" },
              p3: { type: "dynamic", elementId: "cpuLoadVariableID" },
            },
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
            source: "source1244",
            correlationId: "corelation124",
            code: "1244",
            acknowledged: false,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "http://fakeURl",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };
    });

    let exec = () => {
      return MSAgentDevice.validatePayload(payload);
    };

    it("should return null - if payload is valid", () => {
      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if id is not defined", () => {
      delete payload.id;

      let result = exec();

      expect(result).toEqual(`"id" is required`);
    });

    it("should return message if id is null", () => {
      payload.id = null;

      let result = exec();

      expect(result).toEqual(`"id" must be a string`);
    });

    it("should return message if id is empty string", () => {
      payload.id = "";

      let result = exec();

      expect(result).toEqual(`"id" is not allowed to be empty`);
    });

    it("should return message if name is not defined", () => {
      delete payload.name;

      let result = exec();

      expect(result).toEqual(`"name" is required`);
    });

    it("should return message if name is null", () => {
      payload.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if name is empty string", () => {
      payload.name = "";

      let result = exec();

      expect(result).toEqual(`"name" is not allowed to be empty`);
    });

    it("should return message if type is not defined", () => {
      delete payload.type;

      let result = exec();

      expect(result).toEqual(`"type" is required`);
    });

    it("should return message if type is null", () => {
      payload.type = null;

      let result = exec();

      expect(result).toEqual(`"type" must be [MSAgentDevice]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [MSAgentDevice]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [MSAgentDevice]`);
    });

    it("should return message if isActive is not defined", () => {
      delete payload.isActive;

      let result = exec();

      expect(result).toEqual(`"isActive" is required`);
    });

    it("should return message if isActive is null", () => {
      payload.isActive = null;

      let result = exec();

      expect(result).toEqual(`"isActive" must be a boolean`);
    });

    it("should return message if isActive is not a boolean", () => {
      payload.isActive = 123.321;

      let result = exec();

      expect(result).toEqual(`"isActive" must be a boolean`);
    });

    it("should return message if sendDataFileInterval is not defined", () => {
      delete payload.sendDataFileInterval;

      let result = exec();

      expect(result).toEqual(`"sendDataFileInterval" is required`);
    });

    it("should return message if sendDataFileInterval is null", () => {
      payload.sendDataFileInterval = null;

      let result = exec();

      expect(result).toEqual(`"sendDataFileInterval" must be a number`);
    });

    it("should return message if sendDataFileInterval is not a number", () => {
      payload.sendDataFileInterval = true;

      let result = exec();

      expect(result).toEqual(`"sendDataFileInterval" must be a number`);
    });

    it("should return message if sendDataFileInterval is not an integer", () => {
      payload.sendDataFileInterval = 123.321;

      let result = exec();

      expect(result).toEqual(`"sendDataFileInterval" must be an integer`);
    });

    it("should return message if sendDataFileInterval is equal to 0", () => {
      payload.sendDataFileInterval = 0;

      let result = exec();

      expect(result).toEqual(
        `"sendDataFileInterval" must be greater than or equal to 1`
      );
    });

    it("should return message if sendEventFileInterval is not defined", () => {
      delete payload.sendEventFileInterval;

      let result = exec();

      expect(result).toEqual(`"sendEventFileInterval" is required`);
    });

    it("should return message if sendEventFileInterval is null", () => {
      payload.sendEventFileInterval = null;

      let result = exec();

      expect(result).toEqual(`"sendEventFileInterval" must be a number`);
    });

    it("should return message if sendEventFileInterval is not a number", () => {
      payload.sendEventFileInterval = true;

      let result = exec();

      expect(result).toEqual(`"sendEventFileInterval" must be a number`);
    });

    it("should return message if sendEventFileInterval is not an integer", () => {
      payload.sendEventFileInterval = 123.321;

      let result = exec();

      expect(result).toEqual(`"sendEventFileInterval" must be an integer`);
    });

    it("should return message if sendEventFileInterval is equal to 0", () => {
      payload.sendEventFileInterval = 0;

      let result = exec();

      expect(result).toEqual(
        `"sendEventFileInterval" must be greater than or equal to 1`
      );
    });

    it("should return message if dataStorageSize is not defined", () => {
      delete payload.dataStorageSize;

      let result = exec();

      expect(result).toEqual(`"dataStorageSize" is required`);
    });

    it("should return message if dataStorageSize is null", () => {
      payload.dataStorageSize = null;

      let result = exec();

      expect(result).toEqual(`"dataStorageSize" must be a number`);
    });

    it("should return message if dataStorageSize is not a number", () => {
      payload.dataStorageSize = true;

      let result = exec();

      expect(result).toEqual(`"dataStorageSize" must be a number`);
    });

    it("should return message if dataStorageSize is not an integer", () => {
      payload.dataStorageSize = 123.321;

      let result = exec();

      expect(result).toEqual(`"dataStorageSize" must be an integer`);
    });

    it("should return message if dataStorageSize is samller then 0", () => {
      payload.dataStorageSize = -1;

      let result = exec();

      expect(result).toEqual(
        `"dataStorageSize" must be greater than or equal to 0`
      );
    });

    it("should return message if eventStorageSize is not defined", () => {
      delete payload.eventStorageSize;

      let result = exec();

      expect(result).toEqual(`"eventStorageSize" is required`);
    });

    it("should return message if eventStorageSize is null", () => {
      payload.eventStorageSize = null;

      let result = exec();

      expect(result).toEqual(`"eventStorageSize" must be a number`);
    });

    it("should return message if eventStorageSize is not a number", () => {
      payload.eventStorageSize = true;

      let result = exec();

      expect(result).toEqual(`"eventStorageSize" must be a number`);
    });

    it("should return message if eventStorageSize is not an integer", () => {
      payload.eventStorageSize = 123.321;

      let result = exec();

      expect(result).toEqual(`"eventStorageSize" must be an integer`);
    });

    it("should return message if eventStorageSize is samller then 0", () => {
      payload.eventStorageSize = -1;

      let result = exec();

      expect(result).toEqual(
        `"eventStorageSize" must be greater than or equal to 0`
      );
    });

    it("should return message if numberOfDataFilesToSend is not defined", () => {
      delete payload.numberOfDataFilesToSend;

      let result = exec();

      expect(result).toEqual(`"numberOfDataFilesToSend" is required`);
    });

    it("should return message if numberOfDataFilesToSend is null", () => {
      payload.numberOfDataFilesToSend = null;

      let result = exec();

      expect(result).toEqual(`"numberOfDataFilesToSend" must be a number`);
    });

    it("should return message if numberOfDataFilesToSend is not a number", () => {
      payload.numberOfDataFilesToSend = true;

      let result = exec();

      expect(result).toEqual(`"numberOfDataFilesToSend" must be a number`);
    });

    it("should return message if numberOfDataFilesToSend is not an integer", () => {
      payload.numberOfDataFilesToSend = 123.321;

      let result = exec();

      expect(result).toEqual(`"numberOfDataFilesToSend" must be an integer`);
    });

    it("should return message if numberOfDataFilesToSend is samller then 1", () => {
      payload.numberOfDataFilesToSend = 0;

      let result = exec();

      expect(result).toEqual(
        `"numberOfDataFilesToSend" must be greater than or equal to 1`
      );
    });

    it("should return message if numberOfEventFilesToSend is not defined", () => {
      delete payload.numberOfEventFilesToSend;

      let result = exec();

      expect(result).toEqual(`"numberOfEventFilesToSend" is required`);
    });

    it("should return message if numberOfEventFilesToSend is null", () => {
      payload.numberOfEventFilesToSend = null;

      let result = exec();

      expect(result).toEqual(`"numberOfEventFilesToSend" must be a number`);
    });

    it("should return message if numberOfEventFilesToSend is not a number", () => {
      payload.numberOfEventFilesToSend = true;

      let result = exec();

      expect(result).toEqual(`"numberOfEventFilesToSend" must be a number`);
    });

    it("should return message if numberOfEventFilesToSend is not an integer", () => {
      payload.numberOfEventFilesToSend = 123.321;

      let result = exec();

      expect(result).toEqual(`"numberOfEventFilesToSend" must be an integer`);
    });

    it("should return message if numberOfEventFilesToSend is samller then 1", () => {
      payload.numberOfEventFilesToSend = 0;

      let result = exec();

      expect(result).toEqual(
        `"numberOfEventFilesToSend" must be greater than or equal to 1`
      );
    });

    it("should return message if numberOfSendDataRetries is not defined", () => {
      delete payload.numberOfSendDataRetries;

      let result = exec();

      expect(result).toEqual(`"numberOfSendDataRetries" is required`);
    });

    it("should return message if numberOfSendDataRetries is null", () => {
      payload.numberOfSendDataRetries = null;

      let result = exec();

      expect(result).toEqual(`"numberOfSendDataRetries" must be a number`);
    });

    it("should return message if numberOfSendDataRetries is not a number", () => {
      payload.numberOfSendDataRetries = true;

      let result = exec();

      expect(result).toEqual(`"numberOfSendDataRetries" must be a number`);
    });

    it("should return message if numberOfSendDataRetries is not an integer", () => {
      payload.numberOfSendDataRetries = 123.321;

      let result = exec();

      expect(result).toEqual(`"numberOfSendDataRetries" must be an integer`);
    });

    it("should return message if numberOfSendDataRetries is samller then 1", () => {
      payload.numberOfSendDataRetries = 0;

      let result = exec();

      expect(result).toEqual(
        `"numberOfSendDataRetries" must be greater than or equal to 1`
      );
    });

    it("should return message if numberOfSendEventRetries is not defined", () => {
      delete payload.numberOfSendEventRetries;

      let result = exec();

      expect(result).toEqual(`"numberOfSendEventRetries" is required`);
    });

    it("should return message if numberOfSendEventRetries is null", () => {
      payload.numberOfSendEventRetries = null;

      let result = exec();

      expect(result).toEqual(`"numberOfSendEventRetries" must be a number`);
    });

    it("should return message if numberOfSendEventRetries is not a number", () => {
      payload.numberOfSendEventRetries = true;

      let result = exec();

      expect(result).toEqual(`"numberOfSendEventRetries" must be a number`);
    });

    it("should return message if numberOfSendEventRetries is not an integer", () => {
      payload.numberOfSendEventRetries = 123.321;

      let result = exec();

      expect(result).toEqual(`"numberOfSendEventRetries" must be an integer`);
    });

    it("should return message if numberOfSendEventRetries is samller then 1", () => {
      payload.numberOfSendEventRetries = 0;

      let result = exec();

      expect(result).toEqual(
        `"numberOfSendEventRetries" must be greater than or equal to 1`
      );
    });

    it("should return message if boardingKey is not defined", () => {
      delete payload.boardingKey;

      let result = exec();

      expect(result).toEqual(`"boardingKey" is required`);
    });

    it("should return message if boardingKey is null", () => {
      payload.boardingKey = null;

      let result = exec();

      expect(result).toEqual(`"boardingKey" must be of type object`);
    });

    it("should return message if boardingKey is empty object", () => {
      payload.boardingKey = {};

      let result = exec();

      expect(result).toEqual(`"boardingKey.content" is required`);
    });

    it("should return message if boardingKey has no content", () => {
      delete payload.boardingKey.content;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content" is required`);
    });

    it("should return message if boardingKey content has not baseURL", () => {
      delete payload.boardingKey.content.baseUrl;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.baseUrl" is required`);
    });

    it("should return message if boardingKey content baseURL null", () => {
      payload.boardingKey.content.baseUrl = null;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.baseUrl" must be a string`);
    });

    it("should return message if boardingKey content baseURL is not a string", () => {
      payload.boardingKey.content.baseUrl = 1234;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.baseUrl" must be a string`);
    });

    it("should return message if boardingKey content baseURL is not a valid URL", () => {
      payload.boardingKey.content.baseUrl = "fakeString";

      let result = exec();

      expect(result).toEqual(
        `"boardingKey.content.baseUrl" must be a valid uri`
      );
    });

    it("should return message if boardingKey content has not iat", () => {
      delete payload.boardingKey.content.iat;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.iat" is required`);
    });

    it("should return message if boardingKey content iat null", () => {
      payload.boardingKey.content.iat = null;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.iat" must be a string`);
    });

    it("should return message if boardingKey content iat is not a string", () => {
      payload.boardingKey.content.iat = 1234;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.iat" must be a string`);
    });

    it("should return message if boardingKey content has not clientCredentialProfile", () => {
      delete payload.boardingKey.content.clientCredentialProfile;

      let result = exec();

      expect(result).toEqual(
        `"boardingKey.content.clientCredentialProfile" is required`
      );
    });

    it("should return message if boardingKey content clientCredentialProfile null", () => {
      payload.boardingKey.content.clientCredentialProfile = null;

      let result = exec();

      expect(result).toEqual(
        `"boardingKey.content.clientCredentialProfile" must be an array`
      );
    });

    it("should return message if boardingKey content clientCredentialProfile is not an array", () => {
      payload.boardingKey.content.clientCredentialProfile = 1234;

      let result = exec();

      expect(result).toEqual(
        `"boardingKey.content.clientCredentialProfile" must be an array`
      );
    });

    it("should return message if boardingKey content has not clientId", () => {
      delete payload.boardingKey.content.clientId;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.clientId" is required`);
    });

    it("should return message if boardingKey content clientId null", () => {
      payload.boardingKey.content.clientId = null;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.clientId" must be a string`);
    });

    it("should return message if boardingKey content clientId is not a string", () => {
      payload.boardingKey.content.clientId = 1234;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.clientId" must be a string`);
    });

    it("should return message if boardingKey content has not tenant", () => {
      delete payload.boardingKey.content.tenant;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.tenant" is required`);
    });

    it("should return message if boardingKey content tenant null", () => {
      payload.boardingKey.content.tenant = null;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.tenant" must be a string`);
    });

    it("should return message if boardingKey content tenant is not a string", () => {
      payload.boardingKey.content.tenant = 1234;

      let result = exec();

      expect(result).toEqual(`"boardingKey.content.tenant" must be a string`);
    });

    it("should return message if dataToSendConfig is not defined", () => {
      delete payload.dataToSendConfig;

      let result = exec();

      expect(result).toEqual(`"dataToSendConfig" is required`);
    });

    it("should return message if dataToSendConfig is null", () => {
      payload.dataToSendConfig = null;

      let result = exec();

      expect(result).toEqual(`"dataToSendConfig" cannot be null`);
    });

    it("should return null if dataToSendConfig is empty object", () => {
      payload.dataToSendConfig = {};

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if dataToSendConfig elementID and key id differs", () => {
      payload.dataToSendConfig = {
        testElement1ID: {
          elementId: "testElement4ID",
          deviceId: "testDevice1ID",
          sendingInterval: 100,
          qualityCodeEnabled: true,
          datapointId: "aaaa0000",
          dataConverter: {
            conversionType: "fixed",
            precision: 3,
          },
        },
        testElement2ID: {
          elementId: "testElement2ID",
          deviceId: "testDevice2ID",
          sendingInterval: 200,
          qualityCodeEnabled: true,
          datapointId: "bbbb1111",
          dataConverter: {
            conversionType: "precision",
            precision: 3,
          },
        },
        testElement3ID: {
          elementId: "testElement3ID",
          deviceId: "testDevice3ID",
          sendingInterval: 300,
          qualityCodeEnabled: true,
          datapointId: "cccc2222",
          dataConverter: null,
        },
      };

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig elementId as key and in payload differs!`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid elementId - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.elementId;

      let result = exec();

      expect(result).toEqual(`dataToSendConfig error: "elementId" is required`);
    });

    it("should return message if one of dataToSendConfigs has invalid elementId - null", () => {
      payload.dataToSendConfig.testElement2ID.elementId = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "elementId" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid elementId - not a string", () => {
      payload.dataToSendConfig.testElement2ID.elementId = 1234;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "elementId" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid deviceId - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.deviceId;

      let result = exec();

      expect(result).toEqual(`dataToSendConfig error: "deviceId" is required`);
    });

    it("should return message if one of dataToSendConfigs has invalid deviceId - null", () => {
      payload.dataToSendConfig.testElement2ID.deviceId = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "deviceId" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid deviceId - not a string", () => {
      payload.dataToSendConfig.testElement2ID.deviceId = 1234;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "deviceId" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid sendingInterval - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.sendingInterval;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "sendingInterval" is required`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid sendingInterval - null", () => {
      payload.dataToSendConfig.testElement2ID.sendingInterval = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "sendingInterval" must be a number`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid sendingInterval - not a number", () => {
      payload.dataToSendConfig.testElement2ID.sendingInterval = "abcd";

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "sendingInterval" must be a number`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid sendingInterval - not an integer", () => {
      payload.dataToSendConfig.testElement2ID.sendingInterval = 123.432;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "sendingInterval" must be an integer`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid sendingInterval - 0", () => {
      payload.dataToSendConfig.testElement2ID.sendingInterval = 0;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "sendingInterval" must be greater than or equal to 1`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid qualityCodeEnabled - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.qualityCodeEnabled;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "qualityCodeEnabled" is required`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid qualityCodeEnabled - null", () => {
      payload.dataToSendConfig.testElement2ID.qualityCodeEnabled = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "qualityCodeEnabled" must be a boolean`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid qualityCodeEnabled - not a boolean", () => {
      payload.dataToSendConfig.testElement2ID.qualityCodeEnabled = "abcd";

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "qualityCodeEnabled" must be a boolean`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid datapointId - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.datapointId;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "datapointId" is required`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid datapointId - null", () => {
      payload.dataToSendConfig.testElement2ID.datapointId = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "datapointId" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid datapointId - not a string", () => {
      payload.dataToSendConfig.testElement2ID.datapointId = 1234;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "datapointId" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.dataConverter;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter" is required`
      );
    });

    it("should return null if one of dataToSendConfigs has dataConverter = null", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter = null;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - not an object", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter = 1234;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter" must be of type object`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - no conversion type", () => {
      delete payload.dataToSendConfig.testElement2ID.dataConverter
        .conversionType;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.conversionType" is required`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - conversion type is null", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.conversionType = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.conversionType" must be one of [precision, fixed, none]`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - invalid conversion type string", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.conversionType =
        "fakeConversionType";

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.conversionType" must be one of [precision, fixed, none]`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - no precision", () => {
      delete payload.dataToSendConfig.testElement2ID.dataConverter.precision;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.precision" is required`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - precision is null", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.precision = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.precision" must be a number`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - invalid precision string", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.precision =
        "fakeConversionType";

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.precision" must be a number`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - not an integer", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.precision = 1234.4321;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.precision" must be an integer`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid dataConverter - smaller then 0", () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.precision = -1;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "dataConverter.precision" must be greater than or equal to 0`
      );
    });

    it("should return message if eventsToSendConfig is not defined", () => {
      delete payload.eventsToSendConfig;

      let result = exec();

      expect(result).toEqual(`"eventsToSendConfig" is required`);
    });

    it("should return message if eventsToSendConfig is null", () => {
      payload.eventsToSendConfig = null;

      let result = exec();

      expect(result).toEqual(`"eventsToSendConfig" cannot be null`);
    });

    it("should return null if eventsToSendConfig is empty object", () => {
      payload.eventsToSendConfig = {};

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if eventsToSendConfig elementID and key id differs", () => {
      payload.eventsToSendConfig = {
        testElement1ID: {
          elementId: "testElement2ID",
          deviceId: "testDevice1ID",
          sendingInterval: 100,
          entityId: "aaaa0000",
          severity: 20,
          source: "source1234",
          correlationId: "corelation123",
          code: "1234",
          acknowledged: false,
        },
        testElement2ID: {
          elementId: "testElement2ID",
          deviceId: "testDevice2ID",
          sendingInterval: 200,
          entityId: "bbbb1111",
          severity: 30,
          source: "source1244",
          correlationId: "corelation124",
          code: "1244",
          acknowledged: false,
        },
        testElement3ID: {
          elementId: "testElement3ID",
          deviceId: "testDevice3ID",
          sendingInterval: 300,
          entityId: "cccc2222",
          severity: 40,
          source: "source1255",
          correlationId: "corelation125",
          code: "1254",
          acknowledged: false,
        },
      };

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig elementId as key and in payload differs!`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid elementId - undefined", () => {
      delete payload.eventsToSendConfig.testElement2ID.elementId;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "elementId" is required`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid elementId - null", () => {
      payload.eventsToSendConfig.testElement2ID.elementId = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "elementId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid elementId - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.elementId = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "elementId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid deviceId - undefined", () => {
      delete payload.eventsToSendConfig.testElement2ID.deviceId;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "deviceId" is required`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid deviceId - null", () => {
      payload.eventsToSendConfig.testElement2ID.deviceId = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "deviceId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid deviceId - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.deviceId = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "deviceId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid sendingInterval - undefined", () => {
      delete payload.eventsToSendConfig.testElement2ID.sendingInterval;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "sendingInterval" is required`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid sendingInterval - null", () => {
      payload.eventsToSendConfig.testElement2ID.sendingInterval = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "sendingInterval" must be a number`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid sendingInterval - not a number", () => {
      payload.eventsToSendConfig.testElement2ID.sendingInterval = "abcd";

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "sendingInterval" must be a number`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid sendingInterval - not an integer", () => {
      payload.eventsToSendConfig.testElement2ID.sendingInterval = 123.432;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "sendingInterval" must be an integer`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid sendingInterval - 0", () => {
      payload.eventsToSendConfig.testElement2ID.sendingInterval = 0;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "sendingInterval" must be greater than or equal to 1`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid entityId - undefined", () => {
      delete payload.eventsToSendConfig.testElement2ID.entityId;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "entityId" is required`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid entityId - null", () => {
      payload.eventsToSendConfig.testElement2ID.entityId = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "entityId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid entityId - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.entityId = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "entityId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid severity - undefined", () => {
      delete payload.eventsToSendConfig.testElement2ID.severity;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "severity" is required`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid severity - null", () => {
      payload.eventsToSendConfig.testElement2ID.severity = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "severity" must be a number`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid severity - not a number", () => {
      payload.eventsToSendConfig.testElement2ID.severity = "abcd";

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "severity" must be a number`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid severity - not an integer", () => {
      payload.eventsToSendConfig.testElement2ID.severity = 123.432;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "severity" must be an integer`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid severity - smaller than 1", () => {
      payload.eventsToSendConfig.testElement2ID.severity = 0;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "severity" must be greater than or equal to 1`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid severity - greater than 99", () => {
      payload.eventsToSendConfig.testElement2ID.severity = 100;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "severity" must be less than or equal to 99`
      );
    });

    it("should return null if one of eventsToSendConfigs has no source", () => {
      delete payload.eventsToSendConfig.testElement2ID.source;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if one of eventsToSendConfigs has invalid source - null", () => {
      payload.eventsToSendConfig.testElement2ID.source = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "source" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid source - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.source = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "source" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid source - shorter than 1", () => {
      payload.eventsToSendConfig.testElement2ID.source = "";

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "source" is not allowed to be empty`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid source - longer than 255", () => {
      payload.eventsToSendConfig.testElement2ID.source = generateRandomString(
        256
      );

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "source" length must be less than or equal to 255 characters long`
      );
    });

    it("should return null if one of eventsToSendConfigs has no correlationId", () => {
      delete payload.eventsToSendConfig.testElement2ID.correlationId;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if one of eventsToSendConfigs has invalid correlationId - null", () => {
      payload.eventsToSendConfig.testElement2ID.correlationId = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "correlationId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid correlationId - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.correlationId = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "correlationId" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid correlationId - shorter than 1", () => {
      payload.eventsToSendConfig.testElement2ID.correlationId = "";

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "correlationId" is not allowed to be empty`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid correlationId - longer than 36", () => {
      payload.eventsToSendConfig.testElement2ID.correlationId = generateRandomString(
        37
      );

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "correlationId" length must be less than or equal to 36 characters long`
      );
    });

    it("should return null if one of eventsToSendConfigs has no code", () => {
      delete payload.eventsToSendConfig.testElement2ID.code;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if one of eventsToSendConfigs has invalid code - null", () => {
      payload.eventsToSendConfig.testElement2ID.code = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "code" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid code - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.code = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "code" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid code - shorter than 1", () => {
      payload.eventsToSendConfig.testElement2ID.code = "";

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "code" is not allowed to be empty`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid code - longer than 16", () => {
      payload.eventsToSendConfig.testElement2ID.code = generateRandomString(17);

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "code" length must be less than or equal to 16 characters long`
      );
    });

    it("should return null if one of eventsToSendConfigs has no acknowledged", () => {
      delete payload.eventsToSendConfig.testElement2ID.acknowledged;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if one of eventsToSendConfigs has invalid acknowledged - null", () => {
      payload.eventsToSendConfig.testElement2ID.acknowledged = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "acknowledged" must be a boolean`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid acknowledged - not a boolean", () => {
      payload.eventsToSendConfig.testElement2ID.acknowledged = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "acknowledged" must be a boolean`
      );
    });

    it("should return message if one of variables payload is invalid - id different than id inside payload", () => {
      //invalid default value
      payload.variables.associatedVariableID.id =
        "modifiedAssociatedVariableID";

      let result = exec();

      expect(result).toEqual(`variable's id as key and in payload differs!`);
    });

    it("should return message if variables is not defined", () => {
      delete payload.variables;

      let result = exec();

      expect(result).toEqual(`"variables" is required`);
    });

    it("should return message if variables is null", () => {
      payload.variables = null;

      let result = exec();

      expect(result).toEqual(`"variables" cannot be null`);
    });

    it("should return message if one of variables payload is invalid - AssociatedVariable", () => {
      payload.variables.associatedVariableID.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if variables type is not recognized", () => {
      payload.variables.associatedVariableID.type = "FakeType";

      let result = exec();

      expect(result).toEqual(`variable type not recognized`);
    });

    it("should return message if one of calcElement payload is invalid - id different than id inside payload", () => {
      payload.calcElements.averageCalculatorID.id = "fakeID";

      let result = exec();

      expect(result).toEqual(`calcElement's id as key and in payload differs!`);
    });

    it("should return message if one of calcElement payload is invalid - AverageCalculator", () => {
      //Invalid variableID type
      payload.calcElements.averageCalculatorID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of calcElement payload is invalid - FactorCalculator", () => {
      //Invalid variableID type
      payload.calcElements.factorCalculatorID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of calcElement payload is invalid - IncreaseCalculator", () => {
      //Invalid variableID type
      payload.calcElements.increaseCalculatorID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of calcElement payload is invalid - SumCalculator", () => {
      //Invalid variableID type
      payload.calcElements.sumCalculatorID.variableIDs = 12345;

      let result = exec();

      expect(result).toEqual(`"variableIDs" must be an array`);
    });

    it("should return message if one of calcElement payload is invalid - ExpressionCalculator", () => {
      //Invalid expression
      payload.calcElements.expessionCalculatorID.expression = null;

      let result = exec();

      expect(result).toEqual(`"expression" must be a string`);
    });

    it("should return message if one of calcElement types is not recognized", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "FakeType",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`variable type not recognized`);
    });

    it("should return message if calcElement type is not recognized", () => {
      //invalid default value
      payload.calcElements.averageCalculatorID.type = "FakeType";

      let result = exec();

      expect(result).toEqual(`calcElement type not recognized`);
    });

    it("should return message if calcElements is not defined", () => {
      delete payload.calcElements;

      let result = exec();

      expect(result).toEqual(`"calcElements" is required`);
    });

    it("should return message if calcElements is null", () => {
      payload.calcElements = null;

      let result = exec();

      expect(result).toEqual(`"calcElements" cannot be null`);
    });

    it("should return message if one of alert payload is invalid - id different than id inside payload", () => {
      payload.alerts.highLimitAlertID.id = "fakeID";

      let result = exec();

      expect(result).toEqual(`alert's id as key and in payload differs!`);
    });

    it("should return message if alerts type is not recognized", () => {
      //invalid default value
      payload.alerts.highLimitAlertID.type = "FakeType";

      let result = exec();

      expect(result).toEqual(`alert type not recognized`);
    });

    it("should return message if alerts is not defined", () => {
      delete payload.alerts;

      let result = exec();

      expect(result).toEqual(`"alerts" is required`);
    });

    it("should return message if alerts is null", () => {
      payload.alerts = null;

      let result = exec();

      expect(result).toEqual(`"alerts" cannot be null`);
    });

    it("should return message if one of alert payload is invalid - BandwidthLimitAlert", () => {
      //Invalid variableID type
      payload.alerts.bandwidthLimitAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of alert payload is invalid - ExactValuesAlert", () => {
      //Invalid variableID type
      payload.alerts.exactValuesAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of alert payload is invalid - HighLimitAlert", () => {
      //Invalid variableID type
      payload.alerts.highLimitAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of alert payload is invalid - LowLimitAlert", () => {
      //Invalid variableID type
      payload.alerts.lowLimitAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });
  });

  describe("_convertTickIdToMCTimestamp", () => {
    let project;
    let agent;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)
      tickId = 1607100000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      return agent._convertTickIdToMCTimestamp(tickId);
    };

    it("should properly convert tickId to ISO string with date", async () => {
      let result = await exec();

      expect(result).toEqual("2020-12-04T16:40:00.000Z");
    });
  });

  describe("_convertAgentDataSendPayloadToMCAgentPayload", () => {
    let project;
    let agent;
    let initPayload;
    let payloadToSend;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {},
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)
      //1607100001000 - Fri Dec 04 2020 17:40:01 GMT+0100 (Central European Standard Time)
      //1607100002000 - Fri Dec 04 2020 17:40:02 GMT+0100 (Central European Standard Time)
      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: 2001.2001,
          testElement3ID: 3001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: 2002.2002,
          testElement3ID: 3002.3002,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: 2003.2003,
          testElement3ID: 3003.3003,
        },
      };
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      return agent._convertAgentDataSendPayloadToMCAgentPayload(payloadToSend);
    };

    it("should properly convert standard payload to send to MindConnect payload to send", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should leave values in payload of variables not existing in dataConfig", async () => {
      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: 2001.2001,
          testElement3ID: 3001.3001,
          testElement4ID: 4001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: 2002.2002,
          testElement3ID: 3002.3002,
          testElement4ID: 4001.3001,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: 2003.2003,
          testElement3ID: 3003.3003,
          testElement4ID: 4001.3001,
        },
      };

      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if payload to send is an empty object", async () => {
      payloadToSend = {};

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if payload to send is undefined", async () => {
      payloadToSend = undefined;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if payload to send is null", async () => {
      payloadToSend = null;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if there is no variables to send", async () => {
      payloadToSend = {
        1607100000: {
          testElement4ID: 4001.4001,
          testElement5ID: 5001.5001,
          testElement6ID: 6001.6001,
        },
        1607100001: {
          testElement4ID: 4002.4002,
          testElement5ID: 5002.5002,
          testElement6ID: 6002.6002,
        },
        1607100002: {
          testElement4ID: 4003.4003,
          testElement5ID: 5003.5003,
          testElement6ID: 6003.6003,
        },
      };

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should set exact value without converting - for variables without converter", async () => {
      initPayload.dataToSendConfig.testElement2ID.dataConverter = null;

      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2001.2001" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2002.2002" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2003.2003" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should set exact value without converting - for variables with conversion type - none", async () => {
      initPayload.dataToSendConfig.testElement2ID.dataConverter.conversionType =
        "none";

      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2001.2001" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2002.2002" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2003.2003" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should convert value with precision - for variables with conversion type - precision", async () => {
      initPayload.dataToSendConfig.testElement2ID.dataConverter.type =
        "precision";
      initPayload.dataToSendConfig.testElement2ID.dataConverter.precision = 3;

      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should convert value with fixed - for variables with conversion type - fixed", async () => {
      initPayload.dataToSendConfig.testElement2ID.dataConverter.conversionType =
        "fixed";
      initPayload.dataToSendConfig.testElement2ID.dataConverter.precision = 3;

      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2001.200" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2002.200" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2003.200" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should not convert value - if value is a boolean, dataConverter is null", async () => {
      initPayload.dataToSendConfig.testElement2ID.dataConverter = null;

      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: true,
          testElement3ID: 3001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: false,
          testElement3ID: 3002.3002,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: true,
          testElement3ID: 3003.3003,
        },
      };
      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "true" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "false" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "true" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should not convert value - if value is a boolean, dataConverter is present", async () => {
      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: true,
          testElement3ID: 3001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: false,
          testElement3ID: 3002.3002,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: true,
          testElement3ID: 3003.3003,
        },
      };
      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "true" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "false" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "true" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should not include value in payload - if value is null", async () => {
      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: null,
          testElement3ID: 3001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: null,
          testElement3ID: 3002.3002,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: null,
          testElement3ID: 3003.3003,
        },
      };
      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should not include value in payload - if value is undefined", async () => {
      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: undefined,
          testElement3ID: 3001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: undefined,
          testElement3ID: 3002.3002,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: undefined,
          testElement3ID: 3003.3003,
        },
      };
      let result = await exec();

      expect(result).toEqual([
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ]);
    });

    it("should not qualityCode - if value has qualityCodeEnabled set to false", async () => {
      initPayload.dataToSendConfig.testElement2ID.qualityCodeEnabled = false;

      let result = await exec();

      let expectedResult = [
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("_convertAgentEventSendPayloadToMCAgentPayload", () => {
    let project;
    let agent;
    let initPayload;
    let tickId;
    let elementId;
    let value;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
            source: "source1244",
            correlationId: "corelation124",
            code: "1244",
            acknowledged: false,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)

      tickId = 1607100000;
      elementId = "testElement2ID";
      value = { pl: "fakeTestTextPL", en: "fakeTestTextEN" };
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      return agent._convertAgentEventSendPayloadToMCAgentPayload(
        tickId,
        elementId,
        value
      );
    };

    it("should properly convert standard payload to send to MindConnect payload to send", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(result).toEqual(expectedResult);
    });

    it("should return null - if value is undefined", async () => {
      value = undefined;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if value is null", async () => {
      value = null;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null and call logger warn - if value is longer than 255 signs", async () => {
      value = generateRandomString(256);

      let result = await exec();

      expect(result).toEqual(null);
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toContain(
        "Cannot send description of event longer than 255 signs"
      );
    });

    it("should return null - if tickId is undefined", async () => {
      tickId = undefined;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if tickId is null", async () => {
      tickId = null;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if elementId is undefined", async () => {
      elementId = undefined;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if elementId is null", async () => {
      elementId = null;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null - if elementId is not present in eventConfig", async () => {
      elementId = "elementID4";

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should set value as string - if value is already a string", async () => {
      value = "testString";
      let result = await exec();

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: "testString",
      };

      expect(result).toEqual(expectedResult);
    });

    it("should parse value as string - if value is not a string", async () => {
      value = { value1: "testString" };
      let result = await exec();

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: `{"value1":"testString"}`,
      };

      expect(result).toEqual(expectedResult);
    });

    it("should not include source in payload if source is not defined in payload", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        severity: 30,
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
      };

      let result = await exec();

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(result).toEqual(expectedResult);
    });

    it("should not include correlationId in payload if source is not defined in payload", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        code: "1244",
        acknowledged: false,
      };

      let result = await exec();

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(result).toEqual(expectedResult);
    });

    it("should not include code in payload if source is not defined in payload", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        acknowledged: false,
      };

      let result = await exec();

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(result).toEqual(expectedResult);
    });

    it("should not include acknowledged in payload if source is not defined in payload", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
      };

      let result = await exec();

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe("_checkIfBoarded", () => {
    let project;
    let agent;
    let initPayload;
    let isMindConnectAgentBoarded;
    let isOnBoardThrows;

    beforeEach(async () => {
      jest.clearAllMocks();
      isOnBoardThrows = false;
      isMindConnectAgentBoarded = false;

      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
            source: "source1244",
            correlationId: "corelation124",
            code: "1244",
            acknowledged: false,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)

      tickId = 1607100000;
      elementId = "testElement2ID";
      value = { pl: "fakeTestTextPL", en: "fakeTestTextEN" };
    });

    afterEach(async () => {
      jest.clearAllMocks();
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      //faking boarding status
      agent._mindConnectAgent._onBoarded = isMindConnectAgentBoarded;

      if (isOnBoardThrows)
        agent._mindConnectAgent.IsOnBoarded = jest.fn(() => {
          throw Error("check boarded state error");
        });

      return agent._checkIfBoarded();
    };

    it("should return value of IsAgent() from MindConnectAgent - if value is false", async () => {
      isMindConnectAgentBoarded = false;

      let result = await exec();

      expect(agent._mindConnectAgent.IsOnBoarded).toHaveBeenCalledTimes(1);

      expect(result).toEqual(false);
    });

    it("should return value of IsAgent() from MindConnectAgent - if value is true", async () => {
      isMindConnectAgentBoarded = true;

      let result = await exec();

      expect(agent._mindConnectAgent.IsOnBoarded).toHaveBeenCalledTimes(1);

      expect(result).toEqual(true);
    });

    it("should throw if IsOnBoarded throws", async () => {
      isOnBoardThrows = true;

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

      expect(error.message).toContain("check boarded state error");
    });
  });

  describe("OnBoard", () => {
    let project;
    let agent;
    let initPayload;
    let isMindConnectAgentBoarded;
    let hasMindConnectAgentDPConfig;
    let isOnBoardThrows;
    let getDPConfigThrows;

    beforeEach(async () => {
      jest.clearAllMocks();
      isOnBoardThrows = false;
      isMindConnectAgentBoarded = false;
      hasMindConnectAgentDPConfig = false;
      getDPConfigThrows = false;

      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
            source: "source1244",
            correlationId: "corelation124",
            code: "1244",
            acknowledged: false,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)

      tickId = 1607100000;
      elementId = "testElement2ID";
      value = { pl: "fakeTestTextPL", en: "fakeTestTextEN" };
    });

    afterEach(async () => {
      jest.clearAllMocks();
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      //faking boarding status
      agent._mindConnectAgent._onBoarded = isMindConnectAgentBoarded;

      if (isOnBoardThrows)
        agent._mindConnectAgent.IsOnBoarded = jest.fn(() => {
          throw Error("On board error");
        });

      agent._mindConnectAgent._hasDataSourceConfig = hasMindConnectAgentDPConfig;

      if (getDPConfigThrows)
        agent._mindConnectAgent.GetDataSourceConfiguration = jest.fn(() => {
          throw Error("get data source config error");
        });

      return agent.OnBoard();
    };

    it("should call OnBoard and GetDataSourceConfig of MindConnectAgent - if MindConnectAgent is not boarded and has no DP config", async () => {
      isMindConnectAgentBoarded = false;
      hasMindConnectAgentDPConfig = false;

      await exec();

      expect(agent._mindConnectAgent.OnBoard).toHaveBeenCalledTimes(1);
      expect(
        agent._mindConnectAgent.GetDataSourceConfiguration
      ).toHaveBeenCalledTimes(1);

      //Onboard should be called before GetDataSourceConfiguration

      expect(agent._mindConnectAgent.OnBoard).toHaveBeenCalledBefore(
        agent._mindConnectAgent.GetDataSourceConfiguration
      );
    });

    it("should call only GetDataSourceConfig of MindConnectAgent - if MindConnectAgent is boarded and has no DP config", async () => {
      isMindConnectAgentBoarded = true;
      hasMindConnectAgentDPConfig = false;

      await exec();

      expect(agent._mindConnectAgent.OnBoard).not.toHaveBeenCalled();
      expect(
        agent._mindConnectAgent.GetDataSourceConfiguration
      ).toHaveBeenCalledTimes(1);
    });

    it("should call only OnBoard of MindConnectAgent - if MindConnectAgent is not boarded and has DP config", async () => {
      isMindConnectAgentBoarded = false;
      hasMindConnectAgentDPConfig = true;

      await exec();

      expect(agent._mindConnectAgent.OnBoard).toHaveBeenCalledTimes(1);
      expect(
        agent._mindConnectAgent.GetDataSourceConfiguration
      ).not.toHaveBeenCalled();
    });

    it("should throw and not call getDataSource - if OnBoard throws", async () => {
      isOnBoardThrows = true;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`On board error`);

      expect(
        agent._mindConnectAgent.GetDataSourceConfiguration
      ).not.toHaveBeenCalled();
    });

    it("should throw - if GetDataSourceConfiguration throws", async () => {
      getDPConfigThrows = true;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`get data source config error`);
    });
  });

  describe("_sendData", () => {
    let project;
    let agent;
    let initPayload;
    let payloadToSend;
    let sendDataThrowsTwoTimes;

    beforeEach(async () => {
      sendDataThrowsTwoTimes = false;
      jest.clearAllMocks();

      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {},
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)
      //1607100001000 - Fri Dec 04 2020 17:40:01 GMT+0100 (Central European Standard Time)
      //1607100002000 - Fri Dec 04 2020 17:40:02 GMT+0100 (Central European Standard Time)
      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: 2001.2001,
          testElement3ID: 3001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: 2002.2002,
          testElement3ID: 3002.3002,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: 2003.2003,
          testElement3ID: 3003.3003,
        },
      };
    });

    afterEach(async () => {
      jest.clearAllMocks();
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      let throwCounter = 0;
      if (sendDataThrowsTwoTimes)
        agent._mindConnectAgent.BulkPostData = jest.fn(async () => {
          throwCounter++;
          if (throwCounter <= 2) throw Error("send data error");
        });

      return agent._sendData(payloadToSend);
    };

    it("should convert payload to send to mindConnect bulk payload and then call retry with numberOfSendDataRetry and bulkPostData", async () => {
      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendDataRetries
      );

      expect(agent._mindConnectAgent.BulkPostData).toHaveBeenCalledTimes(1);

      let expectedResult = [
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ];

      expect(agent._mindConnectAgent.BulkPostData.mock.calls[0][0]).toEqual(
        expectedResult
      );
    });

    it("should retry and send data second and thrid time - if first and second time fails - thanks to retry", async () => {
      sendDataThrowsTwoTimes = true;

      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendDataRetries
      );

      expect(agent._mindConnectAgent.BulkPostData).toHaveBeenCalledTimes(3);

      let expectedResult = [
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ];

      expect(agent._mindConnectAgent.BulkPostData.mock.calls[0][0]).toEqual(
        expectedResult
      );

      expect(agent._mindConnectAgent.BulkPostData.mock.calls[1][0]).toEqual(
        expectedResult
      );

      expect(agent._mindConnectAgent.BulkPostData.mock.calls[2][0]).toEqual(
        expectedResult
      );
    });

    it("should throw - if number of retries exceeds number in payload", async () => {
      sendDataThrowsTwoTimes = true;
      initPayload.numberOfSendDataRetries = 2;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`send data error`);

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendDataRetries
      );

      expect(agent._mindConnectAgent.BulkPostData).toHaveBeenCalledTimes(2);

      let expectedResult = [
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ];

      expect(agent._mindConnectAgent.BulkPostData.mock.calls[0][0]).toEqual(
        expectedResult
      );

      expect(agent._mindConnectAgent.BulkPostData.mock.calls[1][0]).toEqual(
        expectedResult
      );
    });

    it("should not send data - if payload is undefined", async () => {
      payloadToSend = undefined;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.BulkPostData).not.toHaveBeenCalled();
    });

    it("should not send data - if payload is null", async () => {
      payloadToSend = null;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.BulkPostData).not.toHaveBeenCalled();
    });

    it("should not send data - if payload is an empty object", async () => {
      payloadToSend = {};

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.BulkPostData).not.toHaveBeenCalled();
    });

    it("should not send data - if after conversion it is null", async () => {
      //setting dataConfig payload not to contain any variables - it results in null conversion
      initPayload.dataToSendConfig = {};

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.BulkPostData).not.toHaveBeenCalled();
    });
  });

  describe("_sendEvent", () => {
    let project;
    let agent;
    let initPayload;
    let tickId;
    let elementId;
    let value;
    let sendEventThrowsTwoTimes;

    beforeEach(async () => {
      jest.clearAllMocks();
      sendEventThrowsTwoTimes = false;
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSAgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            severity: 20,
            source: "source1234",
            correlationId: "corelation123",
            code: "1234",
            acknowledged: false,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            severity: 30,
            source: "source1244",
            correlationId: "corelation124",
            code: "1244",
            acknowledged: false,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            severity: 40,
            source: "source1255",
            correlationId: "corelation125",
            code: "1254",
            acknowledged: false,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)

      tickId = 1607100000;
      elementId = "testElement2ID";
      value = { pl: "fakeTestTextPL", en: "fakeTestTextEN" };
    });

    afterEach(async () => {
      jest.clearAllMocks();
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      let throwCounter = 0;
      if (sendEventThrowsTwoTimes)
        agent._mindConnectAgent.PostEvent = jest.fn(async () => {
          throwCounter++;
          if (throwCounter <= 2) throw Error("send event error");
        });

      return agent._sendEvent(tickId, elementId, value);
    };

    it("should create event payload from tickId, value and elementId and then send it by PostEvent", async () => {
      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendEventRetries
      );

      expect(agent._mindConnectAgent.PostEvent).toHaveBeenCalledTimes(1);

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(agent._mindConnectAgent.PostEvent.mock.calls[0][0]).toEqual(
        expectedResult
      );
    });

    it("should retry and send event second and thrid time - if first and second time fails - thanks to retry", async () => {
      sendEventThrowsTwoTimes = true;

      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendEventRetries
      );

      expect(agent._mindConnectAgent.PostEvent).toHaveBeenCalledTimes(3);

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(agent._mindConnectAgent.PostEvent.mock.calls[0][0]).toEqual(
        expectedResult
      );

      expect(agent._mindConnectAgent.PostEvent.mock.calls[1][0]).toEqual(
        expectedResult
      );

      expect(agent._mindConnectAgent.PostEvent.mock.calls[2][0]).toEqual(
        expectedResult
      );
    });

    it("should throw - if number of retries exceeds number in payload", async () => {
      sendEventThrowsTwoTimes = true;
      initPayload.numberOfSendEventRetries = 2;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`send event error`);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendEventRetries
      );

      expect(agent._mindConnectAgent.PostEvent).toHaveBeenCalledTimes(2);

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(agent._mindConnectAgent.PostEvent.mock.calls[0][0]).toEqual(
        expectedResult
      );

      expect(agent._mindConnectAgent.PostEvent.mock.calls[1][0]).toEqual(
        expectedResult
      );
    });

    it("should not send event - if value is undefined", async () => {
      value = undefined;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.PostEvent).not.toHaveBeenCalled();
    });

    it("should not send event - if value is null", async () => {
      value = null;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.PostEvent).not.toHaveBeenCalled();
    });

    it("should not send event - if tickId is undefined", async () => {
      tickId = undefined;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.PostEvent).not.toHaveBeenCalled();
    });

    it("should not send event - if tickId is null", async () => {
      tickId = null;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.PostEvent).not.toHaveBeenCalled();
    });

    it("should not send event - if elementId is undefined", async () => {
      elementId = undefined;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.PostEvent).not.toHaveBeenCalled();
    });

    it("should not send event - if elementId is null", async () => {
      elementId = null;

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.PostEvent).not.toHaveBeenCalled();
    });

    it("should not send event - if payload after conversion is null", async () => {
      //setting eventDataConfig to empty object - conversion will return null
      initPayload.eventsToSendConfig = {};

      await exec();

      expect(retry).not.toHaveBeenCalled();

      expect(agent._mindConnectAgent.PostEvent).not.toHaveBeenCalled();
    });

    it("should create event payload from tickId, value and elementId and then send it by PostEvent - if source in event is not defined", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        severity: 30,
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
      };

      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendEventRetries
      );

      expect(agent._mindConnectAgent.PostEvent).toHaveBeenCalledTimes(1);

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        correlationId: "corelation124",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(agent._mindConnectAgent.PostEvent.mock.calls[0][0]).toEqual(
        expectedResult
      );
    });

    it("should create event payload from tickId, value and elementId and then send it by PostEvent - if correlationId in event is not defined", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        source: "source1244",
        severity: 30,
        code: "1244",
        acknowledged: false,
      };

      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendEventRetries
      );

      expect(agent._mindConnectAgent.PostEvent).toHaveBeenCalledTimes(1);

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        code: "1244",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(agent._mindConnectAgent.PostEvent.mock.calls[0][0]).toEqual(
        expectedResult
      );
    });

    it("should create event payload from tickId, value and elementId and then send it by PostEvent - if code in event is not defined", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        source: "source1244",
        severity: 30,
        correlationId: "corelation124",
        acknowledged: false,
      };

      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendEventRetries
      );

      expect(agent._mindConnectAgent.PostEvent).toHaveBeenCalledTimes(1);

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        acknowledged: false,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(agent._mindConnectAgent.PostEvent.mock.calls[0][0]).toEqual(
        expectedResult
      );
    });

    it("should create event payload from tickId, value and elementId and then send it by PostEvent - if acknowledged in event is not defined", async () => {
      initPayload.eventsToSendConfig.testElement2ID = {
        elementId: "testElement2ID",
        deviceId: "testDevice2ID",
        sendingInterval: 200,
        entityId: "bbbb1111",
        source: "source1244",
        severity: 30,
        correlationId: "corelation124",
        code: "1244",
      };

      await exec();

      expect(retry).toHaveBeenCalledTimes(1);

      expect(retry.mock.calls[0][0]).toEqual(
        initPayload.numberOfSendEventRetries
      );

      expect(agent._mindConnectAgent.PostEvent).toHaveBeenCalledTimes(1);

      let expectedResult = {
        entityId: "bbbb1111",
        severity: 30,
        source: "source1244",
        correlationId: "corelation124",
        code: "1244",
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(agent._mindConnectAgent.PostEvent.mock.calls[0][0]).toEqual(
        expectedResult
      );
    });
  });
});
