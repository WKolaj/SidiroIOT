const { snooze } = require("../../../../utilities/utilities");
const RefreshGroupsManager = require("../../../../classes/Device/RefreshGroup/RefreshGroupsManager");
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
    let exec = () => {
      return new RefreshGroupsManager();
    };

    it("should create new RefreshGroupsManager and initialize fields properly", () => {
      let refreshGroupsManager = exec();

      expect(refreshGroupsManager).toBeDefined();
      expect(refreshGroupsManager.ConnectableDeviceGroups).toBeNull();
      expect(refreshGroupsManager.InternalDeviceGroups).toBeNull();
      expect(refreshGroupsManager.AgentDeviceGroups).toBeNull();
    });
  });

  describe("createRefreshGroups", () => {
    let refreshGroupManager;
    let connectDevices;
    let connectDevice1;
    let connectDevice2;
    let connectDevice3;
    let internalDevices;
    let internalDevice1;
    let internalDevice2;
    let internalDevice3;
    let agentDevices;
    let agentDevice1;
    let agentDevice2;
    let agentDevice3;

    beforeEach(() => {
      connectDevice1 = createFakeDevice(
        "connectDeviceId1",
        "connectDeviceName1",
        "connectDeviceGroup1",
        null
      );

      connectDevice2 = createFakeDevice(
        "connectDeviceId2",
        "connectDeviceName2",
        "connectDeviceGroup1",
        null
      );

      connectDevice3 = createFakeDevice(
        "connectDeviceId3",
        "connectDeviceName3",
        "connectDeviceGroup2",
        null
      );

      connectDevices = [connectDevice1, connectDevice2, connectDevice3];

      internalDevice1 = createFakeDevice(
        "internalDeviceId1",
        "internalDeviceName1",
        "internalDeviceGroup1",
        null
      );

      internalDevice2 = createFakeDevice(
        "internalDeviceId2",
        "internalDeviceName2",
        "internalDeviceGroup2",
        null
      );

      internalDevice3 = createFakeDevice(
        "internalDeviceId3",
        "internalDeviceName3",
        "internalDeviceGroup2",
        null
      );

      internalDevices = [internalDevice1, internalDevice2, internalDevice3];

      agentDevice1 = createFakeDevice(
        "agentDeviceId1",
        "agentDeviceName1",
        "agentDeviceGroup1",
        null
      );

      agentDevice2 = createFakeDevice(
        "agentDeviceId2",
        "agentDeviceName2",
        "agentDeviceGroup1",
        null
      );

      agentDevice3 = createFakeDevice(
        "agentDeviceId3",
        "agentDeviceName3",
        "agentDeviceGroup2",
        null
      );

      agentDevices = [agentDevice1, agentDevice2, agentDevice3];
    });

    let exec = () => {
      refreshGroupManager = new RefreshGroupsManager();
      return refreshGroupManager.createRefreshGroups(
        connectDevices,
        internalDevices,
        agentDevices
      );
    };

    it("should properly assign connectable device groups", () => {
      exec();

      expect(refreshGroupManager.ConnectableDeviceGroups).toBeDefined();

      let connectDeviceGroupsExpectedKeys = [
        "connectDeviceGroup1",
        "connectDeviceGroup2",
      ];
      let connectDeviceGroupKeys = Object.keys(
        refreshGroupManager.ConnectableDeviceGroups.Groups
      );
      expect(connectDeviceGroupKeys).toEqual(connectDeviceGroupsExpectedKeys);

      let connectDeviceGroup1 =
        refreshGroupManager.ConnectableDeviceGroups.Groups[
          "connectDeviceGroup1"
        ];
      let connectDeviceGroup2 =
        refreshGroupManager.ConnectableDeviceGroups.Groups[
          "connectDeviceGroup2"
        ];

      expect(connectDeviceGroup1.Devices).toEqual([
        connectDevice1,
        connectDevice2,
      ]);
      expect(connectDeviceGroup2.Devices).toEqual([connectDevice3]);
    });

    it("should properly assign connectable device groups - if every connectable device has own group", () => {
      connectDevice1.getRefreshGroupID = () => "connectDeviceGroup1";
      connectDevice2.getRefreshGroupID = () => "connectDeviceGroup2";
      connectDevice3.getRefreshGroupID = () => "connectDeviceGroup3";

      exec();

      expect(refreshGroupManager.ConnectableDeviceGroups).toBeDefined();

      let connectDeviceGroupsExpectedKeys = [
        "connectDeviceGroup1",
        "connectDeviceGroup2",
        "connectDeviceGroup3",
      ];
      let connectDeviceGroupKeys = Object.keys(
        refreshGroupManager.ConnectableDeviceGroups.Groups
      );
      expect(connectDeviceGroupKeys).toEqual(connectDeviceGroupsExpectedKeys);

      let connectDeviceGroup1 =
        refreshGroupManager.ConnectableDeviceGroups.Groups[
          "connectDeviceGroup1"
        ];
      let connectDeviceGroup2 =
        refreshGroupManager.ConnectableDeviceGroups.Groups[
          "connectDeviceGroup2"
        ];

      let connectDeviceGroup3 =
        refreshGroupManager.ConnectableDeviceGroups.Groups[
          "connectDeviceGroup3"
        ];

      expect(connectDeviceGroup1.Devices).toEqual([connectDevice1]);
      expect(connectDeviceGroup2.Devices).toEqual([connectDevice2]);
      expect(connectDeviceGroup3.Devices).toEqual([connectDevice3]);
    });

    it("should properly assign connectable device groups - if all connectable device has the same group", () => {
      connectDevice1.getRefreshGroupID = () => "connectDeviceGroup1";
      connectDevice2.getRefreshGroupID = () => "connectDeviceGroup1";
      connectDevice3.getRefreshGroupID = () => "connectDeviceGroup1";

      exec();

      expect(refreshGroupManager.ConnectableDeviceGroups).toBeDefined();

      let connectDeviceGroupsExpectedKeys = ["connectDeviceGroup1"];
      let connectDeviceGroupKeys = Object.keys(
        refreshGroupManager.ConnectableDeviceGroups.Groups
      );
      expect(connectDeviceGroupKeys).toEqual(connectDeviceGroupsExpectedKeys);

      let connectDeviceGroup1 =
        refreshGroupManager.ConnectableDeviceGroups.Groups[
          "connectDeviceGroup1"
        ];

      expect(connectDeviceGroup1.Devices).toEqual([
        connectDevice1,
        connectDevice2,
        connectDevice3,
      ]);
    });

    it("should not throw - if there is no connectable device groups", () => {
      ConnectableDeviceGroups = [];

      expect(exec).not.toThrow();
    });

    it("should properly assign internal device groups", () => {
      exec();

      expect(refreshGroupManager.InternalDeviceGroups).toBeDefined();

      let internalDeviceGroupsExpectedKeys = [
        "internalDeviceGroup1",
        "internalDeviceGroup2",
      ];
      let internalDeviceGroupKeys = Object.keys(
        refreshGroupManager.InternalDeviceGroups.Groups
      );
      expect(internalDeviceGroupKeys).toEqual(internalDeviceGroupsExpectedKeys);

      let internalDeviceGroup1 =
        refreshGroupManager.InternalDeviceGroups.Groups["internalDeviceGroup1"];
      let internalDeviceGroup2 =
        refreshGroupManager.InternalDeviceGroups.Groups["internalDeviceGroup2"];

      expect(internalDeviceGroup1.Devices).toEqual([internalDevice1]);
      expect(internalDeviceGroup2.Devices).toEqual([
        internalDevice2,
        internalDevice3,
      ]);
    });

    it("should properly assign internal device groups - if every internal device has own group", () => {
      internalDevice1.getRefreshGroupID = () => "internalDeviceGroup1";
      internalDevice2.getRefreshGroupID = () => "internalDeviceGroup2";
      internalDevice3.getRefreshGroupID = () => "internalDeviceGroup3";

      exec();

      expect(refreshGroupManager.InternalDeviceGroups).toBeDefined();

      let internalDeviceGroupsExpectedKeys = [
        "internalDeviceGroup1",
        "internalDeviceGroup2",
        "internalDeviceGroup3",
      ];
      let internalDeviceGroupKeys = Object.keys(
        refreshGroupManager.InternalDeviceGroups.Groups
      );
      expect(internalDeviceGroupKeys).toEqual(internalDeviceGroupsExpectedKeys);

      let internalDeviceGroup1 =
        refreshGroupManager.InternalDeviceGroups.Groups["internalDeviceGroup1"];
      let internalDeviceGroup2 =
        refreshGroupManager.InternalDeviceGroups.Groups["internalDeviceGroup2"];

      let internalDeviceGroup3 =
        refreshGroupManager.InternalDeviceGroups.Groups["internalDeviceGroup3"];

      expect(internalDeviceGroup1.Devices).toEqual([internalDevice1]);
      expect(internalDeviceGroup2.Devices).toEqual([internalDevice2]);
      expect(internalDeviceGroup3.Devices).toEqual([internalDevice3]);
    });

    it("should properly assign internal device groups - if all internal device has the same group", () => {
      internalDevice1.getRefreshGroupID = () => "internalDeviceGroup1";
      internalDevice2.getRefreshGroupID = () => "internalDeviceGroup1";
      internalDevice3.getRefreshGroupID = () => "internalDeviceGroup1";

      exec();

      expect(refreshGroupManager.InternalDeviceGroups).toBeDefined();

      let internalDeviceGroupsExpectedKeys = ["internalDeviceGroup1"];
      let internalDeviceGroupKeys = Object.keys(
        refreshGroupManager.InternalDeviceGroups.Groups
      );
      expect(internalDeviceGroupKeys).toEqual(internalDeviceGroupsExpectedKeys);

      let internalDeviceGroup1 =
        refreshGroupManager.InternalDeviceGroups.Groups["internalDeviceGroup1"];

      expect(internalDeviceGroup1.Devices).toEqual([
        internalDevice1,
        internalDevice2,
        internalDevice3,
      ]);
    });

    it("should not throw - if there is no internal device groups", () => {
      InternalDeviceGroups = [];

      expect(exec).not.toThrow();
    });

    it("should properly assign agent device groups", () => {
      exec();

      expect(refreshGroupManager.AgentDeviceGroups).toBeDefined();

      let agentDeviceGroupsExpectedKeys = [
        "agentDeviceGroup1",
        "agentDeviceGroup2",
      ];
      let agentDeviceGroupKeys = Object.keys(
        refreshGroupManager.AgentDeviceGroups.Groups
      );
      expect(agentDeviceGroupKeys).toEqual(agentDeviceGroupsExpectedKeys);

      let agentDeviceGroup1 =
        refreshGroupManager.AgentDeviceGroups.Groups["agentDeviceGroup1"];
      let agentDeviceGroup2 =
        refreshGroupManager.AgentDeviceGroups.Groups["agentDeviceGroup2"];

      expect(agentDeviceGroup1.Devices).toEqual([agentDevice1, agentDevice2]);
      expect(agentDeviceGroup2.Devices).toEqual([agentDevice3]);
    });

    it("should properly assign agent device groups - if every agent device has own group", () => {
      agentDevice1.getRefreshGroupID = () => "agentDeviceGroup1";
      agentDevice2.getRefreshGroupID = () => "agentDeviceGroup2";
      agentDevice3.getRefreshGroupID = () => "agentDeviceGroup3";

      exec();

      expect(refreshGroupManager.AgentDeviceGroups).toBeDefined();

      let agentDeviceGroupsExpectedKeys = [
        "agentDeviceGroup1",
        "agentDeviceGroup2",
        "agentDeviceGroup3",
      ];
      let agentDeviceGroupKeys = Object.keys(
        refreshGroupManager.AgentDeviceGroups.Groups
      );
      expect(agentDeviceGroupKeys).toEqual(agentDeviceGroupsExpectedKeys);

      let agentDeviceGroup1 =
        refreshGroupManager.AgentDeviceGroups.Groups["agentDeviceGroup1"];
      let agentDeviceGroup2 =
        refreshGroupManager.AgentDeviceGroups.Groups["agentDeviceGroup2"];

      let agentDeviceGroup3 =
        refreshGroupManager.AgentDeviceGroups.Groups["agentDeviceGroup3"];

      expect(agentDeviceGroup1.Devices).toEqual([agentDevice1]);
      expect(agentDeviceGroup2.Devices).toEqual([agentDevice2]);
      expect(agentDeviceGroup3.Devices).toEqual([agentDevice3]);
    });

    it("should properly assign agent device groups - if all agent device has the same group", () => {
      agentDevice1.getRefreshGroupID = () => "agentDeviceGroup1";
      agentDevice2.getRefreshGroupID = () => "agentDeviceGroup1";
      agentDevice3.getRefreshGroupID = () => "agentDeviceGroup1";

      exec();

      expect(refreshGroupManager.AgentDeviceGroups).toBeDefined();

      let agentDeviceGroupsExpectedKeys = ["agentDeviceGroup1"];
      let agentDeviceGroupKeys = Object.keys(
        refreshGroupManager.AgentDeviceGroups.Groups
      );
      expect(agentDeviceGroupKeys).toEqual(agentDeviceGroupsExpectedKeys);

      let agentDeviceGroup1 =
        refreshGroupManager.AgentDeviceGroups.Groups["agentDeviceGroup1"];

      expect(agentDeviceGroup1.Devices).toEqual([
        agentDevice1,
        agentDevice2,
        agentDevice3,
      ]);
    });

    it("should not throw - if there is no agent device groups", () => {
      AgentDeviceGroups = [];

      expect(exec).not.toThrow();
    });
  });

  //TODO - Add unit tests for refresh

  //   describe("refresh", () => {
  //     let refreshGroups;
  //     let devices;
  //     let device1;
  //     let device2;
  //     let device3;
  //     let device1RefreshMock;
  //     let device2RefreshMock;
  //     let device3RefreshMock;
  //     let tickNumber;
  //     let loggerWarnMock;
  //     let loggerWarnOriginal;

  //     beforeEach(() => {
  //       loggerWarnMock = jest.fn();
  //       loggerWarnOriginal = logger.warn;
  //       logger.warn = loggerWarnMock;

  //       tickNumber = 1234;
  //       device1RefreshMock = jest.fn();
  //       device2RefreshMock = jest.fn();
  //       device3RefreshMock = jest.fn();

  //       //Embedding mock refresh method inside refresh after snooze - in order to check wether await is used
  //       //snooze time in different order helps to determine wether methods are invoked simuntaneusly for each group
  //       device1 = createFakeDevice(
  //         "deviceId1",
  //         "device1Name",
  //         "deviceGroup1",
  //         async (tickNumber) => {
  //           await snooze(200);
  //           device1RefreshMock(tickNumber);
  //         }
  //       );

  //       device2 = createFakeDevice(
  //         "deviceId2",
  //         "device2Name",
  //         "deviceGroup1",
  //         async (tickNumber) => {
  //           await snooze(200);
  //           device2RefreshMock(tickNumber);
  //         }
  //       );

  //       device3 = createFakeDevice(
  //         "deviceId3",
  //         "device3Name",
  //         "deviceGroup2",
  //         async (tickNumber) => {
  //           await snooze(300);
  //           device3RefreshMock(tickNumber);
  //         }
  //       );

  //       devices = [device1, device2, device3];
  //     });

  //     afterEach(() => {
  //       logger.warn = loggerWarnOriginal;
  //     });

  //     let exec = async () => {
  //       refreshGroups = new RefreshGroups(devices);
  //       return refreshGroups.refresh(tickNumber);
  //     };

  //     it("should refresh all devices assigned to RefreshGroups", async () => {
  //       await exec();

  //       expect(device1RefreshMock).toHaveBeenCalledTimes(1);
  //       expect(device1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

  //       expect(device2RefreshMock).toHaveBeenCalledTimes(1);
  //       expect(device2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

  //       expect(device3RefreshMock).toHaveBeenCalledTimes(1);
  //       expect(device3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

  //       //logger warn should not have been called
  //       expect(loggerWarnMock).not.toHaveBeenCalled();
  //     });

  //     it("should simunteusly invoke method of different groups, but one after another methods of the same group", async () => {
  //       //Group1 -  device1 (snooze 200ms), device2 (snooze 200ms)
  //       //Group2 -  device3 (snooze 300ms)

  //       await exec();

  //       //Methods should be inoked in order: device1, device3, device2
  //       expect(device1RefreshMock).toHaveBeenCalledBefore(device3RefreshMock);
  //       expect(device3RefreshMock).toHaveBeenCalledBefore(device2RefreshMock);
  //     });

  //     it("should simunteusly invoke method of different groups - if every device has seperate group assigned", async () => {
  //       device1.getRefreshGroupID = () => "deviceGroup1";
  //       device2.getRefreshGroupID = () => "deviceGroup2";
  //       device3.getRefreshGroupID = () => "deviceGroup3";

  //       device1.refresh = async (tickNumber) => {
  //         await snooze(300);
  //         device1RefreshMock(tickNumber);
  //       };

  //       device2.refresh = async (tickNumber) => {
  //         await snooze(200);
  //         device2RefreshMock(tickNumber);
  //       };

  //       device3.refresh = async (tickNumber) => {
  //         await snooze(100);
  //         device3RefreshMock(tickNumber);
  //       };

  //       //Group1 -  device1 (snooze 300ms),
  //       //Group2 -  device2 (snooze 200ms),
  //       //Group3 -  device3 (snooze 100ms)

  //       await exec();

  //       //Methods should be inoked in order: device3, device2, device1
  //       expect(device3RefreshMock).toHaveBeenCalledBefore(device2RefreshMock);
  //       expect(device2RefreshMock).toHaveBeenCalledBefore(device1RefreshMock);
  //     });

  //     it("should invoke methods one by one - if all devices are in one group", async () => {
  //       device1.getRefreshGroupID = () => "deviceGroup1";
  //       device2.getRefreshGroupID = () => "deviceGroup1";
  //       device3.getRefreshGroupID = () => "deviceGroup1";

  //       device1.refresh = async (tickNumber) => {
  //         await snooze(300);
  //         device1RefreshMock(tickNumber);
  //       };

  //       device2.refresh = async (tickNumber) => {
  //         await snooze(200);
  //         device2RefreshMock(tickNumber);
  //       };

  //       device3.refresh = async (tickNumber) => {
  //         await snooze(100);
  //         device3RefreshMock(tickNumber);
  //       };

  //       //Group1 -  device1 (snooze 300ms),
  //       //Group1 -  device2 (snooze 200ms),
  //       //Group1 -  device3 (snooze 100ms)

  //       await exec();

  //       //Methods should be inoked in order: device1, device2, device3
  //       expect(device1RefreshMock).toHaveBeenCalledBefore(device2RefreshMock);
  //       expect(device2RefreshMock).toHaveBeenCalledBefore(device3RefreshMock);
  //     });

  //     it("should refresh all devices assigned to RefreshGroups and not throw - if one of device throws", async () => {
  //       device1.refresh = async () => {
  //         throw new Error("test error");
  //       };

  //       await exec();

  //       expect(device2RefreshMock).toHaveBeenCalledTimes(1);
  //       expect(device2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

  //       expect(device3RefreshMock).toHaveBeenCalledTimes(1);
  //       expect(device3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

  //       //logger warn should have been called
  //       expect(loggerWarnMock).toHaveBeenCalledTimes(1);
  //       expect(loggerWarnMock.mock.calls[0][0]).toEqual("test error");
  //     });

  //     it("should not throw - if there is no devices", async () => {
  //       devices = [];

  //       await expect(
  //         new Promise(async (resolve, reject) => {
  //           try {
  //             return resolve(true);
  //           } catch (err) {
  //             return reject(err);
  //           }
  //         })
  //       ).resolves.toBeDefined();
  //     });
  //   });
});
