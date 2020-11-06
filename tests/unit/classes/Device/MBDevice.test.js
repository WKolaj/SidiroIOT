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
    let exec = () => {
      return new MBDevice();
    };

    it("should create new MBDevice and set its RequestManager to MBRequestManager and Driver to MBDriver", async () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.RequestManager).toBeDefined();
      expect(result.RequestManager instanceof MBRequestManager).toEqual(true);

      expect(result.Driver).toBeDefined();
      expect(result.Driver instanceof MBDriver).toEqual(true);
    });
  });

  describe("init", () => {
    let device;
    let payload;

    beforeEach(() => {
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
      device = new MBDevice();
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBFloat
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBFloat
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBUInt32
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBSwappedUInt32
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBSwappedInt32
      );
      testMBVariable(
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
      payload.variables["testVariable3ID"].length = 4;
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBDouble
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBSwappedDouble
      );
      testMBVariable(
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
        12,
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt16
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBUInt16
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
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
        allVariablesValues[0],
        variable1Payload,
        variable1Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
        allVariablesValues[1],
        variable2Payload,
        variable2Payload.defaultValue,
        0,
        MBInt32,
        true
      );
      testMBVariable(
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
      device = new MBDevice();
      await device.init(payload);

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
});
