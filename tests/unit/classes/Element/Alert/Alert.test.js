const Alert = require("../../../../../classes/Element/Alerts/Alert");

describe("Alert", () => {
  describe("formatValueToDisplay", () => {
    let value;

    beforeEach(() => {
      value = 12345.6789;
    });

    let exec = () => {
      return Alert.formatValueToDisplay(value);
    };

    it("should format value to be displayed as fixed with 3 signs", () => {
      let result = exec();

      expect(result).toEqual("12345.679");
    });

    it("should format value to be displayed as fixed with 3 signs - if value has only 3 digits after comma", () => {
      value = 12345.67;

      let result = exec();

      expect(result).toEqual("12345.670");
    });

    it("should format value as integer if value is integer", () => {
      value = 12345;

      let result = exec();

      expect(result).toEqual("12345");
    });

    it("should format value as 0 if value is 0", () => {
      value = 0;

      let result = exec();

      expect(result).toEqual("0");
    });

    it("should format value as -1 if value is -1", () => {
      value = -1;

      let result = exec();

      expect(result).toEqual("-1");
    });

    it("should format value as negative number with fixed 3 numbers if value is negative", () => {
      value = -12345.6789;

      let result = exec();

      expect(result).toEqual("-12345.679");
    });

    it("should return empty string if value is null", () => {
      value = null;

      let result = exec();

      expect(result).toEqual("");
    });

    it("should return empty string if value is undefined", () => {
      value = undefined;

      let result = exec();

      expect(result).toEqual("");
    });

    it("should return true if value is boolean (true)", () => {
      value = true;

      let result = exec();

      expect(result).toEqual("true");
    });

    it("should return false if value is boolean (false)", () => {
      value = false;

      let result = exec();

      expect(result).toEqual("false");
    });

    it("should return string if value is a string", () => {
      value = "abcd1234";

      let result = exec();

      expect(result).toEqual("abcd1234");
    });

    it("should return empty string if value is an empty string", () => {
      value = "";

      let result = exec();

      expect(result).toEqual("");
    });
  });

  describe("formatTextToDisplay", () => {
    let text;
    let value;
    let tickId;
    let deviceName;
    let elementName;

    beforeEach(() => {
      text = "testText: $VALUE $TIME $DEVICE $ELEMENT";
      value = 1234.5678;
      //1610960929000 - Mon Jan 18 2021 10:08:49 GMT+0100 (Central European Standard Time)
      tickId = 1610960929;
      deviceName = "testDeviceName";
      elementName = "testElementName";
    });

    let exec = () => {
      return Alert.formatAlertText(
        text,
        value,
        tickId,
        deviceName,
        elementName
      );
    };

    it("should properly format text - if all values exists", () => {
      let result = exec();

      expect(result).toEqual(
        "testText: 1234.568 2021-01-18T09:08:49.000Z testDeviceName testElementName"
      );
    });

    it("should properly format text - if all value is integer", () => {
      value = 123;
      let result = exec();

      expect(result).toEqual(
        "testText: 123 2021-01-18T09:08:49.000Z testDeviceName testElementName"
      );
    });

    it("should properly format text - if all value is boolean", () => {
      value = true;
      let result = exec();

      expect(result).toEqual(
        "testText: true 2021-01-18T09:08:49.000Z testDeviceName testElementName"
      );
    });

    it("should properly format text - if only value exists in text", () => {
      text = "testText: $VALUE";
      let result = exec();

      expect(result).toEqual("testText: 1234.568");
    });

    it("should properly format text - if only time exists", () => {
      text = "testText: $TIME";
      let result = exec();

      expect(result).toEqual("testText: 2021-01-18T09:08:49.000Z");
    });

    it("should properly format text - if only deviceName exists", () => {
      text = "testText: $DEVICE";
      let result = exec();

      expect(result).toEqual("testText: testDeviceName");
    });

    it("should properly format text - if only elementName exists", () => {
      text = "testText: $ELEMENT";
      let result = exec();

      expect(result).toEqual("testText: testElementName");
    });
  });
});
