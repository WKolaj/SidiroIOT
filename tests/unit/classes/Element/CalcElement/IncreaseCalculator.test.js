const IncreaseCalculator = require("../../../../../classes/Element/CalcElement/IncreaseCalculator");
const {
  createFakeDevice,
  createFakeVariable,
} = require("../../../../utilities/testUtilities");

describe("IncreaseCalculator", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new IncreaseCalculator(project, device);
    };

    it("should create new IncreaseCalculator and set all its properties to null", () => {
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
      expect(result.Overflow).toEqual(null);
      expect(result._refreshedFirstTime).toEqual(null);
      expect(result._calculationStarted).toEqual(null);
      expect(result._beginValue).toEqual(null);
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
        type: "IncreaseCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "variable2ID",
        factor: 5,
        calculationInterval: 15,
        overflow: 1234,
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

      calcElement = new IncreaseCalculator(project, device);

      return calcElement.init(payload);
    };

    it("should initialized IncreaseCalculator based on its payload", async () => {
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

    it("should initialized IncreaseCalculator based on its payload - if overflow is null", async () => {
      payload.overflow = null;

      await exec();

      let calcElementPayload = calcElement.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should set _refreshedFirstTime and _calculationStarted to false", async () => {
      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._calculationStarted).toEqual(false);
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
        type: "IncreaseCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
        calculationInterval: 15,
        overflow: 1234,
      };
    });

    let exec = async () => {
      calcElement = new IncreaseCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.generatePayload();
    };

    it("should return a valid IncreaseCalculator payload", async () => {
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
        type: "IncreaseCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
        calculationInterval: 15,
        overflow: 1234.4321,
      };
    });

    let exec = () => {
      return IncreaseCalculator.validatePayload(payload);
    };

    it("should return null if IncreaseCalculator payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [IncreaseCalculator]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [IncreaseCalculator]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [IncreaseCalculator]`);
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

    it("should return message if overflow is not defined", () => {
      delete payload.overflow;

      let result = exec();

      expect(result).toEqual(`"overflow" is required`);
    });

    it("should return null if overflow is null", () => {
      payload.overflow = null;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if overflow is not a number", () => {
      payload.overflow = "abcd";

      let result = exec();

      expect(result).toEqual(`"overflow" must be a number`);
    });

    it("should return message if overflow is lesser than 0", () => {
      payload.overflow = -1;

      let result = exec();

      expect(result).toEqual(`"overflow" must be greater than or equal to 0`);
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
        type: "IncreaseCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
      };

      value = 1234;
    });

    let exec = async () => {
      calcElement = new IncreaseCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.checkIfValueCanBeSet(value);
    };

    it("should always return a message that IncreaseCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("IncreaseCalculator value is readonly");
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
    let beginValue;
    let calculationStarted;
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
        type: "IncreaseCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "variable2ID",
        factor: 5,
        calculationInterval: 15,
        overflow: 1234,
      };

      tickId = 1234;
      beginIntervalTick = null;
      endIntervalTick = null;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = false;
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

      calcElement = new IncreaseCalculator(project, device);

      await calcElement.init(payload);

      calcElement._beginIntervalTick = beginIntervalTick;
      calcElement._endIntervalTick = endIntervalTick;
      calcElement._beginValue = beginValue;
      calcElement._calculationStarted = calculationStarted;
      calcElement._refreshedFirstTime = refreshedFirstTime;

      return calcElement.refresh(tickId);
    };

    it("should not set calculationStarted but set refreshedFirstTime and set set beginIntervalTick and endIntervalTick - if calculationStarted and refreshedFirstTime are false", async () => {
      tickId = 1234;
      beginIntervalTick = null;
      endIntervalTick = null;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = false;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(false);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(null);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should do nothing if variable does not exist", async () => {
      tickId = 1234;
      beginIntervalTick = null;
      endIntervalTick = null;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = false;

      payload.variableID = "fakeVariable";

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._calculationStarted).toEqual(false);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(null);
      expect(calcElement._endIntervalTick).toEqual(null);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(null);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should do nothing if variable's value is not value", async () => {
      tickId = 1234;
      beginIntervalTick = null;
      endIntervalTick = null;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = false;

      variable2Value = [1, 2, 3, 4, 5];

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(false);
      expect(calcElement._calculationStarted).toEqual(false);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(null);
      expect(calcElement._endIntervalTick).toEqual(null);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(null);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should set calculationStarted, set beginIntervalTick and endIntervalTick to new interval, set new begin Value - but not set value and lastValueTick - if tickId is from next interval and refreshedFirstTime is set and endIntervalTick is the same as newIntervalTick for tickId", async () => {
      //tickId = 1234 -> 1230 to 1245
      //previous interval 1215 to 1230

      tickId = 1234;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value should be set but value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should set calculationStarted, set beginIntervalTick and endIntervalTick to new interval, set new begin Value - but not set value and lastValueTick - if tickId is exactly begining of new interval and refreshedFirstTime is set and endIntervalTick is the same as newIntervalTick for tickId", async () => {
      //tickId = 1230 -> 1230 to 1245
      //previous interval 1215 to 1230

      tickId = 1230;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value should be set but value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should set calculationStarted, set beginIntervalTick and endIntervalTick to new interval, set new begin Value - but not set value and lastValueTick - if tickId is from two intervals ahead and refreshedFirstTime is set and endIntervalTick is the same as newIntervalTick for tickId", async () => {
      //tickId = 1246 -> 1245 to 1260
      //actual interval 1215 to 1230

      tickId = 1246;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1245);
      expect(calcElement._endIntervalTick).toEqual(1260);

      //Begin value should be set but value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should set calculationStarted, set beginIntervalTick and endIntervalTick to new interval, set new begin Value - but not set value and lastValueTick - if tickId is exactly the begin of two intervals ahead and refreshedFirstTime is set and endIntervalTick is the same as newIntervalTick for tickId", async () => {
      //tickId = 1245 -> 1245 to 1260
      //actual interval 1215 to 1230

      tickId = 1245;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1245);
      expect(calcElement._endIntervalTick).toEqual(1260);

      //Begin value should be set but value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should leave calculationStarted as true, beginIntervalTick, endIntervalTick, not set new begin Value not calculate and set not new increase -  if tickId is from earlier interval", async () => {
      //tickId = 1213 -> 1245 to 1260
      //actual interval 1215 to 1230

      tickId = 1213;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = 100;
      payload.factor = 3;
      variable2Value = 300;
      calculationStarted = true;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1215);
      expect(calcElement._endIntervalTick).toEqual(1230);

      //Begin value should be set but value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(100);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should leave calculationStarted as true, set new beginIntervalTick and new endIntervalTick, set new begin Value but not calculate and set new increase -  if tickId is exactly the begin of two intervals ahead", async () => {
      //tickId = 1245 -> 1245 to 1260
      //actual interval 1215 to 1230

      tickId = 1245;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = 100;
      payload.factor = 3;
      variable2Value = 300;
      calculationStarted = true;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1245);
      expect(calcElement._endIntervalTick).toEqual(1260);

      //Begin value should be set but value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(300);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should leave calculationStarted as true, set new beginIntervalTick and new endIntervalTick, set new begin Value but not calculate and set new increase -  if tickId is from two intervals ahead", async () => {
      //tickId = 1247 -> 1245 to 1260
      //actual interval 1215 to 1230

      tickId = 1247;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = 100;
      payload.factor = 3;
      variable2Value = 300;
      calculationStarted = true;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1245);
      expect(calcElement._endIntervalTick).toEqual(1260);

      //Begin value should be set but value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(300);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);
    });

    it("should leave calculationStarted as true, set new beginIntervalTick and new endIntervalTick, set new begin Value and calculate and set new increase -  if tickId is exactly the begin of new interval - value is larger than beginValue", async () => {
      //tickId = 1230 -> 1230 to 1245
      //previous interval 1215 to 1230

      tickId = 1230;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = 100;
      payload.factor = 3;
      variable2Value = 300;
      calculationStarted = true;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value should be set and value and LastValueTick should be set as well
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(3 * (300 - 100));
      //Last tick should be set to begin of new interval
      expect(calcElement.LastValueTick).toEqual(1230);
    });

    it("should leave calculationStarted as true, set new beginIntervalTick and new endIntervalTick, set new begin Value and calculate and set new increase -  if tickId is from next interval - value is larger than beginValue", async () => {
      //tickId = 1234 -> 1230 to 1245
      //previous interval 1215 to 1230

      tickId = 1234;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = 100;
      payload.factor = 3;
      variable2Value = 300;
      calculationStarted = true;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value should be set and value and LastValueTick should be set as well
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(3 * (300 - 100));
      //Last tick should be set to begin of new interval
      expect(calcElement.LastValueTick).toEqual(1230);
    });

    it("should leave calculationStarted as true, set new beginIntervalTick and new endIntervalTick, set new begin Value and calculate and set new increase -  if tickId is from next interval - value is smaller than beginValue, overflow is not null", async () => {
      //tickId = 1234 -> 1230 to 1245
      //previous interval 1215 to 1230

      tickId = 1234;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = 300;
      payload.factor = 3;
      payload.overflow = 500;
      variable2Value = 100;
      calculationStarted = true;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value should be set and value and LastValueTick should be set as well
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(3 * (500 - 300 + 100));
      //Last tick should be set to begin of new interval
      expect(calcElement.LastValueTick).toEqual(1230);
    });

    it("should leave calculationStarted as true, set new beginIntervalTick and new endIntervalTick, set new begin Value and calculate and set new increase to 0 -  if tickId is from next interval - value is smaller than beginValue, overflow is null", async () => {
      //tickId = 1234 -> 1230 to 1245
      //previous interval 1215 to 1230

      tickId = 1234;
      beginIntervalTick = 1215;
      endIntervalTick = 1230;
      beginValue = 300;
      payload.factor = 3;
      payload.overflow = null;
      variable2Value = 100;
      calculationStarted = true;
      refreshedFirstTime = true;

      await exec();

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value should be set and value and LastValueTick should be set as well
      expect(calcElement._beginValue).toEqual(variable2Value);
      expect(calcElement.Value).toEqual(0);
      //Last tick should be set to begin of new interval
      expect(calcElement.LastValueTick).toEqual(1230);
    });

    it("should properly calculate whole procedure - from the begining, value difference is positive", async () => {
      //tickId = 1234 -> 1230 to 1245
      //previous interval 1215 to 1230

      tickId = 1234;
      beginIntervalTick = null;
      endIntervalTick = null;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = false;
      variable2Value = 100;

      await exec();
      //INTIALIZED but value not test

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(false);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(null);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      variable2._value = 105;
      await calcElement.refresh(1236);
      variable2._value = 107;
      await calcElement.refresh(1238);
      variable2._value = 109;
      await calcElement.refresh(1240);
      variable2._value = 115;
      await calcElement.refresh(1242);
      variable2._value = 118;
      await calcElement.refresh(1244);
      variable2._value = 122;
      await calcElement.refresh(1246);

      //NEW INTERVAL - calculation started but value not set

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1245);
      expect(calcElement._endIntervalTick).toEqual(1260);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(122);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      variable2._value = 120;
      await calcElement.refresh(1248);
      variable2._value = 122;
      await calcElement.refresh(1252);
      variable2._value = 124;
      await calcElement.refresh(1256);
      variable2._value = 126;
      await calcElement.refresh(1258);
      variable2._value = 128;
      await calcElement.refresh(1262);

      //(128-122)*5 = 30

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1260);
      expect(calcElement._endIntervalTick).toEqual(1275);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(128);
      expect(calcElement.Value).toEqual(30);
      expect(calcElement.LastValueTick).toEqual(1260);
    });

    it("should properly calculate whole procedure - from the begining, value difference is negative, overflow is enabled", async () => {
      //tickId = 1234 -> 1230 to 1245
      //previous interval 1215 to 1230

      payload.overflow = 200;
      tickId = 1234;
      beginIntervalTick = null;
      endIntervalTick = null;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = false;
      variable2Value = 100;

      await exec();
      //INTIALIZED but value not test

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(false);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(null);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      variable2._value = 105;
      await calcElement.refresh(1236);
      variable2._value = 107;
      await calcElement.refresh(1238);
      variable2._value = 109;
      await calcElement.refresh(1240);
      variable2._value = 115;
      await calcElement.refresh(1242);
      variable2._value = 118;
      await calcElement.refresh(1244);
      variable2._value = 122;
      await calcElement.refresh(1246);

      //NEW INTERVAL - calculation started but value not set

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1245);
      expect(calcElement._endIntervalTick).toEqual(1260);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(122);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      variable2._value = 120;
      await calcElement.refresh(1248);
      variable2._value = 122;
      await calcElement.refresh(1252);
      variable2._value = 10;
      await calcElement.refresh(1256);
      variable2._value = 12;
      await calcElement.refresh(1258);
      variable2._value = 14;
      await calcElement.refresh(1262);

      //(128-122)*5 = 30

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1260);
      expect(calcElement._endIntervalTick).toEqual(1275);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(14);
      expect(calcElement.Value).toEqual(5 * (200 - 122 + 14));
      expect(calcElement.LastValueTick).toEqual(1260);
    });

    it("should properly calculate whole procedure - from the begining, value difference is negative, overflow is disabled", async () => {
      //tickId = 1234 -> 1230 to 1245
      //previous interval 1215 to 1230

      payload.overflow = null;
      tickId = 1234;
      beginIntervalTick = null;
      endIntervalTick = null;
      beginValue = null;
      calculationStarted = false;
      refreshedFirstTime = false;
      variable2Value = 100;

      await exec();
      //INTIALIZED but value not test

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(false);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1230);
      expect(calcElement._endIntervalTick).toEqual(1245);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(null);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      variable2._value = 105;
      await calcElement.refresh(1236);
      variable2._value = 107;
      await calcElement.refresh(1238);
      variable2._value = 109;
      await calcElement.refresh(1240);
      variable2._value = 115;
      await calcElement.refresh(1242);
      variable2._value = 118;
      await calcElement.refresh(1244);
      variable2._value = 122;
      await calcElement.refresh(1246);

      //NEW INTERVAL - calculation started but value not set

      expect(calcElement._refreshedFirstTime).toEqual(true);
      expect(calcElement._calculationStarted).toEqual(true);

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1245);
      expect(calcElement._endIntervalTick).toEqual(1260);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(122);
      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      variable2._value = 120;
      await calcElement.refresh(1248);
      variable2._value = 122;
      await calcElement.refresh(1252);
      variable2._value = 10;
      await calcElement.refresh(1256);
      variable2._value = 12;
      await calcElement.refresh(1258);
      variable2._value = 14;
      await calcElement.refresh(1262);

      //(128-122)*5 = 30

      //tickId = 1234 -> 1230 to 1245
      expect(calcElement._beginIntervalTick).toEqual(1260);
      expect(calcElement._endIntervalTick).toEqual(1275);

      //Begin value, value and LastValueTick should stay as they are
      expect(calcElement._beginValue).toEqual(14);
      expect(calcElement.Value).toEqual(0);
      expect(calcElement.LastValueTick).toEqual(1260);
    });
  });
});
