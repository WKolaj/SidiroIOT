const MBBoolean = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBBoolean");

describe("MBBoolean", () => {
  describe("_convertDataToValue", () => {
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      dataToConvert = [true];
    });

    let exec = async () => {
      mbVariable = new MBBoolean();

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it if data is [true]", async () => {
      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should convert data to value and return it if data is [false]", async () => {
      dataToConvert = [false];
      let result = await exec();

      expect(result).toEqual(false);
    });
  });

  describe("_convertValueToData", () => {
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      valueToConvert = true;
    });

    let exec = async () => {
      mbVariable = new MBBoolean();
      return mbVariable._convertValueToData(valueToConvert);
    };

    it("should convert value to data and return it if value is true", async () => {
      let result = await exec();

      expect(result).toEqual([true]);
    });

    it("should convert value to data and return it if value is false", async () => {
      valueToConvert = false;
      let result = await exec();

      expect(result).toEqual([false]);
    });
  });
});
