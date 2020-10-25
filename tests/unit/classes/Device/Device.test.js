const { snooze } = require("../../../../utilities/utilities");
const Device = require("../../../../classes/Device/Device");
const logger = require("../../../../logger/logger");

describe("Device", () => {
  //TODO - add load tests
  describe("refresh", () => {
    const createFakeDevice = (
      id,
      type,
      name,
      refreshSnooze,
      refreshVariablesMock,
      calcElements,
      alerts
    ) => {
      let device = new Device();
      device._id = id;
      device._type = type;
      device._name = name;
      device._refreshVariables = async () => {
        await snooze(refreshSnooze);
        await refreshVariablesMock();
      };

      device._calcElements = {};
      for (let calcElement of calcElements)
        device._calcElements[calcElement.ID] = calcElement;

      device._alerts = {};
      for (let alert of alerts) device._alerts[alert.ID] = alert;

      return device;
    };

    let device;
    let refreshVariableMockFunc;
    let calcElement1;
    let calcElement2;
    let calcElement3;
    let calcElements;
    let calcElement1RefreshMock;
    let calcElement2RefreshMock;
    let calcElement3RefreshMock;
    let alert1;
    let alert2;
    let alert3;
    let alerts;
    let alert1RefreshMock;
    let alert2RefreshMock;
    let alert3RefreshMock;
    let tickNumber;
    let loggerWarnMock;
    let loggerWarnOriginal;

    beforeEach(() => {
      loggerWarnMock = jest.fn();
      loggerWarnOriginal = logger.warn;
      logger.warn = loggerWarnMock;

      tickNumber = 1234;

      refreshVariableMockFunc = jest.fn();

      calcElement1RefreshMock = jest.fn();
      calcElement2RefreshMock = jest.fn();
      calcElement3RefreshMock = jest.fn();
      calcElement1 = {
        ID: "calcElement1ID",
        Name: "calcElement1Name",
        refresh: async (tick) => {
          await snooze(100);
          await calcElement1RefreshMock(tick);
        },
      };
      calcElement2 = {
        ID: "calcElement2ID",
        Name: "calcElement2Name",
        refresh: async (tick) => {
          await snooze(200);
          await calcElement2RefreshMock(tick);
        },
      };
      calcElement3 = {
        ID: "calcElement3ID",
        Name: "calcElement3Name",
        refresh: async (tick) => {
          await snooze(300);
          await calcElement3RefreshMock(tick);
        },
      };
      calcElements = [calcElement1, calcElement2, calcElement3];

      alert1RefreshMock = jest.fn();
      alert2RefreshMock = jest.fn();
      alert3RefreshMock = jest.fn();
      alert1 = {
        ID: "alert1ID",
        Name: "alert1Name",
        refresh: async (tick) => {
          await snooze(100);
          await alert1RefreshMock(tick);
        },
      };
      alert2 = {
        ID: "alert2ID",
        Name: "alert2Name",
        refresh: async (tick) => {
          await snooze(200);
          await alert2RefreshMock(tick);
        },
      };
      alert3 = {
        ID: "alert3ID",
        Name: "alert3Name",
        refresh: async (tick) => {
          await snooze(300);
          await alert3RefreshMock(tick);
        },
      };
      alerts = [alert1, alert2, alert3];
    });

    afterEach(() => {
      logger.warn = loggerWarnOriginal;
    });

    let exec = async () => {
      device = createFakeDevice(
        "device1ID",
        "Device",
        "device1Name",
        100,
        refreshVariableMockFunc,
        calcElements,
        alerts
      );

      return device.refresh(tickNumber);
    };

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one", async () => {
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

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one - if there are no calcElements", async () => {
      calcElements = [];

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

    it("should invoke refreshVariable first, than refresh all calcElement one by one and than refresh all alerts one by one - if there are no calcElements", async () => {
      alerts = [];

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
