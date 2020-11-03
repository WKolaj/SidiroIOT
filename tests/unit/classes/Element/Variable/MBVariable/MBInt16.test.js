const MBInt16 = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBInt16");

describe("MBInt16", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      dataToConvert = [1234];
    });

    let exec = async () => {
      mbVariable = new MBInt16();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toEqual(1234);
    });

    it("should be able to covert negative values", async () => {
      dataToConvert = [65535];

      let result = await exec();

      expect(result).toEqual(-1);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = 1234;
    });

    let exec = async () => {
      mbVariable = new MBInt16();
      return mbVariable._convertValueToData(valueToConvert);
    };

    it("should convert value to data and return it", async () => {
      let result = await exec();

      expect(result).toEqual([1234]);
    });

    it("should be able to convert negative values", async () => {
      valueToConvert = -1;
      let result = await exec();

      expect(result).toEqual([65535]);
    });
  });

  describe("_getReadPossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBInt16();
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
      mbVariable = new MBInt16();
      return mbVariable._getWritePossibleFunctionCodes();
    };

    it("should return function 16", async () => {
      let result = await exec();

      expect(result).toEqual([16]);
    });
  });
});
