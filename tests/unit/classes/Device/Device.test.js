const { snooze } = require("../../../../utilities/utilities");
const logger = require("../../../../logger/logger");
const {
  createFakeDevice,
  createFakeCalcElement,
  createFakeAlert,
  wrapMethodToInvokeAfter,
} = require("../../../utilities/testUtilities");
const Device = require("../../../../classes/Device/Device");

describe("Device", () => {
  //TODO - add init tests

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

  describe("refresh", () => {
    let device;
    let isDeviceActive;
    let refreshVariableMockFunc;
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
      loggerWarnMock = jest.fn();
      loggerWarnOriginal = logger.warn;
      logger.warn = loggerWarnMock;

      createCalcElements = true;
      createAlerts = true;

      tickNumber = 1234;

      refreshVariableMockFunc = jest.fn();

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
      calcElement1 = createFakeCalcElement(
        "calcElement1ID",
        "calcElement1Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement1SampleTime,
        wrapMethodToInvokeAfter(calcElement1RefreshMock, 100)
      );

      calcElement2 = createFakeCalcElement(
        "calcElement2ID",
        "calcElement2Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement2SampleTime,
        wrapMethodToInvokeAfter(calcElement2RefreshMock, 200)
      );

      calcElement3 = createFakeCalcElement(
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
        "alert1ID",
        "alert1Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert1SampleTime,
        wrapMethodToInvokeAfter(alert1RefreshMock, 100)
      );

      alert2 = createFakeAlert(
        "alert2ID",
        "alert2Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert2SampleTime,
        wrapMethodToInvokeAfter(alert2RefreshMock, 200)
      );

      alert3 = createFakeAlert(
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
        "device1ID",
        "Device",
        "device1Name",
        100,
        refreshVariableMockFunc,
        calcElements,
        alerts,
        isDeviceActive
      );

      return device.refresh(tickNumber);
    };

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one - if every calcElement and alert sampleTime suits tickNumber", async () => {
      await exec();

      expect(refreshVariableMockFunc).toHaveBeenCalledTimes(1);
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
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should not refresh anything if device is not active", async () => {
      isDeviceActive = false;

      await exec();

      expect(refreshVariableMockFunc).not.toHaveBeenCalled();
      expect(calcElement1RefreshMock).not.toHaveBeenCalled();
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).not.toHaveBeenCalled();
      expect(alert1RefreshMock).not.toHaveBeenCalled();
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).not.toHaveBeenCalled();
    });

    it("should invoke refreshVariable first, than refresh calcElements that suits tickId one by one and than refresh alerts that suits tickId one by one", async () => {
      calcElement1SampleTime = 1;
      calcElement2SampleTime = 2;
      calcElement3SampleTime = 3;

      alert1SampleTime = 1;
      alert2SampleTime = 2;
      alert3SampleTime = 3;

      tickNumber = 3;

      //Only first and third should be invoked

      await exec();

      expect(refreshVariableMockFunc).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(refreshVariableMockFunc).toHaveBeenCalledBefore(
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
