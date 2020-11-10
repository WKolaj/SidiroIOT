const ValueFromByteArrayCalculator = require("../../../../../classes/Element/CalcElement/ValueFromByteArrayCalculator");
const {
  createFakeDevice,
  createFakeVariable,
} = require("../../../../utilities/testUtilities");

describe("ValueFromByteArrayCalculator", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new ValueFromByteArrayCalculator(project, device);
    };

    it("should create new ValueFromByteArrayCalculator and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.Value).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
      expect(result.BitNumber).toEqual(null);
      expect(result.ByteNumber).toEqual(null);
      expect(result.Length).toEqual(null);
      expect(result.VariableID).toEqual(null);
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
      variable1Value = [1, 1, 1, 1];
      variable1LastValueTick = 100;
      variable1Add = true;

      variable2ID = "variable2ID";
      variable2Value = [2, 2, 2, 2];
      variable2LastValueTick = 200;
      variable2Add = true;

      variable3ID = "variable3ID";
      variable3Value = [3, 3, 3, 3];
      variable3LastValueTick = 300;
      variable3Add = true;

      project = "fakeProject";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "ValueFromByteArrayCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 15,
        variableID: "variable2ID",
        bitNumber: 4,
        byteNumber: 3,
        length: 2,
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

      calcElement = new ValueFromByteArrayCalculator(project, device);

      return calcElement.init(payload);
    };

    it("should initialized ValueFromByteArrayCalculator based on its payload", async () => {
      await exec();

      let calcElementPayload = calcElement.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should not throw and set invalid variableId - if there is no variable of given id", async () => {
      payload.variableID = "fakeVariableID";
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
    //No need to create fake devices and variables - variableID is not checked during initialization
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
        type: "ValueFromByteArrayCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 15,
        variableID: "variable2ID",
        bitNumber: 4,
        byteNumber: 3,
        length: 2,
      };
    });

    let exec = async () => {
      calcElement = new ValueFromByteArrayCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.generatePayload();
    };

    it("should return a valid FactorElement payload", async () => {
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
        type: "ValueFromByteArrayCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 15,
        variableID: "variable2ID",
        bitNumber: 4,
        byteNumber: 3,
        length: 2,
      };
    });

    let exec = () => {
      return ValueFromByteArrayCalculator.validatePayload(payload);
    };

    it("should return null if ValueFromByteArrayCalculator payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [ValueFromByteArrayCalculator]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [ValueFromByteArrayCalculator]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [ValueFromByteArrayCalculator]`);
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

    it("should return message if variableID is not defined", () => {
      delete payload.variableID;

      let result = exec();

      expect(result).toEqual(`"variableID" is required`);
    });

    it("should return message if variableID is null", () => {
      payload.variableID = null;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if variableID is empty string", () => {
      payload.variableID = "";

      let result = exec();

      expect(result).toEqual(`"variableID" is not allowed to be empty`);
    });

    it("should return message if bitNumber is not defined", () => {
      delete payload.bitNumber;

      let result = exec();

      expect(result).toEqual(`"bitNumber" is required`);
    });

    it("should return message if bitNumber is null", () => {
      payload.bitNumber = null;

      let result = exec();

      expect(result).toEqual(`"bitNumber" must be a number`);
    });

    it("should return message if bitNumber is not a number", () => {
      payload.bitNumber = "abcd";

      let result = exec();

      expect(result).toEqual(`"bitNumber" must be a number`);
    });

    it("should return message if bitNumber is a float", () => {
      payload.bitNumber = 123.321;

      let result = exec();

      expect(result).toEqual(`"bitNumber" must be an integer`);
    });

    it("should return message if bitNumber is lesser than 0", () => {
      payload.bitNumber = -1;

      let result = exec();

      expect(result).toEqual(`"bitNumber" must be greater than or equal to 0`);
    });

    it("should return message if bitNumber is greater than 7", () => {
      payload.bitNumber = 8;

      let result = exec();

      expect(result).toEqual(`"bitNumber" must be less than or equal to 7`);
    });

    it("should return message if byteNumber is not defined", () => {
      delete payload.byteNumber;

      let result = exec();

      expect(result).toEqual(`"byteNumber" is required`);
    });

    it("should return message if byteNumber is null", () => {
      payload.byteNumber = null;

      let result = exec();

      expect(result).toEqual(`"byteNumber" must be a number`);
    });

    it("should return message if byteNumber is not a number", () => {
      payload.byteNumber = "abcd";

      let result = exec();

      expect(result).toEqual(`"byteNumber" must be a number`);
    });

    it("should return message if byteNumber is a float", () => {
      payload.byteNumber = 123.321;

      let result = exec();

      expect(result).toEqual(`"byteNumber" must be an integer`);
    });

    it("should return message if byteNumber is lesser than 0", () => {
      payload.byteNumber = -1;

      let result = exec();

      expect(result).toEqual(`"byteNumber" must be greater than or equal to 0`);
    });

    it("should return message if length is not defined", () => {
      delete payload.length;

      let result = exec();

      expect(result).toEqual(`"length" is required`);
    });

    it("should return message if length is null", () => {
      payload.length = null;

      let result = exec();

      expect(result).toEqual(`"length" must be a number`);
    });

    it("should return message if length is not a number", () => {
      payload.length = "abcd";

      let result = exec();

      expect(result).toEqual(`"length" must be a number`);
    });

    it("should return message if length is a float", () => {
      payload.length = 123.321;

      let result = exec();

      expect(result).toEqual(`"length" must be an integer`);
    });

    it("should return message if length is lesser than 1", () => {
      payload.length = 0;

      let result = exec();

      expect(result).toEqual(`"length" must be greater than or equal to 1`);
    });

    it("should return null if bitNumber is 0 and length is 8", () => {
      payload.length = 8;
      payload.bitNumber = 0;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if bitNumber is 7 and length is 1", () => {
      payload.length = 1;
      payload.bitNumber = 7;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if bitNumber is 1 and length is 8", () => {
      payload.length = 8;
      payload.bitNumber = 1;

      let result = exec();

      expect(result).toEqual(
        `"length" must be less than or equal to ref:bitNumber`
      );
    });

    it("should return message if bitNumber is 7 and length is 2", () => {
      payload.length = 7;
      payload.bitNumber = 2;

      let result = exec();

      expect(result).toEqual(
        `"length" must be less than or equal to ref:bitNumber`
      );
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
        type: "ValueFromByteArrayCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 15,
        variableID: "variable2ID",
        bitNumber: 4,
        byteNumber: 3,
        length: 2,
      };

      value = 1234;
    });

    let exec = async () => {
      calcElement = new ValueFromByteArrayCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.checkIfValueCanBeSet(value);
    };

    it("should always return a message that ValueFromByteArrayCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("ValueFromByteArrayCalculator value is readonly");
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
      variable1Value = [1, 2, 3, 4];
      variable1LastValueTick = 100;
      variable1Add = true;

      variable2ID = "variable2ID";
      variable2Value = [5, 6, 7, 8];
      variable2LastValueTick = tickId;
      variable2Add = true;

      variable3ID = "variable3ID";
      variable3Value = [9, 10, 11, 12];
      variable3LastValueTick = 300;
      variable3Add = true;

      project = "fakeProject";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "ValueFromByteArrayCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 15,
        variableID: "variable2ID",
        bitNumber: 1,
        byteNumber: 2,
        length: 3,
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

      calcElement = new ValueFromByteArrayCalculator(project, device);

      await calcElement.init(payload);

      return calcElement.refresh(tickId);
    };

    it("should set value and lastValueTick to ValueFromByteArrayCalculator element", async () => {
      await exec();

      //bits 1,2,3 from byte 2 of variable2 = 7 -> 0000 0111
      //value - 011 -> 3

      expect(calcElement.Value).toEqual(3);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should set value and lastValueTick to ValueFromByteArrayCalculator element - if value is all 1", async () => {
      variable2Value = [5, 6, 15, 8];

      await exec();

      //bits 1,2,3 from byte 2 of variable2 = 15 -> 0000 1111
      //value - 111 -> 7

      expect(calcElement.Value).toEqual(7);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should set value and lastValueTick to ValueFromByteArrayCalculator element - if value is all 0", async () => {
      variable2Value = [5, 6, 0, 8];

      await exec();

      //bits 1,2,3 from byte 2 of variable2 = 15 -> 0000 0000
      //value - 000 -> 0

      expect(calcElement.Value).toEqual(0);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should set value and lastValueTick to ValueFromByteArrayCalculator element - even if variable2 lastValueTick differst from actualTick", async () => {
      tickId = 123;
      variable2LastValueTick = 200;

      await exec();

      //bits 1,2,3 from byte 2 of variable2 = 7 -> 0000 0111
      //value - 011 -> 3

      expect(calcElement.Value).toEqual(3);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should not set value and lastValueTick but also not throw - if there is no variable of given id", async () => {
      payload.variableID = "fakeVariableID";

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

    it("should not set value and lastValueTick but also not throw - if value of variable is not an array", async () => {
      variable2Value = 1234;

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

    it("should not set value and lastValueTick but also not throw - if value of variable is a shorter array", async () => {
      variable2Value = [1, 2];

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
