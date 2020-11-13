const { snooze } = require("../../../../utilities/utilities");
const {
  createFakeConnectableVariable,
  createFakeAlert,
  createFakeCalcElement,
  createFakeConnectableDevice,
  wrapMethodToInvokeAfter,
  createFakeProtocolRequest,
  createFakeDevice,
} = require("../../../utilities/testUtilities");
const logger = require("../../../../logger/logger");
const ConnectableDevice = require("../../../../classes/Device/ConnectableDevice/ConnectableDevice");
const RequestManager = require("../../../../classes/Request/RequestManager");
const Driver = require("../../../../classes/Driver/Driver");

describe("ConnectableDevice", () => {
  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "testProject";
    });

    let exec = () => {
      return new ConnectableDevice(project);
    };

    it("should create new ConnectableDevice and set RequestManager and Driver to null", () => {
      let driver = exec();

      expect(driver).toBeDefined();

      expect(driver.RequestManager).toEqual(null);
      expect(driver.Driver).toEqual(null);
    });

    it("should assign project to ConnectableDevice", () => {
      let result = exec();

      expect(result._project).toEqual(project);
    });

    it("should set _continueIfRequestThrows to false", () => {
      let result = exec();

      expect(result._continueIfRequestThrows).toEqual(false);
    });
  });

  describe("init", () => {
    let project;
    let device;
    let payload;
    let requestManagerMock;
    let driverMock;

    beforeEach(() => {
      project = "testProject";
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "ConncectableDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        timeout: 2500,
      };
      requestManagerMock = new RequestManager();
      requestManagerMock.createRequests = jest.fn();
      driverMock = new Driver();
      driverMock.activate = jest.fn();
      driverMock.deactivate = jest.fn();
    });

    let exec = async () => {
      device = new ConnectableDevice(project);
      device._requestManager = requestManagerMock;
      device._driver = driverMock;
      return device.init(payload);
    };

    it("should initialize connectableDevice based on payload", async () => {
      await exec();

      expect(device.ID).toEqual(payload.id);
      expect(device.Name).toEqual(payload.name);
      expect(device.Type).toEqual(payload.type);
      expect(device.Variables).toEqual(payload.variables);
      expect(device.CalcElements).toEqual(payload.calcElements);
      expect(device.Alerts).toEqual(payload.alerts);
      expect(device.Timeout).toEqual(payload.timeout);
    });

    it("should call activate of driver if is active is set to true", async () => {
      payload.isActive = true;

      await exec();

      expect(driverMock.activate).toHaveBeenCalledTimes(1);
      expect(driverMock.deactivate).not.toHaveBeenCalled();
    });

    it("should call deactivate of driver if is active is set to false", async () => {
      payload.isActive = false;

      await exec();

      expect(driverMock.activate).not.toHaveBeenCalled();
      expect(driverMock.deactivate).toHaveBeenCalledTimes(1);
    });
  });

  describe("generatePayload", () => {
    let project;
    let device;
    let deviceId;
    let deviceName;
    let deviceType;
    let isDriverActive;
    let isDriverConnected;
    let isDriverBusy;
    let driverConnectMock;
    let driverDisconnectMock;
    let driverProcessRequestMock;
    let driverTimeout;
    let driverConnectDelay;
    let driverDisconnectDelay;
    let driverProcessRequestDelay;
    let driverProcessRequestResult;
    let variable1;
    let variable2;
    let variable3;
    let variable4;
    let variable5;
    let variables;
    let variable1ConvertDataToValueMockFunc;
    let variable2ConvertDataToValueMockFunc;
    let variable3ConvertDataToValueMockFunc;
    let variable4ConvertDataToValueMockFunc;
    let variable5ConvertDataToValueMockFunc;
    let variable1ConvertValueToDataMockFunc;
    let variable2ConvertValueToDataMockFunc;
    let variable3ConvertValueToDataMockFunc;
    let variable4ConvertValueToDataMockFunc;
    let variable5ConvertValueToDataMockFunc;
    let request1;
    let request2;
    let request3;
    let requests;
    let request1Variables;
    let request2Variables;
    let request3Variables;
    let request1SampleTime;
    let request2SampleTime;
    let request3SampleTime;
    let request1Write;
    let request2Write;
    let request3Write;
    let request1WriteDataToVariablesMockFunc;
    let request2WriteDataToVariablesMockFunc;
    let request3WriteDataToVariablesMockFunc;
    let calcElement1;
    let calcElement2;
    let calcElement3;
    let calcElements;
    let calcElement1SampleTime;
    let calcElement2SampleTime;
    let calcElement3SampleTime;
    let calcElement1RefreshMock;
    let calcElement2RefreshMock;
    let calcElement3RefreshMock;
    let alert1;
    let alert2;
    let alert3;
    let alerts;
    let alert1SampleTime;
    let alert2SampleTime;
    let alert3SampleTime;
    let alert1RefreshMock;
    let alert2RefreshMock;
    let alert3RefreshMock;
    let addVariable1;
    let addVariable2;
    let addVariable3;
    let addVariable4;
    let addVariable5;
    let addCalcElement1;
    let addCalcElement2;
    let addCalcElement3;
    let addAlert1;
    let addAlert2;
    let addAlert3;

    beforeEach(() => {
      project = "testProject";
      deviceId = "device1ID";
      deviceName = "device1Name";
      deviceType = "FakeDevice";
      addVariable1 = true;
      addVariable2 = true;
      addVariable3 = true;
      addVariable4 = true;
      addVariable5 = true;
      addCalcElement1 = true;
      addCalcElement2 = true;
      addCalcElement3 = true;
      addAlert1 = true;
      addAlert2 = true;
      addAlert3 = true;

      driverProcessRequestResult = [1, 2, 3, 4];

      //#region init device

      isDriverActive = true;
      isDriverConnected = true;
      isDriverBusy = false;
      driverConnectMock = jest.fn();
      driverDisconnectMock = jest.fn();
      driverProcessRequestMock = jest.fn(() => {
        return driverProcessRequestResult;
      });
      driverTimeout = 500;
      driverConnectDelay = 100;
      driverDisconnectDelay = 100;
      driverProcessRequestDelay = 100;

      //#endregion init device

      //#region init variables

      variable1ConvertDataToValueMockFunc = jest.fn().mockReturnValue(1111);
      variable1ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([1, 1, 1, 1]);

      variable2ConvertDataToValueMockFunc = jest.fn().mockReturnValue(2222);
      variable2ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([2, 2, 2, 2]);

      variable3ConvertDataToValueMockFunc = jest.fn().mockReturnValue(3333);
      variable3ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([3, 3, 3, 3]);

      variable4ConvertDataToValueMockFunc = jest.fn().mockReturnValue(4444);
      variable4ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([4, 4, 4, 4]);

      variable5ConvertDataToValueMockFunc = jest.fn().mockReturnValue(5555);
      variable5ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([5, 5, 5, 5]);

      //#endregion init variables

      //#region init calcElements

      calcElement1RefreshMock = jest.fn();
      calcElement2RefreshMock = jest.fn();
      calcElement3RefreshMock = jest.fn();

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 2;
      calcElement3SampleTime = 3;

      //#endregion init calcElements

      //#region init alerts

      alert1RefreshMock = jest.fn();
      alert2RefreshMock = jest.fn();
      alert3RefreshMock = jest.fn();

      alert1SampleTime = 1;
      alert2SampleTime = 2;
      alert3SampleTime = 3;

      //#endregion init alerts

      //#region init request

      request1WriteDataToVariablesMockFunc = jest.fn();
      request2WriteDataToVariablesMockFunc = jest.fn();
      request3WriteDataToVariablesMockFunc = jest.fn();

      request1Variables = [variable1, variable4];
      request2Variables = [variable2, variable5];
      request3Variables = [variable3];

      request1SampleTime = 1;
      request2SampleTime = 2;
      request3SampleTime = 3;

      request1Write = false;
      request2Write = true;
      request3Write = false;

      //#endregion init request
    });

    let exec = async () => {
      //#region create variables

      variables = [];

      variable1 = createFakeConnectableVariable(
        project,
        null,
        "variable1ID",
        "variable1Name",
        "FakeVariable",
        1,
        "FakeUnit",
        1,
        [1, 1],
        variable1ConvertDataToValueMockFunc,
        variable1ConvertValueToDataMockFunc
      );

      variable2 = createFakeConnectableVariable(
        project,
        null,
        "variable2ID",
        "variable2Name",
        "FakeVariable",
        2,
        "FakeUnit",
        2,
        [2, 2],
        variable2ConvertDataToValueMockFunc,
        variable2ConvertValueToDataMockFunc
      );

      variable3 = createFakeConnectableVariable(
        project,
        null,
        "variable3ID",
        "variable3Name",
        "FakeVariable",
        3,
        "FakeUnit",
        3,
        [3, 3],
        variable3ConvertDataToValueMockFunc,
        variable3ConvertValueToDataMockFunc
      );

      variable4 = createFakeConnectableVariable(
        project,
        null,
        "variable4ID",
        "variable4Name",
        "FakeVariable",
        4,
        "FakeUnit",
        1,
        [4, 4],
        variable4ConvertDataToValueMockFunc,
        variable4ConvertValueToDataMockFunc
      );

      variable5 = createFakeConnectableVariable(
        project,
        null,
        "variable5ID",
        "variable5Name",
        "FakeVariable",
        5,
        "FakeUnit",
        2,
        [5, 5],
        variable5ConvertDataToValueMockFunc,
        variable5ConvertValueToDataMockFunc
      );

      if (addVariable1) variables.push(variable1);
      if (addVariable2) variables.push(variable2);
      if (addVariable3) variables.push(variable3);
      if (addVariable4) variables.push(variable4);
      if (addVariable5) variables.push(variable5);

      //#endregion create variables

      //#region create calcElements

      calcElements = [];

      calcElement1 = createFakeCalcElement(
        project,
        null,
        "calcElement1ID",
        "calcElement1Name",
        "FakeCalcElement",
        1,
        "FakeUnit",
        calcElement1SampleTime,
        calcElement1RefreshMock
      );

      calcElement2 = createFakeCalcElement(
        project,
        null,
        "calcElement2ID",
        "calcElement2Name",
        "FakeCalcElement",
        2,
        "FakeUnit",
        calcElement2SampleTime,
        calcElement2RefreshMock
      );

      calcElement3 = createFakeCalcElement(
        project,
        null,
        "calcElement3ID",
        "calcElement3Name",
        "FakeCalcElement",
        3,
        "FakeUnit",
        calcElement3SampleTime,
        calcElement3RefreshMock
      );

      if (addCalcElement1) calcElements.push(calcElement1);
      if (addCalcElement2) calcElements.push(calcElement2);
      if (addCalcElement3) calcElements.push(calcElement3);

      //#endregion create calcElements

      //#region create alerts

      alerts = [];

      alert1 = createFakeAlert(
        project,
        null,
        "alert1ID",
        "alert1Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert1SampleTime,
        alert1RefreshMock
      );

      alert2 = createFakeAlert(
        project,
        null,
        "alert2ID",
        "alert2Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert2SampleTime,
        alert2RefreshMock
      );

      alert3 = createFakeAlert(
        project,
        null,
        "alert3ID",
        "alert3Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert3SampleTime,
        alert3RefreshMock
      );

      if (addAlert1) alerts.push(alert1);
      if (addAlert2) alerts.push(alert2);
      if (addAlert3) alerts.push(alert3);

      //#endregion create alerts

      //#region create request

      request1 = createFakeProtocolRequest(
        request1Variables,
        request1SampleTime,
        request1Write,
        wrapMethodToInvokeAfter(request1WriteDataToVariablesMockFunc, 100)
      );

      request2 = createFakeProtocolRequest(
        request2Variables,
        request2SampleTime,
        request2Write,
        wrapMethodToInvokeAfter(request2WriteDataToVariablesMockFunc, 100)
      );

      request3 = createFakeProtocolRequest(
        request3Variables,
        request3SampleTime,
        request3Write,
        wrapMethodToInvokeAfter(request3WriteDataToVariablesMockFunc, 100)
      );

      requests = [request1, request2, request3];

      //#endregion create requests

      device = createFakeConnectableDevice(
        project,
        deviceId,
        deviceType,
        deviceName,
        variables,
        requests,
        calcElements,
        alerts,
        isDriverActive,
        isDriverConnected,
        isDriverBusy,
        wrapMethodToInvokeAfter(driverConnectMock, driverConnectDelay),
        wrapMethodToInvokeAfter(driverDisconnectMock, driverDisconnectDelay),
        wrapMethodToInvokeAfter(
          driverProcessRequestMock,
          driverProcessRequestDelay
        ),
        driverTimeout
      );

      return device.generatePayload();
    };

    it("should return valid payload of device - if active is true and connected is true", async () => {
      isDriverActive = true;
      isDriverConnected = true;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: isDriverActive,
        isConnected: isDriverConnected,
        timeout: driverTimeout,
        variables: {},
        alerts: {},
        calcElements: {},
      };

      for (let variable of variables) {
        let payload = variable.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.variables[variable.ID] = payload;
      }

      for (let calcElement of calcElements) {
        let payload = calcElement.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.calcElements[calcElement.ID] = payload;
      }

      for (let alert of alerts) {
        let payload = alert.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.alerts[alert.ID] = payload;
      }

      expect(result).toEqual(expectedPayload);
    });

    it("should return valid payload of device - if active is false and connected is false", async () => {
      isDriverActive = false;
      isDriverConnected = false;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: isDriverActive,
        isConnected: isDriverConnected,
        timeout: driverTimeout,
        variables: {},
        alerts: {},
        calcElements: {},
      };

      for (let variable of variables) {
        let payload = variable.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.variables[variable.ID] = payload;
      }

      for (let calcElement of calcElements) {
        let payload = calcElement.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.calcElements[calcElement.ID] = payload;
      }

      for (let alert of alerts) {
        let payload = alert.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.alerts[alert.ID] = payload;
      }

      expect(result).toEqual(expectedPayload);
    });

    it("should return valid payload of device - if there are no variables, calcElements and alerts", async () => {
      addVariable1 = false;
      addVariable2 = false;
      addVariable3 = false;
      addVariable4 = false;
      addVariable5 = false;
      addAlert1 = false;
      addAlert2 = false;
      addAlert3 = false;
      addCalcElement1 = false;
      addCalcElement2 = false;
      addCalcElement3 = false;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: isDriverActive,
        isConnected: isDriverConnected,
        timeout: driverTimeout,
        variables: {},
        alerts: {},
        calcElements: {},
      };

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("IsActive", () => {
    let project;
    let device;
    let isDriverActive;
    let isDriverConnected;
    let isDriverBusy;
    let driverConnectMock;
    let driverDisconnectMock;

    beforeEach(() => {
      project = "testProject";
      isDriverActive = false;
      isDriverConnected = false;
      isDriverBusy = false;
      driverConnectMock = jest.fn();
      driverDisconnectMock = jest.fn();
    });

    let exec = async () => {
      device = createFakeConnectableDevice(
        project,
        "device1Id",
        "FakeDevice",
        "device1Name",
        [],
        [],
        [],
        [],
        isDriverActive,
        isDriverConnected,
        isDriverBusy,
        driverConnectMock,
        driverDisconnectMock,
        jest.fn(),
        100
      );
      return device.IsActive;
    };

    it("should return driver's active state - if state is true", async () => {
      isDriverActive = true;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return driver's active state - if state is false", async () => {
      isDriverActive = false;

      let result = await exec();

      expect(result).toEqual(false);
    });
  });

  describe("IsConnected", () => {
    let project;
    let device;
    let isDriverActive;
    let isDriverConnected;
    let isDriverBusy;
    let driverConnectMock;
    let driverDisconnectMock;

    beforeEach(() => {
      project = "testProject";
      isDriverActive = false;
      isDriverConnected = false;
      isDriverBusy = false;
      driverConnectMock = jest.fn();
      driverDisconnectMock = jest.fn();
    });

    let exec = async () => {
      device = createFakeConnectableDevice(
        project,
        "device1Id",
        "FakeDevice",
        "device1Name",
        [],
        [],
        [],
        [],
        isDriverActive,
        isDriverConnected,
        isDriverBusy,
        driverConnectMock,
        driverDisconnectMock,
        jest.fn(),
        100
      );
      return device.IsConnected;
    };

    it("should return driver's connected state - if state is true", async () => {
      isDriverConnected = true;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return driver's connected state - if state is false", async () => {
      isDriverConnected = false;

      let result = await exec();

      expect(result).toEqual(false);
    });
  });

  describe("Timeout", () => {
    let project;
    let device;
    let isDriverActive;
    let isDriverConnected;
    let isDriverBusy;
    let driversTimeout;
    let driverConnectMock;
    let driverDisconnectMock;

    beforeEach(() => {
      project = "testProject";
      isDriverActive = false;
      isDriverConnected = false;
      isDriverBusy = false;
      driverConnectMock = jest.fn();
      driverDisconnectMock = jest.fn();
      driversTimeout = 123;
    });

    let exec = async () => {
      device = createFakeConnectableDevice(
        project,
        "device1Id",
        "FakeDevice",
        "device1Name",
        [],
        [],
        [],
        [],
        isDriverActive,
        isDriverConnected,
        isDriverBusy,
        driverConnectMock,
        driverDisconnectMock,
        jest.fn(),
        driversTimeout
      );
      return device.Timeout;
    };

    it("should return driver's timeout", async () => {
      let result = await exec();

      expect(result).toEqual(driversTimeout);
    });
  });

  describe("activate", () => {
    let project;
    let device;
    let isDriverActive;
    let isDriverConnected;
    let isDriverBusy;
    let driverConnectMock;
    let driverDisconnectMock;

    beforeEach(() => {
      project = "testProject";
      isDriverActive = false;
      isDriverConnected = false;
      isDriverBusy = false;
      driverConnectMock = jest.fn();
      driverDisconnectMock = jest.fn();
    });

    let exec = async () => {
      device = createFakeConnectableDevice(
        project,
        "device1Id",
        "FakeDevice",
        "device1Name",
        [],
        [],
        [],
        [],
        isDriverActive,
        isDriverConnected,
        isDriverBusy,
        driverConnectMock,
        driverDisconnectMock,
        jest.fn(),
        100
      );
      return device.activate();
    };

    it("should set driver's and device's IsActive to true", async () => {
      await exec();

      expect(device.IsActive).toEqual(true);
      expect(device.Driver.IsActive).toEqual(true);
    });

    it("should not throw if device is already active", async () => {
      isDriverActive = true;

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

      expect(device.IsActive).toEqual(true);
      expect(device.Driver.IsActive).toEqual(true);
    });
  });

  describe("deactivate", () => {
    let project;
    let device;
    let isDriverActive;
    let isDriverConnected;
    let isDriverBusy;
    let driverConnectMock;
    let driverDisconnectMock;

    beforeEach(() => {
      project = "testProject";
      isDriverActive = true;
      isDriverConnected = false;
      isDriverBusy = false;
      driverConnectMock = jest.fn();
      driverDisconnectMock = jest.fn();
    });

    let exec = async () => {
      device = createFakeConnectableDevice(
        project,
        "device1Id",
        "FakeDevice",
        "device1Name",
        [],
        [],
        [],
        [],
        isDriverActive,
        isDriverConnected,
        isDriverBusy,
        driverConnectMock,
        driverDisconnectMock,
        jest.fn(),
        100
      );
      return device.deactivate();
    };

    it("should set device's and driver's IsActive to false", async () => {
      await exec();

      expect(device.Driver.IsActive).toEqual(false);
      expect(device.IsActive).toEqual(false);
    });

    it("should not throw if device is deactive", async () => {
      isDriverActive = false;

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

      expect(device.Driver.IsActive).toEqual(false);
      expect(device.IsActive).toEqual(false);
    });
  });

  describe("refresh", () => {
    let project;
    let device;
    let isDriverActive;
    let isDriverConnected;
    let isDriverBusy;
    let driverConnectMock;
    let driverDisconnectMock;
    let driverProcessRequestMock;
    let driverTimeout;
    let driverConnectDelay;
    let driverDisconnectDelay;
    let driverProcessRequestDelay;
    let driverProcessRequestResult;
    let deviceContinueOnRequestThrow;
    let variable1;
    let variable2;
    let variable3;
    let variable4;
    let variable5;
    let variables;
    let variable1ConvertDataToValueMockFunc;
    let variable2ConvertDataToValueMockFunc;
    let variable3ConvertDataToValueMockFunc;
    let variable4ConvertDataToValueMockFunc;
    let variable5ConvertDataToValueMockFunc;
    let variable1ConvertValueToDataMockFunc;
    let variable2ConvertValueToDataMockFunc;
    let variable3ConvertValueToDataMockFunc;
    let variable4ConvertValueToDataMockFunc;
    let variable5ConvertValueToDataMockFunc;
    let request1;
    let request2;
    let request3;
    let requests;
    let request1Variables;
    let request2Variables;
    let request3Variables;
    let request1SampleTime;
    let request2SampleTime;
    let request3SampleTime;
    let request1Write;
    let request2Write;
    let request3Write;
    let request1WriteDataToVariablesMockFunc;
    let request2WriteDataToVariablesMockFunc;
    let request3WriteDataToVariablesMockFunc;
    let calcElement1;
    let calcElement2;
    let calcElement3;
    let calcElements;
    let calcElement1SampleTime;
    let calcElement2SampleTime;
    let calcElement3SampleTime;
    let calcElement1RefreshMock;
    let calcElement2RefreshMock;
    let calcElement3RefreshMock;
    let alert1;
    let alert2;
    let alert3;
    let alerts;
    let alert1SampleTime;
    let alert2SampleTime;
    let alert3SampleTime;
    let alert1RefreshMock;
    let alert2RefreshMock;
    let alert3RefreshMock;
    let tickNumber;
    let loggerWarnMock;
    let loggerWarnOriginal;

    beforeEach(() => {
      project = "testProject";
      loggerWarnMock = jest.fn();
      loggerWarnOriginal = logger.warn;
      logger.warn = loggerWarnMock;

      tickNumber = 15;

      driverProcessRequestResult = [1, 2, 3, 4];

      //#region init device

      deviceContinueOnRequestThrow = true;
      isDriverActive = true;
      isDriverConnected = true;
      isDriverBusy = false;
      driverConnectMock = jest.fn();
      driverDisconnectMock = jest.fn();
      driverProcessRequestMock = jest.fn(() => {
        return driverProcessRequestResult;
      });
      driverTimeout = 500;
      driverConnectDelay = 100;
      driverDisconnectDelay = 100;
      driverProcessRequestDelay = 100;

      //#endregion init device

      //#region init variables

      variable1ConvertDataToValueMockFunc = jest.fn().mockReturnValue(1111);
      variable1ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([1, 1, 1, 1]);

      variable2ConvertDataToValueMockFunc = jest.fn().mockReturnValue(2222);
      variable2ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([2, 2, 2, 2]);

      variable3ConvertDataToValueMockFunc = jest.fn().mockReturnValue(3333);
      variable3ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([3, 3, 3, 3]);

      variable4ConvertDataToValueMockFunc = jest.fn().mockReturnValue(4444);
      variable4ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([4, 4, 4, 4]);

      variable5ConvertDataToValueMockFunc = jest.fn().mockReturnValue(5555);
      variable5ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([5, 5, 5, 5]);

      //#endregion init variables

      //#region init calcElements

      calcElement1RefreshMock = jest.fn();
      calcElement2RefreshMock = jest.fn();
      calcElement3RefreshMock = jest.fn();

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 2;
      calcElement3SampleTime = 3;

      //#endregion init calcElements

      //#region init alerts

      alert1RefreshMock = jest.fn();
      alert2RefreshMock = jest.fn();
      alert3RefreshMock = jest.fn();

      alert1SampleTime = 1;
      alert2SampleTime = 2;
      alert3SampleTime = 3;

      //#endregion init alerts

      //#region init request

      request1WriteDataToVariablesMockFunc = jest.fn();
      request2WriteDataToVariablesMockFunc = jest.fn();
      request3WriteDataToVariablesMockFunc = jest.fn();

      request1Variables = [variable1, variable4];
      request2Variables = [variable2, variable5];
      request3Variables = [variable3];

      request1SampleTime = 1;
      request2SampleTime = 2;
      request3SampleTime = 3;

      request1Write = false;
      request2Write = true;
      request3Write = false;

      //#endregion init request
    });

    afterEach(() => {
      logger.warn = loggerWarnOriginal;
    });

    let exec = async () => {
      //#region create variables

      variable1 = createFakeConnectableVariable(
        project,
        null,
        "variable1ID",
        "variable1Name",
        "FakeVariable",
        1,
        "FakeUnit",
        1,
        [1, 1],
        variable1ConvertDataToValueMockFunc,
        variable1ConvertValueToDataMockFunc
      );

      variable2 = createFakeConnectableVariable(
        project,
        null,
        "variable2ID",
        "variable2Name",
        "FakeVariable",
        2,
        "FakeUnit",
        2,
        [2, 2],
        variable2ConvertDataToValueMockFunc,
        variable2ConvertValueToDataMockFunc
      );

      variable3 = createFakeConnectableVariable(
        project,
        null,
        "variable3ID",
        "variable3Name",
        "FakeVariable",
        3,
        "FakeUnit",
        3,
        [3, 3],
        variable3ConvertDataToValueMockFunc,
        variable3ConvertValueToDataMockFunc
      );

      variable4 = createFakeConnectableVariable(
        project,
        null,
        "variable4ID",
        "variable4Name",
        "FakeVariable",
        4,
        "FakeUnit",
        1,
        [4, 4],
        variable4ConvertDataToValueMockFunc,
        variable4ConvertValueToDataMockFunc
      );

      variable5 = createFakeConnectableVariable(
        project,
        null,
        "variable5ID",
        "variable5Name",
        "FakeVariable",
        5,
        "FakeUnit",
        2,
        [5, 5],
        variable5ConvertDataToValueMockFunc,
        variable5ConvertValueToDataMockFunc
      );

      variables = [variable1, variable2, variable3, variable4, variable5];

      //#endregion create variables

      //#region create calcElements

      calcElement1 = createFakeCalcElement(
        project,
        null,
        "calcElement1ID",
        "calcElement1Name",
        "FakeCalcElement",
        1,
        "FakeUnit",
        calcElement1SampleTime,
        calcElement1RefreshMock
      );

      calcElement2 = createFakeCalcElement(
        project,
        null,
        "calcElement2ID",
        "calcElement2Name",
        "FakeCalcElement",
        2,
        "FakeUnit",
        calcElement2SampleTime,
        calcElement2RefreshMock
      );

      calcElement3 = createFakeCalcElement(
        project,
        null,
        "calcElement3ID",
        "calcElement3Name",
        "FakeCalcElement",
        3,
        "FakeUnit",
        calcElement3SampleTime,
        calcElement3RefreshMock
      );

      calcElements = [calcElement1, calcElement2, calcElement3];

      //#endregion create calcElements

      //#region create alerts

      alert1 = createFakeAlert(
        project,
        null,
        "alert1ID",
        "alert1Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert1SampleTime,
        alert1RefreshMock
      );

      alert2 = createFakeAlert(
        project,
        null,
        "alert2ID",
        "alert2Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert2SampleTime,
        alert2RefreshMock
      );

      alert3 = createFakeAlert(
        project,
        null,
        "alert3ID",
        "alert3Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert3SampleTime,
        alert3RefreshMock
      );

      alerts = [alert1, alert2, alert3];

      //#endregion create alerts

      //#region create request

      request1 = createFakeProtocolRequest(
        request1Variables,
        request1SampleTime,
        request1Write,
        wrapMethodToInvokeAfter(request1WriteDataToVariablesMockFunc, 100)
      );

      request2 = createFakeProtocolRequest(
        request2Variables,
        request2SampleTime,
        request2Write,
        wrapMethodToInvokeAfter(request2WriteDataToVariablesMockFunc, 100)
      );

      request3 = createFakeProtocolRequest(
        request3Variables,
        request3SampleTime,
        request3Write,
        wrapMethodToInvokeAfter(request3WriteDataToVariablesMockFunc, 100)
      );

      requests = [request1, request2, request3];

      //#endregion create requests

      device = createFakeConnectableDevice(
        project,
        "device1ID",
        "FakeDevice",
        "device1Name",
        variables,
        requests,
        calcElements,
        alerts,
        isDriverActive,
        isDriverConnected,
        isDriverBusy,
        wrapMethodToInvokeAfter(driverConnectMock, driverConnectDelay),
        wrapMethodToInvokeAfter(driverDisconnectMock, driverDisconnectDelay),
        wrapMethodToInvokeAfter(
          driverProcessRequestMock,
          driverProcessRequestDelay
        ),
        driverTimeout,
        deviceContinueOnRequestThrow
      );

      return device.refresh(tickNumber);
    };

    it("should process all requests, refresh all calcElements and alerts which sampleTime matches tickNumber 15", async () => {
      tickNumber = 15;

      await exec();

      //tickNumber is 15 - elements with sample time 1 and 3 should be invoked

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //processing two request with sample time 1 and 3
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(2);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);

      //Disconnect or connect should not have been called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);
    });

    it("should process all requests, refresh all calcElements and alerts which sampleTime if all element matches tickNumber - 6", async () => {
      tickNumber = 6;

      await exec();

      //tickNumber is 6 - all elements should be invoked

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //All requests should be processed
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(3);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[2][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[2][1]).toEqual(tickNumber);

      //Disconnect or connect should not have been called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);
    });

    it("should at first refresh variables (requests) than calcElements and then alerts", async () => {
      //Ensuring to invoke only one request - in order to check order between invoking request and setting its data to variables
      tickNumber = 1;

      //Ensuring all other element to be refreshed
      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      await exec();

      expect(driverProcessRequestMock).toHaveBeenCalledTimes(1);

      //First - driver should process request
      expect(driverProcessRequestMock).toHaveBeenCalledBefore(
        request1WriteDataToVariablesMockFunc
      );

      //Then data from processing request should be assigned to value 1 and 2
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );

      //Then refreshing all calcElements one by one
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );

      //Then refreshing all alerts one by one
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should not process any requests if sample time of any request does not match tickNumber 15", async () => {
      request1SampleTime = 2;
      request2SampleTime = 4;
      request3SampleTime = 6;

      tickNumber = 15;

      await exec();

      //tickNumber is 15 - elements with sample time 1 and 3 should be invoked

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //any request should not be processed
      expect(driverProcessRequestMock).not.toHaveBeenCalled();

      //Disconnect or connect should not have been called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //No request should be invoked - no writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);
    });

    it("should not refresh any calcElements if sample time of any calcElement does not match tickNumber 15", async () => {
      calcElement1SampleTime = 2;
      calcElement2SampleTime = 4;
      calcElement3SampleTime = 6;

      tickNumber = 15;

      await exec();

      //tickNumber is 15 - elements with sample time 1 and 3 should be invoked

      expect(calcElement1RefreshMock).not.toHaveBeenCalled();
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).not.toHaveBeenCalled();

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //processing two request with sample time 1 and 3
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(2);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);

      //Disconnect or connect should not have been called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
    });

    it("should not refresh any alert, if alert of any calcElement does not match tickNumber 15", async () => {
      alert1SampleTime = 2;
      alert2SampleTime = 4;
      alert3SampleTime = 6;

      tickNumber = 15;

      await exec();

      //tickNumber is 15 - elements with sample time 1 and 3 should be invoked

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).not.toHaveBeenCalled();
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).not.toHaveBeenCalled();

      //processing two request with sample time 1 and 3
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(2);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);

      //Disconnect or connect should not have been called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
    });

    it("should not throw and proceed with next actions - if refreshing one of requests throws - continueOnRequestThrow set to true", async () => {
      //making all elements to be called
      tickNumber = 6;
      //making second request (the one that throws) to be for read - writeData should not be called after throw
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(() => {
        numberOfCalls++;
        if (numberOfCalls === 2) throw new Error("test error");
        return driverProcessRequestResult;
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request should be processed - even that 2nd throws
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(3);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[2][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[2][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("test error");
    });

    it("should not throw and proceed with next actions - if refreshing one of requests takes too much time - continueOnRequestThrow set to true", async () => {
      //making all elements to be called
      tickNumber = 6;

      //making second request (the one that throws) to be for read - writeData should not be called after timeout
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(async () => {
        numberOfCalls++;
        if (numberOfCalls === 2) await snooze(1000);
        return driverProcessRequestResult;
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request should be processed - even that 2nd throws
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(3);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[2][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[2][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws due to timeout, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Processing data timeout error"
      );
    });

    it("should not throw and proceed with next actions - if refreshing one of requests throws and than disconnect throws - continueOnRequestThrow set to true", async () => {
      //making all elements to be called
      tickNumber = 6;
      //making second request (the one that throws) to be for read - writeData should not be called after throw
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(() => {
        numberOfCalls++;
        if (numberOfCalls === 2) throw new Error("test error");
        return driverProcessRequestResult;
      });

      driverDisconnectMock = jest.fn(() => {
        throw new Error("testError2");
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request should be processed - even that 2nd throws
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(3);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[2][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[2][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("test error");
    });

    it("should not throw and proceed with next actions - if refreshing one of requests takes too much time and than disconnect throws - continueOnRequestThrow set to true", async () => {
      //making all elements to be called
      tickNumber = 6;
      //making second request (the one that throws) to be for read - writeData should not be called after throw
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(async () => {
        numberOfCalls++;
        if (numberOfCalls === 2) await snooze(1000);
        return driverProcessRequestResult;
      });

      driverDisconnectMock = jest.fn(() => {
        throw new Error("testError2");
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request should be processed - even that 2nd throws
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(3);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[2][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[2][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Processing data timeout error"
      );
    });

    it("should not throw but not proceed with next requests - if refreshing one of requests throws - continueOnRequestThrow set to false", async () => {
      deviceContinueOnRequestThrow = false;

      //making all elements to be called
      tickNumber = 6;
      //making second request (the one that throws) to be for read - writeData should not be called after throw
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(() => {
        numberOfCalls++;
        if (numberOfCalls === 2) throw new Error("test error");
        return driverProcessRequestResult;
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request before second should be processed
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(2);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("test error");
    });

    it("should not throw but not proceed with next requests - if refreshing one of requests takes too much time - continueOnRequestThrow set to false", async () => {
      deviceContinueOnRequestThrow = false;

      //making all elements to be called
      tickNumber = 6;

      //making second request (the one that throws) to be for read - writeData should not be called after timeout
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(async () => {
        numberOfCalls++;
        if (numberOfCalls === 2) await snooze(1000);
        return driverProcessRequestResult;
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request before second should be processed
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(2);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws due to timeout, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Processing data timeout error"
      );
    });

    it("should not throw but not proceed with next requests - if refreshing one of requests throws and than disconnect throws - continueOnRequestThrow set to false", async () => {
      deviceContinueOnRequestThrow = false;

      //making all elements to be called
      tickNumber = 6;
      //making second request (the one that throws) to be for read - writeData should not be called after throw
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(() => {
        numberOfCalls++;
        if (numberOfCalls === 2) throw new Error("test error");
        return driverProcessRequestResult;
      });

      driverDisconnectMock = jest.fn(() => {
        throw new Error("testError2");
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request before 2nd should be called
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(2);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("test error");
    });

    it("should not throw but not proceed with next requests - if refreshing one of requests takes too much time and than disconnect throws - continueOnRequestThrow set to false", async () => {
      deviceContinueOnRequestThrow = false;

      //making all elements to be called
      tickNumber = 6;
      //making second request (the one that throws) to be for read - writeData should not be called after throw
      request2Write = false;

      let numberOfCalls = 0;

      //Throwing only during second refresh
      driverProcessRequestMock = jest.fn(async () => {
        numberOfCalls++;
        if (numberOfCalls === 2) await snooze(1000);
        return driverProcessRequestResult;
      });

      driverDisconnectMock = jest.fn(() => {
        throw new Error("testError2");
      });

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all requests before 2nd should be called
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(2);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);

      expect(driverConnectMock).not.toHaveBeenCalled();
      //Driver should call disconnect once - when processing throws, disconnect is mocked so connect will not be called again
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Processing data timeout error"
      );
    });

    it("should not throw and proceed with next actions - if refreshing one of calcElement throws", async () => {
      //making all elements to be called
      tickNumber = 6;

      calcElement2RefreshMock = async () => {
        throw new Error("testError1");
      };

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request should be processed - even that 2nd throws
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(3);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[2][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[2][1]).toEqual(tickNumber);

      //Connect and disconnect should not have been called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError1");
    });

    it("should not throw and proceed with next actions - if refreshing one of alerts throws", async () => {
      //making all elements to be called
      tickNumber = 6;

      alert2RefreshMock = async () => {
        throw new Error("testError1");
      };

      //refreshing should not throw
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

      //all elements should be refreshed
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //all request should be processed - even that 2nd throws
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(3);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[1][0]).toEqual(request2);
      expect(driverProcessRequestMock.mock.calls[1][1]).toEqual(tickNumber);
      expect(driverProcessRequestMock.mock.calls[2][0]).toEqual(request3);
      expect(driverProcessRequestMock.mock.calls[2][1]).toEqual(tickNumber);

      //Connect and disconnect should not have been called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request3WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );
      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError1");
    });

    it("should connect device if device was not connected before", async () => {
      //Ensuring to invoke only one request - isConnect is mock and always returns the same value - so connect would be called for every request otherwise
      tickNumber = 1;

      //Ensuring all other element to be refreshed
      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDriverConnected = false;

      await exec();

      //Connect should be called once before invoking requests
      expect(driverConnectMock).toHaveBeenCalledTimes(1);
      expect(driverConnectMock).toHaveBeenCalledBefore(
        driverProcessRequestMock
      );
      //Disconnect should not have been called
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //All elements should be proccessed properly
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //All requests should be processed
      expect(driverProcessRequestMock).toHaveBeenCalledTimes(1);
      expect(driverProcessRequestMock.mock.calls[0][0]).toEqual(request1);
      expect(driverProcessRequestMock.mock.calls[0][1]).toEqual(tickNumber);

      //For each request that is ment to read data - writeDataToVariables should be invoked
      expect(request1WriteDataToVariablesMockFunc).toHaveBeenCalledTimes(1);
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][0]).toEqual(
        driverProcessRequestResult
      );
      expect(request1WriteDataToVariablesMockFunc.mock.calls[0][1]).toEqual(
        tickNumber
      );

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);
    });

    it("should not throw but not invoke refreshing request and proceed with next actions - if device's driver is busy", async () => {
      //Ensuring all other element to be refreshed
      request1SampleTime = 1;
      request2SampleTime = 1;
      request3SampleTime = 1;

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDriverBusy = true;

      await exec();

      //All elements should be proccessed properly
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //All requests should not be processed
      expect(driverProcessRequestMock).not.toHaveBeenCalled();

      //For each request that is not meant to be written
      expect(request1WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Connect and disconnect should not be called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //Busy state should not be changed
      expect(device.Driver.Busy).toEqual(true);

      //Logger method should be called - two time, for every invoked request
      expect(loggerWarnMock).toHaveBeenCalledTimes(3);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("Driver is busy");
      expect(loggerWarnMock.mock.calls[1][0]).toEqual("Driver is busy");
      expect(loggerWarnMock.mock.calls[2][0]).toEqual("Driver is busy");
    });

    it("should not throw but not invoke refreshing request, not refresh calcElements and not refresh alerts - if device is not active", async () => {
      //Ensuring all other element to be refreshed
      request1SampleTime = 1;
      request2SampleTime = 1;
      request3SampleTime = 1;

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDriverActive = false;

      await exec();

      //All elements should be proccessed properly
      expect(calcElement1RefreshMock).not.toHaveBeenCalled();
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).not.toHaveBeenCalled();

      expect(alert1RefreshMock).not.toHaveBeenCalled();
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).not.toHaveBeenCalled();

      //All requests should not be processed
      expect(driverProcessRequestMock).not.toHaveBeenCalled();

      //For each request that is not meant to be written
      expect(request1WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request2WriteDataToVariablesMockFunc).not.toHaveBeenCalled();
      expect(request3WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Connect and disconnect should not be called
      expect(driverConnectMock).not.toHaveBeenCalled();
      expect(driverDisconnectMock).not.toHaveBeenCalled();

      //Busy state should not be changed
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should not be called - in order not to exceed buffer - device can be not active deliberately
      expect(loggerWarnMock).not.toHaveBeenCalled();
    });

    it("should not throw but stop invoking refreshing request and proceed with next - if device is not connect, tries to connect and connect throws", async () => {
      //Ensuring to invoke only one request - isConnect is mock and always returns the same value - so connect would be called for every request otherwise
      tickNumber = 1;

      driverConnectMock = jest.fn(() => {
        throw new Error("testError");
      });

      //Ensuring all other element to be refreshed
      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDriverConnected = false;

      await exec();

      //Connect should be called once before invoking requests
      expect(driverConnectMock).toHaveBeenCalledTimes(1);
      //Disconnect should not have been called if connection was not established
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driverConnectMock).toHaveBeenCalledBefore(driverDisconnectMock);

      //All elements should be proccessed properly
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //Request should not be processed
      expect(driverProcessRequestMock).not.toHaveBeenCalled();

      //WriteDataToVariables should not be invoked
      expect(request1WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Error while trying to connect"
      );
    });

    it("should not throw but stop invoking refreshing request and proceed with next - if device is not connect, tries to connect and connecting takes to much time", async () => {
      //Ensuring to invoke only one request - isConnect is mock and always returns the same value - so connect would be called for every request otherwise
      tickNumber = 1;

      driverConnectMock = jest.fn(async () => {
        await snooze(1000);
        return true;
      });

      //Ensuring all other element to be refreshed
      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDriverConnected = false;

      await exec();

      //Connect should be called once before invoking requests
      expect(driverConnectMock).toHaveBeenCalledTimes(1);
      //Disconnect should not have been called if connection was not established
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driverConnectMock).toHaveBeenCalledBefore(driverDisconnectMock);

      //All elements should be proccessed properly
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //Request should not be processed
      expect(driverProcessRequestMock).not.toHaveBeenCalled();

      //WriteDataToVariables should not be invoked
      expect(request1WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Error while trying to connect"
      );
    });

    it("should not throw but stop invoking refreshing request and proceed with next - if device is not connect, tries to connect and connect throws and then disconnect throws", async () => {
      //Ensuring to invoke only one request - isConnect is mock and always returns the same value - so connect would be called for every request otherwise
      tickNumber = 1;

      driverConnectMock = jest.fn(() => {
        throw new Error("testError1");
      });
      driverDisconnectMock = jest.fn(() => {
        throw new Error("testError2");
      });

      //Ensuring all other element to be refreshed
      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDriverConnected = false;

      await exec();

      //Connect should be called once before invoking requests
      expect(driverConnectMock).toHaveBeenCalledTimes(1);
      //Disconnect should not have been called if connection was not established
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driverConnectMock).toHaveBeenCalledBefore(driverDisconnectMock);

      //All elements should be proccessed properly
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //Request should not be processed
      expect(driverProcessRequestMock).not.toHaveBeenCalled();

      //WriteDataToVariables should not be invoked
      expect(request1WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Error while trying to connect"
      );
    });

    it("should not throw but stop invoking refreshing request and proceed with next - if device is not connect, tries to connect and connecting takes to much time and then disconnect throws", async () => {
      //Ensuring to invoke only one request - isConnect is mock and always returns the same value - so connect would be called for every request otherwise
      tickNumber = 1;

      driverConnectMock = jest.fn(async () => {
        await snooze(1000);
        return true;
      });

      driverDisconnectMock = jest.fn(() => {
        throw new Error("testError2");
      });

      //Ensuring all other element to be refreshed
      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDriverConnected = false;

      await exec();

      //Connect should be called once before invoking requests
      expect(driverConnectMock).toHaveBeenCalledTimes(1);
      //Disconnect should not have been called if connection was not established
      expect(driverDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driverConnectMock).toHaveBeenCalledBefore(driverDisconnectMock);

      //All elements should be proccessed properly
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //Request should not be processed
      expect(driverProcessRequestMock).not.toHaveBeenCalled();

      //WriteDataToVariables should not be invoked
      expect(request1WriteDataToVariablesMockFunc).not.toHaveBeenCalled();

      //Busy should be set to false
      expect(device.Driver.Busy).toEqual(false);

      //Logger method should be called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual(
        "Error while trying to connect"
      );
    });
  });
});
