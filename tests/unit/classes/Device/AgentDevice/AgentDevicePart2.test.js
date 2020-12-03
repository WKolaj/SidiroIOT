const {
  snooze,
  clearDirectoryAsync,
  createDirIfNotExists,
  checkIfDirectoryExistsAsync,
  createDirAsync,
  writeFileAsync,
  checkIfFileExistsAsync,
  exists,
  createFileAsync,
  readDirAsync,
  readFileAsync,
} = require("../../../../../utilities/utilities");
const {
  createFakeConnectableVariable,
  createFakeAlert,
  createFakeCalcElement,
  wrapMethodToInvokeAfter,
  createFakeProtocolRequest,
  createFakeDevice,
} = require("../../../../utilities/testUtilities");
const logger = require("../../../../../logger/logger");
const AgentDevice = require("../../../../../classes/Device/AgentDevice/AgentDevice");
const path = require("path");

const AgentsDirPath = "__testDir/settings/agentsData";

describe("AgentDevice", () => {
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
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

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
        AgentsDirPath: AgentsDirPath,
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
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

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
        AgentsDirPath: AgentsDirPath,
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
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

  describe("_checkIfDataShouldBeSent", () => {
    let project;
    let payload;
    let device;
    let sendDataInterval;
    let tickId;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
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
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
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

  describe("_tryMovingDataFromClipboardToStorage", () => {
    let project;
    let payload;
    let device;
    let clipboardData;
    let storageFile1Path;
    let storageFile2Path;
    let storageFile3Path;
    let storageFile1ID;
    let storageFile2ID;
    let storageFile3ID;
    let storageFile1Content;
    let storageFile2Content;
    let storageFile3Content;
    let addStorageFile1;
    let addStorageFile2;
    let addStorageFile3;
    let createDataThrows;
    let logErrorMock;

    beforeEach(async () => {
      createDataThrows = false;

      addStorageFile1 = true;
      addStorageFile2 = true;
      addStorageFile3 = true;

      storageFile1ID = "1606817695038-AKm19eiq";
      storageFile2ID = "1606817695039-BKm19eiq";
      storageFile3ID = "1606817695040-CKm19eiq";

      storageFile1Content = {
        101: {
          elementID1: 111,
          elementID2: 112,
          elementID3: 113,
        },
        102: {
          elementID1: 121,
          elementID2: 122,
          elementID3: 123,
        },
        103: {
          elementID1: 131,
          elementID2: 132,
          elementID3: 133,
        },
      };
      storageFile2Content = {
        201: {
          elementID1: 211,
          elementID2: 212,
          elementID3: 213,
        },
        202: {
          elementID1: 221,
          elementID2: 222,
          elementID3: 223,
        },
        203: {
          elementID1: 231,
          elementID2: 232,
          elementID3: 233,
        },
      };
      storageFile3Content = {
        301: {
          elementID1: 311,
          elementID2: 312,
          elementID3: 313,
        },
        302: {
          elementID1: 321,
          elementID2: 322,
          elementID3: 323,
        },
        303: {
          elementID1: 331,
          elementID2: 332,
          elementID3: 333,
        },
      };

      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
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
        numberOfDataFilesToSend: 4,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {},
      };

      clipboardData = {
        1001: {
          elementID1: 1011,
          elementID2: 1012,
          elementID3: 1013,
        },
        1002: {
          elementID1: 1021,
          elementID2: 1022,
          elementID3: 1023,
        },
        1003: {
          elementID1: 1031,
          elementID2: 1032,
          elementID3: 1033,
        },
      };

      //Overwriting logger action method
      logErrorMock = jest.fn();
      logger.error = logErrorMock;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      await device.init(payload);

      storageFile1Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile1ID}.data`
      );
      storageFile2Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile2ID}.data`
      );
      storageFile3Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile3ID}.data`
      );

      if (addStorageFile1)
        await createFileAsync(
          storageFile1Path,
          JSON.stringify(storageFile1Content)
        );
      if (addStorageFile2)
        await createFileAsync(
          storageFile2Path,
          JSON.stringify(storageFile2Content)
        );
      if (addStorageFile3)
        await createFileAsync(
          storageFile3Path,
          JSON.stringify(storageFile3Content)
        );

      device._dataClipboard._data = clipboardData;

      if (createDataThrows)
        device._dataStorage.createData = jest.fn(() => {
          throw new Error("testError");
        });

      return device._tryMovingDataFromClipboardToStorage();
    };

    it("should move data from clipboard to fileStorage and clear clipboard", async () => {
      await exec();

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //Storage should contain 4 elements
      let storageIDs = await device._dataStorage.getAllIDs();

      expect(storageIDs.length).toEqual(4);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) =>
          item !== storageFile1ID &&
          item !== storageFile2ID &&
          item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._dataStorage.getData(fileID);
      expect(storageContent).toEqual(clipboardData);
    });

    it("should move data from clipboard to fileStorage and delete oldest file and clear clipboard - if buffer length exceeded", async () => {
      payload.dataStorageSize = 3;
      await exec();

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //Storage should contain 3 elements
      let storageIDs = await device._dataStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 2 previous ids - not the first (oldest) one
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) => item !== storageFile2ID && item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._dataStorage.getData(fileID);
      expect(storageContent).toEqual(clipboardData);
    });

    it("should move data from clipboard to fileStorage even if data is an empty object", async () => {
      clipboardData = {};
      await exec();

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //Storage should contain 3 elements
      let storageIDs = await device._dataStorage.getAllIDs();

      expect(storageIDs.length).toEqual(4);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) =>
          item !== storageFile1ID &&
          item !== storageFile2ID &&
          item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._dataStorage.getData(fileID);
      expect(storageContent).toEqual(clipboardData);
    });

    it("should return true if data was moved successfully", async () => {
      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should not throw and return false and not clear clipboard - if createData throws", async () => {
      createDataThrows = true;

      let result = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            result = await exec();
            return resolve(true);
          } catch (err) {
            return reject(err);
          }
        })
      ).resolves.toBeDefined();

      expect(result).toEqual(false);

      //clipboard should not be cleared
      expect(device._dataClipboard.getAllData()).toEqual(clipboardData);

      //logger error should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("testError");
    });
  });

  describe("_trySendingDataFromClipboardAndClearItOrMoveThemToStorage", () => {
    let project;
    let payload;
    let device;
    let clipboardData;
    let storageFile1Path;
    let storageFile2Path;
    let storageFile3Path;
    let storageFile1ID;
    let storageFile2ID;
    let storageFile3ID;
    let storageFile1Content;
    let storageFile2Content;
    let storageFile3Content;
    let addStorageFile1;
    let addStorageFile2;
    let addStorageFile3;
    let logErrorMock;
    let sendDataMockFunc;

    beforeEach(async () => {
      createDataThrows = false;

      addStorageFile1 = true;
      addStorageFile2 = true;
      addStorageFile3 = true;

      storageFile1ID = "1606817695038-AKm19eiq";
      storageFile2ID = "1606817695039-BKm19eiq";
      storageFile3ID = "1606817695040-CKm19eiq";

      storageFile1Content = {
        101: {
          elementID1: 111,
          elementID2: 112,
          elementID3: 113,
        },
        102: {
          elementID1: 121,
          elementID2: 122,
          elementID3: 123,
        },
        103: {
          elementID1: 131,
          elementID2: 132,
          elementID3: 133,
        },
      };
      storageFile2Content = {
        201: {
          elementID1: 211,
          elementID2: 212,
          elementID3: 213,
        },
        202: {
          elementID1: 221,
          elementID2: 222,
          elementID3: 223,
        },
        203: {
          elementID1: 231,
          elementID2: 232,
          elementID3: 233,
        },
      };
      storageFile3Content = {
        301: {
          elementID1: 311,
          elementID2: 312,
          elementID3: 313,
        },
        302: {
          elementID1: 321,
          elementID2: 322,
          elementID3: 323,
        },
        303: {
          elementID1: 331,
          elementID2: 332,
          elementID3: 333,
        },
      };

      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
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
        numberOfDataFilesToSend: 4,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {},
      };

      clipboardData = {
        1001: {
          elementID1: 1011,
          elementID2: 1012,
          elementID3: 1013,
        },
        1002: {
          elementID1: 1021,
          elementID2: 1022,
          elementID3: 1023,
        },
        1003: {
          elementID1: 1031,
          elementID2: 1032,
          elementID3: 1033,
        },
      };

      //Overwriting logger action method
      logErrorMock = jest.fn();
      logger.error = logErrorMock;

      sendDataMockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      await device.init(payload);

      storageFile1Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile1ID}.data`
      );
      storageFile2Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile2ID}.data`
      );
      storageFile3Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile3ID}.data`
      );

      if (addStorageFile1)
        await createFileAsync(
          storageFile1Path,
          JSON.stringify(storageFile1Content)
        );
      if (addStorageFile2)
        await createFileAsync(
          storageFile2Path,
          JSON.stringify(storageFile2Content)
        );
      if (addStorageFile3)
        await createFileAsync(
          storageFile3Path,
          JSON.stringify(storageFile3Content)
        );

      device._dataClipboard._data = clipboardData;

      device._sendData = sendDataMockFunc;

      return device._trySendingDataFromClipboardAndClearItOrMoveThemToStorage();
    };

    it("should return true and invoke sendData with data from clipboard and clear clipboard", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      //Send data should have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(1);

      //Send data should have been called with data from clipboard
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(clipboardData);

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});
    });

    it("should return true but invoke sendData with data from clipboard and clear clipboard - if clipboardData is null", async () => {
      clipboardData = null;

      let result = await exec();

      expect(result).toEqual(true);

      //Send data should have been called
      expect(sendDataMockFunc).not.toHaveBeenCalled();

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});
    });

    it("should return true but invoke sendData with data from clipboard and clear clipboard - if clipboardData an empty object", async () => {
      clipboardData = null;

      let result = await exec();

      expect(result).toEqual(true);

      //Send data should have been called
      expect(sendDataMockFunc).not.toHaveBeenCalled();

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});
    });

    it("should not throw but return false and move clipboard data to storage - if sendData throws", async () => {
      sendDataMockFunc = jest.fn(async () => {
        throw Error("testError");
      });

      let result = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            result = await exec();
            return resolve(true);
          } catch (err) {
            return reject(err);
          }
        })
      ).resolves.toBeDefined();

      expect(result).toEqual(false);

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //Storage should contain 4 elements
      let storageIDs = await device._dataStorage.getAllIDs();

      expect(storageIDs.length).toEqual(4);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) =>
          item !== storageFile1ID &&
          item !== storageFile2ID &&
          item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._dataStorage.getData(fileID);
      expect(storageContent).toEqual(clipboardData);

      //logger should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("testError");
    });

    it("should not throw but return false and move clipboard data to storage and delete oldest file and clear clipboard - if buffer length exceeded", async () => {
      payload.dataStorageSize = 3;

      sendDataMockFunc = jest.fn(async () => {
        throw Error("testError");
      });

      let result = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            result = await exec();
            return resolve(true);
          } catch (err) {
            return reject(err);
          }
        })
      ).resolves.toBeDefined();

      expect(result).toEqual(false);

      //clipboard should be cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //Storage should contain 3 elements
      let storageIDs = await device._dataStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 2 previous ids - not the first (oldest) one
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) => item !== storageFile2ID && item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._dataStorage.getData(fileID);
      expect(storageContent).toEqual(clipboardData);

      //logger should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("testError");
    });
  });

  describe("_trySendingDataFromStorage", () => {
    let project;
    let payload;
    let device;
    let storageFile1Path;
    let storageFile2Path;
    let storageFile3Path;
    let storageFile1ID;
    let storageFile2ID;
    let storageFile3ID;
    let storageFile1Content;
    let storageFile2Content;
    let storageFile3Content;
    let addStorageFile1;
    let addStorageFile2;
    let addStorageFile3;
    let logErrorMock;
    let sendDataMockFunc;
    let getAllIDsThrows;
    let getDataThrows;
    let deleteDataThrows;

    beforeEach(async () => {
      getAllIDsThrows = false;
      getDataThrows = false;
      deleteDataThrows = false;
      createDataThrows = false;

      addStorageFile1 = true;
      addStorageFile2 = true;
      addStorageFile3 = true;

      storageFile1ID = "1606817695038-AKm19eiq";
      storageFile2ID = "1606817695039-BKm19eiq";
      storageFile3ID = "1606817695040-CKm19eiq";

      storageFile1Content = {
        101: {
          elementID1: 111,
          elementID2: 112,
          elementID3: 113,
        },
        102: {
          elementID1: 121,
          elementID2: 122,
          elementID3: 123,
        },
        103: {
          elementID1: 131,
          elementID2: 132,
          elementID3: 133,
        },
      };
      storageFile2Content = {
        201: {
          elementID1: 211,
          elementID2: 212,
          elementID3: 213,
        },
        202: {
          elementID1: 221,
          elementID2: 222,
          elementID3: 223,
        },
        203: {
          elementID1: 231,
          elementID2: 232,
          elementID3: 233,
        },
      };
      storageFile3Content = {
        301: {
          elementID1: 311,
          elementID2: 312,
          elementID3: 313,
        },
        302: {
          elementID1: 321,
          elementID2: 322,
          elementID3: 323,
        },
        303: {
          elementID1: 331,
          elementID2: 332,
          elementID3: 333,
        },
      };

      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
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
        numberOfDataFilesToSend: 4,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {},
      };

      clipboardData = {
        1001: {
          elementID1: 1011,
          elementID2: 1012,
          elementID3: 1013,
        },
        1002: {
          elementID1: 1021,
          elementID2: 1022,
          elementID3: 1023,
        },
        1003: {
          elementID1: 1031,
          elementID2: 1032,
          elementID3: 1033,
        },
      };

      //Overwriting logger action method
      logErrorMock = jest.fn();
      logger.error = logErrorMock;

      sendDataMockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      await device.init(payload);

      storageFile1Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile1ID}.data`
      );
      storageFile2Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile2ID}.data`
      );
      storageFile3Path = path.join(
        device._dirPath,
        "dataToSend",
        `${storageFile3ID}.data`
      );

      if (addStorageFile1)
        await createFileAsync(
          storageFile1Path,
          JSON.stringify(storageFile1Content)
        );
      if (addStorageFile2)
        await createFileAsync(
          storageFile2Path,
          JSON.stringify(storageFile2Content)
        );
      if (addStorageFile3)
        await createFileAsync(
          storageFile3Path,
          JSON.stringify(storageFile3Content)
        );

      device._sendData = sendDataMockFunc;

      if (getAllIDsThrows)
        device._dataStorage.getAllIDs = async () => {
          throw Error("GetAllIDsError");
        };
      if (getDataThrows) {
        //Throws only for second file
        let originalMethod = device._dataStorage.getData;
        device._dataStorage.getData = async (id) => {
          if (id === storageFile2ID) {
            throw Error("GetDataError");
          } else {
            let result = await originalMethod.call(device._dataStorage, id);
            return result;
          }
        };
      }
      if (deleteDataThrows) {
        //Throws only for second file
        let originalMethod = device._dataStorage.deleteData;
        device._dataStorage.deleteData = async (id) => {
          if (id === storageFile2ID) {
            throw Error("DeleteDataError");
          } else {
            let result = await originalMethod.call(device._dataStorage, id);
            return result;
          }
        };
      }
      return device._trySendingDataFromStorage();
    };

    it("should return true and send all data from storage and clear DataStorage", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      //Send data should have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(3);

      //Send data should have been called with data from storage
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(storageFile3Content);
      expect(sendDataMockFunc.mock.calls[1][0]).toEqual(storageFile2Content);
      expect(sendDataMockFunc.mock.calls[2][0]).toEqual(storageFile1Content);

      //storage should be cleared
      let allIds = await device._dataStorage.getAllIDs();
      expect(allIds).toEqual([]);

      //All files should have been removed
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([]);
    });

    it("should return true and send only given number of files - if number of files exceeds SendDataFile", async () => {
      payload.numberOfDataFilesToSend = 2;

      let result = await exec();

      expect(result).toEqual(true);

      //Send data should have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(2);

      //Send data should have been called with data from storage
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(storageFile3Content);
      expect(sendDataMockFunc.mock.calls[1][0]).toEqual(storageFile2Content);

      //storage should be cleared except files that were not sent
      let allIds = await device._dataStorage.getAllIDs();
      expect(allIds).toEqual([storageFile1ID]);

      //All files except this one should have been removed
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([`${storageFile1ID}.data`]);

      //file content should not have been changed
      let fileContent = await device._dataStorage.getData(storageFile1ID);
      expect(fileContent).toEqual(storageFile1Content);
    });

    it("should return true but send all data from storage and DataStorage cleared - if there are no files", async () => {
      addStorageFile1 = false;
      addStorageFile2 = false;
      addStorageFile3 = false;

      let result = await exec();

      expect(result).toEqual(true);

      //Send data should not have been called
      expect(sendDataMockFunc).not.toHaveBeenCalled();

      //storage should be cleared
      let allIds = await device._dataStorage.getAllIDs();
      expect(allIds).toEqual([]);

      //All files should have been removed
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([]);
    });

    it("should return true and not send given file but delete it - file content is null", async () => {
      storageFile2Content = null;

      let result = await exec();

      expect(result).toEqual(true);

      //Send data should have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(2);

      //Send data should have been called with data from storage
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(storageFile3Content);
      expect(sendDataMockFunc.mock.calls[1][0]).toEqual(storageFile1Content);

      //storage should have been totally cleared
      let allIds = await device._dataStorage.getAllIDs();
      expect(allIds).toEqual([]);

      //All files except the one when sendFile threw should have been removed
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([]);
    });

    it("should return false and not send given file and also not delete it - if send data throws while sending this file", async () => {
      //send data throws second time
      let sendDataIndex = 0;
      sendDataMockFunc = jest.fn(async () => {
        sendDataIndex++;
        if (sendDataIndex === 2) throw new Error("testError");
      });

      let result = await exec();

      expect(result).toEqual(false);

      //Send data should have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(3);

      //Send data should have been called with data from storage
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(storageFile3Content);
      expect(sendDataMockFunc.mock.calls[1][0]).toEqual(storageFile2Content);
      expect(sendDataMockFunc.mock.calls[2][0]).toEqual(storageFile1Content);

      //storage should not be totally cleared
      let allIds = await device._dataStorage.getAllIDs();
      expect(allIds).toEqual([storageFile2ID]);

      //All files except the one when sendFile threw should have been removed
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([`${storageFile2ID}.data`]);

      //content of file 2 should not have been edited
      let file2Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile2ID}.data`),
        "utf8"
      );

      expect(file2Content).toBeDefined();

      expect(JSON.parse(file2Content)).toEqual(storageFile2Content);

      //logger should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("testError");
    });

    it("should return false and not send any file - if send data throws for every file", async () => {
      sendDataMockFunc = jest.fn(async () => {
        throw new Error("testError");
      });

      let result = await exec();

      expect(result).toEqual(false);

      //Send data should have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(3);

      //Send data should have been called with data from storage
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(storageFile3Content);
      expect(sendDataMockFunc.mock.calls[1][0]).toEqual(storageFile2Content);
      expect(sendDataMockFunc.mock.calls[2][0]).toEqual(storageFile1Content);

      //storage should not be cleared
      let allIds = await device._dataStorage.getAllIDs();
      expect(allIds).toEqual([storageFile1ID, storageFile2ID, storageFile3ID]);

      //Any file should have been deleted
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([
        `${storageFile1ID}.data`,
        `${storageFile2ID}.data`,
        `${storageFile3ID}.data`,
      ]);

      //content of file 1 should not have been edited
      let file1Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile1ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file1Content)).toEqual(storageFile1Content);

      //content of file 2 should not have been edited
      let file2Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile2ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file2Content)).toEqual(storageFile2Content);

      //content of file 3 should not have been edited
      let file3Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile3ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file3Content)).toEqual(storageFile3Content);

      //logger should have been called for every file
      expect(logErrorMock).toHaveBeenCalledTimes(3);
      expect(logErrorMock.mock.calls[0][0]).toEqual("testError");
      expect(logErrorMock.mock.calls[1][0]).toEqual("testError");
      expect(logErrorMock.mock.calls[2][0]).toEqual("testError");
    });

    it("should return false and not send or delete any file - if getAllIDs throws", async () => {
      getAllIDsThrows = true;

      let result = await exec();

      expect(result).toEqual(false);

      //Send data should not have been called
      expect(sendDataMockFunc).not.toHaveBeenCalled();

      //Any file should have been deleted
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([
        `${storageFile1ID}.data`,
        `${storageFile2ID}.data`,
        `${storageFile3ID}.data`,
      ]);

      //content of file 1 should not have been edited
      let file1Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile1ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file1Content)).toEqual(storageFile1Content);

      //content of file 2 should not have been edited
      let file2Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile2ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file2Content)).toEqual(storageFile2Content);

      //content of file 3 should not have been edited
      let file3Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile3ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file3Content)).toEqual(storageFile3Content);

      //logger should have been called once
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("GetAllIDsError");
    });

    it("should return false and not send or delete given file - if getData throws for this file", async () => {
      getDataThrows = true;

      let result = await exec();

      expect(result).toEqual(false);

      //Send data should not have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(2);

      //Send data should have been called with data from storage
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(storageFile3Content);
      expect(sendDataMockFunc.mock.calls[1][0]).toEqual(storageFile1Content);

      //All files except 2nd should have been deleted
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([`${storageFile2ID}.data`]);

      //content of file 2 should not have been edited
      let file2Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile2ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file2Content)).toEqual(storageFile2Content);

      //logger should have been called three times - for every file
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("GetDataError");
    });

    it("should return false - if clearData throws for this file", async () => {
      deleteDataThrows = true;

      let result = await exec();

      expect(result).toEqual(false);

      //Send data should not have been called
      expect(sendDataMockFunc).toHaveBeenCalledTimes(3);

      //Send data should have been called with data from storage
      expect(sendDataMockFunc.mock.calls[0][0]).toEqual(storageFile3Content);
      expect(sendDataMockFunc.mock.calls[1][0]).toEqual(storageFile2Content);
      expect(sendDataMockFunc.mock.calls[2][0]).toEqual(storageFile1Content);

      //All files except 2nd should have been deleted
      let dirFiles = await readDirAsync(device._dataStorage._dirPath);

      expect(dirFiles).toEqual([`${storageFile2ID}.data`]);

      //content of file 2 should not have been edited
      let file2Content = await readFileAsync(
        path.join(device._dataStorage._dirPath, `${storageFile2ID}.data`),
        "utf8"
      );
      expect(JSON.parse(file2Content)).toEqual(storageFile2Content);

      //logger should have been called three times - for every file
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("DeleteDataError");
    });
  });
});
