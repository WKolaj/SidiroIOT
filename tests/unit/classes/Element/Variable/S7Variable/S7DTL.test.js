const S7DTL = require("../../../../../../classes/Element/Variable/ConnectableVariable/S7Variable/S7DTL");

describe("S7DTL", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new S7DTL(project, device);
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
    let variable;
    let data;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";

      //Bytes
      // 0,1          -   Year    -   1990    =   [7,198]
      // 2            -   Month   -   11
      // 3            -   Day     -   30
      // 4            -   Weekday -   6 (friday)
      // 5            -   Hour    -   10
      // 6            -   Min     -   11
      // 7            -   Sec     -   12
      // 8,9,10,11    -   Nanosec -   134000000 ns = [ 7, 252, 173, 128 ]

      //In UTC it is 659959872134

      data = [7, 198, 11, 30, 6, 10, 11, 12, 7, 252, 173, 128];
    });

    let exec = async () => {
      variable = new S7DTL(project, device);

      return variable._convertDataToValue(data);
    };

    it("should return proper value", async () => {
      let result = await exec();

      expect(result).toEqual(659959872134);
    });

    it("should return proper value - if month is january", async () => {
      //In UTC it is 633694272134
      data = [7, 198, 1, 30, 6, 10, 11, 12, 7, 252, 173, 128];

      let result = await exec();

      expect(result).toEqual(633694272134);
    });

    it("should return proper value - if month is december", async () => {
      //In UTC it is 662551872134
      data = [7, 198, 12, 30, 6, 10, 11, 12, 7, 252, 173, 128];

      let result = await exec();

      expect(result).toEqual(662551872134);
    });
  });

  describe("_convertValueToData", () => {
    let project;
    let device;
    let variable;
    let value;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
      value = 659959872134;
    });

    let exec = async () => {
      variable = new S7DTL(project, device);
      return variable._convertValueToData(value);
    };

    it("should return proper data - if value is greater than 0", async () => {
      let result = await exec();

      expect(result).toEqual([7, 198, 11, 30, 6, 10, 11, 12, 7, 252, 173, 128]);
    });

    it("should return proper data - if month is january", async () => {
      value = 633694272134;

      let result = await exec();

      expect(result).toEqual([7, 198, 1, 30, 3, 10, 11, 12, 7, 252, 173, 128]);
    });

    it("should return proper data - if month is december", async () => {
      value = 662551872134;

      let result = await exec();

      expect(result).toEqual([7, 198, 12, 30, 1, 10, 11, 12, 7, 252, 173, 128]);
    });

    it("should return proper data - if day is sunday", async () => {
      value = 660132672134;

      let result = await exec();

      expect(result).toEqual([7, 198, 12, 2, 1, 10, 11, 12, 7, 252, 173, 128]);
    });

    it("should return proper data - if day is saturday", async () => {
      value = 660046272134;

      let result = await exec();

      expect(result).toEqual([7, 198, 12, 1, 7, 10, 11, 12, 7, 252, 173, 128]);
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
        type: "S7DTL",
        defaultValue: 1607515561983,
        sampleTime: 876,
        offset: 123,
        length: 12,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        memoryType: "DB",
        dbNumber: 4,
      };
    });

    let exec = async () => {
      variable = new S7DTL(project, device);

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("S7DTL");
      expect(variable.DefaultValue).toEqual(1607515561983);
      expect(variable.SampleTime).toEqual(876);

      expect(variable.Value).toEqual(1607515561983);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(12);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.MemoryType).toEqual("DB");
      expect(variable.DBNumber).toEqual(4);
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

      expect(error.message).toEqual("Invalid length in payload of S7DTL");

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
        type: "S7DTL",
        defaultValue: 123,
        sampleTime: 876,
        offset: 123,
        length: 12,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        memoryType: "DB",
        dbNumber: 4,
        unit: "FakeUnit",
      };
    });

    let exec = () => {
      return S7DTL.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [S7DTL]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [S7DTL]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [S7DTL]`);
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

    it("should return message if defaultValue is a smaller than 0", () => {
      payload.defaultValue = -1;

      let result = exec();

      expect(result).toEqual(
        `"defaultValue" must be greater than or equal to 0`
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

      expect(result).toEqual(`"length" must be [12]`);
    });

    it("should return message if length is 0", () => {
      payload.length = 0;

      let result = exec();

      expect(result).toEqual(`"length" must be [12]`);
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

    it("should return message if memoryType is not defined", () => {
      delete payload.memoryType;

      let result = exec();

      expect(result).toEqual(`"memoryType" is required`);
    });

    it("should return message if memoryType is null", () => {
      payload.memoryType = null;

      let result = exec();

      expect(result).toEqual(`"memoryType" must be one of [I, Q, M, DB]`);
    });

    it("should return message if memoryType is empty string", () => {
      payload.memoryType = "";

      let result = exec();

      expect(result).toEqual(`"memoryType" must be one of [I, Q, M, DB]`);
    });

    it("should return message if memoryType is invalid string", () => {
      payload.memoryType = "fakeString";

      let result = exec();

      expect(result).toEqual(`"memoryType" must be one of [I, Q, M, DB]`);
    });

    it("should return message if dbNumber is not defined - memoryType is DB", () => {
      payload.memoryType = "DB";
      delete payload.dbNumber;

      let result = exec();

      expect(result).toEqual(`"dbNumber" is required`);
    });

    it("should return message if dbNumber is null - memoryType is DB", () => {
      payload.memoryType = "DB";
      payload.dbNumber = null;

      let result = exec();

      expect(result).toEqual(`"dbNumber" must be a number`);
    });

    it("should return message if dbNumber is 0 - memoryType is DB", () => {
      payload.memoryType = "DB";
      payload.dbNumber = 0;

      let result = exec();

      expect(result).toEqual(`"dbNumber" must be greater than or equal to 1`);
    });

    it("should return message if dbNumber is float - memoryType is DB", () => {
      payload.memoryType = "DB";
      payload.dbNumber = 123.351;

      let result = exec();

      expect(result).toEqual(`"dbNumber" must be an integer`);
    });

    it("should return null if dbNumber is not defined - memoryType is not DB", () => {
      payload.memoryType = "I";
      delete payload.dbNumber;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if dbNumber is null - memoryType is not DB", () => {
      payload.memoryType = "I";
      payload.dbNumber = null;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if dbNumber is a valid integer - memoryType is not DB", () => {
      payload.memoryType = "I";
      payload.dbNumber = 123;

      let result = exec();

      expect(result).toEqual(`"dbNumber" must be [null]`);
    });

    it("should return message if dbNumber is 0 - memoryType is not DB", () => {
      payload.memoryType = "DB";
      payload.dbNumber = 0;

      let result = exec();

      expect(result).toEqual(`"dbNumber" must be greater than or equal to 1`);
    });

    it("should return message if dbNumber is float - memoryType is not DB", () => {
      payload.memoryType = "DB";
      payload.dbNumber = 123.351;

      let result = exec();

      expect(result).toEqual(`"dbNumber" must be an integer`);
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
      variable = new S7DTL(project, device);
      return variable.checkIfValueCanBeSet(value);
    };

    it("should return null if value is a valid integer", () => {
      value = 123;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if value is sammler than 0", () => {
      value = -1;

      let result = exec();

      expect(result).toEqual(`"value" must be greater than or equal to 0`);
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
