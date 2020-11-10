const SumCalculator = require("../../../../../classes/Element/CalcElement/SumCalculator");
const {
  createFakeDevice,
  createFakeVariable,
} = require("../../../../utilities/testUtilities");

describe("SumCalculator", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new SumCalculator(project, device);
    };

    it("should create new SumCalculator and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.Value).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
      expect(result.VariableIDs).toEqual(null);
    });

    it("should assign project and device", () => {
      let result = exec();

      expect(result._project).toEqual(project);
      expect(result._device).toEqual(device);
    });
  });

  describe("init", () => {
    let project;
    let variable1ID;
    let variable1Value;
    let variable1LastValueTick;
    let variable1Add;
    let variable1;
    let variable2ID;
    let variable2Value;
    let variable2LastValueTick;
    let variable2Add;
    let variable3ID;
    let variable3Value;
    let variable3LastValueTick;
    let variable3Add;
    let device;
    let payload;
    let calcElement;

    beforeEach(() => {
      variable1ID = "variable1ID";
      variable1Value = 123.321;
      variable1LastValueTick = 100;
      variable1Add = true;

      variable2ID = "variable2ID";
      variable2Value = 223.321;
      variable2LastValueTick = 200;
      variable2Add = true;

      variable3ID = "variable3ID";
      variable3Value = 323.321;
      variable3LastValueTick = 300;
      variable3Add = true;

      project = "fakeProject";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "SumCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableIDs: [
          { variableID: "variable1ID", factor: 1 },
          { variableID: "variable2ID", factor: 2 },
          { variableID: "variable3ID", factor: 3 },
        ],
      };
    });

    let exec = async () => {
      variable1 = createFakeVariable(
        project,
        null,
        variable1ID,
        "variable1Name",
        "FakeVariable",
        variable1Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable1.setValue(variable1Value, variable1LastValueTick);

      variable2 = createFakeVariable(
        project,
        null,
        variable2ID,
        "variable2Name",
        "FakeVariable",
        variable2Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable2.setValue(variable2Value, variable2LastValueTick);

      variable3 = createFakeVariable(
        project,
        null,
        variable3ID,
        "variable3Name",
        "FakeVariable",
        variable3Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable3.setValue(variable3Value, variable3LastValueTick);

      variables = [];
      if (variable1Add) variables.push(variable1);
      if (variable2Add) variables.push(variable2);
      if (variable3Add) variables.push(variable3);

      device = createFakeDevice(
        project,
        "fakeDevice1ID",
        "FakeDevice",
        "fakeDevice1Name",
        [],
        [],
        variables,
        true
      );

      calcElement = new SumCalculator(project, device);

      return calcElement.init(payload);
    };

    it("should initialized FactorCalculator based on its payload", async () => {
      await exec();

      let calcElementPayload = calcElement.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should not throw and set invalid variableIds - if there is no variable of given id", async () => {
      payload.variableIDs = [
        { variableID: "fakeID", factor: 1 },
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];
      await exec();

      let calcElementPayload = calcElement.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });
  });

  describe("generatePayload", () => {
    //No need to create fake devices and variables - variableIDs is not checked during initialization
    let project;
    let device;
    let payload;
    let calcElement;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "SumCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableIDs: [
          { variableID: "variable1ID", factor: 1 },
          { variableID: "variable2ID", factor: 2 },
          { variableID: "variable3ID", factor: 3 },
        ],
      };
    });

    let exec = async () => {
      calcElement = new SumCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.generatePayload();
    };

    it("should return a valid SumCalculator payload", async () => {
      let result = await exec();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
      };

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("validatePayload", () => {
    //No need to create fake devices and variables - variableID is not checked during initialization
    let payload;

    beforeEach(() => {
      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "SumCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableIDs: [
          { variableID: "variable1ID", factor: 1 },
          { variableID: "variable2ID", factor: 2 },
          { variableID: "variable3ID", factor: 3 },
        ],
      };
    });

    let exec = () => {
      return SumCalculator.validatePayload(payload);
    };

    it("should return null if FactorElement payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [SumCalculator]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [SumCalculator]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [SumCalculator]`);
    });

    it("should return message if unit is not defined", () => {
      delete payload.unit;

      let result = exec();

      expect(result).toEqual(`"unit" is required`);
    });

    it("should return message if unit is null", () => {
      payload.unit = null;

      let result = exec();

      expect(result).toEqual(`"unit" must be a string`);
    });

    it("should return message if unit is empty string", () => {
      payload.unit = "";

      let result = exec();

      expect(result).toEqual(`"unit" is not allowed to be empty`);
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

    it("should return message if defaultValue is not a number", () => {
      payload.defaultValue = "test value";

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if variableIDs is not defined", () => {
      delete payload.variableIDs;

      let result = exec();

      expect(result).toEqual(`"variableIDs" is required`);
    });

    it("should return message if variableIDs is null", () => {
      payload.variableIDs = null;

      let result = exec();

      expect(result).toEqual(`"variableIDs" must be an array`);
    });

    it("should return null if variableIDs is an empty array", () => {
      payload.variableIDs = [];

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if one of object inside variableIDs is invalid - null", () => {
      payload.variableIDs = [
        null,
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

      let result = exec();

      expect(result).toEqual(`"variableIDs[0]" must be of type object`);
    });

    it("should return message if one of object inside variableIDs is invalid - lack of variableID", () => {
      payload.variableIDs = [
        { factor: 1 },
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

      let result = exec();

      expect(result).toEqual(`"variableIDs[0].variableID" is required`);
    });

    it("should return message if one of object inside variableIDs is invalid - variableID = null", () => {
      payload.variableIDs = [
        { variableID: null, factor: 1 },
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

      let result = exec();

      expect(result).toEqual(`"variableIDs[0].variableID" must be a string`);
    });

    it("should return message if one of object inside variableIDs is invalid - variableID is not a string", () => {
      payload.variableIDs = [
        { variableID: 123, factor: 1 },
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

      let result = exec();

      expect(result).toEqual(`"variableIDs[0].variableID" must be a string`);
    });

    it("should return message if one of object inside variableIDs is invalid - factor is not present", () => {
      payload.variableIDs = [
        { variableID: "variable1ID" },
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

      let result = exec();

      expect(result).toEqual(`"variableIDs[0].factor" is required`);
    });

    it("should return message if one of object inside variableIDs is invalid - factor is null", () => {
      payload.variableIDs = [
        { variableID: "variable1ID", factor: null },
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

      let result = exec();

      expect(result).toEqual(`"variableIDs[0].factor" must be a number`);
    });

    it("should return message if one of object inside variableIDs is invalid - factor is not a number", () => {
      payload.variableIDs = [
        { variableID: "variable1ID", factor: "fakeFactor" },
        { variableID: "variable2ID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

      let result = exec();

      expect(result).toEqual(`"variableIDs[0].factor" must be a number`);
    });
  });

  describe("checkIfValueCanBeSet", () => {
    //No need to create fake devices and variables - variableID is not checked during initialization
    let project;
    let device;
    let payload;
    let calcElement;
    let value;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "SumCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableIDs: [
          { variableID: "variable1ID", factor: 1 },
          { variableID: "variable2ID", factor: 2 },
          { variableID: "variable3ID", factor: 3 },
        ],
      };

      value = 1234;
    });

    let exec = async () => {
      calcElement = new SumCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.checkIfValueCanBeSet(value);
    };

    it("should always return a message that SumCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("SumCalculator value is readonly");
    });
  });

  describe("refresh", () => {
    let project;
    let variable1ID;
    let variable1Value;
    let variable1LastValueTick;
    let variable1Add;
    let variable1;
    let variable2ID;
    let variable2Value;
    let variable2LastValueTick;
    let variable2Add;
    let variable3ID;
    let variable3Value;
    let variable3LastValueTick;
    let variable3Add;
    let device;
    let payload;
    let calcElement;
    let tickId;

    beforeEach(() => {
      tickId = 1234;

      variable1ID = "variable1ID";
      variable1Value = 123.321;
      variable1LastValueTick = 100;
      variable1Add = true;

      variable2ID = "variable2ID";
      variable2Value = 223.321;
      variable2LastValueTick = tickId;
      variable2Add = true;

      variable3ID = "variable3ID";
      variable3Value = 323.321;
      variable3LastValueTick = 300;
      variable3Add = true;

      project = "fakeProject";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "SumCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableIDs: [
          { variableID: "variable1ID", factor: 1 },
          { variableID: "variable2ID", factor: 2 },
          { variableID: "variable3ID", factor: 3 },
        ],
      };
    });

    let exec = async () => {
      variable1 = createFakeVariable(
        project,
        null,
        variable1ID,
        "variable1Name",
        "FakeVariable",
        variable1Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable1.setValue(variable1Value, variable1LastValueTick);

      variable2 = createFakeVariable(
        project,
        null,
        variable2ID,
        "variable2Name",
        "FakeVariable",
        variable2Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable2.setValue(variable2Value, variable2LastValueTick);

      variable3 = createFakeVariable(
        project,
        null,
        variable3ID,
        "variable3Name",
        "FakeVariable",
        variable3Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable3.setValue(variable3Value, variable3LastValueTick);

      variables = [];
      if (variable1Add) variables.push(variable1);
      if (variable2Add) variables.push(variable2);
      if (variable3Add) variables.push(variable3);

      device = createFakeDevice(
        project,
        "fakeDevice1ID",
        "FakeDevice",
        "fakeDevice1Name",
        [],
        [],
        variables,
        true
      );

      calcElement = new SumCalculator(project, device);

      await calcElement.init(payload);

      return calcElement.refresh(tickId);
    };

    it("should set value and lastValueTick to SumCalculator element", async () => {
      await exec();

      let expectedValue =
        variable1Value * payload.variableIDs[0].factor +
        variable2Value * payload.variableIDs[1].factor +
        variable3Value * payload.variableIDs[2].factor;

      expect(calcElement.Value).toEqual(expectedValue);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should set value and lastValueTick to FactorCalculator element - even if one variables lastValueTick differst from actualTick", async () => {
      tickId = 123;
      variable2LastValueTick = 200;

      await exec();

      let expectedValue =
        variable1Value * payload.variableIDs[0].factor +
        variable2Value * payload.variableIDs[1].factor +
        variable3Value * payload.variableIDs[2].factor;

      expect(calcElement.Value).toEqual(expectedValue);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should not set value and lastValueTick but also not throw - if there is no variable of given id", async () => {
      payload.variableIDs = [
        { variableID: "variable1ID", factor: 1 },
        { variableID: "fakeVariableID", factor: 2 },
        { variableID: "variable3ID", factor: 3 },
      ];

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

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should not set value and lastValueTick but also not throw - if value of variable is not a number", async () => {
      variable2Value = [1, 2, 3, 4, 5];

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

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });
  });
});
