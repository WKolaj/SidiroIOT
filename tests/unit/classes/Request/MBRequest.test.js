const MBRequest = require("../../../../classes/Request/MBRequest/MBRequest");
const { snooze } = require("../../../../utilities/utilities");
const { createFakeMBVariable } = require("../../../utilities/testUtilities");

describe("MBRequest", () => {
  describe("constructor", () => {
    let variable1;
    let variable1SampleTime;
    let variable1Offset;
    let variable1UnitID;
    let variable1Length;
    let variable1Read;
    let variable1ReadFCode;
    let variable1ReadAsSeperate;
    let variable1Write;
    let variable1WriteFCode;
    let variable1WriteAsSeperate;
    let addVariable1;

    let variable2;
    let variable2SampleTime;
    let variable2Offset;
    let variable2UnitID;
    let variable2Length;
    let variable2Read;
    let variable2ReadFCode;
    let variable2ReadAsSeperate;
    let variable2Write;
    let variable2WriteFCode;
    let variable2WriteAsSeperate;
    let addVariable2;

    let variable3;
    let variable3SampleTime;
    let variable3Offset;
    let variable3UnitID;
    let variable3Length;
    let variable3Read;
    let variable3ReadFCode;
    let variable3ReadAsSeperate;
    let variable3Write;
    let variable3WriteFCode;
    let variable3WriteAsSeperate;
    let addVariable3;

    let sampleTime;
    let writeRequest;
    let fCode;
    let unitID;

    beforeEach(() => {
      sampleTime = 15;
      writeRequest = false;
      fCode = 4;
      unitID = 1;

      addVariable1 = true;
      addVariable2 = true;
      addVariable3 = true;

      variable1SampleTime = 15;
      variable1Offset = 1;
      variable1UnitID = 1;
      variable1Length = 2;
      variable1Read = true;
      variable1ReadFCode = 4;
      variable1ReadAsSeperate = false;
      variable1Write = false;
      variable1WriteFCode = 16;
      variable1WriteAsSeperate = false;

      variable2SampleTime = 15;
      variable2Offset = 3;
      variable2UnitID = 1;
      variable2Length = 3;
      variable2Read = true;
      variable2ReadFCode = 4;
      variable2ReadAsSeperate = false;
      variable2Write = false;
      variable2WriteFCode = 16;
      variable2WriteAsSeperate = false;

      variable3SampleTime = 15;
      variable3Offset = 6;
      variable3UnitID = 1;
      variable3Length = 2;
      variable3Read = true;
      variable3ReadFCode = 4;
      variable3ReadAsSeperate = false;
      variable3Write = false;
      variable3WriteFCode = 16;
      variable3WriteAsSeperate = false;
    });

    let exec = () => {
      variable1 = createFakeMBVariable(
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
        variable1UnitID,
        variable1ReadFCode,
        variable1WriteFCode,
        variable1Read,
        variable1Write,
        variable1ReadAsSeperate,
        variable1WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variable2 = createFakeMBVariable(
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
        variable2UnitID,
        variable2ReadFCode,
        variable2WriteFCode,
        variable2Read,
        variable2Write,
        variable2ReadAsSeperate,
        variable2WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variable3 = createFakeMBVariable(
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
        variable3UnitID,
        variable3ReadFCode,
        variable3WriteFCode,
        variable3Read,
        variable3Write,
        variable3ReadAsSeperate,
        variable3WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variables = [];

      if (addVariable1) variables.push(variable1);
      if (addVariable2) variables.push(variable2);
      if (addVariable3) variables.push(variable3);

      return new MBRequest(variables, sampleTime, writeRequest, fCode, unitID);
    };

    it("should create new MBRequest and assign its variable and sampleTime", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.FCode).toEqual(fCode);
      expect(result.UnitID).toEqual(unitID);
    });

    it("should throw - if readFCode of one of variables is different than fCode of MBRequest and read is set to true", async () => {
      variable2ReadFCode = 2;
      expect(exec).toThrow(
        "Trying to assing variable with different fCode to Modbus request"
      );
    });

    it("should not throw - if readFCode of one of variables is different than fCode of MBRequest but read is set to false", () => {
      variable2ReadFCode = 2;

      variable1Read = false;
      variable2Read = false;
      variable3Read = false;

      variable1Write = true;
      variable2Write = true;
      variable3Write = true;

      writeRequest = true;

      fCode = 16;

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.FCode).toEqual(fCode);
      expect(result.UnitID).toEqual(unitID);
    });

    it("should throw - if writeFCode of one of variables is different than fCode of MBRequest and write is set to true", async () => {
      variable2WriteFCode = 20;

      variable1Read = false;
      variable2Read = false;
      variable3Read = false;

      variable1Write = true;
      variable2Write = true;
      variable3Write = true;

      writeRequest = true;

      fCode = 16;

      expect(exec).toThrow(
        "Trying to assing variable with different fCode to Modbus request"
      );
    });

    it("should not throw - if writeFCode of one of variables is different than fCode of MBRequest but write is set to false", () => {
      variable2WriteFCode = 2;

      variable1Read = true;
      variable2Read = true;
      variable3Read = true;

      variable1Write = false;
      variable2Write = false;
      variable3Write = false;

      writeRequest = false;

      fCode = 4;

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(writeRequest);
      expect(result.ReadRequest).toEqual(!writeRequest);
      expect(result.FCode).toEqual(fCode);
      expect(result.UnitID).toEqual(unitID);
    });

    it("should throw - if variable unitID is different than request unit ID", async () => {
      variable2UnitID = 2;

      expect(exec).toThrow(
        "Trying to assing variable with different UnitID to Modbus request"
      );
    });
  });
});
