const MinCalculator = require("../../../../../classes/Element/CalcElement/ExtremeCalculator/MinCalculator");
const {
  createFakeDevice,
  createFakeVariable,
} = require("../../../../utilities/testUtilities");

describe("MinCalculator", () => {
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
      return new MinCalculator(project, device);
    };

    it("should create new MinCalculator and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.Value).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
      expect(result.VariableID).toEqual(null);
      expect(result.CalculationInterval).toEqual(null);
      expect(result._refreshedFirstTime).toEqual(null);
      expect(result._beginIntervalTick).toEqual(null);
      expect(result._endIntervalTick).toEqual(null);
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
        type: "MinCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "variable2ID",
        calculationInterval: 15,
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

      calcElement = new MinCalculator(project, device);

      return calcElement.init(payload);
    };

    it("should initialized MinCalculator based on its payload", async () => {
      await exec();

      let calcElementPayload = calcElement.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
        deviceId: "fakeDevice1ID",
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
        deviceId: "fakeDevice1ID",
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should set _refreshedFirstTime to false and _valuesAndTicks to empty object", async () => {
      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(false);
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
      device = { ID: "fakeDeviceId" };

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "MinCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        calculationInterval: 15,
      };
    });

    let exec = async () => {
      calcElement = new MinCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.generatePayload();
    };

    it("should return a valid MinCalculator payload", async () => {
      let result = await exec();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
        deviceId: "fakeDeviceId",
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
        type: "MinCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        calculationInterval: 15,
      };
    });

    let exec = () => {
      return MinCalculator.validatePayload(payload);
    };

    it("should return null if MinCalculator payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [MinCalculator]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [MinCalculator]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [MinCalculator]`);
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

    it("should return message if calculationInterval is not defined", () => {
      delete payload.calculationInterval;

      let result = exec();

      expect(result).toEqual(`"calculationInterval" is required`);
    });

    it("should return null if calculationInterval is null", () => {
      payload.calculationInterval = null;

      let result = exec();

      expect(result).toEqual(`"calculationInterval" must be a number`);
    });

    it("should return message if calculationInterval is not a number", () => {
      payload.calculationInterval = "abcd";

      let result = exec();

      expect(result).toEqual(`"calculationInterval" must be a number`);
    });

    it("should return message if calculationInterval is a float", () => {
      payload.calculationInterval = 123.321;

      let result = exec();

      expect(result).toEqual(`"calculationInterval" must be an integer`);
    });

    it("should return message if calculationInterval is lesser than 1", () => {
      payload.calculationInterval = 0;

      let result = exec();

      expect(result).toEqual(
        `"calculationInterval" must be greater than or equal to 1`
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
        type: "MinCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
      };

      value = 1234;
    });

    let exec = async () => {
      calcElement = new MinCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.checkIfValueCanBeSet(value);
    };

    it("should always return a message that MinCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("MinCalculator value is readonly");
    });
  });

  describe("refresh", () => {
    let project;
    let variable1ID;
    let variable1Value;
    let variable1LastValueTick;
    let variable1Add;
    let variable1;
    let device;
    let payload;
    let calcElement;
    let tickId;
    let beginIntervalTick;
    let endIntervalTick;
    let refreshedFirstTime;
    let value;
    let lastValueTick;

    beforeEach(() => {
      variable1ID = "variable1ID";
      variable1Value = 9.9;
      variable1LastValueTick = 150;
      variable1Add = true;

      project = "fakeProject";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "MinCalculator",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 123456.654321,
        variableID: "variable1ID",
        calculationInterval: 100,
      };

      beginIntervalTick = 100;
      endIntervalTick = 200;
      value = 10;
      lastValueTick = 110;
      tickId = 150;

      refreshedFirstTime = true;
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

      variables = [];
      if (variable1Add) variables.push(variable1);

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

      calcElement = new MinCalculator(project, device);

      await calcElement.init(payload);

      calcElement._beginIntervalTick = beginIntervalTick;
      calcElement._endIntervalTick = endIntervalTick;
      calcElement._refreshedFirstTime = refreshedFirstTime;
      calcElement._value = value;
      calcElement._lastValueTick = lastValueTick;

      return calcElement.refresh(tickId);
    };

    it("should set new value and tickId to calcElement - if value is smaller then actual value", async () => {
      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval and refreshedFirstTime should stay as they are
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);
    });

    it("should not set new value and tickId to calcElement - if value is greater then actual value", async () => {
      variable1Value = 10.1;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(value);
      expect(calcElement.LastValueTick).toEqual(lastValueTick);

      //interval and refreshedFirstTime should stay as they are
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);
    });

    it("should not begin new interval and not set value to calcElement - if value is greater then actual interval and tickId is exactly the tick of interval end", async () => {
      variable1Value = 10.1;
      variable1LastValueTick = 200;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(value);
      expect(calcElement.LastValueTick).toEqual(lastValueTick);

      //interval should not be changed
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);
    });

    it("should not begin new interval but set value to calcElement - if value is smaller then actual interval and tickId is exactly the tick of interval end", async () => {
      variable1Value = 9.9;
      variable1LastValueTick = 200;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should not be changed
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);
    });

    it("should begin new interval and set value to calcElement - if value is greater then actual but tick id is from new interval", async () => {
      variable1Value = 10.1;
      variable1LastValueTick = 201;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(200);
      expect(calcElement._endIntervalTick).toEqual(300);
    });

    it("should begin new interval and set value to calcElement - if value is smaller then actual and tick id is from new interval", async () => {
      variable1Value = 9.9;
      variable1LastValueTick = 201;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(200);
      expect(calcElement._endIntervalTick).toEqual(300);
    });

    it("should begin new interval, skip one internval and set value to calcElement - if value is greater then actual but tick id is from new interval more than one interval ahead", async () => {
      variable1Value = 10.1;
      variable1LastValueTick = 301;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);
    });

    it("should begin new interval, skip one internval and set value to calcElement - if value is smaller then actual and tick id is from new interval more than one interval ahead", async () => {
      variable1Value = 9.9;
      variable1LastValueTick = 301;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);
    });

    it("should set value to calcElement and new beginIntervalTick and endInterval tick - if refreshedFirstTime is false, value is greater and interval values are null", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = null;
      endIntervalTick = null;
      value = 10.1;
      variable1Value = 9.9;
      variable1LastValueTick = 301;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);
    });

    it("should set value to calcElement and new beginIntervalTick and endInterval tick - if refreshedFirstTime is false, value is greater and interval values are null", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = null;
      endIntervalTick = null;
      value = 10;
      variable1Value = 10.1;
      variable1LastValueTick = 301;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);
    });

    it("should set value to calcElement and new beginIntervalTick and endInterval tick - if refreshedFirstTime is false and interval values are null", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = null;
      endIntervalTick = null;
      variable1Value = 10.1;
      variable1LastValueTick = 301;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);
    });

    it("should set value to calcElement and new beginIntervalTick and endInterval tick - if refreshedFirstTime is false and interval values are not null", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = 100;
      endIntervalTick = 200;
      variable1Value = 10.1;
      variable1LastValueTick = 301;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);
    });

    it("should set value to calcElement and new beginIntervalTick and endInterval tick - if refreshedFirstTime is false and interval values are not null and from the same interval", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = 300;
      endIntervalTick = 400;
      variable1Value = 10.1;
      variable1LastValueTick = 301;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(variable1Value);
      expect(calcElement.LastValueTick).toEqual(variable1LastValueTick);

      //interval should be set to new interval
      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);
    });

    it("should not set value to calcElement and new beginIntervalTick and endInterval tick - if variable does not exist", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = null;
      endIntervalTick = null;
      payload.variableID = "fakeVariableID";

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(value);
      expect(calcElement.LastValueTick).toEqual(lastValueTick);

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._beginIntervalTick).toEqual(null);
      expect(calcElement._endIntervalTick).toEqual(null);
    });

    it("should not set value to calcElement and new beginIntervalTick and endInterval tick - if value is not a number (boolean)", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = null;
      endIntervalTick = null;
      variable1Value = true;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(value);
      expect(calcElement.LastValueTick).toEqual(lastValueTick);

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._beginIntervalTick).toEqual(null);
      expect(calcElement._endIntervalTick).toEqual(null);
    });

    it("should not set value to calcElement and new beginIntervalTick and endInterval tick - if lastValueTick of variable is null (defaultValue)", async () => {
      refreshedFirstTime = false;
      beginIntervalTick = null;
      endIntervalTick = null;
      variable1LastValueTick = null;

      await exec();

      //new value should have been set
      expect(calcElement.Value).toEqual(value);
      expect(calcElement.LastValueTick).toEqual(lastValueTick);

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._beginIntervalTick).toEqual(null);
      expect(calcElement._endIntervalTick).toEqual(null);
    });
  });
});
