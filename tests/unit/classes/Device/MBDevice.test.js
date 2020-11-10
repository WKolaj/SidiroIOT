const MBDevice = require("../../../../classes/Device/ConnectableDevice/MBDevice");
const MBDriver = require("../../../../classes/Driver/MBDriver");
const MBFloat = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBFloat");
const MBInt32 = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBInt32");
const MBUInt32 = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBUInt32");
const MBSwappedFloat = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedFloat");
const MBSwappedInt32 = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedInt32");
const MBSwappedUInt32 = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedUInt32");
const MBRequestManager = require("../../../../classes/Request/MBRequest/MBRequestManager");
const {
  createFakeCalcElement,
  createFakeAlert,
  testMBVariable,
  testMBRequest,
} = require("../../../utilities/testUtilities");
const MBDouble = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBDouble");
const MBSwappedDouble = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedDouble");
const MBByteArray = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBByteArray");
const MBBoolean = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBBoolean");
const MBUInt16 = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBUInt16");
const MBInt16 = require("../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBInt16");
const { snooze } = require("../../../../utilities/utilities");

describe("MBDevice", () => {
  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "fakeProject";
    });

    let exec = () => {
      return new MBDevice(project);
    };

    it("should create new MBDevice and set its RequestManager to MBRequestManager and Driver to MBDriver", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.RequestManager).toBeDefined();
      expect(result.RequestManager instanceof MBRequestManager).toEqual(true);

      expect(result.Driver).toBeDefined();
      expect(result.Driver instanceof MBDriver).toEqual(true);
    });

    it("should assign project to MBDevice", () => {
      let result = exec();

      expect(result._project).toEqual(project);
    });
  });

  describe("init", () => {
    let project;
    let device;
    let payload;

    beforeEach(() => {
      project = "testProject";
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            offset: 12,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            offset: 14,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.100.100",
        portNumber: 602,
        timeout: 2500,
      };
    });

    //TODO - add tests for calcElements and alerts after implementation
    //TODO - add tests with internal variables and associated variables

    let exec = async () => {
      device = new MBDevice(project);
      return device.init(payload);
    };

    it("should initialize MBDevice based on given payload", async () => {
      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBFloat
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBFloat
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBFloat
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        10,
        6,
        1,
        false,
        true,
        allVariablesValues
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables are of different types - MBFloat, MBInt32 and MBUInt32", async () => {
      payload.variables["testVariable1ID"].type = "MBUInt32";
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].defaultValue = 432;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBUInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBFloat
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        10,
        6,
        1,
        false,
        true,
        allVariablesValues
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables are of different types - MBSwappedFloat, MBSwappedInt32 and MBSwappedUInt32", async () => {
      payload.variables["testVariable1ID"].type = "MBSwappedUInt32";
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable2ID"].type = "MBSwappedInt32";
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBSwappedFloat";
      payload.variables["testVariable3ID"].defaultValue = 321.123;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBSwappedUInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBSwappedInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBSwappedFloat
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        10,
        6,
        1,
        false,
        true,
        allVariablesValues
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables are of different types - MBDouble, MBSwappedDouble and MBByteArray", async () => {
      payload.variables["testVariable1ID"].type = "MBDouble";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 4;
      payload.variables["testVariable1ID"].defaultValue = 123.321;
      payload.variables["testVariable2ID"].type = "MBSwappedDouble";
      payload.variables["testVariable2ID"].offset = 14;
      payload.variables["testVariable2ID"].length = 4;
      payload.variables["testVariable2ID"].defaultValue = 432.234;
      payload.variables["testVariable3ID"].type = "MBByteArray";
      payload.variables["testVariable3ID"].offset = 18;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].defaultValue = [1, 2, 3, 4];

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBDouble
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBSwappedDouble
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBByteArray,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        10,
        10,
        1,
        false,
        true,
        allVariablesValues
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables are of different types - MBInt16, MBUInt16, MBBoolean", async () => {
      payload.variables["testVariable1ID"].type = "MBInt16";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 1;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable2ID"].type = "MBUInt16";
      payload.variables["testVariable2ID"].offset = 11;
      payload.variables["testVariable2ID"].length = 1;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBBoolean";
      payload.variables["testVariable3ID"].offset = 25;
      payload.variables["testVariable3ID"].length = 1;
      payload.variables["testVariable3ID"].readFCode = 2;
      payload.variables["testVariable3ID"].defaultValue = true;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt16
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBUInt16
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBBoolean,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        2,
        25,
        1,
        1,
        false,
        true,
        [allVariablesValues[2]]
      );
      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        3,
        10,
        2,
        1,
        false,
        true,
        [allVariablesValues[0], allVariablesValues[1]]
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if there is no variables in payload", async () => {
      payload.variables = {};

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.Variables).toEqual({});
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);
    });

    it("should not initialize MBDevice and throw - if type of one of variable is not recoginzed", async () => {
      payload.variables["testVariable1ID"].type = "FakeType";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("Unrecognized Variable type: FakeType");
    });

    it("should not initialize MBDevice and throw - if type is different than MBDevice", async () => {
      payload.type = "FakeType";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("Trying to set type FakeType to MBDevice!");
    });

    it("should initialize MBDevice based on given payload - if variables are to write", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable1ID"].read = false;
      payload.variables["testVariable1ID"].write = true;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 12;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable2ID"].read = false;
      payload.variables["testVariable2ID"].write = true;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 14;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].defaultValue = 876;
      payload.variables["testVariable3ID"].read = false;
      payload.variables["testVariable3ID"].write = true;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        16,
        10,
        6,
        1,
        true,
        false,
        allVariablesValues
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables is a split between variables and variables are to read", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 14;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 16;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].defaultValue = 876;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        10,
        2,
        1,
        false,
        true,
        [allVariablesValues[0]]
      );
      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        3,
        14,
        4,
        1,
        false,
        true,
        [allVariablesValues[1], allVariablesValues[2]]
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables is a split between variables and variables are to write", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].read = false;
      payload.variables["testVariable1ID"].write = true;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 14;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].read = false;
      payload.variables["testVariable2ID"].write = true;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 16;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].defaultValue = 876;
      payload.variables["testVariable3ID"].read = false;
      payload.variables["testVariable3ID"].write = true;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        16,
        10,
        2,
        1,
        true,
        false,
        [allVariablesValues[0]]
      );
      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        16,
        14,
        4,
        1,
        true,
        false,
        [allVariablesValues[1], allVariablesValues[2]]
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if there are some variables to read some to write", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].read = true;
      payload.variables["testVariable1ID"].write = false;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 12;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].read = false;
      payload.variables["testVariable2ID"].write = true;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 14;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].read = true;
      payload.variables["testVariable3ID"].write = false;
      payload.variables["testVariable3ID"].defaultValue = 876;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(3);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        10,
        2,
        1,
        false,
        true,
        [allVariablesValues[0]]
      );

      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        3,
        14,
        2,
        1,
        false,
        true,
        [allVariablesValues[2]]
      );

      testMBRequest(
        device.RequestManager.Requests[2],
        15,
        16,
        12,
        2,
        1,
        true,
        false,
        [allVariablesValues[1]]
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if some variables have readAsSingle set to true", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].read = true;
      payload.variables["testVariable1ID"].write = false;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable1ID"].readAsSingle = true;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 12;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].read = true;
      payload.variables["testVariable2ID"].write = false;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 14;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].read = true;
      payload.variables["testVariable3ID"].write = false;
      payload.variables["testVariable3ID"].defaultValue = 876;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        10,
        2,
        1,
        false,
        true,
        [allVariablesValues[0]]
      );

      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        3,
        12,
        4,
        1,
        false,
        true,
        [allVariablesValues[1], allVariablesValues[2]]
      );
      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if some variables have writeAsSingle set to true", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].read = false;
      payload.variables["testVariable1ID"].write = true;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable1ID"].writeAsSingle = true;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 12;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].read = false;
      payload.variables["testVariable2ID"].write = true;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 14;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].read = false;
      payload.variables["testVariable3ID"].write = true;
      payload.variables["testVariable3ID"].defaultValue = 876;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        16,
        10,
        2,
        1,
        true,
        false,
        [allVariablesValues[0]]
      );

      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        16,
        12,
        4,
        1,
        true,
        false,
        [allVariablesValues[1], allVariablesValues[2]]
      );
      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables have different SampleTime", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable1ID"].sampleTime = 10;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 12;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 14;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].defaultValue = 876;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        10,
        3,
        10,
        2,
        1,
        false,
        true,
        [allVariablesValues[0]]
      );

      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        3,
        12,
        4,
        1,
        false,
        true,
        [allVariablesValues[1], allVariablesValues[2]]
      );
      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables have different ReadFCode", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable1ID"].readFCode = 4;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 12;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 14;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].defaultValue = 876;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        12,
        4,
        1,
        false,
        true,
        [allVariablesValues[1], allVariablesValues[2]]
      );

      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        4,
        10,
        2,
        1,
        false,
        true,
        [allVariablesValues[0]]
      );

      //#endregion Checking requests
    });

    it("should initialize MBDevice based on given payload - if variables have different UnitID", async () => {
      payload.variables["testVariable1ID"].type = "MBInt32";
      payload.variables["testVariable1ID"].offset = 10;
      payload.variables["testVariable1ID"].length = 2;
      payload.variables["testVariable1ID"].defaultValue = 123;
      payload.variables["testVariable1ID"].unitID = 2;
      payload.variables["testVariable2ID"].type = "MBInt32";
      payload.variables["testVariable2ID"].offset = 12;
      payload.variables["testVariable2ID"].length = 2;
      payload.variables["testVariable2ID"].defaultValue = 432;
      payload.variables["testVariable3ID"].type = "MBInt32";
      payload.variables["testVariable3ID"].offset = 14;
      payload.variables["testVariable3ID"].length = 2;
      payload.variables["testVariable3ID"].defaultValue = 876;

      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);

      //#region Checking variables

      let allVariablesKeys = Object.keys(device.Variables);
      let allVariablesValues = Object.values(device.Variables);

      expect(allVariablesKeys).toEqual([
        "testVariable1ID",
        "testVariable2ID",
        "testVariable3ID",
      ]);

      expect(allVariablesValues.length).toEqual(3);

      let variable1Payload = payload.variables["testVariable1ID"];
      let variable2Payload = payload.variables["testVariable2ID"];
      let variable3Payload = payload.variables["testVariable3ID"];

      testMBVariable(
        project,
        device,
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        project,
        device,
        allVariablesValues[2],
        variable3Payload,
        variable3Payload.defaultValue,
        0,
        MBInt32,
        true
      );

      //#endregion Checking variables

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testMBRequest(
        device.RequestManager.Requests[0],
        15,
        3,
        12,
        4,
        1,
        false,
        true,
        [allVariablesValues[1], allVariablesValues[2]]
      );

      testMBRequest(
        device.RequestManager.Requests[1],
        15,
        3,
        10,
        2,
        2,
        false,
        true,
        [allVariablesValues[0]]
      );

      //#endregion Checking requests
    });
  });

  describe("generatePayload", () => {
    let project;
    let payload;
    let device;
    let connectDevice;
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
    let addCalcElement1;
    let addCalcElement2;
    let addCalcElement3;
    let addAlert1;
    let addAlert2;
    let addAlert3;

    beforeEach(() => {
      project = "testProject";
      connectDevice = false;
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.100.100",
        portNumber: 602,
        timeout: 2500,
      };

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
      device = new MBDevice(project);
      await device.init(payload);

      //#region create calcElements

      calcElements = [];

      calcElement1 = createFakeCalcElement(
        project,
        device,
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
        device,
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
        device,
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
        device,
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
        device,
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
        device,
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

      for (let calcElement of calcElements)
        device.CalcElements[calcElement.ID] = calcElement;

      for (let alert of alerts) device.Alerts[alert.ID] = alert;

      if (connectDevice) await device.Driver._connect();
      return device.generatePayload();
    };

    it("should return valid payload of device and its variables - if is connected is false", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            value: 123.456,
            lastValueTick: 0,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            value: 321.654,
            lastValueTick: 0,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            value: 789.654,
            lastValueTick: 0,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        isConnected: false,
        ipAddress: "192.168.100.100",
        portNumber: 602,
        timeout: 2500,
      };

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

    it("should return valid payload of device and its variables - if is connected is true", async () => {
      connectDevice = true;

      let result = await exec();

      expect(result).toBeDefined();

      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            value: 123.456,
            lastValueTick: 0,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            value: 321.654,
            lastValueTick: 0,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "MBDouble",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            value: 789.654,
            lastValueTick: 0,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        isConnected: true,
        ipAddress: "192.168.100.100",
        portNumber: 602,
        timeout: 2500,
      };

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

    it("should return valid payload of device and its variables - if there are no variables, calcElements and alerts", async () => {
      payload.variables = {};

      addCalcElement1 = false;
      addCalcElement2 = false;
      addCalcElement3 = false;

      addAlert1 = false;
      addAlert2 = false;
      addAlert3 = false;

      let result = await exec();

      expect(result).toBeDefined();

      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "MBDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        isConnected: false,
        ipAddress: "192.168.100.100",
        portNumber: 602,
        timeout: 2500,
      };

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: "device1ID",
        name: "device1Name",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };
    });

    let exec = () => {
      return MBDevice.validatePayload(payload);
    };

    it("should return null if payload is valid", () => {
      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if id is not defined", () => {
      delete payload.id;

      let result = exec();

      expect(result).toEqual(`"id" is required`);
    });

    it("should return message if id is null", () => {
      payload.id = null;

      let result = exec();

      expect(result).toEqual(`"id" must be a string`);
    });

    it("should return message if id is empty string", () => {
      payload.id = "";

      let result = exec();

      expect(result).toEqual(`"id" is not allowed to be empty`);
    });

    it("should return message if name is not defined", () => {
      delete payload.name;

      let result = exec();

      expect(result).toEqual(`"name" is required`);
    });

    it("should return message if name is null", () => {
      payload.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if name is empty string", () => {
      payload.name = "";

      let result = exec();

      expect(result).toEqual(`"name" is not allowed to be empty`);
    });

    it("should return message if type is not defined", () => {
      delete payload.type;

      let result = exec();

      expect(result).toEqual(`"type" is required`);
    });

    it("should return message if type is null", () => {
      payload.type = null;

      let result = exec();

      expect(result).toEqual(`"type" must be [MBDevice]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBDevice]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBDevice]`);
    });

    it("should return message if ipAddress is not defined", () => {
      delete payload.ipAddress;

      let result = exec();

      expect(result).toEqual(`"ipAddress" is required`);
    });

    it("should return message if ipAddress is null", () => {
      payload.ipAddress = null;

      let result = exec();

      expect(result).toEqual(`"ipAddress" must be a string`);
    });

    it("should return message if ipAddress is empty string", () => {
      payload.ipAddress = "";

      let result = exec();

      expect(result).toEqual(`"ipAddress" is not allowed to be empty`);
    });

    it("should return message if ipAddress is invalid ipAddress", () => {
      payload.ipAddress = "fakeIP";

      let result = exec();

      expect(result).toEqual(
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return message if ipAddress is a valid IP with CIDR", () => {
      payload.ipAddress = "192.168.10.10/24";

      let result = exec();

      expect(result).toEqual(
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return message if portNumber is not defined", () => {
      delete payload.portNumber;

      let result = exec();

      expect(result).toEqual(`"portNumber" is required`);
    });

    it("should return message if portNumber is null", () => {
      payload.portNumber = null;

      let result = exec();

      expect(result).toEqual(`"portNumber" must be a number`);
    });

    it("should return message if portNumber is a float", () => {
      payload.portNumber = 123.321;

      let result = exec();

      expect(result).toEqual(`"portNumber" must be an integer`);
    });

    it("should return message if portNumber is smaller than 1", () => {
      payload.portNumber = 0;

      let result = exec();

      expect(result).toEqual(`"portNumber" must be greater than or equal to 1`);
    });

    it("should return message if timeout is not defined", () => {
      delete payload.timeout;

      let result = exec();

      expect(result).toEqual(`"timeout" is required`);
    });

    it("should return message if timeout is null", () => {
      payload.timeout = null;

      let result = exec();

      expect(result).toEqual(`"timeout" must be a number`);
    });

    it("should return message if timeout is a float", () => {
      payload.timeout = 123.321;

      let result = exec();

      expect(result).toEqual(`"timeout" must be an integer`);
    });

    it("should return message if timeout is smaller than 1", () => {
      payload.timeout = 0;

      let result = exec();

      expect(result).toEqual(`"timeout" must be greater than or equal to 1`);
    });

    it("should return message if isActive is not defined", () => {
      delete payload.isActive;

      let result = exec();

      expect(result).toEqual(`"isActive" is required`);
    });

    it("should return message if isActive is null", () => {
      payload.isActive = null;

      let result = exec();

      expect(result).toEqual(`"isActive" must be a boolean`);
    });

    it("should return message if isActive is not a boolean", () => {
      payload.isActive = 123.321;

      let result = exec();

      expect(result).toEqual(`"isActive" must be a boolean`);
    });

    it("should return message if one of variables payload is invalid - id different than id inside payload", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable99ID",
        name: "testVariable1Name",
        type: "MBFloat",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 321.654,
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 3,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`variable's id as key and in payload differs!`);
    });

    it("should return message if variables is not defined", () => {
      delete payload.variables;

      let result = exec();

      expect(result).toEqual(`"variables" is required`);
    });

    it("should return message if variables is null", () => {
      payload.variables = null;

      let result = exec();

      expect(result).toEqual(`"variables" cannot be null`);
    });

    it("should return message if one of variables payload is invalid - id different than id inside payload", () => {
      payload.variables.testVariable1ID = {
        id: "testVariable99ID",
        name: "testVariable1Name",
        type: "MBFloat",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 321.654,
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 3,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`variable's id as key and in payload differs!`);
    });

    it("should return message if one of variables payload is invalid - MBBoolean", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBBoolean",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 321.654,
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a boolean`);
    });

    it("should return message if one of variables payload is invalid - MBByteArray", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBByteArray",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: [1, 2],
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must contain ref:length items`);
    });

    it("should return message if one of variables payload is invalid - MBDouble", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBDouble",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 4,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBFloat", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBFloat",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBInt16", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBInt16",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 1,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBInt32",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedDouble", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedDouble",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 4,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedFloat", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedFloat",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedInt32",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedUInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedUInt32",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBUInt16", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBUInt16",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 1,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBUInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBUInt32",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    //TODO - add tests for associated variables and internal variables

    it("should return message if one of variables types is not recognized", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "FakeType",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`variable type not recognized`);
    });

    it("should return message if calcElements is not defined", () => {
      delete payload.calcElements;

      let result = exec();

      expect(result).toEqual(`"calcElements" is required`);
    });

    it("should return message if calcElements is null", () => {
      payload.calcElements = null;

      let result = exec();

      expect(result).toEqual(`"calcElements" cannot be null`);
    });

    //TODO - add tests for types of calcElements

    it("should return message if alerts is not defined", () => {
      delete payload.alerts;

      let result = exec();

      expect(result).toEqual(`"alerts" is required`);
    });

    it("should return message if alerts is null", () => {
      payload.alerts = null;

      let result = exec();

      expect(result).toEqual(`"alerts" cannot be null`);
    });

    //TODO - add tests for types of alerts
  });

  describe("getRefreshGroupID", () => {
    let project;
    let device;
    let payload;

    beforeEach(() => {
      project = "testProject";
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "MBDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            offset: 12,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "MBFloat",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            offset: 14,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.100.100",
        portNumber: 602,
        timeout: 2500,
      };
    });

    let exec = async () => {
      device = new MBDevice(project);
      await device.init(payload);
      return device.getRefreshGroupID();
    };

    it("should return ipAddress:portNumber as a group id", async () => {
      let result = await exec();

      expect(result).toEqual(`${payload.ipAddress}:${payload.portNumber}`);
    });
  });
});
