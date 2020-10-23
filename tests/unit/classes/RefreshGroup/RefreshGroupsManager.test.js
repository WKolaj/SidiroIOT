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

  describe("refresh", () => {
    let refreshGroupManager;
    let tickNumber;
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
    let connectDevice1MockRefresh;
    let connectDevice2MockRefresh;
    let connectDevice3MockRefresh;
    let internalDevice1MockRefresh;
    let internalDevice2MockRefresh;
    let internalDevice3MockRefresh;
    let agentDevice1MockRefresh;
    let agentDevice2MockRefresh;
    let agentDevice3MockRefresh;
    let loggerWarnMock;
    let loggerWarnOriginal;

    beforeEach(() => {
      loggerWarnMock = jest.fn();
      loggerWarnOriginal = logger.warn;
      logger.warn = loggerWarnMock;

      tickNumber = 1234;

      connectDevice1MockRefresh = jest.fn();
      connectDevice2MockRefresh = jest.fn();
      connectDevice3MockRefresh = jest.fn();

      connectDevice1 = createFakeDevice(
        "connectDeviceId1",
        "connectDeviceName1",
        "connectDeviceGroup1",
        async (tickNumber) => {
          await snooze(100);
          connectDevice1MockRefresh(tickNumber);
        }
      );

      connectDevice2 = createFakeDevice(
        "connectDeviceId2",
        "connectDeviceName2",
        "connectDeviceGroup1",
        async (tickNumber) => {
          await snooze(200);
          connectDevice2MockRefresh(tickNumber);
        }
      );

      connectDevice3 = createFakeDevice(
        "connectDeviceId3",
        "connectDeviceName3",
        "connectDeviceGroup2",
        async (tickNumber) => {
          await snooze(200);
          connectDevice3MockRefresh(tickNumber);
        }
      );

      connectDevices = [connectDevice1, connectDevice2, connectDevice3];

      internalDevice1MockRefresh = jest.fn();
      internalDevice2MockRefresh = jest.fn();
      internalDevice3MockRefresh = jest.fn();

      internalDevice1 = createFakeDevice(
        "internalDeviceId1",
        "internalDeviceName1",
        "internalDeviceGroup1",
        async (tickNumber) => {
          await snooze(200);
          internalDevice1MockRefresh(tickNumber);
        }
      );

      internalDevice2 = createFakeDevice(
        "internalDeviceId2",
        "internalDeviceName2",
        "internalDeviceGroup2",
        async (tickNumber) => {
          await snooze(100);
          internalDevice2MockRefresh(tickNumber);
        }
      );

      internalDevice3 = createFakeDevice(
        "internalDeviceId3",
        "internalDeviceName3",
        "internalDeviceGroup2",
        async (tickNumber) => {
          await snooze(200);
          internalDevice3MockRefresh(tickNumber);
        }
      );

      internalDevices = [internalDevice1, internalDevice2, internalDevice3];

      agentDevice1MockRefresh = jest.fn();
      agentDevice2MockRefresh = jest.fn();
      agentDevice3MockRefresh = jest.fn();

      agentDevice1 = createFakeDevice(
        "agentDeviceId1",
        "agentDeviceName1",
        "agentDeviceGroup1",
        async (tickNumber) => {
          await snooze(100);
          agentDevice1MockRefresh(tickNumber);
        }
      );

      agentDevice2 = createFakeDevice(
        "agentDeviceId2",
        "agentDeviceName2",
        "agentDeviceGroup1",
        async (tickNumber) => {
          await snooze(200);
          agentDevice2MockRefresh(tickNumber);
        }
      );

      agentDevice3 = createFakeDevice(
        "agentDeviceId3",
        "agentDeviceName3",
        "agentDeviceGroup2",
        async (tickNumber) => {
          await snooze(200);
          agentDevice3MockRefresh(tickNumber);
        }
      );

      agentDevices = [agentDevice1, agentDevice2, agentDevice3];
    });

    afterEach(() => {
      logger.warn = loggerWarnOriginal;
    });

    let exec = async () => {
      refreshGroupManager = new RefreshGroupsManager();
      refreshGroupManager.createRefreshGroups(
        connectDevices,
        internalDevices,
        agentDevices
      );

      return refreshGroupManager.refresh(tickNumber);
    };

    it("should invoke refresh of devices in proper order - if in every device type there are some devices with same group and some with only one group", async () => {
      //Connect devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)
      //Internal devices:
      // - Group1: dev1 (snooze 200ms)
      // - Group2: dev2 (snooze 100ms), dev3 (snooze 200ms)
      //Agent devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)

      await exec();

      //All refresh method should have been called
      expect(connectDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber
      expect(connectDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(internalDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(agentDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - connectDevices: dev1 -> dev3 -> dev2 -> internalDevices: dev2 -> dev1 -> dev3 -> agentDevices: dev1 -> dev3 -> dev2
      expect(connectDevice1MockRefresh).toHaveBeenCalledBefore(
        connectDevice3MockRefresh
      );
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice2MockRefresh
      );
      expect(internalDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
      expect(internalDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice1MockRefresh
      );
      expect(agentDevice1MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
      expect(agentDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );
    });

    it("should invoke refresh of devices in proper order - if in every device type all devices have different group", async () => {
      connectDevice1.getRefreshGroupID = () => "connectDeviceGroup1";
      connectDevice1.refresh = async (tickNumber) => {
        await snooze(300);
        connectDevice1MockRefresh(tickNumber);
      };

      connectDevice2.getRefreshGroupID = () => "connectDeviceGroup2";
      connectDevice2.refresh = async (tickNumber) => {
        await snooze(200);
        connectDevice2MockRefresh(tickNumber);
      };

      connectDevice3.getRefreshGroupID = () => "connectDeviceGroup3";
      connectDevice3.refresh = async (tickNumber) => {
        await snooze(100);
        connectDevice3MockRefresh(tickNumber);
      };

      internalDevice1.getRefreshGroupID = () => "internalDeviceGroup1";
      internalDevice1.refresh = async (tickNumber) => {
        await snooze(300);
        internalDevice1MockRefresh(tickNumber);
      };

      internalDevice2.getRefreshGroupID = () => "internalDeviceGroup2";
      internalDevice2.refresh = async (tickNumber) => {
        await snooze(200);
        internalDevice2MockRefresh(tickNumber);
      };

      internalDevice3.getRefreshGroupID = () => "internalDeviceGroup3";
      internalDevice3.refresh = async (tickNumber) => {
        await snooze(100);
        internalDevice3MockRefresh(tickNumber);
      };

      agentDevice1.getRefreshGroupID = () => "agentDeviceGroup1";
      agentDevice1.refresh = async (tickNumber) => {
        await snooze(300);
        agentDevice1MockRefresh(tickNumber);
      };

      agentDevice2.getRefreshGroupID = () => "agentDeviceGroup2";
      agentDevice2.refresh = async (tickNumber) => {
        await snooze(200);
        agentDevice2MockRefresh(tickNumber);
      };

      agentDevice3.getRefreshGroupID = () => "agentDeviceGroup3";
      agentDevice3.refresh = async (tickNumber) => {
        await snooze(100);
        agentDevice3MockRefresh(tickNumber);
      };

      //Connect devices:
      // - Group1: dev1 (snooze 300ms)
      // - Group2: dev2 (snooze 200ms)
      // - Group3: dev3 (snooze 100ms)
      //Internal devices:
      // - Group1: dev1 (snooze 300ms)
      // - Group2: dev2 (snooze 200ms)
      // - Group3: dev3 (snooze 100ms)
      //Agent devices:
      // - Group1: dev1 (snooze 300ms)
      // - Group2: dev2 (snooze 200ms)
      // - Group3: dev3 (snooze 100ms)

      await exec();

      //All refresh method should have been called
      expect(connectDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber
      expect(connectDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(internalDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(agentDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - connectDevices: dev3 -> dev2 -> dev1 -> internalDevices: dev3 -> dev2 -> dev1 -> agentDevices: dev3 -> dev2 -> dev1
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        connectDevice1MockRefresh
      );
      expect(connectDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
      expect(internalDevice3MockRefresh).toHaveBeenCalledBefore(
        internalDevice2MockRefresh
      );
      expect(internalDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
      expect(agentDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );
      expect(agentDevice2MockRefresh).toHaveBeenCalledBefore(
        agentDevice1MockRefresh
      );
    });

    it("should invoke refresh of devices in proper order - if in every device type all devices are in the same group", async () => {
      connectDevice1.getRefreshGroupID = () => "connectDeviceGroup1";
      connectDevice1.refresh = async (tickNumber) => {
        await snooze(300);
        connectDevice1MockRefresh(tickNumber);
      };

      connectDevice2.getRefreshGroupID = () => "connectDeviceGroup1";
      connectDevice2.refresh = async (tickNumber) => {
        await snooze(200);
        connectDevice2MockRefresh(tickNumber);
      };

      connectDevice3.getRefreshGroupID = () => "connectDeviceGroup1";
      connectDevice3.refresh = async (tickNumber) => {
        await snooze(100);
        connectDevice3MockRefresh(tickNumber);
      };

      internalDevice1.getRefreshGroupID = () => "internalDeviceGroup1";
      internalDevice1.refresh = async (tickNumber) => {
        await snooze(300);
        internalDevice1MockRefresh(tickNumber);
      };

      internalDevice2.getRefreshGroupID = () => "internalDeviceGroup1";
      internalDevice2.refresh = async (tickNumber) => {
        await snooze(200);
        internalDevice2MockRefresh(tickNumber);
      };

      internalDevice3.getRefreshGroupID = () => "internalDeviceGroup1";
      internalDevice3.refresh = async (tickNumber) => {
        await snooze(100);
        internalDevice3MockRefresh(tickNumber);
      };

      agentDevice1.getRefreshGroupID = () => "agentDeviceGroup1";
      agentDevice1.refresh = async (tickNumber) => {
        await snooze(300);
        agentDevice1MockRefresh(tickNumber);
      };

      agentDevice2.getRefreshGroupID = () => "agentDeviceGroup1";
      agentDevice2.refresh = async (tickNumber) => {
        await snooze(200);
        agentDevice2MockRefresh(tickNumber);
      };

      agentDevice3.getRefreshGroupID = () => "agentDeviceGroup1";
      agentDevice3.refresh = async (tickNumber) => {
        await snooze(100);
        agentDevice3MockRefresh(tickNumber);
      };

      //Connect devices:
      // - Group1: dev1 (snooze 300ms), dev2 (snooze 200ms), dev3 (snooze 100ms)
      //Internal devices:
      // - Group1: dev1 (snooze 300ms), dev2 (snooze 200ms), dev3 (snooze 100ms)
      //Agent devices:
      // - Group1: dev1 (snooze 300ms), dev2 (snooze 200ms), dev3 (snooze 100ms)

      await exec();

      //All refresh method should have been called
      expect(connectDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber
      expect(connectDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(internalDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(agentDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - connectDevices: dev1 -> dev2 -> dev3 -> internalDevices: dev1 -> dev2 -> dev3 -> agentDevices: dev1 -> dev2 -> dev3
      expect(connectDevice1MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        connectDevice3MockRefresh
      );
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice2MockRefresh
      );
      expect(internalDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
      expect(internalDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice1MockRefresh
      );
      expect(agentDevice1MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );
      expect(agentDevice2MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
    });

    it("should invoke refresh of devices in proper order - if there are no connect devices", async () => {
      connectDevices = [];
      //Connect devices:
      //Internal devices:
      // - Group1: dev1 (snooze 200ms)
      // - Group2: dev2 (snooze 100ms), dev3 (snooze 200ms)
      //Agent devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)

      await exec();

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber

      expect(internalDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(agentDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - internalDevices: dev2 -> dev1 -> dev3 -> agentDevices: dev1 -> dev3 -> dev2

      expect(internalDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
      expect(internalDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice1MockRefresh
      );
      expect(agentDevice1MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
      expect(agentDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );
    });

    it("should invoke refresh of devices in proper order - if there are no internal devices", async () => {
      internalDevices = [];

      //Connect devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)
      //Internal devices:
      //Agent devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)

      await exec();

      //All refresh method should have been called
      expect(connectDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber
      expect(connectDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(agentDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - connectDevices: dev1 -> dev3 -> dev2 -> internalDevices: dev2 -> dev1 -> dev3 -> agentDevices: dev1 -> dev3 -> dev2
      expect(connectDevice1MockRefresh).toHaveBeenCalledBefore(
        connectDevice3MockRefresh
      );
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        agentDevice1MockRefresh
      );
      expect(agentDevice1MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
      expect(agentDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );
    });

    it("should invoke refresh of devices in proper order - if there are no agent devices", async () => {
      agentDevices = [];

      //Connect devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)
      //Internal devices:
      // - Group1: dev1 (snooze 200ms)
      // - Group2: dev2 (snooze 100ms), dev3 (snooze 200ms)
      //Agent devices:

      await exec();

      //All refresh method should have been called
      expect(connectDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber
      expect(connectDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(internalDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - connectDevices: dev1 -> dev3 -> dev2 -> internalDevices: dev2 -> dev1 -> dev3 -> agentDevices: dev1 -> dev3 -> dev2
      expect(connectDevice1MockRefresh).toHaveBeenCalledBefore(
        connectDevice3MockRefresh
      );
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice2MockRefresh
      );
      expect(internalDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
    });

    it("should invoke refresh of devices in proper order - if one of connect devices throws while refreshing", async () => {
      connectDevice1.refresh = async (tickNumber) => {
        throw new Error("Test Error");
      };

      //Connect devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)
      //Internal devices:
      // - Group1: dev1 (snooze 200ms)
      // - Group2: dev2 (snooze 100ms), dev3 (snooze 200ms)
      //Agent devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)

      await exec();

      //All refresh method should have been called
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //Expected order - connectDevices: dev1 -> dev3 -> dev2 -> internalDevices: dev2 -> dev1 -> dev3 -> agentDevices: dev1 -> dev3 -> dev2
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice2MockRefresh
      );
      expect(internalDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
      expect(internalDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice1MockRefresh
      );
      expect(agentDevice1MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
      expect(agentDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );

      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("Test Error");
    });

    it("should invoke refresh of devices in proper order - if one of internal devices throws while refreshing", async () => {
      internalDevice2.refresh = async (tickNumber) => {
        throw new Error("Test Error");
      };

      //Connect devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)
      //Internal devices:
      // - Group1: dev1 (snooze 200ms)
      // - Group2: dev2 (snooze 100ms), dev3 (snooze 200ms)
      //Agent devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)

      await exec();

      //All refresh method should have been called
      expect(connectDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber
      expect(connectDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(internalDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(agentDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - connectDevices: dev1 -> dev3 -> dev2 -> internalDevices: dev2 -> dev1 -> dev3 -> agentDevices: dev1 -> dev3 -> dev2
      expect(connectDevice1MockRefresh).toHaveBeenCalledBefore(
        connectDevice3MockRefresh
      );
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
      expect(internalDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice1MockRefresh
      );
      expect(agentDevice1MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
      expect(agentDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );

      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("Test Error");
    });

    it("should invoke refresh of devices in proper order - if one of agent devices throws while refreshing", async () => {
      agentDevice1.refresh = async (tickNumber) => {
        throw new Error("Test Error");
      };

      //Connect devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)
      //Internal devices:
      // - Group1: dev1 (snooze 200ms)
      // - Group2: dev2 (snooze 100ms), dev3 (snooze 200ms)
      //Agent devices:
      // - Group1: dev1 (snooze 100ms), dev2 (snooze 200ms)
      // - Group2: dev3 (snooze 200ms)

      await exec();

      //All refresh method should have been called
      expect(connectDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(connectDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(internalDevice1MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(internalDevice3MockRefresh).toHaveBeenCalledTimes(1);

      expect(agentDevice2MockRefresh).toHaveBeenCalledTimes(1);
      expect(agentDevice3MockRefresh).toHaveBeenCalledTimes(1);

      //All refresh method should be invoked with tickNumber
      expect(connectDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(connectDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(internalDevice1MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(internalDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      expect(agentDevice2MockRefresh.mock.calls[0][0]).toEqual(tickNumber);
      expect(agentDevice3MockRefresh.mock.calls[0][0]).toEqual(tickNumber);

      //Expected order - connectDevices: dev1 -> dev3 -> dev2 -> internalDevices: dev2 -> dev1 -> dev3 -> agentDevices: dev1 -> dev3 -> dev2
      expect(connectDevice1MockRefresh).toHaveBeenCalledBefore(
        connectDevice3MockRefresh
      );
      expect(connectDevice3MockRefresh).toHaveBeenCalledBefore(
        connectDevice2MockRefresh
      );
      expect(connectDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice2MockRefresh
      );
      expect(internalDevice2MockRefresh).toHaveBeenCalledBefore(
        internalDevice1MockRefresh
      );
      expect(internalDevice1MockRefresh).toHaveBeenCalledBefore(
        internalDevice3MockRefresh
      );
      expect(internalDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice3MockRefresh
      );
      expect(agentDevice3MockRefresh).toHaveBeenCalledBefore(
        agentDevice2MockRefresh
      );
    });
  });
});
