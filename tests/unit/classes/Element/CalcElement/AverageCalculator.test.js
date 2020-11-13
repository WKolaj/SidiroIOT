const { ref } = require("joi");
const AverageCalculator = require("../../../../../classes/Element/CalcElement/AverageCalculator");
const {
  createFakeDevice,
  createFakeVariable,
} = require("../../../../utilities/testUtilities");

describe("AverageCalculator", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new AverageCalculator(project, device);
    };

    it("should create new AverageCalculator and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.Value).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
      expect(result.Factor).toEqual(null);
      expect(result.VariableID).toEqual(null);
      expect(result.CalculationInterval).toEqual(null);
      expect(result._refreshedFirstTime).toEqual(null);
      expect(result._valuesAndTicks).toEqual(null);
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
        type: "AverageCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "variable2ID",
        factor: 5,
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

      calcElement = new AverageCalculator(project, device);

      return calcElement.init(payload);
    };

    it("should initialized AverageCalculator based on its payload", async () => {
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

    it("should set _refreshedFirstTime to false and _valuesAndTicks to empty object", async () => {
      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._valuesAndTicks).toEqual({});
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
        type: "AverageCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
        calculationInterval: 15,
      };
    });

    let exec = async () => {
      calcElement = new AverageCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.generatePayload();
    };

    it("should return a valid AverageCalculator payload", async () => {
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
        type: "AverageCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
        calculationInterval: 15,
      };
    });

    let exec = () => {
      return AverageCalculator.validatePayload(payload);
    };

    it("should return null if AverageCalculator payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [AverageCalculator]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [AverageCalculator]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [AverageCalculator]`);
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

    it("should return message if factor is not defined", () => {
      delete payload.factor;

      let result = exec();

      expect(result).toEqual(`"factor" is required`);
    });

    it("should return message if factor is null", () => {
      payload.factor = null;

      let result = exec();

      expect(result).toEqual(`"factor" must be a number`);
    });

    it("should return message if factor is not a number", () => {
      payload.factor = "test value";

      let result = exec();

      expect(result).toEqual(`"factor" must be a number`);
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
        type: "AverageCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
      };

      value = 1234;
    });

    let exec = async () => {
      calcElement = new AverageCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.checkIfValueCanBeSet(value);
    };

    it("should always return a message that AverageCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("AverageCalculator value is readonly");
    });
  });

  describe("_calculateAverage", () => {
    let project;
    let device;
    let calcElement;
    let beginTickInterval;
    let endTickInterval;
    let valuesAndTicks;
    let factor;
    let value;
    let tickId;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      value = 25;
      tickId = 210;
    });

    let exec = () => {
      calcElement = new AverageCalculator(project, device);
      calcElement._beginIntervalTick = beginTickInterval;
      calcElement._endIntervalTick = endTickInterval;
      calcElement._valuesAndTicks = valuesAndTicks;
      calcElement._factor = factor;

      return calcElement._calculateAverage(tickId, value);
    };

    it("should calculate average value based on valuesAndTicks, value and beginTickInterval and endTickInterval correctly", () => {
      let result = exec();

      //begin 100
      //      115:10
      //      140:15
      //      160:20
      //end   200:25

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25

      expect(result).toEqual(96.25);
    });

    it("should calculate average value based on valuesAndTicks, value and beginTickInterval and endTickInterval correctly - if first tickId is the same as begin interval", () => {
      valuesAndTicks = { 100: 10, 140: 15, 160: 20 };

      let result = exec();

      //begin 100
      //      100:10
      //      140:15
      //      160:20
      //end   200:25

      //average - 5*(0*10 + 40*15 + 20*20 + 40*25)/100 = 100

      expect(result).toEqual(100);
    });

    it("should calculate average value based on valuesAndTicks, value and beginTickInterval and endTickInterval correctly - if tickId is the same as end interval", () => {
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      tickId = 200;

      let result = exec();

      //begin 100
      //      115:10
      //      140:15
      //      160:20
      //end   200:25

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 103.75

      expect(result).toEqual(96.25);
    });

    it("should calculate average value based on valuesAndTicks, value and beginTickInterval and endTickInterval correctly - if there is only one element in values", () => {
      valuesAndTicks = { 115: 10 };
      tickId = 200;

      let result = exec();

      //begin 100
      //      115:10
      //end   200:25

      //average - 5*(15*10 + 85*25)/100 = 103.75

      expect(result).toEqual(113.75);
    });

    it("should calculate average value based on valuesAndTicks, value and beginTickInterval and endTickInterval correctly - if there is only one element in values and it is the begining of the period", () => {
      valuesAndTicks = { 100: 10 };
      tickId = 200;

      let result = exec();

      //begin 100
      //      100:10
      //end   200:25

      //average - 5*(0*10 + 100*25)/100 = 125

      expect(result).toEqual(125);
    });

    it("should calculate average value based on valuesAndTicks, value and beginTickInterval and endTickInterval correctly - if there is only one element in values and it is the begining of the period", () => {
      valuesAndTicks = { 100: 10 };
      tickId = 200;

      let result = exec();

      //begin 100
      //      100:10
      //end   200:25

      //average - 5*(0*10 + 100*25)/100 = 125

      expect(result).toEqual(125);
    });

    it("should return actual value if there is no valuesAndTicks", () => {
      valuesAndTicks = {};

      let result = exec();

      expect(result).toEqual(value);
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
    let beginIntervalTick;
    let endIntervalTick;
    let valuesAndTicks;
    let factor;
    let refreshedFirstTime;

    beforeEach(() => {
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
        type: "AverageCalculator",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 123456.654321,
        variableID: "variable2ID",
        factor: 5,
        calculationInterval: 100,
      };

      beginIntervalTick = 100;
      endIntervalTick = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      value = 25;
      tickId = 210;

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

      calcElement = new AverageCalculator(project, device);

      await calcElement.init(payload);

      calcElement._beginIntervalTick = beginIntervalTick;
      calcElement._endIntervalTick = endIntervalTick;
      calcElement._refreshedFirstTime = refreshedFirstTime;
      calcElement._valuesAndTicks = valuesAndTicks;
      calcElement._factor = factor;

      return calcElement.refresh(tickId);
    };

    it("should leave refreshedFirstTime as true and set beginIntervalTick and endIntervalTick of a new interval and then calculate average and assing it to value together with LastValueTick - if refreshedFirstTime is true and tick is future period", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 210;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(200);
      expect(calcElement._endIntervalTick).toEqual(300);

      //begin 100
      //      115:10
      //      140:15
      //      160:20
      //end   200:25

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25
      expect(calcElement.Value).toEqual(96.25);
      expect(calcElement.LastValueTick).toEqual(200);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({
        [variable2LastValueTick]: variable2Value,
      });
    });

    it("should leave refreshedFirstTime as true and set beginIntervalTick and endIntervalTick of a new interval and then calculate average and assing it to value together with LastValueTick - if refreshedFirstTime is true and tick is future period two intervals forward", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 310;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(300);
      expect(calcElement._endIntervalTick).toEqual(400);

      //begin 100
      //      115:10
      //      140:15
      //      160:20
      //end   200:25

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25
      expect(calcElement.Value).toEqual(96.25);
      expect(calcElement.LastValueTick).toEqual(200);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({
        [variable2LastValueTick]: variable2Value,
      });
    });

    it("should do nothing - if lastVariableTick is 0", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 0;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual(valuesAndTicks);
    });

    it("should do nothing - if refreshedFirstTime is true and tick is from past interval", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 80;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual(valuesAndTicks);
    });

    it("should do nothing - if there is no variable of given id - refreshedFirstTime is true", async () => {
      payload.variableID = "fakeID";
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 210;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual(valuesAndTicks);
    });

    it("should do nothing - if variables value is not a number - refreshedFirstTime is true", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = [1, 2, 3, 4, 5, 6];
      variable2LastValueTick = 210;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual(valuesAndTicks);
    });

    it("should leave refreshedFirstTime as true and set beginIntervalTick and endIntervalTick of a new interval and then calculate average and assing it to value together with LastValueTick - if refreshedFirstTime is true and tick is exactly the start of the future period", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 200;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(200);
      expect(calcElement._endIntervalTick).toEqual(300);

      //begin 100
      //      115:10
      //      140:15
      //      160:20
      //end   200:25

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25
      expect(calcElement.Value).toEqual(96.25);
      expect(calcElement.LastValueTick).toEqual(200);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({
        [variable2LastValueTick]: variable2Value,
      });
    });

    it("should leave refreshedFirstTime as true, leave beginIntervalTick and endIntervalTick, not calculate average and not assing it to value together with LastValueTick but add value and tickId to ValuesAndTicks - if refreshedFirstTime is true and tick is exactly the start of the actual period", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      let initialValuesAndTicks = { ...valuesAndTicks };
      variable2LastValueTick = 180;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({
        ...initialValuesAndTicks,
        [variable2LastValueTick]: variable2Value,
      });
    });

    it("should leave refreshedFirstTime as true, leave beginIntervalTick and endIntervalTick, not calculate average and not assing it to value together with LastValueTick but replace value of given tickId to ValuesAndTicks - if refreshedFirstTime is true and tick is already present", async () => {
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      let initialValuesAndTicks = { ...valuesAndTicks };
      variable2LastValueTick = 160;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({
        ...initialValuesAndTicks,
        [variable2LastValueTick]: variable2Value,
      });
    });

    it("should set refreshedFirstTime as true, set new beginIntervalTick and endIntervalTick, not calculate average and not assing it to value together with LastValueTick create new ValuesAndTicks and add tickId and value to it - if refreshedFirstTime is false", async () => {
      refreshedFirstTime = false;
      beginTickInterval = null;
      endTickInterval = null;
      valuesAndTicks = "fakeValuesAndTicks";
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 210;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._beginIntervalTick).toEqual(200);
      expect(calcElement._endIntervalTick).toEqual(300);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({
        [variable2LastValueTick]: variable2Value,
      });
    });

    it("should do nothing - if there is no variable of given id - refreshedFirstTime is false", async () => {
      refreshedFirstTime = false;
      payload.variableID = "fakeID";
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = 25;
      variable2LastValueTick = 210;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual(valuesAndTicks);
    });

    it("should do nothing - if variables value is not a number - refreshedFirstTime is false", async () => {
      refreshedFirstTime = false;
      beginTickInterval = 100;
      endTickInterval = 200;
      valuesAndTicks = { 115: 10, 140: 15, 160: 20 };
      factor = 5;
      variable2Value = [1, 2, 3, 4, 5, 6];
      variable2LastValueTick = 210;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._beginIntervalTick).toEqual(100);
      expect(calcElement._endIntervalTick).toEqual(200);

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual(valuesAndTicks);
    });

    it("should properly set calculate value and lastValueTick for whole procedure - several refreshes,from the begining, last value is exactly the begin of next interval", async () => {
      refreshedFirstTime = false;
      beginTickInterval = null;
      endTickInterval = null;
      valuesAndTicks = null;
      factor = 5;
      variable2Value = 0;
      variable2LastValueTick = 100;

      //begin 100
      //      115:10
      //      140:15
      //      160:20
      //end   200:25

      await exec();
      variable2._value = 10;
      variable2._lastValueTick = 115;
      await calcElement.refresh(tickId);
      variable2._value = 15;
      variable2._lastValueTick = 140;
      await calcElement.refresh(tickId);
      variable2._value = 20;
      variable2._lastValueTick = 160;
      await calcElement.refresh(tickId);
      variable2._value = 25;
      variable2._lastValueTick = 200;
      await calcElement.refresh(tickId);

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25
      expect(calcElement.Value).toEqual(96.25);
      expect(calcElement.LastValueTick).toEqual(200);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({ 200: 25 });
    });

    it("should properly set calculate value and lastValueTick for whole procedure - several refreshes,from the begining, last value is from the next interval", async () => {
      refreshedFirstTime = false;
      beginTickInterval = null;
      endTickInterval = null;
      valuesAndTicks = null;
      factor = 5;
      variable2Value = 0;
      variable2LastValueTick = 100;

      //begin 100
      //      115:10
      //      140:15
      //      160:20
      //end   200:25

      await exec();
      variable2._value = 10;
      variable2._lastValueTick = 115;
      await calcElement.refresh(tickId);
      variable2._value = 15;
      variable2._lastValueTick = 140;
      await calcElement.refresh(tickId);
      variable2._value = 20;
      variable2._lastValueTick = 160;
      await calcElement.refresh(tickId);
      variable2._value = 25;
      variable2._lastValueTick = 205;
      await calcElement.refresh(tickId);

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25
      expect(calcElement.Value).toEqual(96.25);
      expect(calcElement.LastValueTick).toEqual(200);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({ 205: 25 });
    });

    it("should properly set calculate value and lastValueTick for whole procedure - several refreshes, from working the period, first value is exactly the begin of next interval", async () => {
      refreshedFirstTime = false;
      beginTickInterval = null;
      endTickInterval = null;
      valuesAndTicks = null;
      factor = 5;
      variable2Value = 0;
      variable2LastValueTick = 100;

      //begin 200
      //      215:10
      //      240:15
      //      260:20
      //end   300:25

      //proper work
      await exec();
      variable2._value = 1;
      variable2._lastValueTick = 115;
      await calcElement.refresh(tickId);
      variable2._value = 2;
      variable2._lastValueTick = 140;
      await calcElement.refresh(tickId);
      variable2._value = 3;
      variable2._lastValueTick = 160;
      await calcElement.refresh(tickId);
      //new period
      variable2._value = 4;
      variable2._lastValueTick = 200;
      await calcElement.refresh(tickId);
      variable2._value = 10;
      variable2._lastValueTick = 215;
      await calcElement.refresh(tickId);
      variable2._value = 15;
      variable2._lastValueTick = 240;
      await calcElement.refresh(tickId);
      variable2._value = 20;
      variable2._lastValueTick = 260;
      await calcElement.refresh(tickId);
      variable2._value = 25;
      variable2._lastValueTick = 305;
      await calcElement.refresh(tickId);

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25
      expect(calcElement.Value).toEqual(96.25);
      expect(calcElement.LastValueTick).toEqual(300);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({ 305: 25 });
    });

    it("should properly set calculate value and lastValueTick for whole procedure - several refreshes, from working the period, first value is from the next interval", async () => {
      refreshedFirstTime = false;
      beginTickInterval = null;
      endTickInterval = null;
      valuesAndTicks = null;
      factor = 5;
      variable2Value = 0;
      variable2LastValueTick = 100;

      //begin 200
      //      215:10
      //      240:15
      //      260:20
      //end   300:25

      //proper work
      await exec();
      variable2._value = 1;
      variable2._lastValueTick = 115;
      await calcElement.refresh(tickId);
      variable2._value = 2;
      variable2._lastValueTick = 140;
      await calcElement.refresh(tickId);
      variable2._value = 3;
      variable2._lastValueTick = 160;
      await calcElement.refresh(tickId);
      //new period
      variable2._value = 10;
      variable2._lastValueTick = 215;
      await calcElement.refresh(tickId);
      variable2._value = 15;
      variable2._lastValueTick = 240;
      await calcElement.refresh(tickId);
      variable2._value = 20;
      variable2._lastValueTick = 260;
      await calcElement.refresh(tickId);
      variable2._value = 25;
      variable2._lastValueTick = 305;
      await calcElement.refresh(tickId);

      //average - 5*(15*10 + 25*15 + 20*20 + 40*25)/100 = 96.25
      expect(calcElement.Value).toEqual(96.25);
      expect(calcElement.LastValueTick).toEqual(300);

      //new value should be set into valuesAndTicks
      expect(calcElement._valuesAndTicks).toEqual({ 305: 25 });
    });
  });
});
