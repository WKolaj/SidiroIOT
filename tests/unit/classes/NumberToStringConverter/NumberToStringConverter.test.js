const NumberToStringConverter = require("../../../../classes/NumberToStringConverter/NumberToStringConverter");

describe("NumberToStringConverter", () => {
  describe("constructor", () => {
    let exec = () => {
      return new NumberToStringConverter();
    };

    it("should create NumberToStringConverter and set Precision and ConversionType to null", () => {
      let result = exec();

      expect(result.Precision).toEqual(null);
      expect(result.ConversionType).toEqual(null);
    });
  });

  describe("init", () => {
    let converter;
    let payload;

    beforeEach(() => {
      payload = {
        conversionType: "fixed",
        precision: 123,
      };
    });

    let exec = () => {
      converter = new NumberToStringConverter();
      return converter.init(payload);
    };

    it("should assign conversionType and precision to converter", () => {
      exec();

      expect(converter.ConversionType).toEqual(payload.conversionType);
      expect(converter.Precision).toEqual(payload.precision);
    });
  });

  describe("generatePayload", () => {
    let converter;
    let payload;

    beforeEach(() => {
      payload = {
        conversionType: "fixed",
        precision: 123,
      };
    });

    let exec = () => {
      converter = new NumberToStringConverter();
      converter.init(payload);
      return converter.generatePayload();
    };

    it("should return valid payload of converter", () => {
      let result = exec();

      expect(result).toEqual({
        conversionType: "fixed",
        precision: 123,
      });
    });
  });

  describe("convertValue", () => {
    let converter;
    let payload;
    let value;

    beforeEach(() => {
      payload = {
        conversionType: "fixed",
        precision: 2,
      };
      value = 123.456;
    });

    let exec = () => {
      converter = new NumberToStringConverter();
      converter.init(payload);

      return converter.convertValue(value);
    };

    it("should return converter value - if conversionType is fixed", () => {
      payload.conversionType = "fixed";
      payload.precision = 2;

      let result = exec();

      expect(result).toEqual("123.46");
    });

    it("should return converter value - if conversionType is precision", () => {
      payload.conversionType = "precision";
      payload.precision = 2;

      let result = exec();

      expect(result).toEqual("1.2e+2");
    });

    it("should return value converted to string - if conversion type is none", () => {
      payload.conversionType = "none";
      payload.precision = 2;

      let result = exec();

      expect(result).toEqual("123.456");
    });

    it("should return null - if value is undefined", () => {
      value = undefined;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null - if value is null", () => {
      value = null;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return value converted to string - if value is boolean (true)", () => {
      value = true;

      let result = exec();

      expect(result).toEqual("true");
    });

    it("should return value converted to string - if value is boolean (false)", () => {
      value = false;

      let result = exec();

      expect(result).toEqual("false");
    });

    it("should return value  - if value is a string", () => {
      value = "abcd1234";

      let result = exec();

      expect(result).toEqual("abcd1234");
    });

    it("should return value  - if value is an empty string", () => {
      value = "";

      let result = exec();

      expect(result).toEqual("");
    });

    it("should return {} - if value is an empty object", () => {
      value = {};

      let result = exec();

      expect(result).toEqual("{}");
    });

    it("should return object parsed to string - if value is an object", () => {
      value = {
        abcd: 1234,
        1234: "abcd",
        value1: "abcd1234",
      };

      let result = exec();

      expect(result).toEqual(JSON.stringify(value));
    });
  });
});
