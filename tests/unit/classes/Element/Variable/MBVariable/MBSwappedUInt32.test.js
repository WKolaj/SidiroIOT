const MBSwappedUInt32 = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedUInt32");

describe("MBSwappedUInt32", () => {
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
      mbVariable = new MBSwappedUInt32();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toEqual(372114642);
    });

    it("should be able to convert large positive values (instead of negative)", async () => {
      //65535 => 65536×65535
      //1234 => + 1234
      //4294902994
      dataToConvert = [65535, 1234];

      let result = await exec();

      expect(result).toEqual(4294902994);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = 372114642;
    });

    let exec = async () => {
      mbVariable = new MBSwappedUInt32();
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
});
