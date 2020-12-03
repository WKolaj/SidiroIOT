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
  describe("refresh", () => {
    let project;
    let payload;
    let device;
    let initialBoardedState;
    let getElementMockFunc;
    let tryBoardOnSendData;
    let tryBoardOnSendEvent;

    //#region VARIABLES

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

    //#endregion VARIABLES

    //#region ALERTS

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

    //#endregion ALERTS

    //#region DATA STORAGE

    let dataStorageFile1Path;
    let dataStorageFile2Path;
    let dataStorageFile3Path;
    let dataStorageFile1ID;
    let dataStorageFile2ID;
    let dataStorageFile3ID;
    let dataStorageFile1Content;
    let dataStorageFile2Content;
    let dataStorageFile3Content;
    let addDataStorageFile1;
    let addDataStorageFile2;
    let addDataStorageFile3;

    //#endregion DATA STORAGE

    //#region DATA LAST VALUES

    let lastDataValues;

    //#endregion DATA LAST VALUES

    //#region DATA CLIPBOARD

    let dataClipboardContent;

    //#endregion DATA CLIPBOARD

    //#region EVENT STORAGE

    let eventStorageFile1Path;
    let eventStorageFile2Path;
    let eventStorageFile3Path;
    let eventStorageFile1ID;
    let eventStorageFile2ID;
    let eventStorageFile3ID;
    let eventStorageFile1Content;
    let eventStorageFile2Content;
    let eventStorageFile3Content;
    let addEventStorageFile1;
    let addEventStorageFile2;
    let addEventStorageFile3;

    //#endregion EVENT STORAGE

    //#region EVENT LAST VALUES

    let lastEventValues;

    //#endregion EVENT LAST VALUES

    //#region EVENT CLIPBOARD

    let eventClipboardContent;

    //#endregion EVENT CLIPBOARD

    //#region MOCK FUNCTIONS

    let OnBoardMockFunc;
    let SendEventMockFunc;
    let SendDataMockFunc;
    let CheckIfBoardedMockFunc;

    //#endregion MOCK FUNCTIONS

    beforeEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);

      //#region VARIABLES

      variable1ID = "variable1ID";
      variable1Value = 1001;
      variable1LastValueTick = 101;

      variable2ID = "variable2ID";
      variable2Value = 1002;
      variable2LastValueTick = 102;

      variable3ID = "variable3ID";
      variable3Value = 1003;
      variable3LastValueTick = 103;

      //#endregion VARIABLES

      //#region ALERTS

      alert1ID = "alert1ID";
      alert1Value = "test text 1";
      alert1LastValueTick = 101;

      alert2ID = "alert2ID";
      alert2Value = "test text 2";
      alert2LastValueTick = 102;

      alert3ID = "alert3ID";
      alert3Value = "test text 3";
      alert3LastValueTick = 103;

      //#endregion ALERTS

      //#region DATA CLIPBOARD

      dataClipboardContent = {};

      //#endregion DATA CLIPBOARD

      //#region DATA LAST VALUES

      lastDataValues = {};

      //#endregion DATA LAST VALUES

      //#region DATA STORAGE

      dataStorageFile1ID = "1606817695038-DKm19eiq";
      dataStorageFile2ID = "1606817695039-EKm19eiq";
      dataStorageFile3ID = "1606817695040-FKm19eiq";

      addDataStorageFile1 = true;
      addDataStorageFile2 = true;
      addDataStorageFile3 = true;

      dataStorageFile1Content = {
        101: {
          variable1ID: 1110,
          variable2ID: 1120,
          variable3ID: 1130,
        },
        102: {
          variable1ID: 1210,
          variable2ID: 1220,
          variable3ID: 1230,
        },
        103: {
          variable1ID: 1310,
          variable2ID: 1320,
          variable3ID: 1330,
        },
      };
      dataStorageFile2Content = {
        201: {
          variable1ID: 2110,
          variable2ID: 2120,
          variable3ID: 2130,
        },
        202: {
          variable1ID: 2210,
          variable2ID: 2220,
          variable3ID: 223,
        },
        203: {
          variable1ID: 2310,
          variable2ID: 2320,
          variable3ID: 2330,
        },
      };
      dataStorageFile3Content = {
        301: {
          variable1ID: 3110,
          variable2ID: 3120,
          variable3ID: 3130,
        },
        302: {
          variable1ID: 3210,
          variable2ID: 3220,
          variable3ID: 3230,
        },
        303: {
          variable1ID: 3310,
          variable2ID: 3320,
          variable3ID: 3330,
        },
      };

      //#endregion DATA STORAGE

      //#region EVENT STORAGE

      eventStorageFile1ID = "1606817695038-AKm19eiq";
      eventStorageFile2ID = "1606817695039-BKm19eiq";
      eventStorageFile3ID = "1606817695040-CKm19eiq";

      addEventStorageFile1 = true;
      addEventStorageFile2 = true;
      addEventStorageFile3 = true;

      eventStorageFile1Content = {
        tickId: 101,
        elementID: "alert1ID",
        value: "testAlertText1",
      };
      eventStorageFile2Content = {
        tickId: 201,
        elementID: "alert2ID",
        value: "testAlertText2",
      };
      eventStorageFile3Content = {
        tickId: 301,
        elementID: "alert3ID",
        value: "testAlertText3",
      };

      //#endregion EVENT STORAGE

      //#region EVENT CLIPBOARD

      eventClipboardContent = [];

      //#endregion EVENT CLIPBOARD

      //#region EVENT LAST VALUES

      lastEventValues = {};

      //#endregion EVENT LAST VALUES

      //#region PROJECT MOCK

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

      //#endregion PROJECT MOCK

      //#region PAYLOAD

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 17,
        sendEventFileInterval: 19,
        dataStorageSize: 4,
        eventStorageSize: 4,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 3,
        dataToSendConfig: {
          [variable1ID]: {
            elementId: variable1ID,
            deviceId: "testDevice1ID",
            sendingInterval: 1,
          },
          [variable2ID]: {
            elementId: variable2ID,
            deviceId: "testDevice1ID",
            sendingInterval: 3,
          },
          [variable3ID]: {
            elementId: variable3ID,
            deviceId: "testDevice1ID",
            sendingInterval: 5,
          },
        },
        eventsToSendConfig: {
          [alert1ID]: {
            elementId: alert1ID,
            deviceId: "testDevice1ID",
            sendingInterval: 7,
          },
          [alert2ID]: {
            elementId: alert2ID,
            deviceId: "testDevice1ID",
            sendingInterval: 11,
          },
          [alert3ID]: {
            elementId: alert3ID,
            deviceId: "testDevice1ID",
            sendingInterval: 13,
          },
        },
      };

      //#endregion PAYLOAD

      //#region MOCK FUNCTIONS

      OnBoardMockFunc = jest.fn();
      SendEventMockFunc = jest.fn();
      SendDataMockFunc = jest.fn();
      CheckIfBoardedMockFunc = jest.fn(async () => true);

      //#endregion MOCK FUNCTIONS

      //#region DEVICE PROPS

      tryBoardOnSendData = true;
      tryBoardOnSendEvent = true;
      initialBoardedState = true;

      //#endregion DEVICE PROPS

      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      //Overwriting logger action method
      logErrorMock = jest.fn();
      logger.error = logErrorMock;
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentDirPath);
      await clearDirectoryAsync(AgentDirPath);
    });

    let exec = async () => {
      //#region CREATING VARIABLES

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

      //#endregion CREATING VARIABLES

      //#region CREATING ALERTS

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

      //#endregion CREATING ALERTS

      //#region CREATING AND INITIALIZING DEVICE

      device = new AgentDevice(project);

      await device.init(payload);

      device._tryBoardOnSendData = tryBoardOnSendData;
      device._tryBoardOnSendEvent = tryBoardOnSendEvent;

      device._dataClipboard._data = dataClipboardContent;
      device._eventClipboard._data = eventClipboardContent;

      device._lastDataValues = lastDataValues;
      device._lastEventValues = lastEventValues;

      device.OnBoard = OnBoardMockFunc;
      device._checkIfBoarded = CheckIfBoardedMockFunc;
      device._sendData = SendDataMockFunc;
      device._sendEvent = SendEventMockFunc;
      device._boarded = initialBoardedState;

      //#endregion CREATING AND INITIALIZING DEVICE

      //#region CREATING DATA STORAGE FILES

      dataStorageFile1Path = path.join(
        device._dirPath,
        "dataToSend",
        `${dataStorageFile1ID}.data`
      );
      dataStorageFile2Path = path.join(
        device._dirPath,
        "dataToSend",
        `${dataStorageFile2ID}.data`
      );
      dataStorageFile3Path = path.join(
        device._dirPath,
        "dataToSend",
        `${dataStorageFile3ID}.data`
      );

      if (addDataStorageFile1)
        await createFileAsync(
          dataStorageFile1Path,
          JSON.stringify(dataStorageFile1Content)
        );

      if (addDataStorageFile2)
        await createFileAsync(
          dataStorageFile2Path,
          JSON.stringify(dataStorageFile2Content)
        );

      if (addDataStorageFile3)
        await createFileAsync(
          dataStorageFile3Path,
          JSON.stringify(dataStorageFile3Content)
        );

      //#endregion CREATING DATA STORAGE FILES

      //#region CREATING EVENT STORAGE FILES

      eventStorageFile1Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${eventStorageFile1ID}.data`
      );
      eventStorageFile2Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${eventStorageFile2ID}.data`
      );
      eventStorageFile3Path = path.join(
        device._dirPath,
        "eventsToSend",
        `${eventStorageFile3ID}.data`
      );

      if (addEventStorageFile1)
        await createFileAsync(
          eventStorageFile1Path,
          JSON.stringify(eventStorageFile1Content)
        );

      if (addEventStorageFile2)
        await createFileAsync(
          eventStorageFile2Path,
          JSON.stringify(eventStorageFile2Content)
        );

      if (addEventStorageFile3)
        await createFileAsync(
          eventStorageFile3Path,
          JSON.stringify(eventStorageFile3Content)
        );

      //#endregion CREATING EVENT STORAGE FILES

      return device.refresh(tickId);
    };

    /**
     * @description Method for testing valid refresh with default values
     */
    const testValidRefresh = async () => {
      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    };

    it("should send content of file and event clipboards and content of event and file storages - if tickId fits everything and device is boarded", async () => {
      await exec();

      await testValidRefresh();
    });

    it("should do nothing - if device is not active", async () => {
      payload.isActive = false;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      expect(SendEventMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should stay empty
      expect(device._lastDataValues).toEqual({});

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should stay empty
      expect(device._lastEventValues).toEqual({});

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([
        dataStorageFile1ID,
        dataStorageFile2ID,
        dataStorageFile3ID,
      ]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([
        eventStorageFile1ID,
        eventStorageFile2ID,
        eventStorageFile3ID,
      ]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //Initially boarded state was true - should remain true
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    //#region BOARDING

    it("should not call OnBoard if device is boarded and checkIfBoarded returns true", async () => {
      initialBoardedState = true;
      let boarded = true;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      OnBoardMockFunc = jest.fn(async () => {
        boarded = true;
      });

      await exec();

      await testValidRefresh();

      //Onboard function should have been called
      expect(OnBoardMockFunc).not.toHaveBeenCalled();

      //Should set check if boarded return state to boarded
      expect(device.Boarded).toEqual(true);
    });

    it("should not call OnBoard if device is not boarded but checkIfBoarded returns true", async () => {
      initialBoardedState = false;
      let boarded = true;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      OnBoardMockFunc = jest.fn(async () => {
        boarded = true;
      });

      await exec();

      await testValidRefresh();

      //Onboard function should have been called
      expect(OnBoardMockFunc).not.toHaveBeenCalled();

      //Should set check if boarded return state to boarded
      expect(device.Boarded).toEqual(true);
    });

    it("should call OnBoard if device is boarded but checkIfBoarded returns false", async () => {
      initialBoardedState = true;

      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      OnBoardMockFunc = jest.fn(async () => {
        boarded = true;
      });

      await exec();

      await testValidRefresh();

      //Onboard function should have been called
      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);

      //Should set check if boarded return state to boarded
      expect(device.Boarded).toEqual(true);
    });

    it("should call OnBoard if device is not boarded and checkIfBoarded returns false", async () => {
      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      OnBoardMockFunc = jest.fn(async () => {
        boarded = true;
      });

      await exec();

      await testValidRefresh();

      //Onboard function should have been called
      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);

      //Should set check if boarded return state to boarded
      expect(device.Boarded).toEqual(true);
    });

    it("should call OnBoard if device is not boarded and checkIfBoarded returns false - if tryBoardOnSendData is true and there is only sending data process", async () => {
      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      OnBoardMockFunc = jest.fn(async () => {
        boarded = true;
      });

      tryBoardOnSendEvent = false;
      tryBoardOnSendData = true;

      //19 is send event interval
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17;

      await exec();
      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      expect(SendEventMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([
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
        {
          elementId: alert3ID,
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
      ]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([
        eventStorageFile1ID,
        eventStorageFile2ID,
        eventStorageFile3ID,
      ]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE

      //Onboard function should have been called
      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);
    });

    it("should call OnBoard if device is not boarded and checkIfBoarded returns false - if tryBoardOnSendEvent is true and there is only sending event process", async () => {
      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      OnBoardMockFunc = jest.fn(async () => {
        boarded = true;
      });

      tryBoardOnSendEvent = true;
      tryBoardOnSendData = false;

      //17 is send data interval
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 19;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([
        dataStorageFile1ID,
        dataStorageFile2ID,
        dataStorageFile3ID,
      ]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE

      //Onboard function should have been called
      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);
    });

    it("should not send anything but save values in clipboards if device is not boarded and checkIfBoarded returns false - if tryBoardOnSendEvent is false and if tryBoardOnSendData is false but tickId fits both", async () => {
      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      //Onboard do nothing
      OnBoardMockFunc = jest.fn();

      tryBoardOnSendEvent = false;
      tryBoardOnSendData = false;

      //17 is send data interval, 19 is send event interval
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      expect(SendEventMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([
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
        {
          elementId: alert3ID,
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
      ]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([
        dataStorageFile1ID,
        dataStorageFile2ID,
        dataStorageFile3ID,
      ]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([
        eventStorageFile1ID,
        eventStorageFile2ID,
        eventStorageFile3ID,
      ]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      expect(device.Boarded).toEqual(false);

      //#endregion CHECKING BOARDED STATE

      //Onboard function should have been called
      expect(OnBoardMockFunc).not.toHaveBeenCalled();
    });

    it("should not send anything but save values in clipboards if device is not boarded and checkIfBoarded returns false - if tryBoardOnSendEvent is true and if tryBoardOnSendData is true but tickId doesn'y fit any", async () => {
      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      //Onboard do nothing
      OnBoardMockFunc = jest.fn();

      tryBoardOnSendEvent = false;
      tryBoardOnSendData = false;

      //17 is send data interval, 19 is send event interval
      tickId = 1 * 3 * 5 * 7 * 11 * 13;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      expect(SendEventMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([
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
        {
          elementId: alert3ID,
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
      ]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([
        dataStorageFile1ID,
        dataStorageFile2ID,
        dataStorageFile3ID,
      ]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([
        eventStorageFile1ID,
        eventStorageFile2ID,
        eventStorageFile3ID,
      ]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      expect(device.Boarded).toEqual(false);

      //#endregion CHECKING BOARDED STATE

      //Onboard function should have been called
      expect(OnBoardMockFunc).not.toHaveBeenCalled();
    });

    it("should not send anything but save values in clipboards if device is not boarded and checkIfBoarded returns false after boarding", async () => {
      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      //Onboard do nothing
      OnBoardMockFunc = jest.fn();

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      expect(SendEventMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([
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
        {
          elementId: alert3ID,
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
      ]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([
        dataStorageFile1ID,
        dataStorageFile2ID,
        dataStorageFile3ID,
      ]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([
        eventStorageFile1ID,
        eventStorageFile2ID,
        eventStorageFile3ID,
      ]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      expect(device.Boarded).toEqual(false);

      //#endregion CHECKING BOARDED STATE

      //Onboard function should have been called
      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);

      //Should set false to boarded
      expect(device.Boarded).toEqual(false);
    });

    it("should not send anything but save values in clipboards if device is not boarded and OnBoard throws", async () => {
      let boarded = false;

      CheckIfBoardedMockFunc = jest.fn(async () => {
        return boarded;
      });

      //Onboard do nothing
      OnBoardMockFunc = jest.fn(async () => {
        throw new Error("boarding error");
      });

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      expect(SendEventMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([
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
        {
          elementId: alert3ID,
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
      ]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([
        dataStorageFile1ID,
        dataStorageFile2ID,
        dataStorageFile3ID,
      ]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([
        eventStorageFile1ID,
        eventStorageFile2ID,
        eventStorageFile3ID,
      ]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      expect(device.Boarded).toEqual(false);

      //#endregion CHECKING BOARDED STATE

      //Onboard function should have been called
      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);

      //Should set false to boarded
      expect(device.Boarded).toEqual(false);

      //Logger should have been called
      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.error.mock.calls[0][0]).toEqual("boarding error");
    });

    it("should not send anything but save values in clipboards if device is not boarded and checkIfBoarded throws", async () => {
      CheckIfBoardedMockFunc = jest.fn(async () => {
        throw new Error("Check Boarded Error");
      });

      //Onboard d
      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      expect(SendEventMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([
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
        {
          elementId: alert3ID,
          tickId: alert3LastValueTick,
          value: alert3Value,
        },
      ]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([
        dataStorageFile1ID,
        dataStorageFile2ID,
        dataStorageFile3ID,
      ]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([
        eventStorageFile1ID,
        eventStorageFile2ID,
        eventStorageFile3ID,
      ]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      expect(device.Boarded).toEqual(false);

      //#endregion CHECKING BOARDED STATE

      //Onboard function should have been called
      expect(OnBoardMockFunc).toHaveBeenCalledTimes(1);

      //Should set false to boarded
      expect(device.Boarded).toEqual(false);

      //Logger should have been called two times - before OnBoard and after to refresh state
      expect(logger.error).toHaveBeenCalledTimes(2);
      expect(logger.error.mock.calls[0][0]).toEqual("Check Boarded Error");
      expect(logger.error.mock.calls[1][0]).toEqual("Check Boarded Error");
    });

    //#endregion BOARDING

    //#region FILLING DATA CLIPBOARD

    it("should insert every variable's value into clipboard - if every variable's sending interval fits", async () => {
      payload.dataToSendConfig[variable1ID].sendingInterval = 1;
      payload.dataToSendConfig[variable2ID].sendingInterval = 1;
      payload.dataToSendConfig[variable3ID].sendingInterval = 1;

      await exec();

      await testValidRefresh();
    });

    it("should insert and send only variables that's interval fits tickId", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      //variable1 and variable2 fits
      payload.dataToSendConfig[variable1ID].sendingInterval = 1;
      payload.dataToSendConfig[variable2ID].sendingInterval = 23;
      payload.dataToSendConfig[variable3ID].sendingInterval = 3;

      await exec();
      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned that fits tickId
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData - if there are no variables that fits tickId and clipboardData is empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      dataClipboardContent = {};

      //variable1 and variable2 fits
      payload.dataToSendConfig[variable1ID].sendingInterval = 23;
      payload.dataToSendConfig[variable2ID].sendingInterval = 23;
      payload.dataToSendConfig[variable3ID].sendingInterval = 23;

      await exec();
      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(3);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned that fits tickId
      expect(device._lastDataValues).toEqual({});

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData but send clipboards data - if there are no variables that fits tickId but clipboardData is not empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      dataClipboardContent = {
        [900]: {
          variable1ID: 9001,
        },
        [901]: {
          variable2ID: 9002,
        },
        [902]: {
          variable3ID: 9003,
        },
      };

      //variable1 and variable2 fits
      payload.dataToSendConfig[variable1ID].sendingInterval = 23;
      payload.dataToSendConfig[variable2ID].sendingInterval = 23;
      payload.dataToSendConfig[variable3ID].sendingInterval = 23;

      await exec();
      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(dataClipboardContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned that fits tickId
      expect(device._lastDataValues).toEqual({});

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData - if there are no elements in config and clipboardData is empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      dataClipboardContent = {};

      payload.dataToSendConfig = {};

      await exec();
      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(3);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned that fits tickId
      expect(device._lastDataValues).toEqual({});

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData but send clipboards data - if there are no variables in config but clipboardData is not empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      dataClipboardContent = {
        [900]: {
          variable1ID: 9001,
        },
        [901]: {
          variable2ID: 9002,
        },
        [902]: {
          variable3ID: 9003,
        },
      };

      payload.dataToSendConfig = {};

      await exec();
      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(dataClipboardContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned that fits tickId
      expect(device._lastDataValues).toEqual({});

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should insert and send only variables that's interval fits tickId and exists in project", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      //variable1 and variable2 fits
      payload.dataToSendConfig["fakeVariableID"] = {
        elementId: "fakeVariableID",
        deviceId: "testDevice1ID",
        sendingInterval: 5,
      };

      await exec();

      await testValidRefresh();
    });

    it("should not insert and send variables that's value and lastValueTick has not changed", async () => {
      //variable1 and variable2 fits
      lastDataValues = {
        [variable2ID]: {
          value: variable2Value,
          tickId: variable2LastValueTick,
        },
      };

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned that fits tickId
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should insert and send variables that's value did not changed but lastValueTick has changed", async () => {
      //variable1 and variable2 fits
      lastDataValues = {
        [variable2ID]: {
          value: variable2Value,
          tickId: variable2LastValueTick - 1,
        },
      };

      await exec();

      await testValidRefresh();
    });

    it("should insert and send variables that's value changed but lastValueTick has not changed", async () => {
      //variable1 and variable2 fits
      lastDataValues = {
        [variable2ID]: {
          value: variable2Value - 1,
          tickId: variable2LastValueTick,
        },
      };

      await exec();

      await testValidRefresh();
    });

    //#endregion FILLING DATA CLIPBOARD

    //#region FILLING EVENT CLIPBOARD

    it("should insert every alerts's value into clipboard - if every alert's sending interval fits", async () => {
      payload.eventsToSendConfig[alert1ID].sendingInterval = 1;
      payload.eventsToSendConfig[alert2ID].sendingInterval = 1;
      payload.eventsToSendConfig[alert3ID].sendingInterval = 1;

      await exec();

      await testValidRefresh();
    });

    it("should insert and send only alerts that's interval fits tickId", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      payload.eventsToSendConfig[alert1ID].sendingInterval = 1;
      payload.eventsToSendConfig[alert2ID].sendingInterval = 23;
      payload.eventsToSendConfig[alert3ID].sendingInterval = 3;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 2 times  - for alert variables, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(5);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //only alerts value that fits should be assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData - if there are no alerts that fits tickId and clipboardData is empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      eventClipboardContent = [];

      payload.eventsToSendConfig[alert1ID].sendingInterval = 23;
      payload.eventsToSendConfig[alert2ID].sendingInterval = 23;
      payload.eventsToSendConfig[alert3ID].sendingInterval = 23;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 3 times - - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(3);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //any last values should have been assigned
      expect(device._lastEventValues).toEqual({});

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData but send clipboards data - if there are no elements that fits tickId but clipboardData is not empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      eventClipboardContent = [
        {
          elementId: alert1ID,
          value: "additional text alert 1",
          tickId: 9001,
        },
        {
          elementId: alert2ID,
          value: "additional text alert 2",
          tickId: 9002,
        },
        {
          elementId: alert3ID,
          value: "additional text alert 3",
          tickId: 9003,
        },
      ];

      payload.eventsToSendConfig[alert1ID].sendingInterval = 23;
      payload.eventsToSendConfig[alert2ID].sendingInterval = 23;
      payload.eventsToSendConfig[alert3ID].sendingInterval = 23;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 3 times - 3 from clipboard - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //checking clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(
        eventClipboardContent[0].tickId
      );
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(
        eventClipboardContent[0].elementId
      );
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(
        eventClipboardContent[0].value
      );

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(
        eventClipboardContent[1].tickId
      );
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(
        eventClipboardContent[1].elementId
      );
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(
        eventClipboardContent[1].value
      );

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventClipboardContent[2].tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventClipboardContent[2].elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventClipboardContent[2].value
      );

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //any last values should have been assigned
      expect(device._lastEventValues).toEqual({});

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData - if there are no alerts in config and clipboardData is empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      eventClipboardContent = {};

      payload.eventsToSendConfig = {};

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 3 times - - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(3);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //any last values should have been assigned
      expect(device._lastEventValues).toEqual({});

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert any clipboardData but send clipboards data - if there are no alerts in config but clipboardData is not empty", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      eventClipboardContent = [
        {
          elementId: alert1ID,
          value: "additional text alert 1",
          tickId: 9001,
        },
        {
          elementId: alert2ID,
          value: "additional text alert 2",
          tickId: 9002,
        },
        {
          elementId: alert3ID,
          value: "additional text alert 3",
          tickId: 9003,
        },
      ];

      payload.eventsToSendConfig = {};

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 3 times - 3 from clipboard - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //checking clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(
        eventClipboardContent[0].tickId
      );
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(
        eventClipboardContent[0].elementId
      );
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(
        eventClipboardContent[0].value
      );

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(
        eventClipboardContent[1].tickId
      );
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(
        eventClipboardContent[1].elementId
      );
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(
        eventClipboardContent[1].value
      );

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventClipboardContent[2].tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventClipboardContent[2].elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventClipboardContent[2].value
      );

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //any last values should have been assigned
      expect(device._lastEventValues).toEqual({});

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should insert and send only alerts that's interval fits tickId and exists in project", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      //variable1 and variable2 fits
      payload.eventsToSendConfig["fakeAlertID"] = {
        elementId: "fakeAlertID",
        deviceId: "testDevice1ID",
        sendingInterval: 5,
      };

      await exec();

      await testValidRefresh();
    });

    it("should not insert and send alert that's value and lastValueTick has not changed", async () => {
      lastEventValues = {
        [alert2ID]: {
          value: alert2Value,
          tickId: alert2LastValueTick,
        },
      };

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 2 times  - for alert variables, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(5);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //only alerts value that fits should be assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should insert and send alerts that's value did not changed but lastValueTick has changed", async () => {
      lastEventValues = {
        [alert2ID]: {
          value: alert2Value,
          tickId: alert2LastValueTick - 1,
        },
      };

      await exec();

      await testValidRefresh();
    });

    it("should insert and send alerts that's value changed but lastValueTick has not changed", async () => {
      lastEventValues = {
        [alert2ID]: {
          value: alert2Value + "test text",
          tickId: alert2LastValueTick,
        },
      };
      await exec();

      await testValidRefresh();
    });

    it("should not insert new value but set it to lastEventValues - if new value is null and lastValues is not empty", async () => {
      lastEventValues = {
        [alert2ID]: {
          value: "testText",
          tickId: 1001,
        },
      };

      alert2Value = null;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 5 times - 2 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(5);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: null },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not insert new value but set it to lastEventValues - if new value is null and lastValues is empty", async () => {
      lastEventValues = {};

      alert2Value = null;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(4);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[3][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 5 times - 2 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(5);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: null },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //There should be no data in storage - every file is deleted
      let dataStorageContent = await device._dataStorage.getAllIDs();
      expect(dataStorageContent).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    //#endregion FILLING EVENT CLIPBOARD

    //#region SENDING DATA CLIPBOARD EXCEPTIONS

    it("should save data to storage and not try to send files from storage - if send data throws, data storage size is enought", async () => {
      SendDataMockFunc = jest.fn(async () => {
        throw Error("Sending data error");
      });

      await exec();

      //#region CHECKING SEND DATA

      //Sending only one time - data files should not be send in case there is a problem with sending clipboard.
      expect(SendDataMockFunc).toHaveBeenCalledTimes(1);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs.length).toEqual(4);
      expect(dataStorageIDs).toContain(dataStorageFile1ID);
      expect(dataStorageIDs).toContain(dataStorageFile2ID);
      expect(dataStorageIDs).toContain(dataStorageFile3ID);

      //Check new storage data
      let newDataID = dataStorageIDs.filter(
        (element) =>
          element !== dataStorageFile1ID &&
          element !== dataStorageFile2ID &&
          element !== dataStorageFile3ID
      )[0];

      let newDataContent = await device._dataStorage.getData(newDataID);

      expect(newDataContent).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should save data to storage and remove oldest stroage file and not try to send files from storage - if send data throws, data storage size is too small", async () => {
      SendDataMockFunc = jest.fn(async () => {
        throw Error("Sending data error");
      });

      payload.dataStorageSize = 3;

      await exec();

      //#region CHECKING SEND DATA

      //Sending only one time - data files should not be send in case there is a problem with sending clipboard.
      expect(SendDataMockFunc).toHaveBeenCalledTimes(1);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //dataStorageFile1 should have been deleted
      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs.length).toEqual(3);
      expect(dataStorageIDs).toContain(dataStorageFile2ID);
      expect(dataStorageIDs).toContain(dataStorageFile3ID);

      //Check new storage data
      let newDataID = dataStorageIDs.filter(
        (element) =>
          element !== dataStorageFile2ID && element !== dataStorageFile3ID
      )[0];

      let newDataContent = await device._dataStorage.getData(newDataID);

      expect(newDataContent).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should save data to storage and not try to send files from storage - if send data throws, data storage is empty", async () => {
      addDataStorageFile1 = false;
      addDataStorageFile2 = false;
      addDataStorageFile3 = false;

      SendDataMockFunc = jest.fn(async () => {
        throw Error("Sending data error");
      });

      await exec();

      //#region CHECKING SEND DATA

      //Sending only one time - data files should not be send in case there is a problem with sending clipboard.
      expect(SendDataMockFunc).toHaveBeenCalledTimes(1);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs.length).toEqual(1);
      //Check new storage data
      let newDataID = dataStorageIDs[0];
      let newDataContent = await device._dataStorage.getData(newDataID);

      expect(newDataContent).toEqual({
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      });

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not send data from clipboard and not save it in storage - if clipboard data is empty", async () => {
      //Setting interval to not fit tick
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      dataClipboardContent = {};

      //checking whether lasts data values was changed
      lastDataValues = {
        variable1ID: { tickId: 11, value: 123 },
        variable2ID: { tickId: 12, value: 456 },
        variable3ID: { tickId: 13, value: 789 },
      };

      //variable1 and variable2 fits
      payload.dataToSendConfig[variable1ID].sendingInterval = 23;
      payload.dataToSendConfig[variable2ID].sendingInterval = 23;
      payload.dataToSendConfig[variable3ID].sendingInterval = 23;

      await exec();

      //#region CHECKING SEND DATA

      expect(SendDataMockFunc).toHaveBeenCalledTimes(3);

      //Checking data files sending

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(
        dataStorageFile3Content
      );
      expect(SendDataMockFunc.mock.calls[1][0]).toEqual(
        dataStorageFile2Content
      );
      expect(SendDataMockFunc.mock.calls[2][0]).toEqual(
        dataStorageFile1Content
      );

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //last data values should not have been changed
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: 11, value: 123 },
        variable2ID: { tickId: 12, value: 456 },
        variable3ID: { tickId: 13, value: 789 },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //Data file should have been send
      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not send data from clipboard but fill it - if clipboard data is empty and tick id does not fit sendingDataInterval", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      dataClipboardContent = {};

      //checking whether lasts data values was changed
      lastDataValues = {
        variable1ID: { tickId: 11, value: 123 },
        variable2ID: { tickId: 12, value: 456 },
        variable3ID: { tickId: 13, value: 789 },
      };

      //variable1 and variable2 fits
      payload.sendDataFileInterval = 23;

      await exec();

      //#region CHECKING SEND DATA

      //Send data should not have been called - does not fit sendDataInterval

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //last data values should have been changed
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: { [variable1ID]: variable1Value },
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //#region CHECKING DATA STORAGE

      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs.length).toEqual(3);
      expect(dataStorageIDs).toContain(dataStorageFile1ID);
      expect(dataStorageIDs).toContain(dataStorageFile2ID);
      expect(dataStorageIDs).toContain(dataStorageFile3ID);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not send data from clipboard but extend it - if clipboard data is not empty and tick id does not fit sendingDataInterval", async () => {
      tickId = 1 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

      //Three examples - the same tick id, the same tickid and  variable id, the same variable tick and values
      dataClipboardContent = {
        [variable1LastValueTick]: { [variable2ID]: variable2Value },
        [variable2LastValueTick]: { [variable2ID]: 1234 },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      };

      //checking whether lasts data values was changed
      lastDataValues = {
        variable1ID: { tickId: 11, value: 123 },
        variable2ID: { tickId: 12, value: 456 },
        variable3ID: { tickId: 13, value: 789 },
      };

      //variable1 and variable2 fits
      payload.sendDataFileInterval = 23;

      await exec();

      //#region CHECKING SEND DATA

      //Send data should not have been called - does not fit sendDataInterval

      expect(SendDataMockFunc).not.toHaveBeenCalled();

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //last data values should have been changed
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({
        [variable1LastValueTick]: {
          [variable2ID]: variable2Value,
          [variable1ID]: variable1Value,
        },
        [variable2LastValueTick]: { [variable2ID]: variable2Value },
        [variable3LastValueTick]: { [variable3ID]: variable3Value },
      });

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      //#region CHECKING DATA STORAGE

      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs.length).toEqual(3);
      expect(dataStorageIDs).toContain(dataStorageFile1ID);
      expect(dataStorageIDs).toContain(dataStorageFile2ID);
      expect(dataStorageIDs).toContain(dataStorageFile3ID);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should not save the data to storage - if send data throws, but data storage buffer is 0", async () => {
      addDataStorageFile1 = false;
      addDataStorageFile2 = false;
      addDataStorageFile3 = false;

      SendDataMockFunc = jest.fn(async () => {
        throw Error("Sending data error");
      });

      payload.dataStorageSize = 0;

      await exec();

      //#region CHECKING SEND DATA

      //Sending only one time - data files should not be send in case there is a problem with sending clipboard.
      expect(SendDataMockFunc).toHaveBeenCalledTimes(1);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    it("should send data properly - if data storage buffer is 0 and there are no files", async () => {
      addDataStorageFile1 = false;
      addDataStorageFile2 = false;
      addDataStorageFile3 = false;

      payload.dataStorageSize = 0;

      await exec();

      //#region CHECKING SEND DATA

      //Sending only one time - data files should not be send in case there is a problem with sending clipboard.
      expect(SendDataMockFunc).toHaveBeenCalledTimes(1);

      //Checking data clipboard sending

      let expectedContent = {
        [variable1LastValueTick]: {
          variable1ID: variable1Value,
        },
        [variable2LastValueTick]: {
          variable2ID: variable2Value,
        },
        [variable3LastValueTick]: {
          variable3ID: variable3Value,
        },
      };

      expect(SendDataMockFunc.mock.calls[0][0]).toEqual(expectedContent);

      //#endregion CHECKING SEND DATA

      //#region CHECKING SEND EVENT

      //SendEvents should have been invoked 6 times - 3 times  - for every alert variable, 3 times - from files
      expect(SendEventMockFunc).toHaveBeenCalledTimes(6);

      //Checking event clipboard sending

      expect(SendEventMockFunc.mock.calls[0][0]).toEqual(alert1LastValueTick);
      expect(SendEventMockFunc.mock.calls[0][1]).toEqual(alert1ID);
      expect(SendEventMockFunc.mock.calls[0][2]).toEqual(alert1Value);

      expect(SendEventMockFunc.mock.calls[1][0]).toEqual(alert2LastValueTick);
      expect(SendEventMockFunc.mock.calls[1][1]).toEqual(alert2ID);
      expect(SendEventMockFunc.mock.calls[1][2]).toEqual(alert2Value);

      expect(SendEventMockFunc.mock.calls[2][0]).toEqual(alert3LastValueTick);
      expect(SendEventMockFunc.mock.calls[2][1]).toEqual(alert3ID);
      expect(SendEventMockFunc.mock.calls[2][2]).toEqual(alert3Value);

      //Checking event file sending

      expect(SendEventMockFunc.mock.calls[3][0]).toEqual(
        eventStorageFile3Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[3][1]).toEqual(
        eventStorageFile3Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[3][2]).toEqual(
        eventStorageFile3Content.value
      );

      expect(SendEventMockFunc.mock.calls[4][0]).toEqual(
        eventStorageFile2Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[4][1]).toEqual(
        eventStorageFile2Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[4][2]).toEqual(
        eventStorageFile2Content.value
      );

      expect(SendEventMockFunc.mock.calls[5][0]).toEqual(
        eventStorageFile1Content.tickId
      );
      expect(SendEventMockFunc.mock.calls[5][1]).toEqual(
        eventStorageFile1Content.elementId
      );
      expect(SendEventMockFunc.mock.calls[5][2]).toEqual(
        eventStorageFile1Content.value
      );

      //#endregion CHECKING SEND EVENT

      //#region CHECKING DATA LAST VALUES

      //all last values should have been assigned
      expect(device._lastDataValues).toEqual({
        variable1ID: { tickId: variable1LastValueTick, value: variable1Value },
        variable2ID: { tickId: variable2LastValueTick, value: variable2Value },
        variable3ID: { tickId: variable3LastValueTick, value: variable3Value },
      });

      //#endregion CHECKING DATA LAST VALUES

      //#region CHECKING EVENT LAST VALUES

      //all last values should have been assigned
      expect(device._lastEventValues).toEqual({
        alert1ID: { tickId: alert1LastValueTick, value: alert1Value },
        alert2ID: { tickId: alert2LastValueTick, value: alert2Value },
        alert3ID: { tickId: alert3LastValueTick, value: alert3Value },
      });

      //#endregion CHECKING EVENT LAST VALUES

      //#region CHECKING DATA CLIPBOARD

      //Clipboard should have been cleared
      expect(device._dataClipboard.getAllData()).toEqual({});

      //#endregion CHECKING DATA CLIPBOARD

      //#region CHECKING EVENT CLIPBOARD

      expect(device._eventClipboard.getAllData()).toEqual([]);

      //#endregion CHECKING EVENT CLIPBOARD

      //#region CHECKING DATA STORAGE

      let dataStorageIDs = await device._dataStorage.getAllIDs();
      expect(dataStorageIDs).toEqual([]);

      //#endregion CHECKING DATA STORAGE

      //#region CHECKING EVENT STORAGE

      //There should be no data in storage - every file is deleted
      let eventStorageContent = await device._eventStorage.getAllIDs();
      expect(eventStorageContent).toEqual([]);

      //#endregion CHECKING EVENT STORAGE

      //#region CHECKING BOARDED STATE

      //boarded state should be assigned from checkIfBoarded.
      expect(device.Boarded).toEqual(true);

      //#endregion CHECKING BOARDED STATE
    });

    //#endregion SENDING DATA CLIPBOARD EXCEPTIONS

    //#region SENDING DATA FILES EXCEPTIONS

    //TODO - add these tests

    //#endregion SENDING DATA FILES EXCEPTIONS

    //#region SENDING EVENT CLIPBOARD EXCEPTIONS

    //TODO - add these tests

    //#endregion SENDING EVENT CLIPBOARD EXCEPTIONS

    //#region SENDING EVENT FILES EXCEPTIONS

    //TODO - add these tests

    //#endregion SENDING EVENT FILES EXCEPTIONS
  });
});
