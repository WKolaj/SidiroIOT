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

  describe("_getReadPossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBUInt16();
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
      mbVariable = new MBUInt16();
      return mbVariable._getWritePossibleFunctionCodes();
    };

    it("should return function 16", async () => {
      let result = await exec();

      expect(result).toEqual([16]);
    });
  });

  describe("init", () => {
    let payload;
    let variable;

    beforeEach(() => {
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "MBUInt16",
        defaultValue: 123,
        sampleTime: 876,
        offset: 123,
        length: 1,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        unitID: 12,
        readFCode: 4,
        writeFCode: 16,
      };
    });

    let exec = async () => {
      variable = new MBUInt16();

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("MBUInt16");
      expect(variable.DefaultValue).toEqual(123);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual(123);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(1);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(4);
      expect(variable.WriteFCode).toEqual(16);
    });

    it("should not initialize any property and throw - if readFCode is not included in readFCodes from getReadFCodes and read is set to true", async () => {
      payload.read = true;
      payload.write = false;
      payload.readFCode = 30;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(
        "Trying to assign invalid read FCode for MBVariable"
      );

      //Variable should not have been initialized
      expect(variable.ID).toEqual(null);
      expect(variable.Name).toEqual(null);
      expect(variable.Type).toEqual(null);
      expect(variable.DefaultValue).toEqual(null);
      expect(variable.LastValueTick).toEqual(null);
      expect(variable.Unit).toEqual(null);
      expect(variable.SampleTime).toEqual(null);
      expect(variable.Offset).toEqual(null);
      expect(variable.Length).toEqual(null);
    });

    it("should initialize and not throw - if readFCode is not included in readFCodes from getReadFCodes bute read is set to false", async () => {
      payload.read = false;
      payload.write = true;
      payload.readFCode = 30;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).resolves.toBeDefined();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("MBUInt16");
      expect(variable.DefaultValue).toEqual(123);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual(123);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(1);

      expect(variable.Read).toEqual(false);
      expect(variable.Write).toEqual(true);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(30);
      expect(variable.WriteFCode).toEqual(16);
    });

    it("should not initialize any property and throw - if writeFCode is not included in writeFCodes from getWriteFCodes and write is set to true", async () => {
      payload.read = false;
      payload.write = true;
      payload.writeFCode = 30;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(
        "Trying to assign invalid write FCode for MBVariable"
      );

      //Variable should not have been initialized
      expect(variable.ID).toEqual(null);
      expect(variable.Name).toEqual(null);
      expect(variable.Type).toEqual(null);
      expect(variable.DefaultValue).toEqual(null);
      expect(variable.LastValueTick).toEqual(null);
      expect(variable.Unit).toEqual(null);
      expect(variable.SampleTime).toEqual(null);
      expect(variable.Offset).toEqual(null);
      expect(variable.Length).toEqual(null);
    });

    it("should initialize and not throw - if writeFCode is not included in writeFCodes from getWriteFCodes bute write is set to false", async () => {
      payload.read = true;
      payload.write = false;
      payload.writeFCode = 30;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).resolves.toBeDefined();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("MBUInt16");
      expect(variable.DefaultValue).toEqual(123);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual(123);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(1);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(4);
      expect(variable.WriteFCode).toEqual(30);
    });

    it("should not initialize any property and throw - if type is invalid", async () => {
      payload.type = "FakeType";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("Invalid type in payload of MBUInt16");

      //Variable should not have been initialized
      expect(variable.ID).toEqual(null);
      expect(variable.Name).toEqual(null);
      expect(variable.Type).toEqual(null);
      expect(variable.DefaultValue).toEqual(null);
      expect(variable.LastValueTick).toEqual(null);
      expect(variable.Unit).toEqual(null);
      expect(variable.SampleTime).toEqual(null);
      expect(variable.Offset).toEqual(null);
      expect(variable.Length).toEqual(null);
    });

    it("should not initialize any property and throw - if length is invalid", async () => {
      payload.length = 5;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("Invalid length in payload of MBUInt16");

      //Variable should not have been initialized
      expect(variable.ID).toEqual(null);
      expect(variable.Name).toEqual(null);
      expect(variable.Type).toEqual(null);
      expect(variable.DefaultValue).toEqual(null);
      expect(variable.LastValueTick).toEqual(null);
      expect(variable.Unit).toEqual(null);
      expect(variable.SampleTime).toEqual(null);
      expect(variable.Offset).toEqual(null);
      expect(variable.Length).toEqual(null);
    });
  });
});
