const MSMQTTAgentDevice = require("../../../../../classes/Device/AgentDevice/MSMQTTAgentDevice");
const {
  createDirIfNotExists,
  clearDirectoryAsync,
  checkIfDirectoryExistsAsync,
  createDirAsync,
  writeFileAsync,
  checkIfFileExistsAsync,
  exists,
  generateRandomString,
  snooze,
} = require("../../../../../utilities/utilities");
const path = require("path");
const mqtt = require("async-mqtt");
const logger = require("../../../../../logger/logger");

const AgentsDirPath = "__testDir/settings/agentsData";

describe("MSMQTTAgentDevice", () => {
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
      return new MSMQTTAgentDevice(project);
    };

    it("should create new MSMQTTAgentDevice and set all properties to null", () => {
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
      expect(device._mqttClient).toEqual(null);
      expect(device._mqttName).toEqual(null);
      expect(device._clientId).toEqual(null);
      expect(device._checkStateInterval).toEqual(null);
      expect(device._model).toEqual(null);
      expect(device._revision).toEqual(null);
      expect(device._tenantName).toEqual(null);
      expect(device._userName).toEqual(null);
      expect(device._userPassword).toEqual(null);
      expect(device._serialNumber).toEqual(null);
      expect(device._mqttMessagesLimit).toEqual(null);
      expect(device._deviceCreatedViaMQTT).toEqual(null);
      expect(device.QoS).toEqual(null);
      expect(device.PublishTimeout).toEqual(null);
      expect(device.ReconnectInterval).toEqual(null);
    });

    it("should assign project to MSMQTTAgentDevice", () => {
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
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 123,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
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

      device = new MSMQTTAgentDevice(project);

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
        type: "MSMQTTAgentDevice",
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
            deviceId: "deviceID",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 123,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
        boarded: false,
      };

      expect(device.generatePayload()).toEqual(expectedPayload);
    });

    it("should not create MQTT Client - Client is created during onboarding", async () => {
      await exec();

      expect(device._mqttClient).toEqual(null);
    });

    it("should set busy to false", async () => {
      await exec();

      expect(device._busy).toEqual(false);
    });

    it("should set _deviceCreatedViaMQTT to false", async () => {
      await exec();

      expect(device._deviceCreatedViaMQTT).toEqual(false);
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

    it("should not throw and - if agents dir already exists and dataStorage and eventStorage dirs exist", async () => {
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

    it("should assing userName key to _userName", async () => {
      await exec();

      expect(device._userName).toEqual(payload.userName);
    });

    it("should assing userPassword key to _userPassword", async () => {
      await exec();

      expect(device._userPassword).toEqual(payload.userPassword);
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
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 123,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
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

      device = new MSMQTTAgentDevice(project);

      activateMockFunc = jest.fn(device.activate);
      deactivateMockFunc = jest.fn(device.deactivate);

      device.activate = activateMockFunc;
      device.deactivate = deactivateMockFunc;

      await device.init(payload);

      return device.generatePayload();
    };

    it("should return a valid payload - without username or password", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            deviceId: "deviceID",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 123,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
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
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 123,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };
    });

    let exec = () => {
      return MSMQTTAgentDevice.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [MSMQTTAgentDevice]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [MSMQTTAgentDevice]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [MSMQTTAgentDevice]`);
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

    it("should return message if mqttName is not defined", () => {
      delete payload.mqttName;

      let result = exec();

      expect(result).toEqual(`"mqttName" is required`);
    });

    it("should return message if mqttName is null", () => {
      payload.mqttName = null;

      let result = exec();

      expect(result).toEqual(`"mqttName" must be a string`);
    });

    it("should return message if mqttName is empty string", () => {
      payload.mqttName = "";

      let result = exec();

      expect(result).toEqual(`"mqttName" is not allowed to be empty`);
    });

    it("should return message if mqttName is shorter than 10 signs", () => {
      payload.mqttName = generateRandomString(9);

      let result = exec();

      expect(result).toEqual(
        `"mqttName" length must be at least 10 characters long`
      );
    });

    it("should return message if clientId is not defined", () => {
      delete payload.clientId;

      let result = exec();

      expect(result).toEqual(`"clientId" is required`);
    });

    it("should return message if clientId is null", () => {
      payload.clientId = null;

      let result = exec();

      expect(result).toEqual(`"clientId" must be a string`);
    });

    it("should return message if clientId is empty string", () => {
      payload.clientId = "";

      let result = exec();

      expect(result).toEqual(`"clientId" is not allowed to be empty`);
    });

    it("should return message if clientId is shorter than 10 signs", () => {
      payload.clientId = generateRandomString(9);

      let result = exec();

      expect(result).toEqual(
        `"clientId" length must be at least 10 characters long`
      );
    });

    it("should return message if checkStateInterval is not defined", () => {
      delete payload.checkStateInterval;

      let result = exec();

      expect(result).toEqual(`"checkStateInterval" is required`);
    });

    it("should return message if checkStateInterval is null", () => {
      payload.checkStateInterval = null;

      let result = exec();

      expect(result).toEqual(`"checkStateInterval" must be a number`);
    });

    it("should return message if checkStateInterval is not a number", () => {
      payload.checkStateInterval = true;

      let result = exec();

      expect(result).toEqual(`"checkStateInterval" must be a number`);
    });

    it("should return message if checkStateInterval is not an integer", () => {
      payload.checkStateInterval = 123.321;

      let result = exec();

      expect(result).toEqual(`"checkStateInterval" must be an integer`);
    });

    it("should return message if checkStateInterval is samller then 1", () => {
      payload.checkStateInterval = 0;

      let result = exec();

      expect(result).toEqual(
        `"checkStateInterval" must be greater than or equal to 1`
      );
    });

    it("should return message if model is not defined", () => {
      delete payload.model;

      let result = exec();

      expect(result).toEqual(`"model" is required`);
    });

    it("should return message if model is null", () => {
      payload.model = null;

      let result = exec();

      expect(result).toEqual(`"model" must be a string`);
    });

    it("should return message if model is empty string", () => {
      payload.model = "";

      let result = exec();

      expect(result).toEqual(`"model" is not allowed to be empty`);
    });

    it("should return message if model is shorter than 3 signs", () => {
      payload.model = generateRandomString(2);

      let result = exec();

      expect(result).toEqual(
        `"model" length must be at least 3 characters long`
      );
    });

    it("should return message if serialNumber is not defined", () => {
      delete payload.serialNumber;

      let result = exec();

      expect(result).toEqual(`"serialNumber" is required`);
    });

    it("should return message if serialNumber is null", () => {
      payload.serialNumber = null;

      let result = exec();

      expect(result).toEqual(`"serialNumber" must be a string`);
    });

    it("should return message if serialNumber is empty string", () => {
      payload.serialNumber = "";

      let result = exec();

      expect(result).toEqual(`"serialNumber" is not allowed to be empty`);
    });

    it("should return message if serialNumber is shorter than 3 signs", () => {
      payload.serialNumber = generateRandomString(2);

      let result = exec();

      expect(result).toEqual(
        `"serialNumber" length must be at least 3 characters long`
      );
    });

    it("should return message if revision is not defined", () => {
      delete payload.revision;

      let result = exec();

      expect(result).toEqual(`"revision" is required`);
    });

    it("should return message if revision is null", () => {
      payload.revision = null;

      let result = exec();

      expect(result).toEqual(`"revision" must be a string`);
    });

    it("should return message if revision is empty string", () => {
      payload.revision = "";

      let result = exec();

      expect(result).toEqual(`"revision" is not allowed to be empty`);
    });

    it("should return null if revision is only 1 character long", () => {
      payload.revision = generateRandomString(1);

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if userName is not defined", () => {
      delete payload.userName;

      let result = exec();

      expect(result).toEqual(`"userName" is required`);
    });

    it("should return message if userName is null", () => {
      payload.userName = null;

      let result = exec();

      expect(result).toEqual(`"userName" must be a string`);
    });

    it("should return message if userName is empty string", () => {
      payload.userName = "";

      let result = exec();

      expect(result).toEqual(`"userName" is not allowed to be empty`);
    });

    it("should return message if userPassword is not defined", () => {
      delete payload.userPassword;

      let result = exec();

      expect(result).toEqual(`"userPassword" is required`);
    });

    it("should return message if userPassword is null", () => {
      payload.userPassword = null;

      let result = exec();

      expect(result).toEqual(`"userPassword" must be a string`);
    });

    it("should return message if userPassword is empty string", () => {
      payload.userPassword = "";

      let result = exec();

      expect(result).toEqual(`"userPassword" is not allowed to be empty`);
    });

    it("should return message if mqttMessagesLimit is not defined", () => {
      delete payload.mqttMessagesLimit;

      let result = exec();

      expect(result).toEqual(`"mqttMessagesLimit" is required`);
    });

    it("should return message if mqttMessagesLimit is null", () => {
      payload.mqttMessagesLimit = null;

      let result = exec();

      expect(result).toEqual(`"mqttMessagesLimit" must be a number`);
    });

    it("should return message if mqttMessagesLimit is not a number", () => {
      payload.mqttMessagesLimit = true;

      let result = exec();

      expect(result).toEqual(`"mqttMessagesLimit" must be a number`);
    });

    it("should return message if mqttMessagesLimit is not an integer", () => {
      payload.mqttMessagesLimit = 123.321;

      let result = exec();

      expect(result).toEqual(`"mqttMessagesLimit" must be an integer`);
    });

    it("should return message if mqttMessagesLimit is samller then 10", () => {
      payload.mqttMessagesLimit = 9;

      let result = exec();

      expect(result).toEqual(
        `"mqttMessagesLimit" must be greater than or equal to 10`
      );
    });

    it("should return message if mqttMessagesLimit is longer then 160", () => {
      payload.mqttMessagesLimit = 161;

      let result = exec();

      expect(result).toEqual(
        `"mqttMessagesLimit" must be less than or equal to 160`
      );
    });

    it("should return message if qos is not defined", () => {
      delete payload.qos;

      let result = exec();

      expect(result).toEqual(`"qos" is required`);
    });

    it("should return message if qos is null", () => {
      payload.qos = null;

      let result = exec();

      expect(result).toEqual(`"qos" must be one of [0, 1, 2]`);
    });

    it("should return message if qos is not a number", () => {
      payload.qos = true;

      let result = exec();

      expect(result).toEqual(`"qos" must be one of [0, 1, 2]`);
    });

    it("should return message if qos is not an integer", () => {
      payload.qos = 123.321;

      let result = exec();

      expect(result).toEqual(`"qos" must be one of [0, 1, 2]`);
    });

    it("should return message if qos is not 0,1,2", () => {
      payload.qos = 3;

      let result = exec();

      expect(result).toEqual(`"qos" must be one of [0, 1, 2]`);
    });

    it("should return null if qos is 0", () => {
      payload.qos = 0;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if qos is 1", () => {
      payload.qos = 1;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if qos is 2", () => {
      payload.qos = 2;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if publishTimeout is not defined", () => {
      delete payload.publishTimeout;

      let result = exec();

      expect(result).toEqual(`"publishTimeout" is required`);
    });

    it("should return message if publishTimeout is null", () => {
      payload.publishTimeout = null;

      let result = exec();

      expect(result).toEqual(`"publishTimeout" must be a number`);
    });

    it("should return message if publishTimeout is not a number", () => {
      payload.publishTimeout = true;

      let result = exec();

      expect(result).toEqual(`"publishTimeout" must be a number`);
    });

    it("should return message if publishTimeout is not an integer", () => {
      payload.publishTimeout = 123.321;

      let result = exec();

      expect(result).toEqual(`"publishTimeout" must be an integer`);
    });

    it("should return message if publishTimeout is samller then 100", () => {
      payload.publishTimeout = 9;

      let result = exec();

      expect(result).toEqual(
        `"publishTimeout" must be greater than or equal to 100`
      );
    });

    it("should return message if reconnectInterval is not defined", () => {
      delete payload.reconnectInterval;

      let result = exec();

      expect(result).toEqual(`"reconnectInterval" is required`);
    });

    it("should return message if reconnectInterval is null", () => {
      payload.reconnectInterval = null;

      let result = exec();

      expect(result).toEqual(`"reconnectInterval" must be a number`);
    });

    it("should return message if reconnectInterval is not a number", () => {
      payload.reconnectInterval = true;

      let result = exec();

      expect(result).toEqual(`"reconnectInterval" must be a number`);
    });

    it("should return message if reconnectInterval is not an integer", () => {
      payload.reconnectInterval = 123.321;

      let result = exec();

      expect(result).toEqual(`"reconnectInterval" must be an integer`);
    });

    it("should return message if reconnectInterval is samller then 0", () => {
      payload.reconnectInterval = -1;

      let result = exec();

      expect(result).toEqual(
        `"reconnectInterval" must be greater than or equal to 0`
      );
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
          groupName: "testElement1Group",
          variableName: "testElement1Name",
          variableUnit: "testElement1Unit",
          dataConverter: {
            conversionType: "fixed",
            precision: 3,
          },
        },
        testElement2ID: {
          elementId: "testElement2ID",
          deviceId: "testDevice2ID",
          sendingInterval: 200,
          groupName: "testElement2Group",
          variableName: "testElement2Name",
          variableUnit: "testElement2Unit",
          dataConverter: {
            conversionType: "precision",
            precision: 3,
          },
        },
        testElement3ID: {
          elementId: "testElement3ID",
          deviceId: "testDevice3ID",
          sendingInterval: 300,
          groupName: "testElement3Group",
          variableName: "testElement3Name",
          variableUnit: "testElement3Unit",
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

    it("should return message if one of dataToSendConfigs has invalid groupName - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.groupName;

      let result = exec();

      expect(result).toEqual(`dataToSendConfig error: "groupName" is required`);
    });

    it("should return message if one of dataToSendConfigs has invalid groupName - null", () => {
      payload.dataToSendConfig.testElement2ID.groupName = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "groupName" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid groupName - not a string", () => {
      payload.dataToSendConfig.testElement2ID.groupName = 1234;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "groupName" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid groupName - shorter than 3", () => {
      payload.dataToSendConfig.testElement2ID.groupName = generateRandomString(
        2
      );

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "groupName" length must be at least 3 characters long`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableName - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.variableName;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableName" is required`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableName - null", () => {
      payload.dataToSendConfig.testElement2ID.variableName = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableName" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableName - not a string", () => {
      payload.dataToSendConfig.testElement2ID.variableName = 1234;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableName" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableName - shorter than 3", () => {
      payload.dataToSendConfig.testElement2ID.variableName = generateRandomString(
        2
      );

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableName" length must be at least 3 characters long`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableUnit - undefined", () => {
      delete payload.dataToSendConfig.testElement2ID.variableUnit;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableUnit" is required`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableUnit - null", () => {
      payload.dataToSendConfig.testElement2ID.variableUnit = null;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableUnit" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableUnit - not a string", () => {
      payload.dataToSendConfig.testElement2ID.variableUnit = 1234;

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableUnit" must be a string`
      );
    });

    it("should return message if one of dataToSendConfigs has invalid variableUnit - shorter than 1", () => {
      payload.dataToSendConfig.testElement2ID.variableUnit = "";

      let result = exec();

      expect(result).toEqual(
        `dataToSendConfig error: "variableUnit" is not allowed to be empty`
      );
    });

    it("should return null if one of dataToSendConfigs has variableUnit with one character", () => {
      payload.dataToSendConfig.testElement2ID.variableUnit = "a";

      let result = exec();

      expect(result).toEqual(null);
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
          elementId: "testElement4ID",
          deviceId: "testDevice1ID",
          sendingInterval: 100,
          severity: 20,
          eventName: "testElement1Event",
          eventType: "EVENT",
        },
        testElement2ID: {
          elementId: "testElement2ID",
          deviceId: "testDevice2ID",
          sendingInterval: 200,
          severity: 30,
          eventName: "testElement2Alert",
          eventType: "ALERT",
        },
        testElement3ID: {
          elementId: "testElement3ID",
          deviceId: "testDevice3ID",
          sendingInterval: 300,
          severity: 40,
          eventName: "testElement3Event",
          eventType: "EVENT",
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

    it("should return message if one of eventsToSendConfigs has invalid eventName - undefined", () => {
      delete payload.eventsToSendConfig.testElement2ID.eventName;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventName" is required`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid eventName - null", () => {
      payload.eventsToSendConfig.testElement2ID.eventName = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventName" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid eventName - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.eventName = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventName" must be a string`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid eventName - shorter than 3 characters", () => {
      payload.eventsToSendConfig.testElement2ID.eventName = generateRandomString(
        2
      );

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventName" length must be at least 3 characters long`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid eventType - undefined", () => {
      delete payload.eventsToSendConfig.testElement2ID.eventType;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventType" is required`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid eventType - null", () => {
      payload.eventsToSendConfig.testElement2ID.eventType = null;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventType" must be one of [EVENT, ALERT]`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid eventType - not a string", () => {
      payload.eventsToSendConfig.testElement2ID.eventType = 1234;

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventType" must be one of [EVENT, ALERT]`
      );
    });

    it("should return message if one of eventsToSendConfigs has invalid eventType - different than EVENT or ALERT", () => {
      payload.eventsToSendConfig.testElement2ID.eventType = generateRandomString(
        5
      );

      let result = exec();

      expect(result).toEqual(
        `eventsToSendConfig error: "eventType" must be one of [EVENT, ALERT]`
      );
    });

    it("should return null if one of eventsToSendConfigs has ieventType of EVENT", () => {
      payload.eventsToSendConfig.testElement2ID.eventType = "EVENT";

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if one of eventsToSendConfigs has ieventType of ALERT", () => {
      payload.eventsToSendConfig.testElement2ID.eventType = "ALERT";

      let result = exec();

      expect(result).toEqual(null);
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

  describe("normalizeStringToSendViaSmartREST", () => {
    let stringToNormalize;

    beforeEach(() => {
      stringToNormalize = JSON.stringify({
        "abcd,defg": 1234,
        abcd: ";abfef,12323",
      });
    });

    let exec = () => {
      return MSMQTTAgentDevice.normalizeStringToSendViaSmartREST(
        stringToNormalize
      );
    };

    it("should return a valid string - if string is a stringified JSON", () => {
      let result = exec();

      expect(result).toEqual(
        `"{""abcd,defg"":1234,""abcd"":"";abfef,12323""}"`
      );
    });

    it("should return a valid string - if string is a normal string", () => {
      stringToNormalize = "abcd1234";

      let result = exec();

      expect(result).toEqual(`"abcd1234"`);
    });

    it("should return empty string - if string is null", () => {
      stringToNormalize = null;

      let result = exec();

      expect(result).toEqual("");
    });

    it("should return empty string - if string is undefined", () => {
      stringToNormalize = undefined;

      let result = exec();

      expect(result).toEqual("");
    });
  });

  describe("normalizeMindConnectSeverity", () => {
    let severityToNormalize;

    beforeEach(() => {
      severityToNormalize = 50;
    });

    let exec = () => {
      return MSMQTTAgentDevice.normalizeMindConnectSeverity(
        severityToNormalize
      );
    };

    it("should return 301 if severity is a critical alert x < 20", () => {
      severityToNormalize = 19;
      let result = exec();

      expect(result).toEqual(301);
    });

    it("should return 302 if severity is a normal alert  20 < x < 30", () => {
      severityToNormalize = 25;
      let result = exec();

      expect(result).toEqual(302);
    });

    it("should return 303 if severity is a warning  30 < x < 40", () => {
      severityToNormalize = 35;
      let result = exec();

      expect(result).toEqual(303);
    });

    it("should return 304 if severity is an information  40 < x ", () => {
      severityToNormalize = 45;
      let result = exec();

      expect(result).toEqual(304);
    });
  });

  describe("_convertTickIdToMQTTTimestamp", () => {
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
      agent = new MSMQTTAgentDevice(project);
      return agent._convertTickIdToMQTTTimestamp(tickId);
    };

    it("should properly convert tickId to ISO string with date", async () => {
      let result = await exec();

      expect(result).toEqual("2020-12-04T16:40:00.000Z");
    });
  });

  describe("_createMQTTSendValueCommand", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;
    let payload;
    let elementId;
    let tickId;
    let value;

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
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 123,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      activateMockFunc = jest.fn();
      deactivatMeockFunc = jest.fn();
      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)
      tickId = 1607100000;
      elementId = "testElement2ID";
      value = 1234.5678;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      agent = new MSMQTTAgentDevice(project);
      await agent.init(payload);
      return agent._createMQTTSendValueCommand(elementId, value, tickId);
    };

    it("should return proper command splitted by commas", async () => {
      let result = await exec();

      expect(result).toEqual(
        "200,testElement2Group,testElement2Name,1.23e+3,testElement2Unit,2020-12-04T16:40:00.000Z"
      );
    });

    it("should return null if there is no element of given id", async () => {
      elementId = "fakeId";
      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null if value is null", async () => {
      value = null;
      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null if tickId is null", async () => {
      tickId = null;
      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null if value is a boolean", async () => {
      value = true;
      let result = await exec();

      expect(result).toEqual(null);
    });
  });

  describe("_convertAgentDataSendPayloadToMQTTCommands", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;
    let payload;
    let payloadToSend;

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
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();

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
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      agent = new MSMQTTAgentDevice(project);
      await agent.init(payload);
      return agent._convertAgentDataSendPayloadToMQTTCommands(payloadToSend);
    };

    it("should return one command - if limit of messages is greater than number of rows", async () => {
      payload.mqttMessagesLimit = 100;

      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should split command into several commands - if there are more rows than mqtt limit", async () => {
      payload.mqttMessagesLimit = 5;
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return one command if limit is exactly the number of commands", async () => {
      payload.mqttMessagesLimit = 9;
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return one command if limit is one below the number of commands", async () => {
      payload.mqttMessagesLimit = 8;
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n",
        "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return all rows seperately if limit of messages is 1", async () => {
      payload.mqttMessagesLimit = 1;
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n",
        "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n",
        "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n",
        "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n",
        "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n",
        "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
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
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
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
      payload.dataToSendConfig.testElement2ID.dataConverter = null;

      let result = await exec();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2001.2001,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2002.2002,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2003.2003,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should set exact value without converting - for variables with conversion type - none", async () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.conversionType =
        "none";

      let result = await exec();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2001.2001,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2002.2002,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2003.2003,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should convert value with precision - for variables with conversion type - precision", async () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.type = "precision";
      payload.dataToSendConfig.testElement2ID.dataConverter.precision = 3;

      let result = await exec();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should convert value with fixed - for variables with conversion type - fixed", async () => {
      payload.dataToSendConfig.testElement2ID.dataConverter.conversionType =
        "fixed";
      payload.dataToSendConfig.testElement2ID.dataConverter.precision = 3;

      let result = await exec();

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2001.200,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2002.200,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2003.200,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should omit boolean values - they cannot be send via MQTT", async () => {
      payload.dataToSendConfig.testElement2ID.dataConverter = null;

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

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n",
        "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should omit boolean values - if value is a boolean, dataConverter is present", async () => {
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

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n",
        "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
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

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n",
        "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
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

      let expectedResult = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n",
        "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("_convertAgentEventSendPayloadToMCAgentPayload", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;
    let initPayload;
    let tickId;
    let elementId;
    let value;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
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
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      agent = new MSMQTTAgentDevice(project);
      await agent.init(initPayload);

      return agent._convertAgentEventSendPayloadToMQTTCommand(
        tickId,
        elementId,
        value
      );
    };

    it("should properly convert standard payload to send to MQTT command to send - if alert is ALERT", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`;

      expect(result).toEqual(expectedResult);
    });

    it("should properly convert standard payload to send to MQTT command to send - if alert is EVENT", async () => {
      elementId = "testElement1ID";

      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = `400,testElement1Event,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`;

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

    it("should return command with empty string - if value is an empty string", async () => {
      value = "";

      let result = await exec();

      expect(result).toEqual(
        `302,testElement2Alert,"",2020-12-04T16:40:00.000Z`
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

      expect(result).toEqual(
        `302,testElement2Alert,"testString",2020-12-04T16:40:00.000Z`
      );
    });

    it("should parse value as string - if value is not a string", async () => {
      value = { value1: "testString" };
      let result = await exec();

      expect(result).toEqual(
        `302,testElement2Alert,"{""value1"":""testString""}",2020-12-04T16:40:00.000Z`
      );
    });

    it("should return null if type is not an ALERT and not an EVENT", async () => {
      initPayload.eventsToSendConfig.testElement2ID.eventType = "FAKE_TYPE";

      let result = await exec();

      expect(result).toEqual(null);
    });
  });

  describe("_generateConnectParameters", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;
    let initPayload;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      agent = new MSMQTTAgentDevice(project);
      await agent.init(initPayload);

      return agent._generateConnectParameters();
    };

    it("should return proper connect parameters to connect to MQTT broker", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",
        reconnectPeriod: 0,
        connectTimeout: 1234,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe("_connectToMQTTBroker", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;
    let initPayload;
    let internetConnection;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      mqtt.mockSetInternetConnection(internetConnection);
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      agent = new MSMQTTAgentDevice(project);
      await agent.init(initPayload);

      return agent._connectToMQTTBroker();
    };

    it("should call connectAsync of mqtt and assign new client to mqttClient", async () => {
      await exec();

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",
        reconnectPeriod: 0,
        connectTimeout: 1234,
      };

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
      expect(mqtt.connectAsync.mock.calls[0][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[0][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[0][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);
    });

    it("should throw if there is no internet connection", async () => {
      internetConnection = false;

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

      expect(error.message).toEqual("Cannot connect - no internet connection");

      //mqtt agent should not be assigned
      expect(agent._mqttClient).toEqual(null);
    });
  });

  describe("_closeConnectionWithBroker", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;
    let initPayload;
    let internetConnection;
    let forceEnd;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;

      forceEnd = true;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      mqtt.mockSetInternetConnection(internetConnection);
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      agent = new MSMQTTAgentDevice(project);
      await agent.init(initPayload);

      await agent._connectToMQTTBroker();

      return agent._closeConnectionWithBroker(forceEnd);
    };

    it("should call end on mqttClient - if force close is set to true", async () => {
      forceEnd = true;
      await exec();

      expect(agent._mqttClient.connected).toEqual(false);
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
    });

    it("should call end on mqttClient - if force close is set to true", async () => {
      forceEnd = false;
      await exec();

      expect(agent._mqttClient.connected).toEqual(false);
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(false);
    });
  });

  describe("_connectToBrokerIfNotConnected", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;
    let initPayload;
    let internetConnection;
    let initAgent;
    let connectBroker;
    let disconnectAfterConnecting;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;

      initAgent = true;

      connectBroker = false;
      disconnectAfterConnecting = false;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      mqtt.mockSetInternetConnection(internetConnection);
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      agent = new MSMQTTAgentDevice(project);
      if (initAgent) await agent.init(initPayload);
      if (connectBroker) await agent._connectToMQTTBroker();
      if (disconnectAfterConnecting) await agent._closeConnectionWithBroker();
      return agent._connectToBrokerIfNotConnected();
    };

    it("should call asyncConnect - if agent is initalized but not connected and device is connected first time (mqttClient = null)", async () => {
      await exec();

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",
        reconnectPeriod: 0,
        connectTimeout: 1234,
      };

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
      expect(mqtt.connectAsync.mock.calls[0][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[0][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[0][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);
    });

    it("should call asyncConnect - if agent is initalized but not connected and device is connected not for the first time (mqttClient = null)", async () => {
      connectBroker = true;
      disconnectAfterConnecting = true;

      await exec();

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",

        reconnectPeriod: 0,
        connectTimeout: 1234,
      };

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(2);
      expect(mqtt.connectAsync.mock.calls[1][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[1][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[1][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);
    });

    it("should not call asyncConnect - if agent is already connected", async () => {
      connectBroker = true;

      await exec();

      //Connect called only one time - during first connection
      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
    });

    it("should throw if there is no internet connection", async () => {
      internetConnection = false;

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

      expect(error.message).toEqual("Cannot connect - no internet connection");

      //mqtt agent should not be assigned
      expect(agent._mqttClient).toEqual(null);
    });
  });

  describe("_sendMQTTCommand", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let initPayload;
    let internetConnection;
    let initAgent;
    let connectBroker;
    let disconnectAfterConnecting;
    let command;
    let qos;
    let publishTimeout;
    let endThrows;
    let publishThrows;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      qos = 1;
      publishTimeout = 100;

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;

      initAgent = true;

      connectBroker = true;
      disconnectAfterConnecting = false;
      command = "testCommandText";
      endThrows = false;
      publishThrows = false;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      initPayload.qos = qos;
      initPayload.publishTimeout = publishTimeout;

      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      mqtt.mockSetInternetConnection(true);

      agent = new MSMQTTAgentDevice(project);
      if (initAgent) await agent.init(initPayload);
      if (connectBroker) await agent._connectToMQTTBroker();
      if (disconnectAfterConnecting) await agent._closeConnectionWithBroker();

      mqtt.mockSetInternetConnection(internetConnection);

      if (endThrows && agent._mqttClient)
        agent._mqttClient.end = jest.fn(() => {
          throw new Error("testError");
        });

      if (publishThrows && agent._mqttClient)
        agent._mqttClient.publish = jest.fn(() => {
          throw new Error("testError");
        });

      return agent._sendMQTTCommand(command);
    };

    it("invoke publish on s/us topic and command with qos set to value of agent's qos and return true", async () => {
      let result = await exec();

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      expect(result).toEqual(true);
    });

    it("should not throw - if publish was invoked properly, and publish time delay elapsed - qos set to 0", async () => {
      qos = 0;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should not throw - if publish was invoked properly, and publish time delay elapsed - qos set to 1", async () => {
      qos = 1;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should not throw - if publish was invoked properly, and publish time delay elapsed - qos set to 2", async () => {
      qos = 2;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should not throw - if there is no internet connection and publish does not hang, qos set to 0", async () => {
      qos = 0;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      expect(agent._mqttClient.end).not.toHaveBeenCalled();
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 1", async () => {
      qos = 1;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 2", async () => {
      qos = 2;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw and not publish if mqtt is not connected but previously was connected", async () => {
      disconnectAfterConnecting = true;
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

      expect(error.message).toEqual(
        "Cannot publish MQTT when device not connected!"
      );

      //publish should have been called
      expect(agent._mqttClient.publish).not.toHaveBeenCalled();

      //than end should be called only once - while disconnecting after connecting, but not in publish
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
    });

    it("should throw and not publish if mqtt is not connected and has never been connected before", async () => {
      disconnectAfterConnecting = false;
      connectBroker = false;
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

      expect(error.message).toEqual(
        "Cannot publish MQTT when device not connected!"
      );

      //publish should have been called
      expect(agent._mqttClient).toEqual(null);
    });

    it("should throw if there was a timeout while publishing and end connection throws an error", async () => {
      endThrows = true;
      //Internet connection set to false - in order for publish to hang
      internetConnection = false;

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

      expect(error.message).toEqual(
        "Error while disconnecting after message timeout"
      );

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw if publish throws", async () => {
      publishThrows = true;

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

      expect(error.message).toEqual("testError");

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(command);
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //end should not have been called
      expect(agent._mqttClient.end).not.toHaveBeenCalled();
    });

    it("should not invoke publish if command is undefined and returng false", async () => {
      command = undefined;

      let result = await exec();

      expect(result).toEqual(false);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not invoke publish if command is null", async () => {
      command = null;

      let result = await exec();

      expect(result).toEqual(false);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not invoke publish if command is an empty string", async () => {
      command = "";

      let result = await exec();

      expect(result).toEqual(false);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });
  });

  describe("_createAndSetUpMQTTDevice", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let initPayload;
    let internetConnection;
    let initAgent;
    let connectBroker;
    let disconnectAfterConnecting;
    let qos;
    let publishTimeout;
    let endThrows;
    let publishThrows;
    let mqttDeviceName;
    let mqttClientId;
    let mqttCheckIntervalState;
    let mqttSerialNumber;
    let mqttModel;
    let mqttRevision;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      qos = 1;
      publishTimeout = 100;

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        serialNumber: "testSerialNumber",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;

      initAgent = true;

      connectBroker = true;
      disconnectAfterConnecting = false;
      endThrows = false;
      publishThrows = false;

      mqttDeviceName = "mqttTestDeviceName";
      mqttClientId = "mqttTestClientId";
      mqttCheckIntervalState = 1234;
      mqttSerialNumber = "mqttTestSerialNumber";
      mqttModel = "mqttTestModel";
      mqttRevision = "mqttTestRevision";
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      initPayload.qos = qos;
      initPayload.publishTimeout = publishTimeout;
      initPayload.mqttName = mqttDeviceName;
      initPayload.clientId = mqttClientId;
      initPayload.checkStateInterval = mqttCheckIntervalState;
      initPayload.clientId = mqttClientId;
      initPayload.model = mqttModel;
      initPayload.serialNumber = mqttSerialNumber;
      initPayload.model = mqttModel;
      initPayload.revision = mqttRevision;

      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      mqtt.mockSetInternetConnection(true);

      agent = new MSMQTTAgentDevice(project);
      if (initAgent) await agent.init(initPayload);
      if (connectBroker) await agent._connectToMQTTBroker();
      if (disconnectAfterConnecting) await agent._closeConnectionWithBroker();

      mqtt.mockSetInternetConnection(internetConnection);

      if (endThrows && agent._mqttClient)
        agent._mqttClient.end = jest.fn(() => {
          throw new Error("testError");
        });

      if (publishThrows && agent._mqttClient)
        agent._mqttClient.publish = jest.fn(() => {
          throw new Error("testError");
        });

      return agent._createAndSetUpMQTTDevice();
    };

    it("invoke publish on s/us topic and proper command with qos set to value of agent's qos", async () => {
      await exec();

      let expectedCommand =
        "100,mqttTestDeviceName,mqttTestClientId\n" +
        "117,1234\n" +
        "110,mqttTestSerialNumber,mqttTestModel,mqttTestRevision";

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommand
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("invoke publish on s/us topic and proper command with qos set to value of agent's qos", async () => {
      await exec();

      let expectedCommand =
        "100,mqttTestDeviceName,mqttTestClientId\n" +
        "117,1234\n" +
        "110,mqttTestSerialNumber,mqttTestModel,mqttTestRevision";

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommand
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should not throw - if there is no internet connection and publish does not hang, qos set to 0", async () => {
      qos = 0;

      await exec();

      await snooze(2 * publishTimeout);

      let expectedCommand =
        "100,mqttTestDeviceName,mqttTestClientId\n" +
        "117,1234\n" +
        "110,mqttTestSerialNumber,mqttTestModel,mqttTestRevision";

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommand
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      expect(agent._mqttClient.end).not.toHaveBeenCalled();
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 1", async () => {
      qos = 1;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      let expectedCommand =
        "100,mqttTestDeviceName,mqttTestClientId\n" +
        "117,1234\n" +
        "110,mqttTestSerialNumber,mqttTestModel,mqttTestRevision";

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommand
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 2", async () => {
      qos = 2;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      let expectedCommand =
        "100,mqttTestDeviceName,mqttTestClientId\n" +
        "117,1234\n" +
        "110,mqttTestSerialNumber,mqttTestModel,mqttTestRevision";

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommand
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw and not publish if mqtt is not connected but previously was connected", async () => {
      disconnectAfterConnecting = true;
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

      expect(error.message).toEqual(
        "Cannot publish MQTT when device not connected!"
      );

      //publish should have been called
      expect(agent._mqttClient.publish).not.toHaveBeenCalled();

      //than end should be called only once - while disconnecting after connecting, but not in publish
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
    });

    it("should throw and not publish if mqtt is not connected and has never been connected before", async () => {
      disconnectAfterConnecting = false;
      connectBroker = false;
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

      expect(error.message).toEqual(
        "Cannot publish MQTT when device not connected!"
      );

      //publish should have been called
      expect(agent._mqttClient).toEqual(null);
    });
  });

  describe("OnBoard", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let initPayload;
    let internetConnection;
    let qos;
    let publishTimeout;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      qos = 1;
      publishTimeout = 100;

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        serialNumber: "testSerialNumber",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      initPayload.qos = qos;
      initPayload.publishTimeout = publishTimeout;

      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      mqtt.mockSetInternetConnection(true);

      agent = new MSMQTTAgentDevice(project);
      await agent.init(initPayload);

      mqtt.mockSetInternetConnection(internetConnection);

      return agent.OnBoard();
    };

    it("connect to broker, create the device and than set deviceCreatedViaMQTT to true", async () => {
      await exec();

      //#region checking connection

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",

        reconnectPeriod: 0,
        connectTimeout: 100,
      };

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
      expect(mqtt.connectAsync.mock.calls[0][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[0][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[0][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);

      //#endregion checking connection

      //#region checking device creation

      let expectedCommand =
        "100,testMQTTName,testMQTTClientId\n" +
        "117,123\n" +
        "110,testSerialNumber,testModel,testRevision";

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommand
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //#endregion checking device creation

      //#region checking deviceCreatedViaMQTT

      expect(agent._deviceCreatedViaMQTT).toEqual(true);

      expect(await agent._checkIfBoarded()).toEqual(true);

      //#endregion checking deviceCreatedViaMQTT
    });

    it("should throw, and not publish anything and not set _deviceCreatedViaMQTT to true - if there is no internet connection", async () => {
      internetConnection = false;

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

      expect(error.message).toEqual("Cannot connect - no internet connection");

      //#region checking connection

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",

        reconnectPeriod: 0,
        connectTimeout: 100,
      };

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
      expect(mqtt.connectAsync.mock.calls[0][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[0][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[0][2]).toEqual(false);

      expect(agent._mqttClient).toEqual(null);

      //#endregion checking connection

      //#region checking device creation

      //Cannot invoke publish becouse client is null

      //#endregion checking device creation

      //#region checking deviceCreatedViaMQTT

      expect(agent._deviceCreatedViaMQTT).toEqual(false);

      expect(await agent._checkIfBoarded()).toEqual(false);

      //#endregion checking deviceCreatedViaMQTT
    });
  });

  describe("_checkIfBoarded", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let initPayload;
    let deviceCreatedViaMQTT;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        serialNumber: "testSerialNumber",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;

      deviceCreatedViaMQTT = false;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      mqtt.mockSetInternetConnection(true);

      agent = new MSMQTTAgentDevice(project);
      await agent.init(initPayload);

      agent._deviceCreatedViaMQTT = deviceCreatedViaMQTT;

      return agent._checkIfBoarded();
    };

    it("should return deviceCreatedViaMQTT - if it is set to false", async () => {
      deviceCreatedViaMQTT = false;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return deviceCreatedViaMQTT - if it is set to true", async () => {
      deviceCreatedViaMQTT = true;

      let result = await exec();

      expect(result).toEqual(true);
    });
  });

  describe("_sendData", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let initPayload;
    let internetConnection;
    let initAgent;
    let connectBroker;
    let disconnectAfterConnecting;
    let command;
    let qos;
    let publishTimeout;
    let endThrows;
    let publishThrows;
    let payloadToSend;
    let mqttMessagesLimit;
    let initialMQTTClient;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      mqttMessagesLimit = 5;
      qos = 1;
      publishTimeout = 100;

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;

      initAgent = true;

      connectBroker = true;
      disconnectAfterConnecting = false;
      endThrows = false;
      publishThrows = false;

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
      initPayload.mqttMessagesLimit = mqttMessagesLimit;
      initPayload.qos = qos;
      initPayload.publishTimeout = publishTimeout;

      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      mqtt.mockSetInternetConnection(true);

      agent = new MSMQTTAgentDevice(project);
      if (initAgent) await agent.init(initPayload);
      if (connectBroker) await agent._connectToMQTTBroker();
      if (disconnectAfterConnecting) await agent._closeConnectionWithBroker();

      initialMQTTClient = agent._mqttClient;

      mqtt.mockSetInternetConnection(internetConnection);

      if (endThrows && agent._mqttClient)
        agent._mqttClient.end = jest.fn(() => {
          throw new Error("testError");
        });

      if (publishThrows && agent._mqttClient)
        agent._mqttClient.publish = jest.fn(() => {
          throw new Error("testError");
        });

      return agent._sendData(payloadToSend);
    };

    it("should split messages according to mqttMessagesLimit and publish them", async () => {
      await exec();

      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(2);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      expect(agent._mqttClient.publish.mock.calls[1][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[1][1]).toEqual(
        expectedCommands[1]
      );
      expect(agent._mqttClient.publish.mock.calls[1][2]).toEqual({ qos: qos });
    });

    it("should publish one huge message - if mqttMessagesLimit is greater than messages in payload", async () => {
      mqttMessagesLimit = 11;

      await exec();

      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should not throw - if there is no internet connection and publish does not hang, qos set to 0", async () => {
      qos = 0;

      await exec();

      await snooze(2 * publishTimeout);

      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(2);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      expect(agent._mqttClient.publish.mock.calls[1][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[1][1]).toEqual(
        expectedCommands[1]
      );
      expect(agent._mqttClient.publish.mock.calls[1][2]).toEqual({ qos: qos });
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 1", async () => {
      qos = 1;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
      ];

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 2", async () => {
      qos = 2;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
      ];

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw if publish throws", async () => {
      publishThrows = true;

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

      expect(error.message).toEqual("testError");

      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
      ];
      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //end should not have been called
      expect(agent._mqttClient.end).not.toHaveBeenCalled();
    });

    it("should should connect if device is not connected but was previously connected", async () => {
      disconnectAfterConnecting = true;

      await exec();

      //agent should have new mqtt client
      expect(agent._mqttClient).not.toEqual(initialMQTTClient);

      //connect async of new mqtt client should have been called

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",

        reconnectPeriod: 0,
        connectTimeout: 100,
      };

      //First time connect is called during firt connection - next during sending data
      expect(mqtt.connectAsync).toHaveBeenCalledTimes(2);
      expect(mqtt.connectAsync.mock.calls[1][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[1][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[1][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);

      //Commands should have been called normally
      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(2);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      expect(agent._mqttClient.publish.mock.calls[1][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[1][1]).toEqual(
        expectedCommands[1]
      );
      expect(agent._mqttClient.publish.mock.calls[1][2]).toEqual({ qos: qos });
    });

    it("should should connect if device is not connected and has never been connected", async () => {
      connectBroker = false;
      disconnectAfterConnecting = false;

      await exec();

      //connect async of new mqtt client should have been called

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",

        reconnectPeriod: 0,
        connectTimeout: 100,
      };

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
      expect(mqtt.connectAsync.mock.calls[0][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[0][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[0][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);

      //Commands should have been called normally
      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
        "200,testElement3Group,testElement3Name,3002.3002,testElement3Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement1Group,testElement1Name,1003.100,testElement1Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:02.000Z\n" +
          "200,testElement3Group,testElement3Name,3003.3003,testElement3Unit,2020-12-04T16:40:02.000Z\n",
      ];

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(2);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      expect(agent._mqttClient.publish.mock.calls[1][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[1][1]).toEqual(
        expectedCommands[1]
      );
      expect(agent._mqttClient.publish.mock.calls[1][2]).toEqual({ qos: qos });
    });

    it("should should throw if device is not connected and there is no internet connection to connect it", async () => {
      disconnectAfterConnecting = true;

      internetConnection = false;

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

      expect(error.message).toEqual("Cannot connect - no internet connection");

      //Commands should not have been called
      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should should throw if device is not connected and connect throws", async () => {
      disconnectAfterConnecting = true;

      //connect throws if there is no internet connection
      internetConnection = false;

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

      expect(error.message).toEqual("Cannot connect - no internet connection");

      //Commands should not have been called
      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should throw if there was a timeout while publishing and end connection throws an error", async () => {
      endThrows = true;
      //Internet connection set to false - in order for publish to hang
      internetConnection = false;

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

      expect(error.message).toEqual(
        "Error while disconnecting after message timeout"
      );

      let expectedCommands = [
        "200,testElement1Group,testElement1Name,1001.100,testElement1Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement3Group,testElement3Name,3001.3001,testElement3Unit,2020-12-04T16:40:00.000Z\n" +
          "200,testElement1Group,testElement1Name,1002.100,testElement1Unit,2020-12-04T16:40:01.000Z\n" +
          "200,testElement2Group,testElement2Name,2.00e+3,testElement2Unit,2020-12-04T16:40:01.000Z\n",
      ];

      //publish should have been called
      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        expectedCommands[0]
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should not throw but not send anything - if payload is empty", async () => {
      payloadToSend = {};

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if payload is null", async () => {
      payloadToSend = null;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if payload is undefined", async () => {
      payloadToSend = undefined;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not connect - if payload is empty and device is not connected", async () => {
      disconnectAfterConnecting = true;

      payloadToSend = {};

      await exec();

      await snooze(2 * publishTimeout);

      //Connect should have been called only once - during tests initialization
      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });
  });

  describe("_sendEvent", () => {
    let project;
    let agent;
    let getElementMockFunc;
    let getElementReturnValue;
    let initPayload;
    let internetConnection;
    let initAgent;
    let connectBroker;
    let disconnectAfterConnecting;
    let qos;
    let publishTimeout;
    let endThrows;
    let publishThrows;
    let mqttMessagesLimit;
    let initialMQTTClient;
    let tickId;
    let elementId;
    let value;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      mqttMessagesLimit = 5;
      qos = 1;
      publishTimeout = 100;

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "MSMQTTAgentDevice",
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
            groupName: "testElement1Group",
            variableName: "testElement1Name",
            variableUnit: "testElement1Unit",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            groupName: "testElement2Group",
            variableName: "testElement2Name",
            variableUnit: "testElement2Unit",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            groupName: "testElement3Group",
            variableName: "testElement3Name",
            variableUnit: "testElement3Unit",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            severity: 20,
            eventName: "testElement1Event",
            eventType: "EVENT",
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            severity: 30,
            eventName: "testElement2Alert",
            eventType: "ALERT",
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            severity: 40,
            eventName: "testElement3Event",
            eventType: "EVENT",
          },
        },
        mqttName: "testMQTTName",
        clientId: "testMQTTClientId",
        checkStateInterval: 123,
        model: "testModel",
        revision: "testRevision",
        tenantName: "testTenant",
        userName: "testUserName",
        userPassword: "testUserPassword",
        serialNumber: "testSerialNumber",
        mqttMessagesLimit: 5,
        qos: 1,
        publishTimeout: 1234,
        reconnectInterval: 4321,
      };

      internetConnection = true;

      initAgent = true;

      connectBroker = true;
      disconnectAfterConnecting = false;
      endThrows = false;
      publishThrows = false;

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
      initPayload.mqttMessagesLimit = mqttMessagesLimit;
      initPayload.qos = qos;
      initPayload.publishTimeout = publishTimeout;

      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      mqtt.mockSetInternetConnection(true);

      agent = new MSMQTTAgentDevice(project);
      if (initAgent) await agent.init(initPayload);
      if (connectBroker) await agent._connectToMQTTBroker();
      if (disconnectAfterConnecting) await agent._closeConnectionWithBroker();

      initialMQTTClient = agent._mqttClient;

      mqtt.mockSetInternetConnection(internetConnection);

      if (endThrows && agent._mqttClient)
        agent._mqttClient.end = jest.fn(() => {
          throw new Error("testError");
        });

      if (publishThrows && agent._mqttClient)
        agent._mqttClient.publish = jest.fn(() => {
          throw new Error("testError");
        });

      return agent._sendEvent(tickId, elementId, value);
    };

    it("should publish event", async () => {
      await exec();

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should not throw - if there is no internet connection and publish does not hang, qos set to 0", async () => {
      qos = 0;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 1", async () => {
      qos = 1;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw after publish timeout and disconnect - if there is no internet connection and publish method hangs, qos set to 2", async () => {
      qos = 2;
      internetConnection = false;
      let startDate = Date.now();

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

      let stopDate = Date.now();

      expect(stopDate - startDate).toBeGreaterThanOrEqual(publishTimeout);

      expect(error.message).toEqual("Publish MQTT message timeout...");

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should throw if publish throws", async () => {
      publishThrows = true;

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

      expect(error.message).toEqual("testError");

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //end should not have been called
      expect(agent._mqttClient.end).not.toHaveBeenCalled();
    });

    it("should should connect if device is not connected but was previously connected", async () => {
      disconnectAfterConnecting = true;

      await exec();

      //agent should have new mqtt client
      expect(agent._mqttClient).not.toEqual(initialMQTTClient);

      //connect async of new mqtt client should have been called

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",

        reconnectPeriod: 0,
        connectTimeout: 100,
      };

      //First time connect is called during firt connection - next during sending data
      expect(mqtt.connectAsync).toHaveBeenCalledTimes(2);
      expect(mqtt.connectAsync.mock.calls[1][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[1][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[1][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);

      //Commands should have been called normally

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should should connect if device is not connected and has never been connected", async () => {
      connectBroker = false;
      disconnectAfterConnecting = false;

      await exec();

      //connect async of new mqtt client should have been called

      let expectedParams = {
        port: 1883,
        clientId: "testMQTTClientId",
        username: `testTenant/testUserName`,
        password: "testUserPassword",
        device_name: "testMQTTClientId",
        tenant: "testTenant",
        protocol: "mqtt/tcp",
        host: "mciotextension.eu1.mindsphere.io",

        reconnectPeriod: 0,
        connectTimeout: 100,
      };

      expect(mqtt.connectAsync).toHaveBeenCalledTimes(1);
      expect(mqtt.connectAsync.mock.calls[0][0]).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );
      expect(mqtt.connectAsync.mock.calls[0][1]).toEqual(expectedParams);
      expect(mqtt.connectAsync.mock.calls[0][2]).toEqual(false);

      expect(agent._mqttClient).toBeDefined();
      expect(agent._mqttClient instanceof mqtt.MockClient).toEqual(true);

      expect(agent._mqttClient.mockUrl).toEqual(
        "testTenant.mciotextension.eu1.mindsphere.io"
      );

      expect(agent._mqttClient.mockConnectionParams).toEqual(expectedParams);

      //Commands should have been called normally

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });
    });

    it("should should throw if device is not connected and there is no internet connection to connect it", async () => {
      disconnectAfterConnecting = true;

      internetConnection = false;

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

      expect(error.message).toEqual("Cannot connect - no internet connection");

      //Commands should not have been called
      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should should throw if device is not connected and connect throws", async () => {
      disconnectAfterConnecting = true;

      //connect throws if there is no internet connection
      internetConnection = false;

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

      expect(error.message).toEqual("Cannot connect - no internet connection");

      //Commands should not have been called
      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should throw if there was a timeout while publishing and end connection throws an error", async () => {
      endThrows = true;
      //Internet connection set to false - in order for publish to hang
      internetConnection = false;

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

      expect(error.message).toEqual(
        "Error while disconnecting after message timeout"
      );

      expect(agent._mqttClient.publish).toHaveBeenCalledTimes(1);

      expect(agent._mqttClient.publish.mock.calls[0][0]).toEqual("s/us");
      expect(agent._mqttClient.publish.mock.calls[0][1]).toEqual(
        `302,testElement2Alert,"{""pl"":""fakeTestTextPL"",""en"":""fakeTestTextEN""}",2020-12-04T16:40:00.000Z`
      );
      expect(agent._mqttClient.publish.mock.calls[0][2]).toEqual({ qos: qos });

      //than end should be called with flag force
      expect(agent._mqttClient.end).toHaveBeenCalledTimes(1);
      expect(agent._mqttClient.end.mock.calls[0][0]).toEqual(true);
      expect(agent._mqttClient.end).toHaveBeenCalledAfter(
        agent._mqttClient.publish
      );
    });

    it("should not throw but not send anything - if tickId is undefined", async () => {
      tickId = undefined;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if elementId is undefined", async () => {
      elementId = undefined;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if value is undefined", async () => {
      value = undefined;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if tickId is null", async () => {
      tickId = null;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if elementId is null", async () => {
      elementId = null;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if value is null", async () => {
      value = null;

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });

    it("should not throw but not send anything - if there is no element of given elementId", async () => {
      elementId = "fakeElementId";

      await exec();

      await snooze(2 * publishTimeout);

      expect(agent._mqttClient.publish).not.toHaveBeenCalled();
    });
  });
});
