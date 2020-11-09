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

  describe("_getReadPossibleFunctionCodes", () => {
    let mbVariable;

    let exec = async () => {
      mbVariable = new MBByteArray();
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
      mbVariable = new MBByteArray();
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
        type: "MBByteArray",
        defaultValue: [1, 2, 3, 4, 5, 6, 7, 8],
        sampleTime: 876,
        offset: 123,
        length: 4,
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
      variable = new MBByteArray();

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("MBByteArray");
      expect(variable.DefaultValue).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(4);

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
      expect(variable.Type).toEqual("MBByteArray");
      expect(variable.DefaultValue).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(4);

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
      expect(variable.Type).toEqual("MBByteArray");
      expect(variable.DefaultValue).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(4);

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

      expect(error.message).toEqual("Invalid type in payload of MBByteArray");

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

    it("should not initialize any property and throw - if length of defaultValue (bytes) is greater than 2x length of variable", async () => {
      payload.defaultValue = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      payload.length = 4;

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
        "Length of default value (bytes) not valid - it should be two times length of variable (words)"
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

    it("should not initialize any property and throw - if length of defaultValue (bytes) is shorter than 2x length of variable", async () => {
      payload.defaultValue = [1, 2, 3, 4, 5, 6, 7];
      payload.length = 4;

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
        "Length of default value (bytes) not valid - it should be two times length of variable (words)"
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
  });

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "MBByteArray",
        defaultValue: [1, 2, 3, 4, 5, 6, 7, 8],
        sampleTime: 876,
        offset: 123,
        length: 4,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        unitID: 12,
        readFCode: 4,
        writeFCode: 16,
        unit: "FakeUnit",
      };
    });

    let exec = async () => {
      return MBByteArray.validatePayload(payload);
    };

    it("should return null if payload is valid", async () => {
      let result = await exec();
      expect(result).toEqual(null);
    });

    it("should return message if id is not defined", async () => {
      delete payload.id;

      let result = await exec();

      expect(result).toEqual(`"id" is required`);
    });

    it("should return message if id is null", async () => {
      payload.id = null;

      let result = await exec();

      expect(result).toEqual(`"id" must be a string`);
    });

    it("should return message if id is empty string", async () => {
      payload.id = "";

      let result = await exec();

      expect(result).toEqual(`"id" is not allowed to be empty`);
    });

    it("should return message if name is not defined", async () => {
      delete payload.name;

      let result = await exec();

      expect(result).toEqual(`"name" is required`);
    });

    it("should return message if name is null", async () => {
      payload.name = null;

      let result = await exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if name is empty string", async () => {
      payload.name = "";

      let result = await exec();

      expect(result).toEqual(`"name" is not allowed to be empty`);
    });

    it("should return message if type is not defined", async () => {
      delete payload.type;

      let result = await exec();

      expect(result).toEqual(`"type" is required`);
    });

    it("should return message if type is null", async () => {
      payload.type = null;

      let result = await exec();

      expect(result).toEqual(`"type" must be [MBByteArray]`);
    });

    it("should return message if type is empty string", async () => {
      payload.type = "";

      let result = await exec();

      expect(result).toEqual(`"type" must be [MBByteArray]`);
    });

    it("should return message if type is invalid string", async () => {
      payload.type = "MBVariable";

      let result = await exec();

      expect(result).toEqual(`"type" must be [MBByteArray]`);
    });

    it("should return message if unit is not defined", async () => {
      delete payload.unit;

      let result = await exec();

      expect(result).toEqual(`"unit" is required`);
    });

    it("should return message if unit is null", async () => {
      payload.unit = null;

      let result = await exec();

      expect(result).toEqual(`"unit" must be a string`);
    });

    it("should return message if unit is empty string", async () => {
      payload.unit = "";

      let result = await exec();

      expect(result).toEqual(`"unit" is not allowed to be empty`);
    });

    it("should return message if sampleTime is not defined", async () => {
      delete payload.sampleTime;

      let result = await exec();

      expect(result).toEqual(`"sampleTime" is required`);
    });

    it("should return message if sampleTime is null", async () => {
      payload.sampleTime = null;

      let result = await exec();

      expect(result).toEqual(`"sampleTime" must be a number`);
    });

    it("should return message if sampleTime is 0", async () => {
      payload.sampleTime = 0;

      let result = await exec();

      expect(result).toEqual(`"sampleTime" must be greater than or equal to 1`);
    });

    it("should return message if sampleTime is a float", async () => {
      payload.sampleTime = 123.321;

      let result = await exec();

      expect(result).toEqual(`"sampleTime" must be an integer`);
    });

    it("should return message if defaultValue is not defined", async () => {
      delete payload.defaultValue;

      let result = await exec();

      expect(result).toEqual(`"defaultValue" is required`);
    });

    it("should return message if defaultValue is null", async () => {
      payload.defaultValue = null;

      let result = await exec();

      expect(result).toEqual(`"defaultValue" must be an array`);
    });

    it("should return message if defaultValue is not an array", async () => {
      payload.defaultValue = 123;

      let result = await exec();

      expect(result).toEqual(`"defaultValue" must be an array`);
    });

    it("should return message if defaultValue is longer than 2x length of variable", async () => {
      payload.defaultValue = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      payload.length = 4;

      let result = await exec();

      expect(result).toEqual(`"defaultValue" must contain ref:length items`);
    });

    it("should return message if defaultValue is shorter than 2x length of variable", async () => {
      payload.defaultValue = [1, 2, 3, 4, 5, 6, 7];
      payload.length = 4;

      let result = await exec();

      expect(result).toEqual(`"defaultValue" must contain ref:length items`);
    });

    it("should return message if defaultValue has values smaller than 0", async () => {
      payload.defaultValue = [-1, 2, 3, 4, 5, 6, 7, 8];
      payload.length = 4;

      let result = await exec();

      expect(result).toEqual(
        `"defaultValue[0]" must be greater than or equal to 0`
      );
    });

    it("should return message if defaultValue has values greater than 255", async () => {
      payload.defaultValue = [256, 2, 3, 4, 5, 6, 7, 8];
      payload.length = 4;

      let result = await exec();

      expect(result).toEqual(
        `"defaultValue[0]" must be less than or equal to 255`
      );
    });

    it("should return message if offset is not defined", async () => {
      delete payload.offset;

      let result = await exec();

      expect(result).toEqual(`"offset" is required`);
    });

    it("should return message if offset is null", async () => {
      payload.offset = null;

      let result = await exec();

      expect(result).toEqual(`"offset" must be a number`);
    });

    it("should return message if offset is -1", async () => {
      payload.offset = -1;

      let result = await exec();

      expect(result).toEqual(`"offset" must be greater than or equal to 0`);
    });

    it("should return message if offset is a float", async () => {
      payload.offset = 123.321;

      let result = await exec();

      expect(result).toEqual(`"offset" must be an integer`);
    });

    it("should return message if length is not defined", async () => {
      delete payload.length;

      let result = await exec();

      expect(result).toEqual(`"length" is required`);
    });

    it("should return message if length is null", async () => {
      payload.length = null;

      let result = await exec();

      expect(result).toEqual(`"length" must be a number`);
    });

    it("should return message if length is 0", async () => {
      payload.length = 0;
      //together with length, a default value should be calculated
      payload.defaultValue = [];

      let result = await exec();

      expect(result).toEqual(`"length" must be greater than or equal to 1`);
    });

    it("should return message if unitID is not defined", async () => {
      delete payload.unitID;

      let result = await exec();

      expect(result).toEqual(`"unitID" is required`);
    });

    it("should return message if unitID is null", async () => {
      payload.unitID = null;

      let result = await exec();

      expect(result).toEqual(`"unitID" must be a number`);
    });

    it("should return message if unitID is 0", async () => {
      payload.unitID = 0;

      let result = await exec();

      expect(result).toEqual(`"unitID" must be greater than or equal to 1`);
    });

    it("should return message if unitID is a float", async () => {
      payload.unitID = 123.321;

      let result = await exec();

      expect(result).toEqual(`"unitID" must be an integer`);
    });

    it("should return message if unitID greater than 255", async () => {
      payload.unitID = 256;

      let result = await exec();

      expect(result).toEqual(`"unitID" must be less than or equal to 255`);
    });

    it("should return message if read is not defined", async () => {
      delete payload.read;

      let result = await exec();

      expect(result).toEqual(`"read" is required`);
    });

    it("should return message if read is null", async () => {
      payload.read = null;

      let result = await exec();

      expect(result).toEqual(`"read" must be a boolean`);
    });

    it("should return message if read is not defined - and write is false", async () => {
      payload.write = false;
      delete payload.read;

      let result = await exec();

      expect(result).toEqual(`"read" is required`);
    });

    it("should return message if write is null - and write is false", async () => {
      payload.write = false;
      payload.read = null;

      let result = await exec();

      expect(result).toEqual(`"read" must be a boolean`);
    });

    it("should return message if read is true as well as write", async () => {
      payload.read = true;
      payload.write = true;

      let result = await exec();

      expect(result).toEqual(`"write" must be [false]`);
    });

    it("should return message if read is false as well as write", async () => {
      payload.read = false;
      payload.write = false;

      let result = await exec();

      expect(result).toEqual(`"write" must be [true]`);
    });

    it("should return message if write is not defined", async () => {
      delete payload.write;

      let result = await exec();

      expect(result).toEqual(`"write" is required`);
    });

    it("should return message if write is null", async () => {
      payload.write = null;

      let result = await exec();

      expect(result).toEqual(`"write" must be [false]`);
    });

    it("should return message if write is not defined - and read is false", async () => {
      payload.read = false;
      delete payload.write;

      let result = await exec();

      expect(result).toEqual(`"write" is required`);
    });

    it("should return message if write is null - and read is false", async () => {
      payload.read = false;
      payload.write = null;

      let result = await exec();

      expect(result).toEqual(`"write" must be [true]`);
    });

    it("should return message if readFCode is not defined - and read is set to true", async () => {
      delete payload.readFCode;

      let result = await exec();

      expect(result).toEqual(`"readFCode" is required`);
    });

    it("should return message if readFCode is null - and read is set to true", async () => {
      payload.readFCode = null;

      let result = await exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is 0  - and read is set to true", async () => {
      payload.readFCode = 0;

      let result = await exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is a float  - and read is set to true", async () => {
      payload.readFCode = 123.321;

      let result = await exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return null if readFCode is not defined - and read is set to false", async () => {
      payload.read = false;
      payload.write = true;
      delete payload.readFCode;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return message if readFCode is null - and read is set to false", async () => {
      payload.read = false;
      payload.write = true;
      payload.readFCode = null;

      let result = await exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is 0  - and read is set to false", async () => {
      payload.read = false;
      payload.write = true;
      payload.readFCode = 0;

      let result = await exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is a float  - and read is set to false", async () => {
      payload.read = false;
      payload.write = true;
      payload.readFCode = 123.321;

      let result = await exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if writeFCode is not defined - and write is set to true", async () => {
      payload.write = true;
      payload.read = false;

      delete payload.writeFCode;

      let result = await exec();

      expect(result).toEqual(`"writeFCode" is required`);
    });

    it("should return message if writeFCode is null - and write is set to true", async () => {
      payload.write = true;
      payload.read = false;
      payload.writeFCode = null;

      let result = await exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is 0  - and write is set to true", async () => {
      payload.write = true;
      payload.read = false;
      payload.writeFCode = 0;

      let result = await exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is a float  - and write is set to true", async () => {
      payload.write = true;
      payload.read = false;
      payload.writeFCode = 123.321;

      let result = await exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return null if writeFCode is not defined - and write is set to false", async () => {
      payload.write = false;
      payload.read = true;
      delete payload.writeFCode;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return message if writeFCode is null - and write is set to false", async () => {
      payload.write = false;
      payload.read = true;
      payload.writeFCode = null;

      let result = await exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is 0  - and write is set to false", async () => {
      payload.write = false;
      payload.read = true;
      payload.writeFCode = 0;

      let result = await exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is a float  - and write is set to false", async () => {
      payload.write = false;
      payload.read = true;
      payload.writeFCode = 123.321;

      let result = await exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if readAsSingle is not defined", async () => {
      delete payload.readAsSingle;

      let result = await exec();

      expect(result).toEqual(`"readAsSingle" is required`);
    });

    it("should return message if readAsSingle is null", async () => {
      payload.readAsSingle = null;

      let result = await exec();

      expect(result).toEqual(`"readAsSingle" must be a boolean`);
    });

    it("should return message if readAsSingle is not a boolean", async () => {
      payload.readAsSingle = 123;

      let result = await exec();

      expect(result).toEqual(`"readAsSingle" must be a boolean`);
    });

    it("should return message if writeAsSingle is not defined", async () => {
      delete payload.writeAsSingle;

      let result = await exec();

      expect(result).toEqual(`"writeAsSingle" is required`);
    });

    it("should return message if writeAsSingle is null", async () => {
      payload.writeAsSingle = null;

      let result = await exec();

      expect(result).toEqual(`"writeAsSingle" must be a boolean`);
    });

    it("should return message if writeAsSingle is not a boolean", async () => {
      payload.writeAsSingle = 123;

      let result = await exec();

      expect(result).toEqual(`"writeAsSingle" must be a boolean`);
    });
  });
});
