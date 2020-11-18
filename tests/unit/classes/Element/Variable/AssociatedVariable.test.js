const AssociatedVariable = require("../../../../../classes/Element/Variable/AssociatedVariable");

describe("AssociatedVariable", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new AssociatedVariable(project, device);
    };

    it("should create new AssociatedVariable and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);

      expect(result.DefaultValue).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);

      expect(result.AssociatedDeviceID).toEqual(null);
      expect(result.AssociatedElementID).toEqual(null);
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
    let getElementMockFunc;
    let getElementReturnValue;

    beforeEach(() => {
      project = {};
      device = { ID: "fakeDeviceId" };
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "AssociatedVariable",
        sampleTime: 876,
        unit: "fakeUnit",
        associatedDeviceID: "fakeDeviceID",
        associatedElementID: "fakeElementID",
      };
      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      variable = new AssociatedVariable(project, device);

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload and get default value from variable", async () => {
      await exec();

      let payload = variable.generatePayload();

      let expectedPayload = {
        ...payload,
        value: getElementReturnValue.DefaultValue,
        lastValueTick: 0,
        deviceId: "fakeDeviceId",
      };

      expect(payload).toEqual(expectedPayload);
    });

    it("should initialize variable's properties based on their payload and set default value to 0 if there is no variable", async () => {
      //Element return value null if variable not found
      getElementReturnValue = null;

      await exec();

      let payload = variable.generatePayload();

      let expectedPayload = {
        ...payload,
        value: 0,
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
        type: "AssociatedVariable",
        sampleTime: 876,
        unit: "fakeUnit",
        associatedDeviceID: "fakeDeviceID",
        associatedElementID: "fakeElementID",
      };
    });

    let exec = () => {
      return AssociatedVariable.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [AssociatedVariable]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [AssociatedVariable]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [AssociatedVariable]`);
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

    it("should return message if defaultValue is set", () => {
      payload.defaultValue = 1234;

      let result = exec();

      expect(result).toEqual(`"defaultValue" is not allowed`);
    });

    it("should return message if defaultValue is null", () => {
      payload.defaultValue = null;

      let result = exec();

      expect(result).toEqual(`"defaultValue" is not allowed`);
    });

    it("should return message if associatedDeviceID is not defined", () => {
      delete payload.associatedDeviceID;

      let result = exec();

      expect(result).toEqual(`"associatedDeviceID" is required`);
    });

    it("should return message if associatedDeviceID is null", () => {
      payload.associatedDeviceID = null;

      let result = exec();

      expect(result).toEqual(`"associatedDeviceID" must be a string`);
    });

    it("should return message if associatedDeviceID is empty string", () => {
      payload.associatedDeviceID = "";

      let result = exec();

      expect(result).toEqual(`"associatedDeviceID" is not allowed to be empty`);
    });

    it("should return message if associatedElementID is not defined", () => {
      delete payload.associatedElementID;

      let result = exec();

      expect(result).toEqual(`"associatedElementID" is required`);
    });

    it("should return message if associatedElementID is null", () => {
      payload.associatedElementID = null;

      let result = exec();

      expect(result).toEqual(`"associatedElementID" must be a string`);
    });

    it("should return message if associatedElementID is empty string", () => {
      payload.associatedElementID = "";

      let result = exec();

      expect(result).toEqual(
        `"associatedElementID" is not allowed to be empty`
      );
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
      variable = new AssociatedVariable(project, device);
      return variable.checkIfValueCanBeSet(value);
    };

    it("should always return a message that AverageCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("AssociatedVariable value is readonly");
    });
  });

  describe("refresh", () => {
    let project;
    let device;
    let payload;
    let variable;
    let getElementMockFunc1;
    let getElementMockFunc2;

    //Elements to be return after first and second invoke of gteElement
    let getElementReturnValue1;
    let getElementReturnValue2;

    let tickID;
    let variableValue;
    let variableLastValueTick;

    beforeEach(() => {
      project = {};
      device = "fakeDevice";
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "AssociatedVariable",
        sampleTime: 876,
        unit: "fakeUnit",
        associatedDeviceID: "fakeDeviceID",
        associatedElementID: "fakeElementID",
      };
      getElementReturnValue1 = {
        LastValueTick: 100,
        Value: 456.789,
        DefaultValue: 987.321,
      };
      getElementReturnValue2 = {
        LastValueTick: 101,
        Value: 678.896,
        DefaultValue: 987.321,
      };
      tickID = 1234;
    });

    let exec = async () => {
      getElementMockFunc1 = jest.fn(() => getElementReturnValue1);
      getElementMockFunc2 = jest.fn(() => getElementReturnValue2);
      project.getElement = getElementMockFunc1;

      variable = new AssociatedVariable(project, device);

      await variable.init(payload);

      project.getElement = getElementMockFunc2;

      return variable.refresh(tickID);
    };

    it("should set values of lastTickId and value from associated element - returned from getElement", async () => {
      await exec();

      expect(variable.LastValueTick).toEqual(
        getElementReturnValue2.LastValueTick
      );
      expect(variable.Value).toEqual(getElementReturnValue2.Value);
    });

    it("should not set values of lastTickId and value from associated element - if element does not exist - get element returns null", async () => {
      getElementReturnValue2 = null;

      await exec();

      expect(variable.LastValueTick).toEqual(0);
      expect(variable.Value).toEqual(getElementReturnValue1.DefaultValue);
    });
  });
});
