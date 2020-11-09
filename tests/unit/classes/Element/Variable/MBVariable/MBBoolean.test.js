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

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: "testVariable2ID",
        name: "testVariable2Name",
        type: "MBBoolean",
        unit: "FakeUnit",
        sampleTime: 123,
        defaultValue: true,
        offset: 11,
        length: 1,
        read: true,
        write: false,
        readFCode: 2,
        unitID: 2,
        readAsSingle: false,
        writeAsSingle: false,
      };
    });

    let exec = () => {
      return MBBoolean.validatePayload(payload);
    };

    it("should return null if payload is valid", () => {
      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if id is not defined", () => {
      delete payload.id;

      let result = exec();

      expect(result).toEqual(`"id" is required`);
    });

    it("should return message if id is null", () => {
      payload.id = null;

      let result = exec();

      expect(result).toEqual(`"id" must be a string`);
    });

    it("should return message if id is empty string", () => {
      payload.id = "";

      let result = exec();

      expect(result).toEqual(`"id" is not allowed to be empty`);
    });

    it("should return message if name is not defined", () => {
      delete payload.name;

      let result = exec();

      expect(result).toEqual(`"name" is required`);
    });

    it("should return message if name is null", () => {
      payload.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if name is empty string", () => {
      payload.name = "";

      let result = exec();

      expect(result).toEqual(`"name" is not allowed to be empty`);
    });

    it("should return message if type is not defined", () => {
      delete payload.type;

      let result = exec();

      expect(result).toEqual(`"type" is required`);
    });

    it("should return message if type is null", () => {
      payload.type = null;

      let result = exec();

      expect(result).toEqual(`"type" must be [MBBoolean]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBBoolean]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBBoolean]`);
    });

    it("should return message if unit is not defined", () => {
      delete payload.unit;

      let result = exec();

      expect(result).toEqual(`"unit" is required`);
    });

    it("should return message if unit is null", () => {
      payload.unit = null;

      let result = exec();

      expect(result).toEqual(`"unit" must be a string`);
    });

    it("should return message if unit is empty string", () => {
      payload.unit = "";

      let result = exec();

      expect(result).toEqual(`"unit" is not allowed to be empty`);
    });

    it("should return message if sampleTime is not defined", () => {
      delete payload.sampleTime;

      let result = exec();

      expect(result).toEqual(`"sampleTime" is required`);
    });

    it("should return message if sampleTime is null", () => {
      payload.sampleTime = null;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be a number`);
    });

    it("should return message if sampleTime is 0", () => {
      payload.sampleTime = 0;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be greater than or equal to 1`);
    });

    it("should return message if sampleTime is a float", () => {
      payload.sampleTime = 123.321;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be an integer`);
    });

    it("should return message if defaultValue is not defined", () => {
      delete payload.defaultValue;

      let result = exec();

      expect(result).toEqual(`"defaultValue" is required`);
    });

    it("should return message if defaultValue is null", () => {
      payload.defaultValue = null;

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a boolean`);
    });

    it("should return message if defaultValue is not a boolean", () => {
      payload.defaultValue = 123;

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a boolean`);
    });

    it("should return message if offset is not defined", () => {
      delete payload.offset;

      let result = exec();

      expect(result).toEqual(`"offset" is required`);
    });

    it("should return message if offset is null", () => {
      payload.offset = null;

      let result = exec();

      expect(result).toEqual(`"offset" must be a number`);
    });

    it("should return message if offset is -1", () => {
      payload.offset = -1;

      let result = exec();

      expect(result).toEqual(`"offset" must be greater than or equal to 0`);
    });

    it("should return message if offset is a float", () => {
      payload.offset = 123.321;

      let result = exec();

      expect(result).toEqual(`"offset" must be an integer`);
    });

    it("should return message if length is not defined", () => {
      delete payload.length;

      let result = exec();

      expect(result).toEqual(`"length" is required`);
    });

    it("should return message if length is null", () => {
      payload.length = null;

      let result = exec();

      expect(result).toEqual(`"length" must be [1]`);
    });

    it("should return message if length is 0", () => {
      payload.length = 0;

      let result = exec();

      expect(result).toEqual(`"length" must be [1]`);
    });

    it("should return message if length is greater than 1", () => {
      payload.length = 2;

      let result = exec();

      expect(result).toEqual(`"length" must be [1]`);
    });

    it("should return message if unitID is not defined", () => {
      delete payload.unitID;

      let result = exec();

      expect(result).toEqual(`"unitID" is required`);
    });

    it("should return message if unitID is null", () => {
      payload.unitID = null;

      let result = exec();

      expect(result).toEqual(`"unitID" must be a number`);
    });

    it("should return message if unitID is 0", () => {
      payload.unitID = 0;

      let result = exec();

      expect(result).toEqual(`"unitID" must be greater than or equal to 1`);
    });

    it("should return message if unitID is a float", () => {
      payload.unitID = 123.321;

      let result = exec();

      expect(result).toEqual(`"unitID" must be an integer`);
    });

    it("should return message if unitID greater than 255", () => {
      payload.unitID = 256;

      let result = exec();

      expect(result).toEqual(`"unitID" must be less than or equal to 255`);
    });

    it("should return message if read is not defined", () => {
      delete payload.read;

      let result = exec();

      expect(result).toEqual(`"read" is required`);
    });

    it("should return message if read is null", () => {
      payload.read = null;

      let result = exec();

      expect(result).toEqual(`"read" must be a boolean`);
    });

    it("should return message if read is true as well as write", () => {
      payload.read = true;
      payload.write = true;

      let result = exec();

      expect(result).toEqual(`"write" must be [false]`);
    });

    it("should return message if read is false as well as write", () => {
      payload.read = false;
      payload.write = false;

      let result = exec();

      expect(result).toEqual(`"write" must be [true]`);
    });

    it("should return message if write is not defined", () => {
      delete payload.write;

      let result = exec();

      expect(result).toEqual(`"write" is required`);
    });

    it("should return message if write is null", () => {
      payload.write = null;

      let result = exec();

      expect(result).toEqual(`"write" must be [false]`);
    });

    it("should return message if write is not defined - and read is false", () => {
      payload.read = false;
      delete payload.write;

      let result = exec();

      expect(result).toEqual(`"write" is required`);
    });

    it("should return message if write is null - and read is false", () => {
      payload.read = false;
      payload.write = null;

      let result = exec();

      expect(result).toEqual(`"write" must be [true]`);
    });

    it("should return message if readFCode is not defined", () => {
      delete payload.readFCode;

      let result = exec();

      expect(result).toEqual(`"readFCode" is required`);
    });

    it("should return message if readFCode is null", () => {
      payload.readFCode = null;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [1, 2]`);
    });

    it("should return message if readFCode is 0", () => {
      payload.readFCode = 0;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [1, 2]`);
    });

    it("should return message if readFCode is a float", () => {
      payload.readFCode = 123.321;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [1, 2]`);
    });

    //writeFCode should not be there - write cannot be true
    it("should return message if writeFCode is present", () => {
      payload.writeFCode = 16;

      let result = exec();

      expect(result).toEqual(`"writeFCode" is not allowed`);
    });

    it("should return message if readAsSingle is not defined", () => {
      delete payload.readAsSingle;

      let result = exec();

      expect(result).toEqual(`"readAsSingle" is required`);
    });

    it("should return message if readAsSingle is null", () => {
      payload.readAsSingle = null;

      let result = exec();

      expect(result).toEqual(`"readAsSingle" must be a boolean`);
    });

    it("should return message if readAsSingle is not a boolean", () => {
      payload.readAsSingle = 123;

      let result = exec();

      expect(result).toEqual(`"readAsSingle" must be a boolean`);
    });

    it("should return message if writeAsSingle is not defined", () => {
      delete payload.writeAsSingle;

      let result = exec();

      expect(result).toEqual(`"writeAsSingle" is required`);
    });

    it("should return message if writeAsSingle is null", () => {
      payload.writeAsSingle = null;

      let result = exec();

      expect(result).toEqual(`"writeAsSingle" must be a boolean`);
    });

    it("should return message if writeAsSingle is not a boolean", () => {
      payload.writeAsSingle = 123;

      let result = exec();

      expect(result).toEqual(`"writeAsSingle" must be a boolean`);
    });
  });
});
