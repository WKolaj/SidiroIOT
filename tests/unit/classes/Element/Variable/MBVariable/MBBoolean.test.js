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

  describe("_getReadPossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBBoolean();
      return mbVariable._getReadPossibleFunctionCodes();
    };

    it("should return functions 1 and 2", async () => {
      let result = await exec();

      expect(result).toEqual([1, 2]);
    });
  });

  describe("_getWritePossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBBoolean();
      return mbVariable._getWritePossibleFunctionCodes();
    };

    it("should return empty array - MBBoolean cannot be written", async () => {
      let result = await exec();

      expect(result).toEqual([]);
    });
  });

  describe("init", () => {
    let payload;
    let variable;
    let convertValueToDataMockFunc;
    let convertDataToValueMockFunc;
    let possibleReadCodes;
    let possibleWriteCodes;
    let getPossibleReadCodesMockFunc;
    let getPossibleWriteCodesMockFunc;

    beforeEach(() => {
      possibleReadCodes = [1, 2, 3, 4];
      possibleWriteCodes = [16];

      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "MBBoolean",
        defaultValue: false,
        sampleTime: 456,
        offset: 123,
        length: 1,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        unitID: 12,
        readFCode: 2,
        writeFCode: 16,
      };
    });

    let exec = async () => {
      variable = new MBBoolean();

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("MBBoolean");
      expect(variable.DefaultValue).toEqual(false);
      expect(variable.SampleTime).toEqual(456);

      expect(variable.Value).toEqual(false);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(1);

      expect(variable.Data).toEqual([false]);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(2);
      expect(variable.WriteFCode).toEqual(16);
    });

    it("should initialize variable's properties based on their payload - if default value is true", async () => {
      payload.defaultValue = true;

      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("MBBoolean");
      expect(variable.DefaultValue).toEqual(true);
      expect(variable.SampleTime).toEqual(456);

      expect(variable.Value).toEqual(true);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(1);

      expect(variable.Data).toEqual([true]);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(2);
      expect(variable.WriteFCode).toEqual(16);
    });

    it("should not initialize any property and throw - if type is different than MBBoolean", async () => {
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

      expect(error.message).toEqual("Invalid type in payload of MBBoolean");

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

    it("should not initialize any property and throw - if length is different than 1", async () => {
      payload.length = 2;

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

      expect(error.message).toEqual("Invalid length in payload of MBBoolean");

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

    it("should not initialize any property and throw - and throw - if write is set to true (no method for setting mbboolean data)", async () => {
      payload.read = false;
      payload.write = true;

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
      expect(variable.Type).toEqual("MBBoolean");
      expect(variable.DefaultValue).toEqual(false);
      expect(variable.SampleTime).toEqual(456);

      expect(variable.Value).toEqual(false);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(1);

      expect(variable.Data).toEqual([false]);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(2);
      expect(variable.WriteFCode).toEqual(30);
    });
  });
});
