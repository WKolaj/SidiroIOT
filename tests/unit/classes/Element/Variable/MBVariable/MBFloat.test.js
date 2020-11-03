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

  describe("_getReadPossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBFloat();
      return mbVariable._getReadPossibleFunctionCodes();
    };

    it("should return functions 3 and 4", async () => {
      let result = await exec();

      expect(result).toEqual([3, 4]);
    });
  });

  describe("_getWritePossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBFloat();
      return mbVariable._getWritePossibleFunctionCodes();
    };

    it("should return function 16", async () => {
      let result = await exec();

      expect(result).toEqual([16]);
    });
  });
});
