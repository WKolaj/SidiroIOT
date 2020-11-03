const MBFloat = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBFloat");

describe("MBFloat", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      dataToConvert = [59769, 17142];
    });

    let exec = async () => {
      mbVariable = new MBFloat();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toBeCloseTo(123.456);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = 123.456;
    });

    let exec = async () => {
      mbVariable = new MBFloat();
      return mbVariable._convertValueToData(valueToConvert);
    };

    it("should convert value to data and return it", async () => {
      let result = await exec();

      expect(result).toEqual([59769, 17142]);
    });
  });
});
