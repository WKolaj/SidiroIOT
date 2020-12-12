const { snooze } = require("../../../../utilities/utilities");
const RefreshGroup = require("../../../../classes/RefreshGroup/RefreshGroup");
const logger = require("../../../../logger/logger");

const createFakeDevice = (id, name, requestGroupID, refreshMethod) => {
  return {
    ID: id,
    Name: name,
    getRefreshGroupID: () => requestGroupID,
    refresh: refreshMethod,
  };
};

describe("RefreshGroup", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let id;
    let devices;
    let device1;
    let device2;
    let device3;

    beforeEach(() => {
      id = "abcd1234";

      device1 = createFakeDevice(
        "deviceId1",
        "device1Name",
        "deviceGroup1",
        null
      );

      device2 = createFakeDevice(
        "deviceId2",
        "device2Name",
        "deviceGroup2",
        null
      );

      device3 = createFakeDevice(
        "deviceId3",
        "device3Name",
        "deviceGroup3",
        null
      );

      devices = [device1, device2, device3];
    });

    let exec = () => {
      return new RefreshGroup(id, devices);
    };

    it("should create new refresh group and assign id and devices", () => {
      let refreshGroup = exec();

      expect(refreshGroup).toBeDefined();

      expect(refreshGroup.ID).toEqual(id);

      expect(refreshGroup.Devices).toEqual(devices);
    });

    it("should create new refresh group and assign id and devices - even if devices are empty", () => {
      devices = [];

      let refreshGroup = exec();

      expect(refreshGroup).toBeDefined();

      expect(refreshGroup.ID).toEqual(id);

      expect(refreshGroup.Devices).toEqual([]);
    });
  });

  describe("refresh", () => {
    let refreshGroup;
    let id;
    let devices;
    let device1;
    let device2;
    let device3;
    let device1RefreshMock;
    let device2RefreshMock;
    let device3RefreshMock;
    let tickNumber;
    let loggerWarnMock;
    let loggerWarnOriginal;

    beforeEach(() => {
      loggerWarnMock = jest.fn();
      loggerWarnOriginal = logger.warn;
      logger.warn = loggerWarnMock;

      tickNumber = 1234;
      device1RefreshMock = jest.fn();
      device2RefreshMock = jest.fn();
      device3RefreshMock = jest.fn();
      id = "abcd1234";
      //Embedding mock refresh method inside refresh after snooze - in order to check wether await is used
      //snooze time in oposite order helps to determine wether methods are invoked one after another
      device1 = createFakeDevice(
        "deviceId1",
        "device1Name",
        "deviceGroup1",
        async (tickNumber) => {
          await snooze(300);
          device1RefreshMock(tickNumber);
        }
      );

      device2 = createFakeDevice(
        "deviceId2",
        "device2Name",
        "deviceGroup1",
        async (tickNumber) => {
          await snooze(200);
          device2RefreshMock(tickNumber);
        }
      );

      device3 = createFakeDevice(
        "deviceId3",
        "device3Name",
        "deviceGroup1",
        async (tickNumber) => {
          await snooze(100);
          device3RefreshMock(tickNumber);
        }
      );

      devices = [device1, device2, device3];
    });

    afterEach(() => {
      logger.warn = loggerWarnOriginal;
    });

    let exec = async () => {
      refreshGroup = new RefreshGroup(id, devices);
      return refreshGroup.createRefreshPromise(tickNumber);
    };

    it("should call refresh of every device", async () => {
      await exec();

      expect(device1RefreshMock).toHaveBeenCalledTimes(1);
      expect(device1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(device2RefreshMock).toHaveBeenCalledTimes(1);
      expect(device2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(device3RefreshMock).toHaveBeenCalledTimes(1);
      expect(device3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //logger warn should not have been called
      expect(loggerWarnMock).not.toHaveBeenCalled();
    });

    it("should refresh methods should be called one after another", async () => {
      await exec();

      expect(device1RefreshMock).toHaveBeenCalledBefore(device2RefreshMock);
      expect(device2RefreshMock).toHaveBeenCalledBefore(device3RefreshMock);
    });

    it("should not throw and continue refreshing other devices - if one of device throws while refreshing", async () => {
      device2.refresh = async () => {
        throw new Error("TestError");
      };
      await exec();

      expect(device1RefreshMock).toHaveBeenCalledTimes(1);
      expect(device1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(device3RefreshMock).toHaveBeenCalledTimes(1);
      expect(device3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //Logger warn should have been invoked
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn.mock.calls[0][0]).toEqual("TestError");
    });

    it("should not throw - even if all devices throws", async () => {
      device1.refresh = async () => {
        throw new Error("TestError1");
      };
      device2.refresh = async () => {
        throw new Error("TestError2");
      };
      device3.refresh = async () => {
        throw new Error("TestError3");
      };
      await exec();

      //Logger warn should have been invoked
      expect(logger.warn).toHaveBeenCalledTimes(3);
      expect(logger.warn.mock.calls[0][0]).toEqual("TestError1");
      expect(logger.warn.mock.calls[1][0]).toEqual("TestError2");
      expect(logger.warn.mock.calls[2][0]).toEqual("TestError3");
    });

    it("should not throw - even if there are no devices", async () => {
      devices = [];

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            return resolve(true);
          } catch (err) {
            return reject(err);
          }
        })
      ).resolves.toBeDefined();
    });
  });
});
