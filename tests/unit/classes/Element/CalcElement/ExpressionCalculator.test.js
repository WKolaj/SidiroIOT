const ExpressionCalculator = require("../../../../../classes/Element/CalcElement/ExpressionCalculator");
const logger = require("../../../../../logger/logger");
const {
  createFakeDevice,
  createFakeVariable,
} = require("../../../../utilities/testUtilities");

describe("ExpressionCalculator", () => {
  let loggerInfoMock;
  beforeEach(() => {
    jest.setTimeout(30000);

    loggerInfoMock = jest.fn();
    logger.info = loggerInfoMock;
  });

  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new ExpressionCalculator(project, device);
    };

    it("should create new ExpressionCalculator and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.Value).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
      expect(result.Parameters).toEqual(null);
      expect(result.Expression).toEqual(null);
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
        type: "ExpressionCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        expression: "p1+p2+p3",
        parameters: {
          p1: { type: "static", value: 100 },
          p2: { type: "dynamic", elementId: "variable3ID" },
          p3: { type: "dynamic", elementId: "variable1ID" },
        },
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

      calcElement = new ExpressionCalculator(project, device);

      return calcElement.init(payload);
    };

    it("should initialized FactorCalculator based on its payload", async () => {
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

    it("should not throw and set invalid parameters - if there is no variable of given id", async () => {
      (payload.parameters = {
        p1: { type: "static", value: 100 },
        p2: { type: "dynamic", elementId: "fakeID" },
        p3: { type: "dynamic", elementId: "variable1ID" },
      }),
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
  });

  describe("generatePayload", () => {
    //No need to create fake devices and variables - variableIDs is not checked during initialization
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
        type: "ExpressionCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        expression: "p1+p2+p3",
        parameters: {
          p1: { type: "static", value: 100 },
          p2: { type: "dynamic", elementId: "variable3ID" },
          p3: { type: "dynamic", elementId: "variable1ID" },
        },
      };
    });

    let exec = async () => {
      calcElement = new ExpressionCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.generatePayload();
    };

    it("should return a valid ExpressionCalculator payload", async () => {
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
        type: "ExpressionCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        expression: "p1+p2+p3",
        parameters: {
          p1: { type: "static", value: 100 },
          p2: { type: "dynamic", elementId: "variable3ID" },
          p3: { type: "dynamic", elementId: "variable1ID" },
        },
      };
    });

    let exec = () => {
      return ExpressionCalculator.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [ExpressionCalculator]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [ExpressionCalculator]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [ExpressionCalculator]`);
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

      expect(result).toEqual(`"defaultValue" must be one of [number, boolean]`);
    });

    it("should return message if defaultValue is not a number or a boolean", () => {
      payload.defaultValue = "test value";

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be one of [number, boolean]`);
    });

    it("should return null - if defaultValue is number", () => {
      payload.defaultValue = 1234.5678;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null - if defaultValue is boolean", () => {
      payload.defaultValue = true;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if expression is not defined", () => {
      delete payload.expression;

      let result = exec();

      expect(result).toEqual(`"expression" is required`);
    });

    it("should return message if expression is null", () => {
      payload.expression = null;

      let result = exec();

      expect(result).toEqual(`"expression" must be a string`);
    });

    it("should return message if expression is empty string", () => {
      payload.expression = "";

      let result = exec();

      expect(result).toEqual(`"expression" is not allowed to be empty`);
    });

    it("should return message if expression is not a string", () => {
      payload.expression = 1234;

      let result = exec();

      expect(result).toEqual(`"expression" must be a string`);
    });

    it("should return message if parameters is not defined", () => {
      delete payload.parameters;

      let result = exec();

      expect(result).toEqual(`"parameters" is required`);
    });

    it("should return message if parameters is null", () => {
      payload.parameters = null;

      let result = exec();

      expect(result).toEqual(`"parameters" must be of type object`);
    });

    it("should return message if parameters is empty string", () => {
      payload.parameters = "";

      let result = exec();

      expect(result).toEqual(`"parameters" must be of type object`);
    });

    it("should return message if paramteres has not type defined", () => {
      delete payload.parameters.p1.type;

      let result = exec();

      expect(result).toEqual(`paramter object type not recognized`);
    });

    it("should return message if paramters has invalid type - number", () => {
      payload.parameters.p1.type = 1234;

      let result = exec();

      expect(result).toEqual(`paramter object type not recognized`);
    });

    it("should return message if paramters has invalid type - invalid string", () => {
      payload.parameters.p1.type = "fakeType";

      let result = exec();

      expect(result).toEqual(`paramter object type not recognized`);
    });

    it("should return message if static parameter does not have value defined", () => {
      delete payload.parameters.p1.value;

      let result = exec();

      expect(result).toEqual(`"value" is required`);
    });

    it("should return message if static parameter has value as null", () => {
      payload.parameters.p1.value = null;

      let result = exec();

      expect(result).toEqual(`"value" must be one of [number, boolean]`);
    });

    it("should return message if static parameter has value as string", () => {
      payload.parameters.p1.value = "fakeValue";

      let result = exec();

      expect(result).toEqual(`"value" must be one of [number, boolean]`);
    });

    it("should return null if static parameter has value as number", () => {
      payload.parameters.p1.value = 123.321;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if static parameter has value as boolean", () => {
      payload.parameters.p1.value = true;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if static parameter does not have elementId defined", () => {
      delete payload.parameters.p2.elementId;

      let result = exec();

      expect(result).toEqual(`"elementId" is required`);
    });

    it("should return message if static parameter has elementId as null", () => {
      payload.parameters.p2.elementId = null;

      let result = exec();

      expect(result).toEqual(`"elementId" must be a string`);
    });

    it("should return message if static parameter has invalid elementId - number", () => {
      payload.parameters.p2.elementId = 123.345;

      let result = exec();

      expect(result).toEqual(`"elementId" must be a string`);
    });

    it("should return message if static parameter has invalid elementId - empty string", () => {
      payload.parameters.p2.elementId = "";

      let result = exec();

      expect(result).toEqual(`"elementId" is not allowed to be empty`);
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
        type: "ExpressionCalculator",
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
      calcElement = new ExpressionCalculator(project, device);
      await calcElement.init(payload);
      return calcElement.checkIfValueCanBeSet(value);
    };

    it("should always return a message that ExpressionCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("ExpressionCalculator value is readonly");
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
        type: "ExpressionCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        expression: "1*p1+2*p2+3*p3",
        parameters: {
          p1: { type: "static", value: 100 },
          p2: { type: "dynamic", elementId: "variable3ID" },
          p3: { type: "dynamic", elementId: "variable1ID" },
        },
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

      calcElement = new ExpressionCalculator(project, device);

      await calcElement.init(payload);

      return calcElement.refresh(tickId);
    };

    it("should set value and lastValueTick to ExpressionCalculator element", async () => {
      /**
       *
       *           expression: "1*p1+2*p2+3*p3",
       *
       *           parameters: {
       *                 p1: { type: "static", value: 100 },
       *                 p2: { type: "dynamic", elementId: "variable3ID" },
       *                 p3: { type: "dynamic", elementId: "variable1ID" },
       *           },
       */

      await exec();

      let expectedValue = 1 * 100 + 2 * variable3Value + 3 * variable1Value;

      expect(calcElement.Value).toEqual(expectedValue);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should set value and lastValueTick to ExpressionCalculator element - even if variable's lastValueTick differs from actual one", async () => {
      /**
       *
       *           expression: "1*p1+2*p2+3*p3",
       *
       *           parameters: {
       *                 p1: { type: "static", value: 100 },
       *                 p2: { type: "dynamic", elementId: "variable3ID" },
       *                 p3: { type: "dynamic", elementId: "variable1ID" },
       *           },
       */

      variable1LastValueTick = 1100;
      variable2LastValueTick = 1200;
      variable3LastValueTick = 1300;

      await exec();

      let expectedValue = 1 * 100 + 2 * variable3Value + 3 * variable1Value;

      expect(calcElement.Value).toEqual(expectedValue);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should not set value - if expression is invalid and throw", async () => {
      payload.expression = "adasdasdas";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(
        `Undefined symbol adasdasdas`
      );
    });

    it("should not set value - if expression return NaN - division by 0", async () => {
      payload.expression = "123/0";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should not have been called
      expect(loggerInfoMock).not.toHaveBeenCalled();
    });

    it("should not set value - if expression return null - division by 0", async () => {
      payload.expression = "null";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should not have been called
      expect(loggerInfoMock).not.toHaveBeenCalled();
    });

    it("should set value and lastValueTick to ExpressionCalculator element - if expression returns boolean", async () => {
      payload.expression = "true or false";

      await exec();

      let expectedValue = true;

      expect(calcElement.Value).toEqual(expectedValue);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should set value - if there is no variable from parameters but it is not used in expression", async () => {
      payload.parameters.p4 = { type: "dynamic", elementId: "fakeVariable1ID" };

      await exec();

      let expectedValue = 1 * 100 + 2 * variable3Value + 3 * variable1Value;

      expect(calcElement.Value).toEqual(expectedValue);
      expect(calcElement.LastValueTick).toEqual(tickId);
    });

    it("should not set value - if there is no parameter form expression", async () => {
      payload.expression = "p1+p2+p3+p4";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(`Undefined symbol p4`);
    });

    it("should not set value - if there is no variable from parameters but it is used in expression", async () => {
      payload.parameters.p4 = { type: "dynamic", elementId: "fakeVariable1ID" };

      payload.expression = "p1+p2+p3+p4";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(`Undefined symbol p4`);
    });

    it("should not set value - if parmeters does not have type", async () => {
      delete payload.parameters.p3.type;

      payload.expression = "p1+p2+p3";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(`Undefined symbol p3`);
    });

    it("should not set value - if parmeters type is not recognized", async () => {
      payload.parameters.p3.type = "fakeType";

      payload.expression = "p1+p2+p3";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(`Undefined symbol p3`);
    });

    it("should not set value - if dynamic parmeters does not have elementId", async () => {
      delete payload.parameters.p2.elementId;

      payload.expression = "p1+p2+p3";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(`Undefined symbol p2`);
    });

    it("should not set value - if static parmeters does not have value", async () => {
      delete payload.parameters.p1.value;

      payload.expression = "p1+p2+p3";

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(`Undefined symbol p1`);
    });

    it("should not set value - if there are no parameters", async () => {
      payload.parameters = {};

      await exec();

      expect(calcElement.Value).toEqual(payload.defaultValue);
      expect(calcElement.LastValueTick).toEqual(0);

      //logger info should have been called
      expect(loggerInfoMock).toHaveBeenCalledTimes(1);
      expect(loggerInfoMock.mock.calls[0][0]).toEqual(`Undefined symbol p1`);
    });
  });
});
