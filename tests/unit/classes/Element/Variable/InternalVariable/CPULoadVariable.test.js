const CPULoadVariable = require("../../../../../../classes/Element/Variable/InternalVariable/CPULoadVariable");
const si = require("systeminformation");

describe("CPULoadVariable", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new CPULoadVariable(project, device);
    };

    it("should create new CPULoadVariable and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);

      expect(result.DefaultValue).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
    });

    it("should assign project and device", () => {
      let result = exec();

      expect(result._project).toEqual(project);
      expect(result._device).toEqual(device);
    });
  });

  describe("init", () => {
    let project;
    let device;
    let payload;
    let variable;

    beforeEach(() => {
      project = {};
      device = { ID: "fakeDeviceId" };
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "CPULoadVariable",
        sampleTime: 876,
        unit: "%",
        defaultValue: 12.34,
      };
    });

    let exec = async () => {
      variable = new CPULoadVariable(project, device);

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      let payload = variable.generatePayload();

      let expectedPayload = {
        ...payload,
        defaultValue: 12.34,
        value: 12.34,
        lastValueTick: 0,
        deviceId: "fakeDeviceId",
      };

      expect(payload).toEqual(expectedPayload);
    });
  });

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "CPULoadVariable",
        sampleTime: 876,
        unit: "%",
        defaultValue: 12.34,
      };
    });

    let exec = () => {
      return CPULoadVariable.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [CPULoadVariable]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [CPULoadVariable]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [CPULoadVariable]`);
    });

    it("should return message if unit is not defined", () => {
      delete payload.unit;

      let result = exec();

      expect(result).toEqual(`"unit" is required`);
    });

    it("should return message if unit is null", () => {
      payload.unit = null;

      let result = exec();

      expect(result).toEqual(`"unit" must be [%]`);
    });

    it("should return message if unit is empty string", () => {
      payload.unit = "";

      let result = exec();

      expect(result).toEqual(`"unit" must be [%]`);
    });

    it("should return message if unit is not a %", () => {
      payload.unit = "A";

      let result = exec();

      expect(result).toEqual(`"unit" must be [%]`);
    });

    it("should return message if sampleTime is not defined", () => {
      delete payload.sampleTime;

      let result = exec();

      expect(result).toEqual(`"sampleTime" is required`);
    });

    it("should return message if sampleTime is null", () => {
      payload.sampleTime = null;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be a number`);
    });

    it("should return message if sampleTime is 0", () => {
      payload.sampleTime = 0;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be greater than or equal to 1`);
    });

    it("should return message if sampleTime is a float", () => {
      payload.sampleTime = 123.321;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be an integer`);
    });

    it("should return message if defaultValue is not defined", () => {
      delete payload.defaultValue;

      let result = exec();

      expect(result).toEqual(`"defaultValue" is required`);
    });

    it("should return message if defaultValue is null", () => {
      payload.defaultValue = null;

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if defaultValue not a number - string", () => {
      payload.defaultValue = "abcd1234";

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });
  });

  describe("checkIfValueCanBeSet", () => {
    let project;
    let device;
    let value;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";

      value = 1234;
    });

    let exec = async () => {
      variable = new CPULoadVariable(project, device);
      return variable.checkIfValueCanBeSet(value);
    };

    it("should always return a message that CPULoadVariable is read only", async () => {
      let result = await exec();

      expect(result).toEqual("CPULoadVariable value is readonly");
    });
  });

  describe("refresh", () => {
    let project;
    let device;
    let payload;
    let variable;
    let siCurrentLoadMockFunc;
    let currentload;

    let tickID;

    beforeEach(() => {
      project = {};
      device = "fakeDevice";
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "CPULoadVariable",
        sampleTime: 876,
        unit: "%",
        defaultValue: 56.78,
      };
      currentload = 12.34;

      tickID = 1234;
      siCurrentLoadMockFunc = jest.fn(si.currentLoad);
    });

    let exec = async () => {
      si._currentLoadData.currentload = currentload;

      variable = new CPULoadVariable(project, device);

      si.currentLoad = siCurrentLoadMockFunc;

      await variable.init(payload);

      return variable.refresh(tickID);
    };

    it("should set value of currentload of si", async () => {
      await exec();

      expect(variable.LastValueTick).toEqual(tickID);
      expect(variable.Value).toEqual(currentload);
    });

    it("should do nothing if currentload throws", async () => {
      siCurrentLoadMockFunc = jest.fn(() => {
        throw new Error("testError");
      });

      await exec();

      expect(variable.LastValueTick).toEqual(0);
      expect(variable.Value).toEqual(56.78);
    });
  });
});
