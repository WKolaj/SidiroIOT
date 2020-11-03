const MBSwappedDouble = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedDouble");

describe("MBSwappedDouble", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      dataToConvert = [16743, 35881, 55422, 27510];
    });

    let exec = async () => {
      mbVariable = new MBSwappedDouble();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toBeCloseTo(12345678.7654321);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = 12345678.7654321;
    });

    let exec = async () => {
      mbVariable = new MBSwappedDouble();
      return mbVariable._convertValueToData(valueToConvert);
    };

    it("should convert value to data and return it", async () => {
      let result = await exec();

      expect(result).toEqual([16743, 35881, 55422, 27510]);
    });
  });
});
