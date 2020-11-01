const Element = require("../../../../classes/Element/Element");

describe("Element", () => {
  describe("constructor", () => {
    let exec = () => {
      return new Element();
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
  });

  describe("init", () => {
    let payload;
    let element;

    beforeEach(() => {
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "testElementType",
        defaultValue: "testElementDefaultValue",
        sampleTime: "testElementSampleTime",
      };
    });

    let exec = async () => {
      element = new Element();
      return element.init(payload);
    };

    it("should initialize element's properties based on their payload", async () => {
      await exec();

      expect(element.ID).toEqual("testElementId");
      expect(element.Name).toEqual("testElementName");
      expect(element.Type).toEqual("testElementType");
      expect(element.DefaultValue).toEqual("testElementDefaultValue");
      expect(element.SampleTime).toEqual("testElementSampleTime");

      //Value should be set according to DefaultValue and lastTick should be set to 0
      expect(element.Value).toEqual("testElementDefaultValue");
      expect(element.LastValueTick).toEqual(0);
    });
  });

  describe("checkIfShouldBeRefreshed", () => {
    let sampleTime;
    let tickNumber;
    let element;

    beforeEach(() => {
      sampleTime = 15;
      tickNumber = 150;
    });

    let exec = () => {
      element = new Element();
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
    let element;
    let value;
    let tickId;

    beforeEach(() => {
      value = 1234.5678;
      tickId = 987654321;
    });

    let exec = () => {
      element = new Element();
      return element._setValue(value, tickId);
    };

    it("should set value and tickId of Element", () => {
      exec();

      expect(element.Value).toEqual(value);
      expect(element.LastValueTick).toEqual(tickId);
    });
  });
});
