const { snooze } = require("../../../../utilities/utilities");
const RefreshGroups = require("../../../../classes/RefreshGroup/RefreshGroups");
const logger = require("../../../../logger/logger");

const createFakeDevice = (id, name, requestGroupID, refreshMethod) => {
  return {
    ID: id,
    Name: name,
    getRefreshGroupID: () => requestGroupID,
    refresh: refreshMethod,
  };
};

describe("RefreshGroups", () => {
  describe("constructor", () => {
    let devices;
    let device1;
    let device2;
    let device3;

    beforeEach(() => {
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
      return new RefreshGroups(devices);
    };

    it("should create new refresh groups and create and all refresh groups - every device has seperate group ID", () => {
      let refreshGroups = exec();

      expect(refreshGroups).toBeDefined();

      //There should be three groups, of device ids
      let expectedKeys = ["deviceGroup1", "deviceGroup2", "deviceGroup3"];
      let recievedKeys = Object.keys(refreshGroups.Groups);

      expect(recievedKeys).toEqual(expectedKeys);

      //Every of group should have corresponding device
      let group1 = refreshGroups.Groups["deviceGroup1"];
      expect(group1.ID).toEqual("deviceGroup1");
      expect(group1.Devices).toEqual([device1]);

      let group2 = refreshGroups.Groups["deviceGroup2"];
      expect(group2.ID).toEqual("deviceGroup2");
      expect(group2.Devices).toEqual([device2]);

      let group3 = refreshGroups.Groups["deviceGroup3"];
      expect(group3.ID).toEqual("deviceGroup3");
      expect(group3.Devices).toEqual([device3]);
    });

    it("should create new refresh groups and create and all refresh groups - if all devices are from the same group", () => {
      device1.getRefreshGroupID = () => "oneAndOnlyGroup";
      device2.getRefreshGroupID = () => "oneAndOnlyGroup";
      device3.getRefreshGroupID = () => "oneAndOnlyGroup";

      let refreshGroups = exec();

      expect(refreshGroups).toBeDefined();

      //There should be one group
      let expectedKeys = ["oneAndOnlyGroup"];
      let recievedKeys = Object.keys(refreshGroups.Groups);

      expect(recievedKeys).toEqual(expectedKeys);

      //Group should have all three devices
      let group1 = refreshGroups.Groups["oneAndOnlyGroup"];
      expect(group1.ID).toEqual("oneAndOnlyGroup");
      expect(group1.Devices).toEqual([device1, device2, device3]);
    });

    it("should create new refresh groups and create and all refresh groups - if one device has different group than others", () => {
      device1.getRefreshGroupID = () => "deviceGroup1";
      device2.getRefreshGroupID = () => "deviceGroup1";
      device3.getRefreshGroupID = () => "deviceGroup2";

      let refreshGroups = exec();

      expect(refreshGroups).toBeDefined();

      //There should be two groups
      let expectedKeys = ["deviceGroup1", "deviceGroup2"];
      let recievedKeys = Object.keys(refreshGroups.Groups);

      expect(recievedKeys).toEqual(expectedKeys);

      //Groups should have corresponding devices
      let group1 = refreshGroups.Groups["deviceGroup1"];
      expect(group1.ID).toEqual("deviceGroup1");
      expect(group1.Devices).toEqual([device1, device2]);

      let group2 = refreshGroups.Groups["deviceGroup2"];
      expect(group2.ID).toEqual("deviceGroup2");
      expect(group2.Devices).toEqual([device3]);
    });

    it("should create new refresh groups and create and all refresh groups - if there is no devices", () => {
      devices = [];

      let refreshGroups = exec();

      expect(refreshGroups).toBeDefined();

      //There should be no groups
      expect(refreshGroups.Groups).toEqual({});
    });
  });

  describe("refresh", () => {
    let refreshGroups;
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

      //Embedding mock refresh method inside refresh after snooze - in order to check wether await is used
      //snooze time in different order helps to determine wether methods are invoked simuntaneusly for each group
      device1 = createFakeDevice(
        "deviceId1",
        "device1Name",
        "deviceGroup1",
        async (tickNumber) => {
          await snooze(200);
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
        "deviceGroup2",
        async (tickNumber) => {
          await snooze(300);
          device3RefreshMock(tickNumber);
        }
      );

      devices = [device1, device2, device3];
    });

    afterEach(() => {
      logger.warn = loggerWarnOriginal;
    });

    let exec = async () => {
      refreshGroups = new RefreshGroups(devices);
      return refreshGroups.refresh(tickNumber);
    };

    it("should refresh all devices assigned to RefreshGroups", async () => {
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

    it("should simunteusly invoke method of different groups, but one after another methods of the same group", async () => {
      //Group1 -  device1 (snooze 200ms), device2 (snooze 200ms)
      //Group2 -  device3 (snooze 300ms)

      await exec();

      //Methods should be inoked in order: device1, device3, device2
      expect(device1RefreshMock).toHaveBeenCalledBefore(device3RefreshMock);
      expect(device3RefreshMock).toHaveBeenCalledBefore(device2RefreshMock);
    });

    it("should simunteusly invoke method of different groups - if every device has seperate group assigned", async () => {
      device1.getRefreshGroupID = () => "deviceGroup1";
      device2.getRefreshGroupID = () => "deviceGroup2";
      device3.getRefreshGroupID = () => "deviceGroup3";

      device1.refresh = async (tickNumber) => {
        await snooze(300);
        device1RefreshMock(tickNumber);
      };

      device2.refresh = async (tickNumber) => {
        await snooze(200);
        device2RefreshMock(tickNumber);
      };

      device3.refresh = async (tickNumber) => {
        await snooze(100);
        device3RefreshMock(tickNumber);
      };

      //Group1 -  device1 (snooze 300ms),
      //Group2 -  device2 (snooze 200ms),
      //Group3 -  device3 (snooze 100ms)

      await exec();

      //Methods should be inoked in order: device3, device2, device1
      expect(device3RefreshMock).toHaveBeenCalledBefore(device2RefreshMock);
      expect(device2RefreshMock).toHaveBeenCalledBefore(device1RefreshMock);
    });

    it("should invoke methods one by one - if all devices are in one group", async () => {
      device1.getRefreshGroupID = () => "deviceGroup1";
      device2.getRefreshGroupID = () => "deviceGroup1";
      device3.getRefreshGroupID = () => "deviceGroup1";

      device1.refresh = async (tickNumber) => {
        await snooze(300);
        device1RefreshMock(tickNumber);
      };

      device2.refresh = async (tickNumber) => {
        await snooze(200);
        device2RefreshMock(tickNumber);
      };

      device3.refresh = async (tickNumber) => {
        await snooze(100);
        device3RefreshMock(tickNumber);
      };

      //Group1 -  device1 (snooze 300ms),
      //Group1 -  device2 (snooze 200ms),
      //Group1 -  device3 (snooze 100ms)

      await exec();

      //Methods should be inoked in order: device1, device2, device3
      expect(device1RefreshMock).toHaveBeenCalledBefore(device2RefreshMock);
      expect(device2RefreshMock).toHaveBeenCalledBefore(device3RefreshMock);
    });

    it("should refresh all devices assigned to RefreshGroups and not throw - if one of device throws", async () => {
      device1.refresh = async () => {
        throw new Error("test error");
      };

      await exec();

      expect(device2RefreshMock).toHaveBeenCalledTimes(1);
      expect(device2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(device3RefreshMock).toHaveBeenCalledTimes(1);
      expect(device3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      //logger warn should have been called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("test error");
    });

    it("should not throw - if there is no devices", async () => {
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
