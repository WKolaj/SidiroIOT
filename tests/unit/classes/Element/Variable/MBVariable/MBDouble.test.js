const MBDouble = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBDouble");

describe("MBDouble", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      dataToConvert = [27510, 55422, 35881, 16743];
    });

    let exec = async () => {
      mbVariable = new MBDouble();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toEqual(12345678.7654321);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = 12345678.7654321;
    });

    let exec = async () => {
      mbVariable = new MBDouble();
      return mbVariable._convertValueToData(valueToConvert);
    };

    it("should convert value to data and return it", async () => {
      let result = await exec();

      expect(result).toEqual([27510, 55422, 35881, 16743]);
    });
  });

  describe("_getReadPossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBDouble();
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
      mbVariable = new MBDouble();
      return mbVariable._getWritePossibleFunctionCodes();
    };

    it("should return function 16", async () => {
      let result = await exec();

      expect(result).toEqual([16]);
    });
  });
});
