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
});
