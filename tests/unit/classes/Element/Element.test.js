const Element = require("../../../../classes/Element/Element");

describe("Element", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new Element(project, device);
    };

    it("should create new Element and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);
      expect(result.Value).toEqual(null);
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
    let element;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "testElementType",
        defaultValue: "testElementDefaultValue",
        sampleTime: "testElementSampleTime",
        unit: "testUnit",
      };
    });

    let exec = async () => {
      element = new Element(project, device);
      return element.init(payload);
    };

    it("should initialize element's properties based on their payload", async () => {
      await exec();

      expect(element.ID).toEqual("testElementId");
      expect(element.Name).toEqual("testElementName");
      expect(element.Type).toEqual("testElementType");
      expect(element.DefaultValue).toEqual("testElementDefaultValue");
      expect(element.SampleTime).toEqual("testElementSampleTime");
      expect(element.Unit).toEqual("testUnit");

      //Value should be set according to DefaultValue and lastTick should be set to 0
      expect(element.Value).toEqual("testElementDefaultValue");
      expect(element.LastValueTick).toEqual(0);
    });
  });

  describe("checkIfShouldBeRefreshed", () => {
    let project;
    let device;
    let sampleTime;
    let tickNumber;
    let element;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      sampleTime = 15;
      tickNumber = 150;
    });

    let exec = () => {
      element = new Element(project, device);
      element._sampleTime = sampleTime;
      return element.checkIfShouldBeRefreshed(tickNumber);
    };

    it("should return true if tickNumber matches sampleTime", () => {
      let result = exec();

      expect(result).toBeTruthy();
    });

    it("should return true if tickNumber doest not match sampleTime", () => {
      tickNumber = 151;

      let result = exec();

      expect(result).toBeFalsy();
    });

    it("should always return false if sampleTime is zero", () => {
      sampleTime = 0;

      let result = exec();

      expect(result).toBeFalsy();
    });
  });

  describe("setValue", () => {
    let project;
    let device;
    let element;
    let value;
    let tickId;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      value = 1234.5678;
      tickId = 987654321;
    });

    let exec = () => {
      element = new Element(project, device);
      return element._setValue(value, tickId);
    };

    it("should set value and tickId of Element", () => {
      exec();

      expect(element.Value).toEqual(value);
      expect(element.LastValueTick).toEqual(tickId);
    });
  });

  describe("generatePayload", () => {
    let project;
    let device;
    let payload;
    let element;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "FakeElemenType",
        defaultValue: 1234,
        sampleTime: 15,
        unit: "testUnit",
      };
    });

    let exec = async () => {
      element = new Element(project, device);
      await element.init(payload);
      return element.generatePayload();
    };

    it("should initialize element's properties based on their payload", async () => {
      let result = await exec();

      let expectedResult = {
        id: "testElementId",
        name: "testElementName",
        type: "FakeElemenType",
        defaultValue: 1234,
        value: 1234,
        lastValueTick: 0,
        sampleTime: 15,
        unit: "testUnit",
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
