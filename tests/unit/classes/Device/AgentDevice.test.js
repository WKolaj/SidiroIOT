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

  describe("_getAndSaveElementsDataToClipboardIfFitsSendingInterval", () => {
    let project;
    let payload;
    let device;
    let variable1;
    let variable1ID;
    let variable1Value;
    let variable1LastValueTick;
    let variable2;
    let variable2ID;
    let variable2Value;
    let variable2LastValueTick;
    let variable3;
    let variable3ID;
    let variable3Value;
    let variable3LastValueTick;
    let getElementMockFunc;
    let lastDataValues;
    let dataClipboardContent;
    let elementId;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      variable1ID = "variable1ID";
      variable1Value = 1001;
      variable1LastValueTick = 101;

      variable2ID = "variable2ID";
      variable2Value = 1002;
      variable2LastValueTick = 102;

      variable3ID = "variable3ID";
      variable3Value = 1003;
      variable3LastValueTick = 103;

      getElementMockFunc = (deviceId, variableId) => {
        switch (variableId) {
          case variable1ID: {
            return variable1;
          }
          case variable2ID: {
            return variable2;
          }
          case variable3ID: {
            return variable3;
          }
          default: {
            return null;
          }
        }
      };

      project = {
        AgentDirPath: AgentDirPath,
        getElement: getElementMockFunc,
      };

      lastDataValues = {};
      dataClipboardContent = {};

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
          [variable1ID]: {
            elementId: variable1ID,
            deviceId: "testDevice1ID",
            sendingInterval: 10,
          },
          [variable2ID]: {
            elementId: variable2ID,
            deviceId: "testDevice1ID",
            sendingInterval: 20,
          },
          [variable3ID]: {
            elementId: variable3ID,
            deviceId: "testDevice1ID",
            sendingInterval: 30,
          },
        },
        eventsToSendConfig: {},
      };

      elementId = "variable2ID";
      tickId = 1000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      variable1 = {
        ID: variable1ID,
        LastValueTick: variable1LastValueTick,
        Value: variable1Value,
      };

      variable2 = {
        ID: variable2ID,
        LastValueTick: variable2LastValueTick,
        Value: variable2Value,
      };

      variable3 = {
        ID: variable3ID,
        LastValueTick: variable3LastValueTick,
        Value: variable3Value,
      };

      device = new AgentDevice(project);

      await device.init(payload);

      device._lastDataValues = lastDataValues;
      device._dataClipboard._data = dataClipboardContent;

      return device._getAndSaveElementsDataToClipboardIfFitsSendingInterval(
        elementId,
        tickId
      );
    };

    it("should assign value to lastDataValue and to clipboard - if elements sending interval fits tickId", async () => {
      lastDataValues = {};
      dataClipboardContent = {};

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
      });
    });

    it("should not assign value to lastDataValue nor to clipboard - if elements sending interval does not fit tickId", async () => {
      lastDataValues = {
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      };
      dataClipboardContent = {
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      };

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 11;

      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      });
    });

    it("should not assign value to lastDataValue nor to clipboard - if element config does not exist", async () => {
      lastDataValues = {
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      };
      dataClipboardContent = {
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      };

      delete payload.dataToSendConfig.variable2ID;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      });
    });

    it("should not assign value to lastDataValue nor to clipboard - if element does not exist", async () => {
      lastDataValues = {
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      };
      dataClipboardContent = {
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      };

      elementId = "variable4ID";

      payload.dataToSendConfig.variable4ID = {
        elementId: "variable4ID",
        deviceId: "testDevice1ID",
        sendingInterval: 40,
      };

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      });
    });

    it("should assign value to clipboard - if clipboard is not empty with different tickId and different vairableID", async () => {
      lastDataValues = {};
      dataClipboardContent = {
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      };

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      });
    });

    it("should assign value to clipboard - if clipboard is not empty with the same tickId but different vairableID", async () => {
      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      lastDataValues = {};
      dataClipboardContent = {
        [variable2LastValueTick]: {
          [variable1ID]: variable1Value,
          [variable3ID]: variable3Value,
        },
      };

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: {
          [variable1ID]: variable1Value,
          [variable3ID]: variable3Value,
          [variable2ID]: variable2Value,
        },
      });
    });

    it("should assign value to clipboard - if clipboard is not empty with the same tickId and the same variableID but different value", async () => {
      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      lastDataValues = {};
      dataClipboardContent = {
        [variable2LastValueTick]: {
          [variable1ID]: variable1Value,
          [variable2ID]: 123.456,
          [variable3ID]: variable3Value,
        },
      };

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: {
          [variable1ID]: variable1Value,
          [variable3ID]: variable3Value,
          [variable2ID]: variable2Value,
        },
      });
    });

    it("should assign value to clipboard - if clipboard is not empty with the same tickId and the same variableID and the same value", async () => {
      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      lastDataValues = {};
      dataClipboardContent = {
        [variable2LastValueTick]: {
          [variable1ID]: variable1Value,
          [variable2ID]: variable2Value,
          [variable3ID]: variable3Value,
        },
      };

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: {
          [variable1ID]: variable1Value,
          [variable3ID]: variable3Value,
          [variable2ID]: variable2Value,
        },
      });
    });

    it("should assign value to lastDataValue and to clipboard - if lastDataValue is already with some data of different variables", async () => {
      lastDataValues = {
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      };
      dataClipboardContent = {};

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
      });
    });

    it("should assign value to lastDataValue and to clipboard - if lastDataValue is already with some data of the same variable but different tickId", async () => {
      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      lastDataValues = {
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick - 1,
          value: variable2Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      };
      dataClipboardContent = {};

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
      });
    });

    it("should assign value to lastDataValue and to clipboard - if lastDataValue is already with some data of the same variable but different value", async () => {
      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      lastDataValues = {
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value - 1,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      };
      dataClipboardContent = {};

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
      });
    });

    it("should not assign value to clipboard - if lastDataValue is already with some data of the same variable with the same value and tickId", async () => {
      variable2LastValueTick = 123;
      variable2ID = "variable2ID";
      variable2Value = 456;

      lastDataValues = {
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
      };
      dataClipboardContent = {};

      elementId = "variable2ID";
      tickId = 1000;
      payload.dataToSendConfig.variable2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({});

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable3ID]: {
          tickId: variable3LastValueTick,
          value: variable3Value,
        },
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
      });
    });
  });

  describe("_getAndSaveElementsEventToClipboardIfFitsSendingInterval", () => {
    let project;
    let payload;
    let device;
    let alert1;
    let alert1ID;
    let alert1Value;
    let alert1LastValueTick;
    let alert2;
    let alert2ID;
    let alert2Value;
    let alert2LastValueTick;
    let alert3;
    let alert3ID;
    let alert3Value;
    let alert3LastValueTick;
    let getElementMockFunc;
    let lastEventValues;
    let eventClipboardContent;
    let elementId;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      alert1ID = "alert1ID";
      alert1Value = "alert1 - alert text";
      alert1LastValueTick = 101;

      alert2ID = "alert2ID";
      alert2Value = "alert2 - alert text";
      alert2LastValueTick = 102;

      alert3ID = "alert3ID";
      alert3Value = "alert3 - alert text";
      alert3LastValueTick = 103;

      getElementMockFunc = (deviceId, alertId) => {
        switch (alertId) {
          case alert1ID: {
            return alert1;
          }
          case alert2ID: {
            return alert2;
          }
          case alert3ID: {
            return alert3;
          }
          default: {
            return null;
          }
        }
      };

      project = {
        AgentDirPath: AgentDirPath,
        getElement: getElementMockFunc,
      };

      lastEventValues = {};
      eventClipboardContent = {};

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
          [alert1ID]: {
            elementId: alert1ID,
            deviceId: "testDevice1ID",
            sendingInterval: 10,
          },
          [alert2ID]: {
            elementId: alert2ID,
            deviceId: "testDevice1ID",
            sendingInterval: 20,
          },
          [alert3ID]: {
            elementId: alert3ID,
            deviceId: "testDevice1ID",
            sendingInterval: 30,
          },
        },
      };

      elementId = "alert2ID";
      tickId = 1000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      alert1 = {
        ID: alert1ID,
        LastValueTick: alert1LastValueTick,
        Value: alert1Value,
      };

      alert2 = {
        ID: alert2ID,
        LastValueTick: alert2LastValueTick,
        Value: alert2Value,
      };

      alert3 = {
        ID: alert3ID,
        LastValueTick: alert3LastValueTick,
        Value: alert3Value,
      };

      device = new AgentDevice(project);

      await device.init(payload);

      device._lastEventValues = lastEventValues;
      device._eventClipboard._data = eventClipboardContent;

      return device._getAndSaveElementsEventToClipboardIfFitsSendingInterval(
        elementId,
        tickId
      );
    };

    it("should assign value to lastEventValues and to clipboard - if elements sending interval fits tickId", async () => {
      lastEventValues = {};
      eventClipboardContent = [];

      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "alert2 - test texts";

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
      });
    });

    it("should not assign value to lastEventValues nor to clipboard - if elements sending interval does not fit tickId", async () => {
      lastEventValues = {
        [alert1LastValueTick]: { [alert1ID]: alert1Value },
        [alert3LastValueTick]: { [alert3ID]: alert3Value },
      };
      eventClipboardContent = [
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },

        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ];

      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 11;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "alert2 - test texts";

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },

        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert1LastValueTick]: { [alert1ID]: alert1Value },
        [alert3LastValueTick]: { [alert3ID]: alert3Value },
      });
    });

    it("should not assign value to lastEventValues nor to clipboard - if element config does not exist", async () => {
      lastEventValues = {
        [alert1LastValueTick]: { [alert1ID]: alert1Value },
        [alert3LastValueTick]: { [alert3ID]: alert3Value },
      };
      eventClipboardContent = [
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },

        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ];

      delete payload.eventsToSendConfig.alert2ID;

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },

        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert1LastValueTick]: { [alert1ID]: alert1Value },
        [alert3LastValueTick]: { [alert3ID]: alert3Value },
      });
    });

    it("should not assign value to lastEventValues nor to clipboard - if element does not exist", async () => {
      lastEventValues = {
        [alert1LastValueTick]: { [alert1ID]: alert1Value },
        [alert3LastValueTick]: { [alert3ID]: alert3Value },
      };
      eventClipboardContent = [
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ];

      elementId = "alert4ID";

      payload.eventsToSendConfig.alert4ID = {
        elementId: "alert4ID",
        deviceId: "testDevice1ID",
        sendingInterval: 40,
      };

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert1LastValueTick]: { [alert1ID]: alert1Value },
        [alert3LastValueTick]: { [alert3ID]: alert3Value },
      });
    });

    it("should assign value to clipboard - if clipboard is not empty with different tickId and different vairableID", async () => {
      lastEventValues = {};
      eventClipboardContent = [
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ];

      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "alert2 - test texts";

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);
    });

    it("should assign value to clipboard - if clipboard is not empty with the same tickId but different variableID", async () => {
      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "alert2 - test texts";

      lastEventValues = {};
      eventClipboardContent = [
        {
          tickId: alert2LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ];

      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert2LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);
    });

    it("should assign value to clipboard - if clipboard is not empty with the same tickId and the same variableID but different value", async () => {
      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "alert2 - test texts";

      lastEventValues = {};
      eventClipboardContent = [
        {
          tickId: alert2LastValueTick,
          elementId: alert3ID,
          value: alert2Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ];

      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert2LastValueTick,
          elementId: alert3ID,
          value: alert2Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);
    });

    it("should assign value to clipboard once again - if clipboard is not empty with the same tickId and the same variableID and the same value", async () => {
      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "alert2 - test texts";

      lastEventValues = {};
      eventClipboardContent = [
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
      ];

      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      await exec();

      //value should be assigned to events clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert3LastValueTick,
          elementId: alert3ID,
          value: alert3Value,
        },
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
        {
          tickId: alert1LastValueTick,
          elementId: alert1ID,
          value: alert1Value,
        },
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);
    });

    it("should assign value to lastEventValues and to clipboard - if lastEventValues is already with some data of different variables", async () => {
      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "test alert2 text";

      lastEventValues = {
        [alert3ID]: {
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      };
      eventClipboardContent = [];

      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      await exec();

      //vale should be assinged to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert3ID]: {
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
      });
    });

    it("should assign value to lastEventValues and to clipboard - if lastEventValues is already with some data of the same variable but different tickId", async () => {
      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "test alert2 text";

      lastEventValues = {
        [alert2ID]: {
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      };
      eventClipboardContent = [];

      await exec();

      //vale should be assinged to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      });
    });

    it("should assign value to lastEventValues and to clipboard - if lastEventValues is already with some data of the same variable but different tickId", async () => {
      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "test alert2 text";

      lastEventValues = {
        [alert2ID]: {
          tickId: alert3LastValueTick,
          value: alert2Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      };
      eventClipboardContent = [];

      await exec();

      //vale should be assinged to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      });
    });

    it("should assign value to lastEventValues and to clipboard - if lastEventValues is already with some data of the same variable but different value", async () => {
      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "test alert2 text";

      lastEventValues = {
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert3Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      };
      eventClipboardContent = [];

      await exec();

      //vale should be assinged to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          tickId: alert2LastValueTick,
          elementId: alert2ID,
          value: alert2Value,
        },
      ]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      });
    });

    it("should not assign value to clipboard - if lastEventValues is already with some data of the same variable with the same value and tickId", async () => {
      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = "test alert2 text";

      lastEventValues = {
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      };
      eventClipboardContent = [];

      await exec();

      //vale should be assinged to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      });
    });

    it("should not assign value to clipboard but to lastEventValue - if lastEventValues is already with some data of the same variable with the same tickId but not the same variable - new variable value is null", async () => {
      elementId = "alert2ID";
      tickId = 1000;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 20;

      alert2LastValueTick = 123;
      alert2ID = "alert2ID";
      alert2Value = null;

      lastEventValues = {
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: "some test text",
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      };
      eventClipboardContent = [];

      await exec();

      //vale should not be assinged to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([]);

      //value should be assigned to lastEventData
      let newLastEventValues = device._lastEventValues;

      expect(newLastEventValues).toEqual({
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      });
    });
  });

  describe("_getAndSaveDataToClipboard", () => {
    let project;
    let payload;
    let device;
    let variable1;
    let variable1ID;
    let variable1Value;
    let variable1LastValueTick;
    let variable2;
    let variable2ID;
    let variable2Value;
    let variable2LastValueTick;
    let variable3;
    let variable3ID;
    let variable3Value;
    let variable3LastValueTick;
    let variable4;
    let variable4ID;
    let variable4Value;
    let variable4LastValueTick;
    let variable5;
    let variable5ID;
    let variable5Value;
    let variable5LastValueTick;
    let getElementMockFunc;
    let lastDataValues;
    let dataClipboardContent;
    let getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      variable1ID = "variable1ID";
      variable1Value = 1001;
      variable1LastValueTick = 101;

      variable2ID = "variable2ID";
      variable2Value = 1002;
      variable2LastValueTick = 102;

      variable3ID = "variable3ID";
      variable3Value = 1003;
      variable3LastValueTick = 103;

      variable4ID = "variable4ID";
      variable4Value = 1004;
      variable4LastValueTick = 104;

      variable5ID = "variable5ID";
      variable5Value = 1005;
      variable5LastValueTick = 105;

      getElementMockFunc = (deviceId, variableId) => {
        switch (variableId) {
          case variable1ID: {
            return variable1;
          }
          case variable2ID: {
            return variable2;
          }
          case variable3ID: {
            return variable3;
          }
          case variable4ID: {
            return variable4;
          }
          case variable5ID: {
            return variable5;
          }
          default: {
            return null;
          }
        }
      };

      project = {
        AgentDirPath: AgentDirPath,
        getElement: getElementMockFunc,
      };

      lastDataValues = {};
      dataClipboardContent = {};

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
          [variable1ID]: {
            elementId: variable1ID,
            deviceId: "testDevice1ID",
            sendingInterval: 10,
          },
          [variable2ID]: {
            elementId: variable2ID,
            deviceId: "testDevice1ID",
            sendingInterval: 20,
          },
          [variable3ID]: {
            elementId: variable3ID,
            deviceId: "testDevice1ID",
            sendingInterval: 30,
          },
        },
        eventsToSendConfig: {},
      };

      tickId = 1000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      variable1 = {
        ID: variable1ID,
        LastValueTick: variable1LastValueTick,
        Value: variable1Value,
      };

      variable2 = {
        ID: variable2ID,
        LastValueTick: variable2LastValueTick,
        Value: variable2Value,
      };

      variable3 = {
        ID: variable3ID,
        LastValueTick: variable3LastValueTick,
        Value: variable3Value,
      };

      variable4 = {
        ID: variable4ID,
        LastValueTick: variable4LastValueTick,
        Value: variable4Value,
      };

      variable5 = {
        ID: variable5ID,
        LastValueTick: variable5LastValueTick,
        Value: variable5Value,
      };

      device = new AgentDevice(project);

      await device.init(payload);

      device._lastDataValues = lastDataValues;
      device._dataClipboard._data = dataClipboardContent;

      getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc = jest.fn(
        device._getAndSaveElementsDataToClipboardIfFitsSendingInterval
      );
      device._getAndSaveElementsDataToClipboardIfFitsSendingInterval = getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc;

      return device._getAndSaveDataToClipboard(tickId);
    };

    it("should call _getAndSaveElementsEventToClipboardIfFitsSendingInterval - for every elements from dataConfig", async () => {
      await exec();

      expect(
        getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc
      ).toHaveBeenCalledTimes(3);

      expect(
        getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[0][0]
      ).toEqual(variable1ID);
      expect(
        getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[0][1]
      ).toEqual(tickId);

      expect(
        getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[1][0]
      ).toEqual(variable2ID);
      expect(
        getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[1][1]
      ).toEqual(tickId);

      expect(
        getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[2][0]
      ).toEqual(variable3ID);
      expect(
        getAndSaveElementsDataToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[2][1]
      ).toEqual(tickId);
    });

    it("should assign all values to lastDataValue and to clipboards - for every elements from data that's sendingInterval fits tickNumber", async () => {
      tickId = 1000;

      payload.dataToSendConfig.variable1ID.sendingInterval = 1;
      payload.dataToSendConfig.variable2ID.sendingInterval = 2;
      payload.dataToSendConfig.variable3ID.sendingInterval = 3;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
      });
    });

    it("should assign all values to lastDataValue and to clipboards - for every elements from data that's sendingInterval fits tickNumber and is different then in lastDataValues", async () => {
      tickId = 1000;

      lastDataValues = {
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
        [variable2ID]: {
          tickId: 123,
          value: 456,
        },
      };

      payload.dataToSendConfig.variable1ID.sendingInterval = 1;
      payload.dataToSendConfig.variable2ID.sendingInterval = 2;
      payload.dataToSendConfig.variable3ID.sendingInterval = 3;

      await exec();

      //value should be assigned to data clipboard
      let clipboardContent = device._dataClipboard.getAllData();
      expect(clipboardContent).toEqual({
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
      });

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastDataValues;

      expect(newLastDataValues).toEqual({
        [variable1ID]: {
          tickId: variable1LastValueTick,
          value: variable1Value,
        },
        [variable2ID]: {
          tickId: variable2LastValueTick,
          value: variable2Value,
        },
      });
    });
  });

  describe("_getAndSaveEventToClipboard", () => {
    let project;
    let payload;
    let device;
    let alert1;
    let alert1ID;
    let alert1Value;
    let alert1LastValueTick;
    let alert2;
    let alert2ID;
    let alert2Value;
    let alert2LastValueTick;
    let alert3;
    let alert3ID;
    let alert3Value;
    let alert3LastValueTick;
    let alert4;
    let alert4ID;
    let alert4Value;
    let alert4LastValueTick;
    let alert5;
    let alert5ID;
    let alert5Value;
    let alert5LastValueTick;
    let getElementMockFunc;
    let lastEventValues;
    let eventClipboardContent;
    let getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      alert1ID = "alert1ID";
      alert1Value = "test text 1";
      alert1LastValueTick = 101;

      alert2ID = "alert2ID";
      alert2Value = "test text 2";
      alert2LastValueTick = 102;

      alert3ID = "alert3ID";
      alert3Value = "test text 3";
      alert3LastValueTick = 103;

      alert4ID = "alert4ID";
      alert4Value = "test text 4";
      alert4LastValueTick = 104;

      alert5ID = "alert5ID";
      alert5Value = "test text 5";
      alert5LastValueTick = 105;

      getElementMockFunc = (deviceId, variableId) => {
        switch (variableId) {
          case alert1ID: {
            return alert1;
          }
          case alert2ID: {
            return alert2;
          }
          case alert3ID: {
            return alert3;
          }
          case alert4ID: {
            return alert4;
          }
          case alert5ID: {
            return alert5;
          }
          default: {
            return null;
          }
        }
      };

      project = {
        AgentDirPath: AgentDirPath,
        getElement: getElementMockFunc,
      };

      lastEventValues = {};
      eventClipboardContent = [];

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
          [alert1ID]: {
            elementId: alert1ID,
            deviceId: "testDevice1ID",
            sendingInterval: 10,
          },
          [alert2ID]: {
            elementId: alert2ID,
            deviceId: "testDevice1ID",
            sendingInterval: 20,
          },
          [alert3ID]: {
            elementId: alert3ID,
            deviceId: "testDevice1ID",
            sendingInterval: 30,
          },
        },
      };

      tickId = 1000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      alert1 = {
        ID: alert1ID,
        LastValueTick: alert1LastValueTick,
        Value: alert1Value,
      };

      alert2 = {
        ID: alert2ID,
        LastValueTick: alert2LastValueTick,
        Value: alert2Value,
      };

      alert3 = {
        ID: alert3ID,
        LastValueTick: alert3LastValueTick,
        Value: alert3Value,
      };

      alert4 = {
        ID: alert4ID,
        LastValueTick: alert4LastValueTick,
        Value: alert4Value,
      };

      alert5 = {
        ID: alert5ID,
        LastValueTick: alert5LastValueTick,
        Value: alert5Value,
      };

      device = new AgentDevice(project);

      await device.init(payload);

      device._lastEventValues = lastEventValues;
      device._eventClipboard._data = eventClipboardContent;

      getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc = jest.fn(
        device._getAndSaveElementsEventToClipboardIfFitsSendingInterval
      );
      device._getAndSaveElementsEventToClipboardIfFitsSendingInterval = getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc;

      return device._getAndSaveEventsToClipboard(tickId);
    };

    it("should call _getAndSaveElementsEventToClipboardIfFitsSendingInterval - for every elements from dataConfig", async () => {
      await exec();

      expect(
        getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc
      ).toHaveBeenCalledTimes(3);

      expect(
        getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[0][0]
      ).toEqual(alert1ID);
      expect(
        getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[0][1]
      ).toEqual(tickId);

      expect(
        getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[1][0]
      ).toEqual(alert2ID);
      expect(
        getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[1][1]
      ).toEqual(tickId);

      expect(
        getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[2][0]
      ).toEqual(alert3ID);
      expect(
        getAndSaveElementsEventToClipboardIfFitsSendingIntervalMockFunc.mock
          .calls[2][1]
      ).toEqual(tickId);
    });

    it("should assign all values to lastDataValue and to clipboards - for every elements from data that's sendingInterval fits tickNumber", async () => {
      tickId = 1000;

      payload.eventsToSendConfig.alert1ID.sendingInterval = 1;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 2;
      payload.eventsToSendConfig.alert3ID.sendingInterval = 3;

      await exec();

      //value should be assigned to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          elementId: alert1ID,
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
        {
          elementId: alert2ID,
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
      ]);

      //value should be assigned to lastValueData
      let newLastEventsValues = device._lastEventValues;

      expect(newLastEventsValues).toEqual({
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
      });
    });

    it("should assign all values to lastDataValue and to clipboards - for every elements from data that's sendingInterval fits tickNumber and is different then in lastDataValues", async () => {
      tickId = 1000;

      lastEventValues = {
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
        [alert2ID]: {
          tickId: 123,
          value: "fake test text",
        },
      };

      payload.eventsToSendConfig.alert1ID.sendingInterval = 1;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 2;
      payload.eventsToSendConfig.alert3ID.sendingInterval = 3;

      await exec();

      //value should be assigned to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          elementId: alert2ID,
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
      ]);

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastEventValues;

      expect(newLastDataValues).toEqual({
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: alert2Value,
        },
      });
    });

    it("should assign all values to lastDataValue and to clipboards - for every elements from data that's sendingInterval fits tickNumber and is different then in lastDataValues and assign all values to lastDataValue but not to clipboards - for every different value that is now null", async () => {
      tickId = 1000;

      lastEventValues = {
        [alert1ID]: {
          tickId: alert1LastValueTick - 1,
          value: "fake text value1",
        },
        [alert2ID]: {
          tickId: alert2LastValueTick - 1,
          value: "fake text value2",
        },
      };

      alert2Value = null;

      payload.eventsToSendConfig.alert1ID.sendingInterval = 1;
      payload.eventsToSendConfig.alert2ID.sendingInterval = 2;
      payload.eventsToSendConfig.alert3ID.sendingInterval = 3;

      await exec();

      //value should be assigned to event clipboard
      let clipboardContent = device._eventClipboard.getAllData();
      expect(clipboardContent).toEqual([
        {
          elementId: alert1ID,
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
      ]);

      //value should be assigned to lastValueData
      let newLastDataValues = device._lastEventValues;

      expect(newLastDataValues).toEqual({
        [alert1ID]: {
          tickId: alert1LastValueTick,
          value: alert1Value,
        },
        [alert2ID]: {
          tickId: alert2LastValueTick,
          value: null,
        },
      });
    });
  });

  describe("_refreshBoardedState", () => {
    let project;
    let payload;
    let device;
    let boardedInitialState;
    let checkIfBoardedMockFunc;
    let checkIfBoardedMockFuncResult;
    let logActionMock;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
        eventsToSendConfig: {},
      };

      checkIfBoardedMockFuncResult = true;
      checkIfBoardedMockFunc = jest.fn(async () => {
        await snooze(10);
        return checkIfBoardedMockFuncResult;
      });
      boardedInitialState = false;

      //Overwriting logger action method
      logActionMock = jest.fn();
      logger.error = logActionMock;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      await device.init(payload);

      device._checkIfBoarded = checkIfBoardedMockFunc;
      device._boarded = boardedInitialState;

      return device._refreshBoardedState();
    };

    it("should refresh Boarded state based on result of checkIfBoardedMockFunc result - if checkIfBoardedMockFunc returns true", async () => {
      checkIfBoardedMockFuncResult = true;

      await exec();

      expect(device.Boarded).toEqual(true);
    });

    it("should refresh Boarded state based on result of checkIfBoardedMockFunc result", async () => {
      checkIfBoardedMockFuncResult = false;

      await exec();

      expect(device.Boarded).toEqual(false);
    });

    it("should refresh Boarded state based on result of checkIfBoardedMockFunc result - if initialBoardedState is true and now it is true", async () => {
      boardedInitialState = true;
      checkIfBoardedMockFuncResult = true;

      await exec();

      expect(device.Boarded).toEqual(true);
    });

    it("should refresh Boarded state based on result of checkIfBoardedMockFunc result - if initialBoardedState is true and now it is false", async () => {
      boardedInitialState = true;
      checkIfBoardedMockFuncResult = false;

      await exec();

      expect(device.Boarded).toEqual(false);
    });

    it("should call logger.error and set boareded as false but not throw - if checkIfBoarded throws", async () => {
      boardedInitialState = true;

      checkIfBoardedMockFunc = async () => {
        throw new Error("testError");
      };

      await exec();

      expect(device.Boarded).toEqual(false);

      expect(logActionMock).toHaveBeenCalledTimes(1);

      expect(logActionMock.mock.calls[0][0]).toEqual("testError");
    });
  });

  describe("_checkIfShouldBoard", () => {
    let project;
    let payload;
    let device;
    let boardedInitialState;
    let tryBoardOnSendData;
    let tryBoardOnSendEvent;
    let sendDataInterval;
    let sendEventInterval;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
        eventsToSendConfig: {},
      };

      checkIfBoardedMockFuncResult = true;
      checkIfBoardedMockFunc = jest.fn(async () => {
        await snooze(10);
        return checkIfBoardedMockFuncResult;
      });
      boardedInitialState = false;

      sendDataInterval = 15;
      sendEventInterval = 15;

      tryBoardOnSendData = true;
      tryBoardOnSendEvent = true;

      tickId = 1000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      payload.sendDataFileInterval = sendDataInterval;
      payload.sendEventFileInterval = sendEventInterval;

      device = new AgentDevice(project);

      await device.init(payload);

      device._boarded = boardedInitialState;
      device._tryBoardOnSendData = tryBoardOnSendData;
      device._tryBoardOnSendEvent = tryBoardOnSendEvent;

      return device._checkIfShouldBoard(tickId);
    };

    it("should return true - if device is not boarded, sendInterval fits tickId and tryBoardOnSendData is true - boarding on sending event is disabled", async () => {
      sendDataInterval = 10;
      sendEventInterval = 123;

      tryBoardOnSendData = true;
      tryBoardOnSendEvent = false;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false - if device is not boarded, sendInterval doesn't fit tickId and tryBoardOnSendData is true - boarding on sending event is disabled", async () => {
      sendDataInterval = 11;
      sendEventInterval = 123;

      tryBoardOnSendData = true;
      tryBoardOnSendEvent = false;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false - if device is not boarded, sendInterval fits tickId and tryBoardOnSendData is false - boarding on sending event is disabled", async () => {
      sendDataInterval = 10;
      sendEventInterval = 123;

      tryBoardOnSendData = false;
      tryBoardOnSendEvent = false;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return true - if device is not boarded, sendInterval fits tickId and tryBoardOnSendEvent is true - boarding on sending data is disabled", async () => {
      sendDataInterval = 123;
      sendEventInterval = 10;

      tryBoardOnSendData = false;
      tryBoardOnSendEvent = true;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false - if device is not boarded, sendInterval doesn't fit tickId and tryBoardOnSendEvent is true - boarding on sending data is disabled", async () => {
      sendDataInterval = 123;
      sendEventInterval = 11;

      tryBoardOnSendData = false;
      tryBoardOnSendEvent = true;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false - if device is not boarded, sendInterval fits tickId and tryBoardOnSendEvent is false - boarding on sending data is disabled", async () => {
      sendDataInterval = 123;
      sendEventInterval = 10;

      tryBoardOnSendData = false;
      tryBoardOnSendEvent = false;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return true - if device is not boarded, sendInterval fits tickId for event and data and tryBoardOnSendEvent and tryBoardOnSendData is true", async () => {
      sendDataInterval = 10;
      sendEventInterval = 10;

      tryBoardOnSendData = true;
      tryBoardOnSendEvent = true;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false - if device is already boarded", async () => {
      boardedInitialState = true;

      sendDataInterval = 10;
      sendEventInterval = 10;

      tryBoardOnSendData = true;
      tryBoardOnSendEvent = true;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(false);
    });
  });

  describe("_tryBoard", () => {
    let project;
    let payload;
    let device;
    let OnBoardMockFunc;
    let logActionMock;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
        eventsToSendConfig: {},
      };

      OnBoardMockFunc = jest.fn();

      //Overwriting logger action method
      logActionMock = jest.fn();
      logger.error = logActionMock;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      device.OnBoard = OnBoardMockFunc;

      await device.init(payload);

      return device._tryBoard();
    };

    it("should invoke OnBoard", async () => {
      await exec();

      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);
    });

    it("should not throw and call logger - if OnBoard throw", async () => {
      OnBoardMockFunc = () => {
        throw new Error("testError");
      };

      await exec();

      expect(logActionMock).toHaveBeenCalledTimes(1);
      expect(logActionMock.mock.calls[0][0]).toEqual("testError");
    });
  });

  describe("_checkIfDataShouldBeSent", () => {
    let project;
    let payload;
    let device;
    let sendDataInterval;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
        eventsToSendConfig: {},
      };

      sendDataInterval = 15;

      tickId = 1000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      payload.sendDataFileInterval = sendDataInterval;

      device = new AgentDevice(project);

      await device.init(payload);

      return device._checkIfDataShouldBeSent(tickId);
    };

    it("should return true - if tickId fits sendDataInterval", async () => {
      sendDataInterval = 10;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false - if tickId doesn't fit sendDataInterval", async () => {
      sendDataInterval = 10;

      tickId = 1001;

      let result = await exec();

      expect(result).toEqual(false);
    });
  });

  describe("_checkIfEventsShouldBeSent", () => {
    let project;
    let payload;
    let device;
    let sendEventInterval;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
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
        eventsToSendConfig: {},
      };

      sendEventInterval = 15;

      tickId = 1000;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      payload.sendEventFileInterval = sendEventInterval;

      device = new AgentDevice(project);

      await device.init(payload);

      return device._checkIfEventsShouldBeSent(tickId);
    };

    it("should return true - if tickId fits sendEventInterval", async () => {
      sendEventInterval = 10;

      tickId = 1000;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false - if tickId doesn't fit sendEventInterval", async () => {
      sendEventInterval = 10;

      tickId = 1001;

      let result = await exec();

      expect(result).toEqual(false);
    });
  });
});
