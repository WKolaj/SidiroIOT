const MBByteArray = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBByteArray");

describe("MBByteArray", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      dataToConvert = [513, 2052, 8208, 32832];
    });

    let exec = async () => {
      mbVariable = new MBByteArray();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toEqual([1, 2, 4, 8, 16, 32, 64, 128]);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = [1, 2, 4, 8, 16, 32, 64, 128];
    });

    let exec = async () => {
      mbVariable = new MBByteArray();
      return mbVariable._convertValueToData(valueToConvert);
    };

    it("should convert value to data and return it", async () => {
      let result = await exec();

      expect(result).toEqual([513, 2052, 8208, 32832]);
    });
  });
});
