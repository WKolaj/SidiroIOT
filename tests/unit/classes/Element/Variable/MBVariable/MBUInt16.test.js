const MBUInt16 = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBUInt16");

describe("MBUInt16", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      dataToConvert = [1234];
    });

    let exec = async () => {
      mbVariable = new MBUInt16();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toEqual(1234);
    });

    it("should be able to covert large positive numbers - instead of negative", async () => {
      dataToConvert = [65535];

      let result = await exec();

      expect(result).toEqual(65535);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = 1234;
    });

    let exec = async () => {
      mbVariable = new MBUInt16();
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
});
