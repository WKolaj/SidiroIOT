const { snooze } = require("../../../../utilities/utilities");
const logger = require("../../../../logger/logger");
const {
  createFakeVariable,
  createFakeDevice,
  createFakeCalcElement,
  createFakeAlert,
  wrapMethodToInvokeAfter,
} = require("../../../utilities/testUtilities");
const Device = require("../../../../classes/Device/Device");

describe("Device", () => {
  //TODO - add init tests - after creating internal and associated variables

  describe("IsActive", () => {
    let device;
    let isDeviceActive;
    let getActiveMockFunc;
    let overrideGetActiveFunc;
    let overrideIsActive;

    beforeEach(() => {
      getActiveMockFunc = jest.fn(() => {
        return isDeviceActive;
      });
      overrideGetActiveFunc = true;
      overrideIsActive = false;
    });

    let exec = () => {
      isDeviceActive = false;
      device = new Device();
      if (overrideGetActiveFunc) device._getIsActiveState = getActiveMockFunc;
      if (overrideIsActive) device._isActive = isDeviceActive;
      return device.IsActive;
    };

    it("should return result of getActiveMockFunc", async () => {
      await exec();

      expect(getActiveMockFunc).toHaveBeenCalledTimes(1);

      expect(device.IsActive).toEqual(isDeviceActive);
    });

    it("should return _isActive if getActiveMockFunc was not overriden - isDeviceActive is true", async () => {
      overrideGetActiveFunc = false;
      overrideIsActive = true;
      isDeviceActive = true;

      await exec();

      expect(device.IsActive).toEqual(isDeviceActive);
    });

    it("should return _isActive if getActiveMockFunc was not overriden - isDeviceActive is false", async () => {
      overrideGetActiveFunc = false;
      overrideIsActive = true;
      isDeviceActive = false;

      await exec();

      expect(device.IsActive).toEqual(isDeviceActive);
    });
  });

  describe("activate", () => {
    let device;
    let isDeviceActive;

    beforeEach(() => {
      isDeviceActive = false;
    });

    let exec = async () => {
      device = createFakeDevice(
        "device1Id",
        "FakeDevice",
        "device1Name",
        100,
        jest.fn(),
        [],
        [],
        isDeviceActive
      );
      return device.activate();
    };

    it("should set device IsActive to true", async () => {
      await exec();

      expect(device.IsActive).toEqual(true);
    });

    it("should not throw id device is already active", async () => {
      isDeviceActive = true;

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
    });
  });

  describe("deactivate", () => {
    let device;
    let isDeviceActive;

    beforeEach(() => {
      isDeviceActive = true;
    });

    let exec = async () => {
      device = createFakeDevice(
        "device1Id",
        "FakeDevice",
        "device1Name",
        100,
        jest.fn(),
        [],
        [],
        isDeviceActive
      );
      return device.deactivate();
    };

    it("should set device IsActive to false", async () => {
      await exec();

      expect(device.IsActive).toEqual(false);
    });

    it("should not throw id device is deactive", async () => {
      isDeviceActive = false;

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

      expect(device.IsActive).toEqual(false);
    });
  });

  describe("generatePayload", () => {
    let device;
    let deviceId;
    let deviceName;
    let deviceType;
    let deviceActive;
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
      deviceId = "device1ID";
      deviceName = "device1Name";
      deviceType = "FakeDevice";
      deviceActive = true;

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
    });

    let exec = async () => {
      //#region create variables

      variables = [];

      variable1 = createFakeVariable(
        "variable1ID",
        "variable1Name",
        "FakeVariable",
        1,
        "FakeUnit",
        1
      );

      variable2 = createFakeVariable(
        "variable2ID",
        "variable2Name",
        "FakeVariable",
        2,
        "FakeUnit",
        2
      );

      variable3 = createFakeVariable(
        "variable3ID",
        "variable3Name",
        "FakeVariable",
        3,
        "FakeUnit",
        3
      );

      variable4 = createFakeVariable(
        "variable4ID",
        "variable4Name",
        "FakeVariable",
        4,
        "FakeUnit",
        1
      );

      variable5 = createFakeVariable(
        "variable5ID",
        "variable5Name",
        "FakeVariable",
        5,
        "FakeUnit",
        2
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
        "calcElement1ID",
        "calcElement1Name",
        "FakeCalcElement",
        1,
        "FakeUnit",
        calcElement1SampleTime,
        calcElement1RefreshMock
      );

      calcElement2 = createFakeCalcElement(
        "calcElement2ID",
        "calcElement2Name",
        "FakeCalcElement",
        2,
        "FakeUnit",
        calcElement2SampleTime,
        calcElement2RefreshMock
      );

      calcElement3 = createFakeCalcElement(
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
        "alert1ID",
        "alert1Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert1SampleTime,
        alert1RefreshMock
      );

      alert2 = createFakeAlert(
        "alert2ID",
        "alert2Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert2SampleTime,
        alert2RefreshMock
      );

      alert3 = createFakeAlert(
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

      device = new Device();

      await device.init({
        id: deviceId,
        name: deviceName,
        type: deviceType,
        isActive: deviceActive,
        calcElements: {},
        variables: {},
        alerts: {},
      });

      for (let variable of variables) {
        device.Variables[variable.ID] = variable;
      }

      for (let calcElement of calcElements) {
        device.CalcElements[calcElement.ID] = calcElement;
      }

      for (let alert of alerts) {
        device.Alerts[alert.ID] = alert;
      }

      return device.generatePayload();
    };

    it("should return valid payload of device - if active is true", async () => {
      isDeviceActive = true;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: deviceActive,
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

    it("should return valid payload of device - if active is false", async () => {
      isDeviceActive = false;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: deviceActive,
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

    it("should return valid payload of device - there are no variables, calcElements or alerts", async () => {
      addVariable1 = false;
      addVariable2 = false;
      addVariable3 = false;
      addVariable4 = false;
      addVariable5 = false;
      addCalcElement1 = false;
      addCalcElement2 = false;
      addCalcElement3 = false;
      addAlert1 = false;
      addAlert2 = false;
      addAlert3 = false;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: deviceActive,
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
  });

  describe("refresh", () => {
    let project;
    let device;
    let isDeviceActive;
    let variable1;
    let variable2;
    let variable3;
    let variables;
    let variable1SampleTime;
    let variable2SampleTime;
    let variable3SampleTime;
    let variable1RefreshMock;
    let variable2RefreshMock;
    let variable3RefreshMock;
    let createVariables;
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
    let createCalcElements;
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
    let createAlerts;
    let tickNumber;
    let loggerWarnMock;
    let loggerWarnOriginal;

    beforeEach(() => {
      project = "fakeProject";
      loggerWarnMock = jest.fn();
      loggerWarnOriginal = logger.warn;
      logger.warn = loggerWarnMock;

      createCalcElements = true;
      createAlerts = true;
      createVariables = true;

      tickNumber = 1234;

      variable1RefreshMock = jest.fn();
      variable2RefreshMock = jest.fn();
      variable3RefreshMock = jest.fn();

      variable1SampleTime = 1;
      variable2SampleTime = 1;
      variable3SampleTime = 1;

      calcElement1RefreshMock = jest.fn();
      calcElement2RefreshMock = jest.fn();
      calcElement3RefreshMock = jest.fn();

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1RefreshMock = jest.fn();
      alert2RefreshMock = jest.fn();
      alert3RefreshMock = jest.fn();

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDeviceActive = true;
    });

    afterEach(() => {
      logger.warn = loggerWarnOriginal;
    });

    let exec = async () => {
      variable1 = createFakeVariable(
        project,
        "variable1ID",
        "variable1Name",
        "FakeVariable",
        0,
        "FakeUnit",
        variable1SampleTime,
        wrapMethodToInvokeAfter(variable1RefreshMock, 100)
      );

      variable2 = createFakeVariable(
        project,
        "variable2ID",
        "variable2Name",
        "FakeVariable",
        0,
        "FakeUnit",
        variable2SampleTime,
        wrapMethodToInvokeAfter(variable2RefreshMock, 200)
      );

      variable3 = createFakeVariable(
        project,
        "variable3ID",
        "variable3Name",
        "FakeVariable",
        0,
        "FakeUnit",
        variable3SampleTime,
        wrapMethodToInvokeAfter(variable3RefreshMock, 300)
      );

      variables = [];
      if (createVariables) variables = [variable1, variable2, variable3];

      calcElement1 = createFakeCalcElement(
        project,
        "calcElement1ID",
        "calcElement1Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement1SampleTime,
        wrapMethodToInvokeAfter(calcElement1RefreshMock, 100)
      );

      calcElement2 = createFakeCalcElement(
        project,
        "calcElement2ID",
        "calcElement2Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement2SampleTime,
        wrapMethodToInvokeAfter(calcElement2RefreshMock, 200)
      );

      calcElement3 = createFakeCalcElement(
        project,
        "calcElement3ID",
        "calcElement3Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement3SampleTime,
        wrapMethodToInvokeAfter(calcElement3RefreshMock, 300)
      );

      calcElements = [];
      if (createCalcElements)
        calcElements = [calcElement1, calcElement2, calcElement3];

      alert1 = createFakeAlert(
        project,
        "alert1ID",
        "alert1Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert1SampleTime,
        wrapMethodToInvokeAfter(alert1RefreshMock, 100)
      );

      alert2 = createFakeAlert(
        project,
        "alert2ID",
        "alert2Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert2SampleTime,
        wrapMethodToInvokeAfter(alert2RefreshMock, 200)
      );

      alert3 = createFakeAlert(
        project,
        "alert3ID",
        "alert3Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert3SampleTime,
        wrapMethodToInvokeAfter(alert3RefreshMock, 300)
      );

      alerts = [];
      if (createAlerts) alerts = [alert1, alert2, alert3];

      device = createFakeDevice(
        project,
        "device1ID",
        "Device",
        "device1Name",
        calcElements,
        alerts,
        variables,
        isDeviceActive
      );

      return device.refresh(tickNumber);
    };

    it("should refresh all variables one by one, than refresh all calcElement one by one and than refresh all alerts one by one - if every calcElement and alert sampleTime suits tickNumber", async () => {
      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable2RefreshMock);

      expect(variable2RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);

      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );

      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );

      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should not refresh anything if device is not active", async () => {
      isDeviceActive = false;

      await exec();

      expect(calcVariable1RefreshMock).not.toHaveBeenCalled();
      expect(calcVariable2RefreshMock).not.toHaveBeenCalled();
      expect(calcVariable3RefreshMock).not.toHaveBeenCalled();
      expect(calcElement1RefreshMock).not.toHaveBeenCalled();
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).not.toHaveBeenCalled();
      expect(alert1RefreshMock).not.toHaveBeenCalled();
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).not.toHaveBeenCalled();
    });

    it("should refresh all variables one by one that suits tickId, than refresh calcElements that suits tickId one by one and than refresh alerts that suits tickId one by one", async () => {
      variable1SampleTime = 1;
      variable1SampleTime = 2;
      variable1SampleTime = 3;

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 2;
      calcElement3SampleTime = 3;

      alert1SampleTime = 1;
      alert2SampleTime = 2;
      alert3SampleTime = 3;

      tickNumber = 3;

      //Only first and third should be invoked

      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).not.toHaveBeenCalled();
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);
      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one - if there are no calcElements", async () => {
      createCalcElements = false;

      await exec();

      expect(refreshVariableMockFunc).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(refreshVariableMockFunc).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one - if there are no alerts", async () => {
      createAlerts = false;

      await exec();

      expect(refreshVariableMockFunc).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(refreshVariableMockFunc).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
    });

    it("should refresh all calcElement one by one and than refresh all alerts one by one - event if refreshVariables throws", async () => {
      refreshVariableMockFunc = async () => {
        throw new Error("testError");
      };
      await exec();

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);

      //logger warn should have been called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError");
    });

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one - even if one of calcElement throws while refreshing", async () => {
      calcElement2RefreshMock = async () => {
        throw new Error("testError");
      };
      await exec();

      expect(refreshVariableMockFunc).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(refreshVariableMockFunc).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);

      //logger warn should have been called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError");
    });

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one - event if one of alerts throws while refreshing", async () => {
      alert2RefreshMock = async () => {
        throw new Error("testError");
      };

      await exec();

      expect(refreshVariableMockFunc).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(refreshVariableMockFunc).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);

      //logger warn should have been called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError");
    });
  });
});
