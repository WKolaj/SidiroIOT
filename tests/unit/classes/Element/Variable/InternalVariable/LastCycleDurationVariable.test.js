const LastCycleDurationVariable = require("../../../../../../classes/Element/Variable/InternalVariable/LastCycleDurationVariable");
const si = require("systeminformation");

describe("LastCycleDurationVariable", () => {
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
      return new LastCycleDurationVariable(project, device);
    };

    it("should create new LastCycleDurationVariable and set all its properties to null", () => {
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
        type: "LastCycleDurationVariable",
        sampleTime: 876,
        unit: "ms",
        defaultValue: 1234,
      };
    });

    let exec = async () => {
      variable = new LastCycleDurationVariable(project, device);

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      let payload = variable.generatePayload();

      let expectedPayload = {
        ...payload,
        defaultValue: 1234,
        value: 1234,
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
        type: "LastCycleDurationVariable",
        sampleTime: 876,
        unit: "ms",
        defaultValue: 1234,
      };
    });

    let exec = () => {
      return LastCycleDurationVariable.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [LastCycleDurationVariable]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [LastCycleDurationVariable]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [LastCycleDurationVariable]`);
    });

    it("should return message if unit is not defined", () => {
      delete payload.unit;

      let result = exec();

      expect(result).toEqual(`"unit" is required`);
    });

    it("should return message if unit is null", () => {
      payload.unit = null;

      let result = exec();

      expect(result).toEqual(`"unit" must be [ms]`);
    });

    it("should return message if unit is empty string", () => {
      payload.unit = "";

      let result = exec();

      expect(result).toEqual(`"unit" must be [ms]`);
    });

    it("should return message if unit is not a ms", () => {
      payload.unit = "A";

      let result = exec();

      expect(result).toEqual(`"unit" must be [ms]`);
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

    it("should return message if defaultValue not an integer - float", () => {
      payload.defaultValue = 1234.4321;

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be an integer`);
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
      variable = new LastCycleDurationVariable(project, device);
      return variable.checkIfValueCanBeSet(value);
    };

    it("should always return a message that LastCycleDurationVariable is read only", async () => {
      let result = await exec();

      expect(result).toEqual("LastCycleDurationVariable value is readonly");
    });
  });

  describe("refresh", () => {
    let project;
    let device;
    let payload;
    let lastCycleDuration;
    let variable;
    let tickID;

    beforeEach(() => {
      lastCycleDuration = 4321;
      project = { LastCycleDuration: null };
      device = "fakeDevice";
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "LastCycleDurationVariable",
        sampleTime: 876,
        unit: "ms",
        defaultValue: 1234,
      };

      tickID = 1234;
    });

    let exec = async () => {
      project.LastCycleDuration = lastCycleDuration;

      variable = new LastCycleDurationVariable(project, device);

      await variable.init(payload);

      return variable.refresh(tickID);
    };

    it("should set value of lastCycleDuration from project", async () => {
      await exec();

      expect(variable.LastValueTick).toEqual(tickID);
      expect(variable.Value).toEqual(lastCycleDuration);
    });

    it("should set value of lastCycleDuration from project - if lastCycleDuration is 0", async () => {
      lastCycleDuration = 0;

      await exec();

      expect(variable.LastValueTick).toEqual(tickID);
      expect(variable.Value).toEqual(lastCycleDuration);
    });

    it("should do nothing if lastCycleDuration is null", async () => {
      lastCycleDuration = null;

      await exec();

      expect(variable.LastValueTick).toEqual(0);
      expect(variable.Value).toEqual(1234);
    });
  });
});
