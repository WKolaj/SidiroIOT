const MBSwappedInt32 = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBSwappedInt32");

describe("MBSwappedInt32", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new MBSwappedInt32(project, device);
    };

    it("should create new ConnectableVariable and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);

      //Value should not be checked - method _convertDataToValue is not set
      //expect(result.Value).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
    });

    it("should assign project and device", () => {
      let result = exec();

      expect(result._project).toEqual(project);
      expect(result._device).toEqual(device);
    });
  });

  describe("_convertDataToValue", () => {
    let project;
    let device;
    let mbVariable;
    let dataToConvert;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      //65535 => 5678 * 65535 = 372113408
      //1234 => + 1234
      // 372114642
      dataToConvert = [5678, 1234];
    });

    let exec = async () => {
      mbVariable = new MBSwappedInt32(project, device);

      return mbVariable._convertDataToValue(dataToConvert);
    };

    it("should convert data to value and return it", async () => {
      let result = await exec();

      expect(result).toEqual(372114642);
    });

    it("should be able to covert negative values", async () => {
      //65535 => -1 * 65535
      //1234 => + 1234
      // -64302
      dataToConvert = [65535, 1234];

      let result = await exec();

      expect(result).toEqual(-64302);
    });
  });

  describe("_convertValueToData", () => {
    let project;
    let device;
    let mbVariable;
    let valueToConvert;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      valueToConvert = 372114642;
    });

    let exec = async () => {
      mbVariable = new MBSwappedInt32(project, device);
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

  describe("_getReadPossibleFunctionCodes", () => {
    let project;
    let device;
    let mbVariable;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = async () => {
      mbVariable = new MBSwappedInt32(project, device);
      return mbVariable._getReadPossibleFunctionCodes();
    };

    it("should return functions 3 and 4", async () => {
      let result = await exec();

      expect(result).toEqual([3, 4]);
    });
  });

  describe("_getWritePossibleFunctionCodes", () => {
    let project;
    let device;
    let mbVariable;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = async () => {
      mbVariable = new MBSwappedInt32(project, device);
      return mbVariable._getWritePossibleFunctionCodes();
    };

    it("should return function 16", async () => {
      let result = await exec();

      expect(result).toEqual([16]);
    });
  });

  describe("init", () => {
    let project;
    let device;
    let payload;
    let variable;

    beforeEach(() => {
      project = "fakeProject";
      device = { ID: "fakeDeviceId" };
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "MBSwappedInt32",
        defaultValue: 123,
        sampleTime: 876,
        offset: 123,
        length: 2,
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
      variable = new MBSwappedInt32(project, device);

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("MBSwappedInt32");
      expect(variable.DefaultValue).toEqual(123);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual(123);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(2);

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
      expect(variable.Type).toEqual("MBSwappedInt32");
      expect(variable.DefaultValue).toEqual(123);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual(123);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(2);

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
      expect(variable.Type).toEqual("MBSwappedInt32");
      expect(variable.DefaultValue).toEqual(123);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual(123);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(2);

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

      expect(error.message).toEqual(
        "Invalid type in payload of MBSwappedInt32"
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

      expect(error.message).toEqual(
        "Invalid length in payload of MBSwappedInt32"
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
        type: "MBSwappedInt32",
        defaultValue: 123,
        sampleTime: 876,
        offset: 123,
        length: 2,
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

    let exec = () => {
      return MBSwappedInt32.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [MBSwappedInt32]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBSwappedInt32]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBSwappedInt32]`);
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

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if defaultValue is not a number", () => {
      payload.defaultValue = "test value";

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if defaultValue is a float", () => {
      payload.defaultValue = 123.321;

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be an integer`);
    });

    it("should return message if defaultValue is a smaller than -2147483648", () => {
      payload.defaultValue = -2147483649;

      let result = exec();

      expect(result).toEqual(
        `"defaultValue" must be greater than or equal to -2147483648`
      );
    });

    it("should return message if defaultValue is a greater than-2147483647", () => {
      payload.defaultValue = 2147483648;

      let result = exec();

      expect(result).toEqual(
        `"defaultValue" must be less than or equal to 2147483647`
      );
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

      expect(result).toEqual(`"length" must be [2]`);
    });

    it("should return message if length is 0", () => {
      payload.length = 0;

      let result = exec();

      expect(result).toEqual(`"length" must be [2]`);
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

    it("should return message if read is not defined - and write is false", () => {
      payload.write = false;
      delete payload.read;

      let result = exec();

      expect(result).toEqual(`"read" is required`);
    });

    it("should return message if write is null - and write is false", () => {
      payload.write = false;
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

    it("should return message if readFCode is not defined - and read is set to true", () => {
      delete payload.readFCode;

      let result = exec();

      expect(result).toEqual(`"readFCode" is required`);
    });

    it("should return message if readFCode is null - and read is set to true", () => {
      payload.readFCode = null;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is 0  - and read is set to true", () => {
      payload.readFCode = 0;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is a float  - and read is set to true", () => {
      payload.readFCode = 123.321;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return null if readFCode is not defined - and read is set to false", () => {
      payload.read = false;
      payload.write = true;
      delete payload.readFCode;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if readFCode is null - and read is set to false", () => {
      payload.read = false;
      payload.write = true;
      payload.readFCode = null;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is 0  - and read is set to false", () => {
      payload.read = false;
      payload.write = true;
      payload.readFCode = 0;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if readFCode is a float  - and read is set to false", () => {
      payload.read = false;
      payload.write = true;
      payload.readFCode = 123.321;

      let result = exec();

      expect(result).toEqual(`"readFCode" must be one of [3, 4]`);
    });

    it("should return message if writeFCode is not defined - and write is set to true", () => {
      payload.write = true;
      payload.read = false;

      delete payload.writeFCode;

      let result = exec();

      expect(result).toEqual(`"writeFCode" is required`);
    });

    it("should return message if writeFCode is null - and write is set to true", () => {
      payload.write = true;
      payload.read = false;
      payload.writeFCode = null;

      let result = exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is 0  - and write is set to true", () => {
      payload.write = true;
      payload.read = false;
      payload.writeFCode = 0;

      let result = exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is a float  - and write is set to true", () => {
      payload.write = true;
      payload.read = false;
      payload.writeFCode = 123.321;

      let result = exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return null if writeFCode is not defined - and write is set to false", () => {
      payload.write = false;
      payload.read = true;
      delete payload.writeFCode;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if writeFCode is null - and write is set to false", () => {
      payload.write = false;
      payload.read = true;
      payload.writeFCode = null;

      let result = exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is 0  - and write is set to false", () => {
      payload.write = false;
      payload.read = true;
      payload.writeFCode = 0;

      let result = exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
    });

    it("should return message if writeFCode is a float  - and write is set to false", () => {
      payload.write = false;
      payload.read = true;
      payload.writeFCode = 123.321;

      let result = exec();

      expect(result).toEqual(`"writeFCode" must be [16]`);
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

  describe("checkIfValueCanBeSet", () => {
    let project;
    let device;
    let variable;
    let value;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      value = 123;
    });

    let exec = () => {
      variable = new MBSwappedInt32(project, device);
      return variable.checkIfValueCanBeSet(value);
    };

    it("should return null if value is a valid integer", () => {
      value = 123;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if value is greater than 2147483647", () => {
      value = 2147483648;

      let result = exec();

      expect(result).toEqual(
        `"value" must be less than or equal to 2147483647`
      );
    });

    it("should return message if value is sammler than -2147483648", () => {
      value = -2147483649;

      let result = exec();

      expect(result).toEqual(
        `"value" must be greater than or equal to -2147483648`
      );
    });

    it("should return message if value is undefined", () => {
      value = undefined;

      let result = exec();

      expect(result).toEqual(`"value" is required`);
    });

    it("should return message if value is null", () => {
      value = null;

      let result = exec();

      expect(result).toEqual(`"value" must be a number`);
    });

    it("should return message if value is not a valid number", () => {
      value = "fakeValue";

      let result = exec();

      expect(result).toEqual(`"value" must be a number`);
    });
  });
});
