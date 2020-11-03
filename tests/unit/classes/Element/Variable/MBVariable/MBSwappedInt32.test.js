const MBSwappedInt32 = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedInt32");

describe("MBSwappedInt32", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      //65535 => 5678 * 65535 = 372113408
      //1234 => + 1234
      // 372114642
      dataToConvert = [5678, 1234];
    });

    let exec = async () => {
      mbVariable = new MBSwappedInt32();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toEqual(372114642);
    });

    it("should be able to covert negative values", async () => {
      //65535 => -1 * 65535
      //1234 => + 1234
      // -64302
      dataToConvert = [65535, 1234];

      let result = await exec();

      expect(result).toEqual(-64302);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = 372114642;
    });

    let exec = async () => {
      mbVariable = new MBSwappedInt32();
      return mbVariable._convertValueToData(valueToConvert);
    };

    it("should convert value to data and return it", async () => {
      let result = await exec();
      //console.log(result);
      expect(result).toEqual([5678, 1234]);
    });

    it("should be able to convert negative values", async () => {
      valueToConvert = -64302;
      let result = await exec();

      expect(result).toEqual([65535, 1234]);
    });
  });

  describe("_getReadPossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBSwappedInt32();
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
      mbVariable = new MBSwappedInt32();
      return mbVariable._getWritePossibleFunctionCodes();
    };

    it("should return function 16", async () => {
      let result = await exec();

      expect(result).toEqual([16]);
    });
  });
});
