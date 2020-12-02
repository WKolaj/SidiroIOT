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
  cloneObject,
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
const { clone } = require("lodash");

const AgentDirPath = "__testDir/settings/agentsData";

describe("AgentDevice", () => {
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

  describe("_trySavingEventToStorage", () => {
    let project;
    let payload;
    let device;
    let eventToSave;
    let clipboardContent;
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
        tickId: 101,
        elementID: "elementID1",
        elementValue: "testAlertText1",
      };
      storageFile2Content = {
        tickId: 201,
        elementID: "elementID2",
        elementValue: "testAlertText2",
      };
      storageFile3Content = {
        tickId: 301,
        elementID: "elementID3",
        elementValue: "testAlertText3",
      };

      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };
      clipboardContent = [
        {
          tickId: 501,
          elementId: "element5ID",
          elementValue: "textElementTest5",
        },
        {
          tickId: 601,
          elementId: "element6ID",
          elementValue: "textElementTest6",
        },
        {
          tickId: 701,
          elementId: "element7ID",
          elementValue: "textElementTest7",
        },
      ];
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

      eventToSave = {
        tickId: 401,
        elementId: "element4ID",
        elementValue: "textElementTest4",
      };

      //Overwriting logger action method
      logErrorMock = jest.fn();
      logger.error = logErrorMock;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      await device.init(payload);

      storageFile1Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${storageFile1ID}.data`
      );
      storageFile2Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${storageFile2ID}.data`
      );
      storageFile3Path = path.join(
        device._dirPath,
        "eventsToSend",
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

      if (createDataThrows)
        device._eventStorage.createData = jest.fn(() => {
          throw new Error("testError");
        });

      device._eventClipboard._data = cloneObject(clipboardContent);

      return device._trySavingEventToStorage(eventToSave);
    };

    it("should save data to event storage without clearing clipboard", async () => {
      await exec();

      //clipboard should not be cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain 4 elements
      let storageIDs = await device._eventStorage.getAllIDs();

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
      let storageContent = await device._eventStorage.getData(fileID);
      expect(storageContent).toEqual(eventToSave);
    });

    it("should copy data from clipboard to fileStorage and delete oldest file and clear clipboard - if buffer length exceeded", async () => {
      payload.eventStorageSize = 3;
      await exec();

      //clipboard should not be cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain 3 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 2 previous ids - not the first (oldest) one
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) => item !== storageFile2ID && item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._eventStorage.getData(fileID);
      expect(storageContent).toEqual(eventToSave);
    });

    it("should save data from clipboard to fileStorage even if data is an empty object", async () => {
      clipboardContent = [];
      await exec();

      //clipboard should not be cleared
      expect(device._eventClipboard.getAllData()).toEqual([]);

      //Storage should contain 4 elements
      let storageIDs = await device._eventStorage.getAllIDs();

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
      let storageContent = await device._eventStorage.getData(fileID);
      expect(storageContent).toEqual(eventToSave);
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
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain 3 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //logger error should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("testError");
    });
  });

  describe("_trySendingEventsFromClipboardAndClearItOrMoveThemToStorage", () => {
    let project;
    let payload;
    let device;
    let clipboardContent;
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
    let sendEventMockFunc;

    beforeEach(async () => {
      createDataThrows = false;

      addStorageFile1 = true;
      addStorageFile2 = true;
      addStorageFile3 = true;

      storageFile1ID = "1606817695038-AKm19eiq";
      storageFile2ID = "1606817695039-BKm19eiq";
      storageFile3ID = "1606817695040-CKm19eiq";

      storageFile1Content = {
        tickId: 101,
        elementID: "elementID1",
        elementValue: "testAlertText1",
      };
      storageFile2Content = {
        tickId: 201,
        elementID: "elementID2",
        elementValue: "testAlertText2",
      };
      storageFile3Content = {
        tickId: 301,
        elementID: "elementID3",
        elementValue: "testAlertText3",
      };

      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };
      clipboardContent = [
        {
          tickId: 501,
          elementId: "element5ID",
          elementValue: "textElementTest5",
        },
        {
          tickId: 601,
          elementId: "element6ID",
          elementValue: "textElementTest6",
        },
        {
          tickId: 701,
          elementId: "element7ID",
          elementValue: "textElementTest7",
        },
      ];
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

      eventToSave = {
        tickId: 401,
        elementId: "element4ID",
        elementValue: "textElementTest4",
      };

      //Overwriting logger action method
      logErrorMock = jest.fn();
      logger.error = logErrorMock;

      sendEventMockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      await device.init(payload);

      storageFile1Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${storageFile1ID}.data`
      );
      storageFile2Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${storageFile2ID}.data`
      );
      storageFile3Path = path.join(
        device._dirPath,
        "eventsToSend",
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

      if (createDataThrows)
        device._eventStorage.createData = jest.fn(() => {
          throw new Error("testError");
        });

      device._eventClipboard._data = cloneObject(clipboardContent);

      device._sendEvent = sendEventMockFunc;

      return device._trySendingEventsFromClipboardAndClearItOrMoveThemToStorage();
    };

    it("should return true and send all data from clipboard - and not save any data to storage", async () => {
      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(true);

      //Send should be called three times - for every event from clipboard
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        clipboardContent[0].tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        clipboardContent[0].elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        clipboardContent[0].elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        clipboardContent[1].tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        clipboardContent[1].elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        clipboardContent[1].elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        clipboardContent[2].tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        clipboardContent[2].elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        clipboardContent[2].elementValue
      );

      //clipboard should be cleared
      expect(device._eventClipboard.getAllData()).toEqual([]);

      //Storage should contain 3 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //fileContents should not be changed
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );
    });

    it("should return true and do nothing - if clipboard is empty", async () => {
      clipboardContent = [];

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(true);

      //Send should not have been called
      expect(device._sendEvent).not.toHaveBeenCalled();

      //clipboard should be cleared
      expect(device._eventClipboard.getAllData()).toEqual([]);

      //Storage should contain 3 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //fileContents should not be changed
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );
    });

    it("should return false, save event to file sent other events - if sending event throws while sending one event", async () => {
      let sendCounter = 0;

      sendEventMockFunc = jest.fn(() => {
        sendCounter++;
        if (sendCounter === 2) throw Error("test Error");
      });

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(false);

      //Send should be called three times - for every event from clipboard
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        clipboardContent[0].tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        clipboardContent[0].elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        clipboardContent[0].elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        clipboardContent[1].tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        clipboardContent[1].elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        clipboardContent[1].elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        clipboardContent[2].tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        clipboardContent[2].elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        clipboardContent[2].elementValue
      );

      //clipboard should be cleared
      expect(device._eventClipboard.getAllData()).toEqual([]);

      //Storage should contain 4 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(4);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //fileContents should not be changed
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) =>
          item !== storageFile1ID &&
          item !== storageFile2ID &&
          item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._eventStorage.getData(fileID);
      expect(storageContent).toEqual(clipboardContent[1]);

      //logger error should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("test Error");
    });

    it("should return false, save every event to file - if sending every event throws", async () => {
      sendEventMockFunc = jest.fn(() => {
        throw Error("test Error");
      });

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(false);

      //Send should be called three times - for every event from clipboard
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        clipboardContent[0].tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        clipboardContent[0].elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        clipboardContent[0].elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        clipboardContent[1].tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        clipboardContent[1].elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        clipboardContent[1].elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        clipboardContent[2].tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        clipboardContent[2].elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        clipboardContent[2].elementValue
      );

      //clipboard should be cleared
      expect(device._eventClipboard.getAllData()).toEqual([]);

      //Storage should contain 6 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(6);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //fileContents should not be changed
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );

      //Getting id of new files
      let newFileIds = storageIDs.filter(
        (item) =>
          item !== storageFile1ID &&
          item !== storageFile2ID &&
          item !== storageFile3ID
      );

      //content of files should be equal to generated
      let storageContent1 = await device._eventStorage.getData(newFileIds[0]);
      expect(storageContent1).toEqual(clipboardContent[0]);

      let storageContent2 = await device._eventStorage.getData(newFileIds[1]);
      expect(storageContent2).toEqual(clipboardContent[1]);

      let storageContent3 = await device._eventStorage.getData(newFileIds[2]);
      expect(storageContent3).toEqual(clipboardContent[2]);

      //logger error should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(3);
      expect(logErrorMock.mock.calls[0][0]).toEqual("test Error");
      expect(logErrorMock.mock.calls[1][0]).toEqual("test Error");
      expect(logErrorMock.mock.calls[2][0]).toEqual("test Error");
    });

    it("should return false, save event to file sent other and delete oldest file - if sending event throws while sending one event and number of file exceeds maximum", async () => {
      payload.eventStorageSize = 3;

      let sendCounter = 0;

      sendEventMockFunc = jest.fn(() => {
        sendCounter++;
        if (sendCounter === 2) throw Error("test Error");
      });

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(false);

      //Send should be called three times - for every event from clipboard
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        clipboardContent[0].tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        clipboardContent[0].elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        clipboardContent[0].elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        clipboardContent[1].tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        clipboardContent[1].elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        clipboardContent[1].elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        clipboardContent[2].tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        clipboardContent[2].elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        clipboardContent[2].elementValue
      );

      //clipboard should be cleared
      expect(device._eventClipboard.getAllData()).toEqual([]);

      //Storage should contain 4 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //fileContents should not be changed
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );

      //Getting id of new file
      let fileID = storageIDs.filter(
        (item) => item !== storageFile2ID && item !== storageFile3ID
      )[0];

      //content of file should be equal to generated
      let storageContent = await device._eventStorage.getData(fileID);
      expect(storageContent).toEqual(clipboardContent[1]);

      //logger error should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("test Error");
    });

    it("should return false, but not save event to file and sent other events - if sending event throws while sending one event and createData throws", async () => {
      let sendCounter = 0;

      sendEventMockFunc = jest.fn(() => {
        sendCounter++;
        if (sendCounter === 2) throw Error("test Error");
      });

      createDataThrows = true;

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(false);

      //Send should be called three times - for every event from clipboard
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        clipboardContent[0].tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        clipboardContent[0].elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        clipboardContent[0].elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        clipboardContent[1].tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        clipboardContent[1].elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        clipboardContent[1].elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        clipboardContent[2].tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        clipboardContent[2].elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        clipboardContent[2].elementValue
      );

      //clipboard should be cleared
      expect(device._eventClipboard.getAllData()).toEqual([]);

      //Storage should contain 3 elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs.length).toEqual(3);

      //Storage ids should contain 3 previous ids
      expect(storageIDs).toContain(storageFile1ID);
      expect(storageIDs).toContain(storageFile2ID);
      expect(storageIDs).toContain(storageFile3ID);

      //fileContents should not be changed
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );

      //logger error should have been called - two times, one when trying to send, one when trying to save
      expect(logErrorMock).toHaveBeenCalledTimes(2);
      expect(logErrorMock.mock.calls[0][0]).toEqual("test Error");
      expect(logErrorMock.mock.calls[1][0]).toEqual("testError");
    });
  });

  describe("_trySendingEventsFromStorage", () => {
    let project;
    let payload;
    let device;
    let eventToSave;
    let clipboardContent;
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
    let sendEventMockFunc;
    let deleteDataThrows;
    let getAllIDsThrows;
    let getDataThrows;

    beforeEach(async () => {
      deleteDataThrows = false;
      getAllIDsThrows = false;
      getDataThrows = false;

      addStorageFile1 = true;
      addStorageFile2 = true;
      addStorageFile3 = true;

      storageFile1ID = "1606817695038-AKm19eiq";
      storageFile2ID = "1606817695039-BKm19eiq";
      storageFile3ID = "1606817695040-CKm19eiq";

      storageFile1Content = {
        tickId: 101,
        elementID: "elementID1",
        elementValue: "testAlertText1",
      };
      storageFile2Content = {
        tickId: 201,
        elementID: "elementID2",
        elementValue: "testAlertText2",
      };
      storageFile3Content = {
        tickId: 301,
        elementID: "elementID3",
        elementValue: "testAlertText3",
      };

      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      project = {
        AgentDirPath: AgentDirPath,
        getElement: () => null,
      };
      clipboardContent = [
        {
          tickId: 501,
          elementId: "element5ID",
          elementValue: "textElementTest5",
        },
        {
          tickId: 601,
          elementId: "element6ID",
          elementValue: "textElementTest6",
        },
        {
          tickId: 701,
          elementId: "element7ID",
          elementValue: "textElementTest7",
        },
      ];
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

      eventToSave = {
        tickId: 401,
        elementId: "element4ID",
        elementValue: "textElementTest4",
      };

      //Overwriting logger action method
      logErrorMock = jest.fn();
      logger.error = logErrorMock;

      sendEventMockFunc = jest.fn();
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      device = new AgentDevice(project);

      await device.init(payload);

      storageFile1Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${storageFile1ID}.data`
      );
      storageFile2Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${storageFile2ID}.data`
      );
      storageFile3Path = path.join(
        device._dirPath,
        "eventsToSend",
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

      if (getAllIDsThrows)
        device._eventStorage.getAllIDs = async () => {
          throw Error("GetAllIDsError");
        };
      if (getDataThrows) {
        //Throws only for second file
        let originalMethod = device._eventStorage.getData;
        device._eventStorage.getData = async (id) => {
          if (id === storageFile2ID) {
            throw Error("GetDataError");
          } else {
            let result = await originalMethod.call(device._eventStorage, id);
            return result;
          }
        };
      }
      if (deleteDataThrows) {
        //Throws only for second file
        let originalMethod = device._eventStorage.deleteData;
        device._eventStorage.deleteData = async (id) => {
          if (id === storageFile2ID) {
            throw Error("DeleteDataError");
          } else {
            let result = await originalMethod.call(device._eventStorage, id);
            return result;
          }
        };
      }
      device._eventClipboard._data = cloneObject(clipboardContent);

      device._sendEvent = sendEventMockFunc;

      return device._trySendingEventsFromStorage();
    };

    it("should return true and send all data from file storage and delete them", async () => {
      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(true);

      //Send should be called three times - for every event from files
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        storageFile3Content.tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        storageFile3Content.elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        storageFile3Content.elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        storageFile2Content.tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        storageFile2Content.elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        storageFile2Content.elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        storageFile1Content.tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        storageFile1Content.elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        storageFile1Content.elementValue
      );

      //clipboard should not been cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain no elements
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs).toEqual([]);

      //All files should have been deleted

      let dirContent = await readDirAsync(device._eventStorage._dirPath);

      expect(dirContent).toEqual([]);
    });

    it("should return true and send and delete only number of files equal to NumberOfEventFilesToSend - if number of files in storage is greater than NumberOfEventFilesToSend", async () => {
      payload.numberOfEventFilesToSend = 2;

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(true);

      //Send should be called three times - for every event from files
      expect(device._sendEvent).toHaveBeenCalledTimes(2);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        storageFile3Content.tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        storageFile3Content.elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        storageFile3Content.elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        storageFile2Content.tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        storageFile2Content.elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        storageFile2Content.elementValue
      );

      //clipboard should not been cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain only not deleted files
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs).toEqual([storageFile1ID]);

      //All files except first one should have been deleted
      let dirContent = await readDirAsync(device._eventStorage._dirPath);

      expect(dirContent).toEqual([`${storageFile1ID}.data`]);

      //Remaining file should have the same content as before
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
    });

    it("should return true and not send or delete anything - if there are no files in storage", async () => {
      addStorageFile1 = false;
      addStorageFile2 = false;
      addStorageFile3 = false;

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(true);

      expect(device._sendEvent).not.toHaveBeenCalled();

      //clipboard should not been cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs).toEqual([]);

      let dirContent = await readDirAsync(device._eventStorage._dirPath);

      expect(dirContent).toEqual([]);
    });

    it("should return false and send all data from file storage except the one that throw - if sending one event throw", async () => {
      let sendCounter = 0;

      sendEventMockFunc = jest.fn(() => {
        sendCounter++;
        if (sendCounter === 2) throw Error("test Error");
      });

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(false);

      //Send should be called three times - for every event from files
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        storageFile3Content.tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        storageFile3Content.elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        storageFile3Content.elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        storageFile2Content.tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        storageFile2Content.elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        storageFile2Content.elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        storageFile1Content.tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        storageFile1Content.elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        storageFile1Content.elementValue
      );

      //clipboard should not been cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain one element - that threw while sending
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs).toEqual([storageFile2ID]);

      //All files except this one should have been deleted

      let dirContent = await readDirAsync(device._eventStorage._dirPath);
      expect(dirContent).toEqual([`${storageFile2ID}.data`]);

      //File content should not have been changed
      let fileContent = await device._eventStorage.getData(storageFile2ID);

      expect(fileContent).toEqual(storageFile2Content);

      //logger should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("test Error");
    });

    it("should return false and not delete any file - if sending throws every time", async () => {
      sendEventMockFunc = jest.fn(() => {
        throw Error("test Error");
      });

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(false);

      //Send should be called three times - for every event from files
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        storageFile3Content.tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        storageFile3Content.elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        storageFile3Content.elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        storageFile2Content.tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        storageFile2Content.elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        storageFile2Content.elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        storageFile1Content.tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        storageFile1Content.elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        storageFile1Content.elementValue
      );

      //clipboard should not been cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain one element - that threw while sending
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs).toEqual([
        storageFile1ID,
        storageFile2ID,
        storageFile3ID,
      ]);

      //All files except this one should have been deleted

      let dirContent = await readDirAsync(device._eventStorage._dirPath);
      expect(dirContent).toEqual([
        `${storageFile1ID}.data`,
        `${storageFile2ID}.data`,
        `${storageFile3ID}.data`,
      ]);

      //File content should not have been changed
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );

      //logger should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(3);
      expect(logErrorMock.mock.calls[0][0]).toEqual("test Error");
      expect(logErrorMock.mock.calls[1][0]).toEqual("test Error");
      expect(logErrorMock.mock.calls[2][0]).toEqual("test Error");
    });

    it("should return false and not send or delete any file - if getAllIDS throws", async () => {
      getAllIDsThrows = true;

      let result = await exec();

      //Should return true - events had been sent properly
      expect(result).toEqual(false);

      //Send should be called three times - for every event from files
      expect(device._sendEvent).not.toHaveBeenCalled();

      //clipboard should not been cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //All files except this one should have been deleted

      let dirContent = await readDirAsync(device._eventStorage._dirPath);
      expect(dirContent).toEqual([
        `${storageFile1ID}.data`,
        `${storageFile2ID}.data`,
        `${storageFile3ID}.data`,
      ]);

      //File content should not have been changed
      expect(await device._eventStorage.getData(storageFile1ID)).toEqual(
        storageFile1Content
      );
      expect(await device._eventStorage.getData(storageFile2ID)).toEqual(
        storageFile2Content
      );
      expect(await device._eventStorage.getData(storageFile3ID)).toEqual(
        storageFile3Content
      );

      //logger should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("GetAllIDsError");
    });

    it("should return send and delete all files except the one that deleteData throws", async () => {
      deleteDataThrows = true;

      let result = await exec();

      //Should return false
      expect(result).toEqual(false);

      //Send should be called three times - for every event from files
      expect(device._sendEvent).toHaveBeenCalledTimes(3);

      expect(device._sendEvent.mock.calls[0][0]).toEqual(
        storageFile3Content.tickId
      );
      expect(device._sendEvent.mock.calls[0][1]).toEqual(
        storageFile3Content.elementId
      );
      expect(device._sendEvent.mock.calls[0][2]).toEqual(
        storageFile3Content.elementValue
      );

      expect(device._sendEvent.mock.calls[1][0]).toEqual(
        storageFile2Content.tickId
      );
      expect(device._sendEvent.mock.calls[1][1]).toEqual(
        storageFile2Content.elementId
      );
      expect(device._sendEvent.mock.calls[1][2]).toEqual(
        storageFile2Content.elementValue
      );

      expect(device._sendEvent.mock.calls[2][0]).toEqual(
        storageFile1Content.tickId
      );
      expect(device._sendEvent.mock.calls[2][1]).toEqual(
        storageFile1Content.elementId
      );
      expect(device._sendEvent.mock.calls[2][2]).toEqual(
        storageFile1Content.elementValue
      );

      //clipboard should not been cleared
      expect(device._eventClipboard.getAllData()).toEqual(clipboardContent);

      //Storage should contain one element - that threw while sending
      let storageIDs = await device._eventStorage.getAllIDs();

      expect(storageIDs).toEqual([storageFile2ID]);

      //All files except this one should have been deleted

      let dirContent = await readDirAsync(device._eventStorage._dirPath);
      expect(dirContent).toEqual([`${storageFile2ID}.data`]);

      //File content should not have been changed
      let fileContent = await device._eventStorage.getData(storageFile2ID);

      expect(fileContent).toEqual(storageFile2Content);

      //logger should have been called
      expect(logErrorMock).toHaveBeenCalledTimes(1);
      expect(logErrorMock.mock.calls[0][0]).toEqual("DeleteDataError");
    });
  });
});
