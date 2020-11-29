const {
  snooze,
  clearDirectoryAsync,
  createDirIfNotExists,
  checkIfDirectoryExistsAsync,
  createDirAsync,
  writeFileAsync,
  checkIfFileExistsAsync,
} = require("../../../../utilities/utilities");
const {
  createFakeConnectableVariable,
  createFakeAlert,
  createFakeCalcElement,
  wrapMethodToInvokeAfter,
  createFakeProtocolRequest,
  createFakeDevice,
} = require("../../../utilities/testUtilities");
const logger = require("../../../../logger/logger");
const AgentDevice = require("../../../../classes/Device/AgentDevice/AgentDevice");
const path = require("path");
const { Agent } = require("http");

const AgentDirPath = "__testDir/settings/agentsData";

describe("AgentDevice", () => {
  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "testProject";
    });

    let exec = () => {
      return new AgentDevice(project);
    };

    it("should create new AgentDevice and set all properties to null", () => {
      let device = exec();

      this._dirPath = null;
      this._dataClipboard = null;
      this._eventClipboard = null;
      this._tryBoardOnSendData = null;
      this._tryBoardOnSendEvent = null;
      this._lastDataValues = null;
      this._lastEventValues = null;
      this._dataStorage = null;
      this._eventStorage = null;
      this._sendDataFileInterval = null;
      this._sendEventFileInterval = null;
      this._dataStorageSize = null;
      this._eventStorageSize = null;
      this._numberOfDataFilesToSend = null;
      this._numberOfEventFilesToSend = null;
      this._dataToSendConfig = null;
      this._eventsToSendConfig = null;
      this._boarded = null;

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
    });

    it("should assign project to AgentDevice", () => {
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
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentDirPath: AgentDirPath,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
          },
        },
        eventsToSendConfig: {
          testElement4ID: {
            elementId: "testElement4ID",
            deviceId: "testDevice4ID",
            sendingInterval: 400,
          },
          testElement5ID: {
            elementId: "testElement5ID",
            deviceId: "testDevice5ID",
            sendingInterval: 500,
          },
          testElement6ID: {
            elementId: "testElement6ID",
            deviceId: "testDevice6ID",
            sendingInterval: 600,
          },
        },
      };

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      device = new AgentDevice(project);

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
        type: "AgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
            defaultValue: getElementReturnValue.DefaultValue,
            value: getElementReturnValue.DefaultValue,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            lastValueTick: 0,
            deviceId: "deviceID",
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
            lastValueTick: 0,
            deviceId: "deviceID",
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
            lastValueTick: 0,
            deviceId: "deviceID",
            value: 123456.654321,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            lastValueTick: 0,
            deviceId: "deviceID",
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
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
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
          },
        },

        eventsToSendConfig: {
          testElement4ID: {
            elementId: "testElement4ID",
            deviceId: "testDevice4ID",
            sendingInterval: 400,
          },
          testElement5ID: {
            elementId: "testElement5ID",
            deviceId: "testDevice5ID",
            sendingInterval: 500,
          },
          testElement6ID: {
            elementId: "testElement6ID",
            deviceId: "testDevice6ID",
            sendingInterval: 600,
          },
        },
        boarded: false,
      };

      expect(device.generatePayload()).toEqual(expectedPayload);
    });

    it("should initialize storages, clipboards and paths", async () => {
      await exec();

      //Checking main dir path
      let mainDirPath = path.join(AgentDirPath, "deviceID");
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
      expect(device._dataStorage.BufferLength).toEqual(
        payload.numberOfDataFilesToSend
      );

      //Checking storages
      expect(device._eventStorage.DirPath).toEqual(
        path.join(mainDirPath, "eventsToSend")
      );
      expect(device._eventStorage.BufferLength).toEqual(
        payload.numberOfEventFilesToSend
      );
    });

    it("should create agents directories if they not exist", async () => {
      await exec();

      let agentDirPath = path.join(AgentDirPath, "deviceID");

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
      let agentDirPath = path.join(AgentDirPath, "deviceID");

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
      let agentDirPath = path.join(AgentDirPath, "deviceID");
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
      let agentDirPath = path.join(AgentDirPath, "deviceID");
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
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentDirPath: AgentDirPath,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
          },
        },
        eventsToSendConfig: {
          testElement4ID: {
            elementId: "testElement4ID",
            deviceId: "testDevice4ID",
            sendingInterval: 400,
          },
          testElement5ID: {
            elementId: "testElement5ID",
            deviceId: "testDevice5ID",
            sendingInterval: 500,
          },
          testElement6ID: {
            elementId: "testElement6ID",
            deviceId: "testDevice6ID",
            sendingInterval: 600,
          },
        },
      };

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      device = new AgentDevice(project);

      activateMockFunc = jest.fn(device.activate);
      deactivateMockFunc = jest.fn(device.deactivate);

      device.activate = activateMockFunc;
      device.deactivate = deactivateMockFunc;

      await device.init(payload);
      return device.generatePayload();
    };

    it("should return valid payload of AgentDevice", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
            defaultValue: getElementReturnValue.DefaultValue,
            value: getElementReturnValue.DefaultValue,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            lastValueTick: 0,
            deviceId: "deviceID",
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
            lastValueTick: 0,
            deviceId: "deviceID",
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
            lastValueTick: 0,
            deviceId: "deviceID",
            value: 123456.654321,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            lastValueTick: 0,
            deviceId: "deviceID",
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
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
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
          },
        },

        eventsToSendConfig: {
          testElement4ID: {
            elementId: "testElement4ID",
            deviceId: "testDevice4ID",
            sendingInterval: 400,
          },
          testElement5ID: {
            elementId: "testElement5ID",
            deviceId: "testDevice5ID",
            sendingInterval: 500,
          },
          testElement6ID: {
            elementId: "testElement6ID",
            deviceId: "testDevice6ID",
            sendingInterval: 600,
          },
        },
        boarded: false,
      };

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("getRefreshGroupID", () => {
    let project;
    let payload;
    let device;
    let getElementMockFunc;
    let getElementReturnValue;
    let activateMockFunc;
    let deactivateMockFunc;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {
        AgentDirPath: AgentDirPath,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
          },
        },
        eventsToSendConfig: {
          testElement4ID: {
            elementId: "testElement4ID",
            deviceId: "testDevice4ID",
            sendingInterval: 400,
          },
          testElement5ID: {
            elementId: "testElement5ID",
            deviceId: "testDevice5ID",
            sendingInterval: 500,
          },
          testElement6ID: {
            elementId: "testElement6ID",
            deviceId: "testDevice6ID",
            sendingInterval: 600,
          },
        },
      };

      activateMockFunc = jest.fn();
      deactivateMockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      device = new AgentDevice(project);

      activateMockFunc = jest.fn(device.activate);
      deactivateMockFunc = jest.fn(device.deactivate);

      device.activate = activateMockFunc;
      device.deactivate = deactivateMockFunc;

      await device.init(payload);
      return device.getRefreshGroupID();
    };

    it("should return ID of device", async () => {
      let result = await exec();

      expect(result).toEqual("deviceID");
    });
  });
});
