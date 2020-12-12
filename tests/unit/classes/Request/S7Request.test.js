const S7Request = require("../../../../classes/Request/S7Request/S7Request");
const MBRequest = require("../../../../classes/Request/S7Request/S7Request");
const { snooze } = require("../../../../utilities/utilities");
const { createFakeS7Variable } = require("../../../utilities/testUtilities");

describe("S7Request", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let variable1;
    let variable1SampleTime;
    let variable1Offset;
    let variable1MemoryType;
    let variable1DBNumber;
    let variable1Length;
    let variable1Read;
    let variable1ReadAsSeperate;
    let variable1Write;
    let variable1WriteAsSeperate;
    let addVariable1;

    let variable2;
    let variable2SampleTime;
    let variable2Offset;
    let variable2MemoryType;
    let variable2DBNumber;
    let variable2Length;
    let variable2Read;
    let variable2ReadAsSeperate;
    let variable2Write;
    let variable2WriteAsSeperate;
    let addVariable2;

    let variable3;
    let variable3SampleTime;
    let variable3Offset;
    let variable3MemoryType;
    let variable3DBNumber;
    let variable3Length;
    let variable3Read;
    let variable3ReadAsSeperate;
    let variable3Write;
    let variable3WriteAsSeperate;
    let addVariable3;

    let sampleTime;
    let writeRequest;
    let dbNumber;
    let memoryType;

    beforeEach(() => {
      sampleTime = 15;
      writeRequest = false;
      dbNumber = 4;
      memoryType = "DB";

      addVariable1 = true;
      addVariable2 = true;
      addVariable3 = true;

      variable1SampleTime = 15;
      variable1Offset = 1;
      variable1MemoryType = "DB";
      variable1DBNumber = 4;
      variable1Length = 2;
      variable1Read = true;
      variable1ReadAsSeperate = false;
      variable1Write = false;
      variable1WriteAsSeperate = false;
      addVariable1 = true;

      variable2SampleTime = 15;
      variable2Offset = 3;
      variable2MemoryType = "DB";
      variable2DBNumber = 4;
      variable2Length = 4;
      variable2Read = true;
      variable2ReadAsSeperate = false;
      variable2Write = false;
      variable2WriteAsSeperate = false;
      addVariable2 = true;

      variable3SampleTime = 15;
      variable3Offset = 7;
      variable3MemoryType = "DB";
      variable3DBNumber = 4;
      variable3Length = 4;
      variable3Read = true;
      variable3ReadAsSeperate = false;
      variable3Write = false;
      variable3WriteAsSeperate = false;
      addVariable3 = true;
    });

    let exec = () => {
      variable1 = createFakeS7Variable(
        null,
        null,
        "var1Id",
        "var1Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable1SampleTime,
        [],
        variable1Offset,
        variable1Length,
        () => 0,
        () => [],
        variable1MemoryType,
        variable1DBNumber,
        variable1Read,
        variable1Write,
        variable1ReadAsSeperate,
        variable1WriteAsSeperate
      );

      variable2 = createFakeS7Variable(
        null,
        null,
        "var2Id",
        "var2Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable2SampleTime,
        [],
        variable2Offset,
        variable2Length,
        () => 0,
        () => [],
        variable2MemoryType,
        variable2DBNumber,
        variable2Read,
        variable2Write,
        variable2ReadAsSeperate,
        variable2WriteAsSeperate
      );

      variable3 = createFakeS7Variable(
        null,
        null,
        "var3Id",
        "var3Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable3SampleTime,
        [],
        variable3Offset,
        variable3Length,
        () => 0,
        () => [],
        variable3MemoryType,
        variable3DBNumber,
        variable3Read,
        variable3Write,
        variable3ReadAsSeperate,
        variable3WriteAsSeperate
      );

      variables = [];

      if (addVariable1) variables.push(variable1);
      if (addVariable2) variables.push(variable2);
      if (addVariable3) variables.push(variable3);

      return new S7Request(
        variables,
        sampleTime,
        writeRequest,
        memoryType,
        dbNumber
      );
    };

    it("should create new S7Request and assign its properties and variables", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.MemoryType).toEqual(memoryType);
      expect(result.DBNumber).toEqual(dbNumber);
    });

    it("should create new S7Request and assign its properties and variables - if area type is not DB and there are not DBNumber properties", () => {
      variable1MemoryType = "I";
      variable1DBNumber = undefined;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;

      memoryType = "I";
      dbNumber = undefined;

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.MemoryType).toEqual(memoryType);
      expect(result.DBNumber).toEqual(null);
    });

    it("should create new S7Request and assign its properties and variables - if area type is not DB but there are DBNumber properties", () => {
      variable1MemoryType = "I";
      variable1DBNumber = 1;

      variable2MemoryType = "I";
      variable2DBNumber = 1;

      variable3MemoryType = "I";
      variable3DBNumber = 1;

      memoryType = "I";
      dbNumber = undefined;

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.MemoryType).toEqual(memoryType);
      expect(result.DBNumber).toEqual(null);
    });

    it("should create new S7Request and assign its properties and variables - if area type is not DB but dbNumber is given for request as arugment", () => {
      variable1MemoryType = "I";
      variable1DBNumber = undefined;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;

      memoryType = "I";
      dbNumber = 123;

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.MemoryType).toEqual(memoryType);
      expect(result.DBNumber).toEqual(null);
    });

    it("should throw - if there is a difference in memory types", async () => {
      variable2MemoryType = "I";

      expect(exec).toThrow(
        "Trying to assing variable with different MemoryType to S7 request"
      );
    });

    it("should throw - if there is a difference in dbNumber value when MemoryType is DB", async () => {
      variable2DBNumber = 2;

      expect(exec).toThrow(
        "Trying to assing variable with different DBNumber to S7 request"
      );
    });

    it("should not throw - if there is a difference in dbNumber value but MemoryType is not DB", async () => {
      variable1MemoryType = "I";
      variable1DBNumber = 1;

      variable2MemoryType = "I";
      variable2DBNumber = 2;

      variable3MemoryType = "I";
      variable3DBNumber = 3;

      memoryType = "I";
      dbNumber = 123;

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.MemoryType).toEqual(memoryType);
      expect(result.DBNumber).toEqual(null);
    });
  });
});
