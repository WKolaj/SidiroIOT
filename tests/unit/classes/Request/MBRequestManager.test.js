const { result } = require("lodash");
const MBRequestManager = require("../../../../classes/Request/MBRequest/MBRequestManager");
const { createFakeMBVariable } = require("../../../utilities/testUtilities");

describe("MBRequestManager", () => {
  describe("groupMBVariables", () => {
    let variable1;
    let variable2;
    let variable3;
    let variable4;
    let variable5;
    let variable6;
    let variable7;
    let variable8;
    let variable9;

    let variable1UnitId;
    let variable1ReadFCode;
    let variable1WriteFCode;
    let variable1Offset;
    let variable1Length;
    let variable1Write;
    let variable1Read;
    let variable1WriteSingle;
    let variable1ReadSingle;
    let variable1SampleTime;

    let variable2UnitId;
    let variable2ReadFCode;
    let variable2WriteFCode;
    let variable2Offset;
    let variable2Length;
    let variable2Write;
    let variable2Read;
    let variable2WriteSingle;
    let variable2ReadSingle;
    let variable2SampleTime;

    let variable3UnitId;
    let variable3ReadFCode;
    let variable3WriteFCode;
    let variable3Offset;
    let variable3Length;
    let variable3Write;
    let variable3Read;
    let variable3WriteSingle;
    let variable3ReadSingle;
    let variable3SampleTime;

    let variable4UnitId;
    let variable4ReadFCode;
    let variable4WriteFCode;
    let variable4Offset;
    let variable4Length;
    let variable4Write;
    let variable4Read;
    let variable4WriteSingle;
    let variable4ReadSingle;
    let variable4SampleTime;

    let variable5UnitId;
    let variable5ReadFCode;
    let variable5WriteFCode;
    let variable5Offset;
    let variable5Length;
    let variable5Write;
    let variable5Read;
    let variable5WriteSingle;
    let variable5ReadSingle;
    let variable5SampleTime;

    let variable6UnitId;
    let variable6ReadFCode;
    let variable6WriteFCode;
    let variable6Offset;
    let variable6Length;
    let variable6Write;
    let variable6Read;
    let variable6WriteSingle;
    let variable6ReadSingle;
    let variable6SampleTime;

    let variable7UnitId;
    let variable7ReadFCode;
    let variable7WriteFCode;
    let variable7Offset;
    let variable7Length;
    let variable7Write;
    let variable7Read;
    let variable7WriteSingle;
    let variable7ReadSingle;
    let variable7SampleTime;

    let variable8UnitId;
    let variable8ReadFCode;
    let variable8WriteFCode;
    let variable8Offset;
    let variable8Length;
    let variable8Write;
    let variable8Read;
    let variable8WriteSingle;
    let variable8ReadSingle;
    let variable8SampleTime;

    let variable9UnitId;
    let variable9ReadFCode;
    let variable9WriteFCode;
    let variable9Offset;
    let variable9Length;
    let variable9Write;
    let variable9Read;
    let variable9WriteSingle;
    let variable9ReadSingle;
    let variable9SampleTime;

    let variable10UnitId;
    let variable10ReadFCode;
    let variable10WriteFCode;
    let variable10Offset;
    let variable10Length;
    let variable10Write;
    let variable10Read;
    let variable10WriteSingle;
    let variable10ReadSingle;
    let variable10SampleTime;

    let variables;

    beforeEach(() => {
      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: UnitId: 1, FCode: 10
       *              var4: offset : 20, len: 1, sampleTime: 15
       *              var2: offset : 21, len: 2, sampleTime: 15,
       *              var6: offset : 24, len: 1, sampleTime: 15,
       *              var10: offset : 25, len: 1, sampleTime: 15, writeSingle: true
       *              var9: offset : 26, len: 1, sampleTime: 10
       */

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3UnitId = 1;
      variable3ReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = true;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable4WriteFCode = 10;
      variable4Offset = 20;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Offset = 21;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Offset = 24;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Offset = 25;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = true;
      variable10ReadSingle = false;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Offset = 26;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
    });

    let exec = () => {
      variable1 = createFakeMBVariable(
        null,
        null,
        "variabl1Id",
        "variable1Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable1SampleTime,
        [],
        variable1Offset,
        variable1Length,
        () => 0,
        () => [],
        variable1UnitId,
        variable1ReadFCode,
        variable1WriteFCode,
        variable1Read,
        variable1Write,
        variable1ReadSingle,
        variable1WriteSingle
      );
      variable2 = createFakeMBVariable(
        null,
        null,
        "variabl2Id",
        "variable2Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable2SampleTime,
        [],
        variable2Offset,
        variable2Length,
        () => 0,
        () => [],
        variable2UnitId,
        variable2ReadFCode,
        variable2WriteFCode,
        variable2Read,
        variable2Write,
        variable2ReadSingle,
        variable2WriteSingle
      );
      variable3 = createFakeMBVariable(
        null,
        null,
        "variabl3Id",
        "variable3Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable3SampleTime,
        [],
        variable3Offset,
        variable3Length,
        () => 0,
        () => [],
        variable3UnitId,
        variable3ReadFCode,
        variable3WriteFCode,
        variable3Read,
        variable3Write,
        variable3ReadSingle,
        variable3WriteSingle
      );
      variable4 = createFakeMBVariable(
        null,
        null,
        "variabl4Id",
        "variable4Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable4SampleTime,
        [],
        variable4Offset,
        variable4Length,
        () => 0,
        () => [],
        variable4UnitId,
        variable4ReadFCode,
        variable4WriteFCode,
        variable4Read,
        variable4Write,
        variable4ReadSingle,
        variable4WriteSingle
      );
      variable5 = createFakeMBVariable(
        null,
        null,
        "variabl5Id",
        "variable5Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable5SampleTime,
        [],
        variable5Offset,
        variable5Length,
        () => 0,
        () => [],
        variable5UnitId,
        variable5ReadFCode,
        variable5WriteFCode,
        variable5Read,
        variable5Write,
        variable5ReadSingle,
        variable5WriteSingle
      );
      variable6 = createFakeMBVariable(
        null,
        null,
        "variabl6Id",
        "variable6Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable6SampleTime,
        [],
        variable6Offset,
        variable6Length,
        () => 0,
        () => [],
        variable6UnitId,
        variable6ReadFCode,
        variable6WriteFCode,
        variable6Read,
        variable6Write,
        variable6ReadSingle,
        variable6WriteSingle
      );
      variable7 = createFakeMBVariable(
        null,
        null,
        "variabl7Id",
        "variable7Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable7SampleTime,
        [],
        variable7Offset,
        variable7Length,
        () => 0,
        () => [],
        variable7UnitId,
        variable7ReadFCode,
        variable7WriteFCode,
        variable7Read,
        variable7Write,
        variable7ReadSingle,
        variable7WriteSingle
      );
      variable8 = createFakeMBVariable(
        null,
        null,
        "variabl8Id",
        "variable8Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable8SampleTime,
        [],
        variable8Offset,
        variable8Length,
        () => 0,
        () => [],
        variable8UnitId,
        variable8ReadFCode,
        variable8WriteFCode,
        variable8Read,
        variable8Write,
        variable8ReadSingle,
        variable8WriteSingle
      );
      variable9 = createFakeMBVariable(
        null,
        null,
        "variabl9Id",
        "variable9Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable9SampleTime,
        [],
        variable9Offset,
        variable9Length,
        () => 0,
        () => [],
        variable9UnitId,
        variable9ReadFCode,
        variable9WriteFCode,
        variable9Read,
        variable9Write,
        variable9ReadSingle,
        variable9WriteSingle
      );
      variable10 = createFakeMBVariable(
        null,
        null,
        "variabl10Id",
        "variable10Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable10SampleTime,
        [],
        variable10Offset,
        variable10Length,
        () => 0,
        () => [],
        variable10UnitId,
        variable10ReadFCode,
        variable10WriteFCode,
        variable10Read,
        variable10Write,
        variable10ReadSingle,
        variable10WriteSingle
      );

      variables = [
        variable1,
        variable2,
        variable3,
        variable4,
        variable5,
        variable6,
        variable7,
        variable8,
        variable9,
        variable10,
      ];

      return MBRequestManager.groupMBVariables(variables);
    };

    it("should properly group variables based on UnitID, Read/Write, FCode, SampleTime, and proper offset/length", () => {
      let result = exec();

      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: UnitId: 1, FCode: 10
       *              var4: offset : 20, len: 1, sampleTime: 15
       *              var2: offset : 21, len: 2, sampleTime: 15,
       *              var6: offset : 24, len: 1, sampleTime: 15,
       *              var10: offset : 25, len: 1, sampleTime: 15, writeSingle: true
       *              var9: offset : 26, len: 1, sampleTime: 10
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7],
       *             [var5],
       *             [var3]
       *             [var8]
       *       ]
       *
       * write: [
       *             [var4,var2],
       *             [var6],
       *             [var10],
       *             [var9]
       *        ]
       *
       */

      let expectedResult = [
        [variable3],
        [variable10],
        [variable5],
        [variable8],
        [variable1, variable7],
        [variable9],
        [variable4, variable2],
        [variable6],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on UnitID, Read/Write, FCode, SampleTime, and proper offset/length - even if there is no variables", () => {
      let result = MBRequestManager.groupMBVariables([]);

      let expectedResult = [];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if all variables should be assigned to the same group (read) and are ordered", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if all variables should be assigned to the same group (read) and are out of order", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var5: offset : 2, len: 3, sampleTime: 10,
       *              var4: offset : 5, len: 5, sampleTime: 10,
       *              var3: offset : 10, len: 2, sampleTime: 10,
       *              var2: offset : 12, len: 4, sampleTime: 10
       *              var10: offset : 16, len: 6, sampleTime: 10
       *              var8: offset : 22, len: 8, sampleTime: 10,
       *              var7: offset : 30, len: 6, sampleTime: 10,
       *              var6: offset : 36, len: 5, sampleTime: 10,
       *              var9: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable5Offset = 2;
      variable5Length = 3;

      variable4Offset = 5;
      variable4Length = 5;

      variable3Offset = 10;
      variable3Length = 2;

      variable2Offset = 12;
      variable2Length = 4;

      variable10Offset = 16;
      variable10Length = 6;

      variable8Offset = 22;
      variable8Length = 8;

      variable7Offset = 30;
      variable7Length = 6;

      variable6Offset = 36;
      variable6Length = 5;

      variable9Offset = 41;
      variable9Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable5,
          variable4,
          variable3,
          variable2,
          variable10,
          variable8,
          variable7,
          variable6,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if all variables should be assigned to the same group (write) and are ordered", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if all variables should be assigned to the same group (write) and are out of order", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var5: offset : 2, len: 3, sampleTime: 10,
       *              var4: offset : 5, len: 5, sampleTime: 10,
       *              var3: offset : 10, len: 2, sampleTime: 10,
       *              var2: offset : 12, len: 4, sampleTime: 10
       *              var10: offset : 16, len: 6, sampleTime: 10
       *              var8: offset : 22, len: 8, sampleTime: 10,
       *              var7: offset : 30, len: 6, sampleTime: 10,
       *              var6: offset : 36, len: 5, sampleTime: 10,
       *              var9: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable5Offset = 2;
      variable5Length = 3;

      variable4Offset = 5;
      variable4Length = 5;

      variable3Offset = 10;
      variable3Length = 2;

      variable2Offset = 12;
      variable2Length = 4;

      variable10Offset = 16;
      variable10Length = 6;

      variable8Offset = 22;
      variable8Length = 8;

      variable7Offset = 30;
      variable7Length = 6;

      variable6Offset = 36;
      variable6Length = 5;

      variable9Offset = 41;
      variable9Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable5,
          variable4,
          variable3,
          variable2,
          variable10,
          variable8,
          variable7,
          variable6,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a gap between variables (read) and variables are stored in order", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       * //GAP
       *              var5: offset : 13, len: 4, sampleTime: 10
       *              var6: offset : 17, len: 6, sampleTime: 10
       *              var7: offset : 23, len: 8, sampleTime: 10,
       *              var8: offset : 31, len: 6, sampleTime: 10,
       *              var9: offset : 37, len: 5, sampleTime: 10,
       *              var10: offset : 42, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 13;
      variable5Length = 4;

      variable6Offset = 17;
      variable6Length = 6;

      variable7Offset = 23;
      variable7Length = 8;

      variable8Offset = 31;
      variable8Length = 6;

      variable9Offset = 37;
      variable9Length = 5;

      variable10Offset = 42;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4],
        [variable5, variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a gap between variables (read) and variables are stored out of order", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var5: offset : 2, len: 3, sampleTime: 10,
       *              var4: offset : 5, len: 5, sampleTime: 10,
       *              var3: offset : 10, len: 2, sampleTime: 10,
       * //GAP
       *              var2: offset : 13, len: 4, sampleTime: 10
       *              var10: offset : 17, len: 6, sampleTime: 10
       *              var8: offset : 23, len: 8, sampleTime: 10,
       *              var7: offset : 31, len: 6, sampleTime: 10,
       *              var6: offset : 37, len: 5, sampleTime: 10,
       *              var9: offset : 42, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable5Offset = 2;
      variable5Length = 3;

      variable4Offset = 5;
      variable4Length = 5;

      variable3Offset = 10;
      variable3Length = 2;

      variable2Offset = 13;
      variable2Length = 4;

      variable10Offset = 17;
      variable10Length = 6;

      variable8Offset = 23;
      variable8Length = 8;

      variable7Offset = 31;
      variable7Length = 6;

      variable6Offset = 37;
      variable6Length = 5;

      variable9Offset = 42;
      variable9Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable5, variable4, variable3],
        [variable2, variable10, variable8, variable7, variable6, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a gap between variables (write) and variables are stored in order", () => {
      /**
       *
       * write: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       * //GAP
       *              var5: offset : 13, len: 4, sampleTime: 10
       *              var6: offset : 17, len: 6, sampleTime: 10
       *              var7: offset : 23, len: 8, sampleTime: 10,
       *              var8: offset : 31, len: 6, sampleTime: 10,
       *              var9: offset : 37, len: 5, sampleTime: 10,
       *              var10: offset : 42, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 13;
      variable5Length = 4;

      variable6Offset = 17;
      variable6Length = 6;

      variable7Offset = 23;
      variable7Length = 8;

      variable8Offset = 31;
      variable8Length = 6;

      variable9Offset = 37;
      variable9Length = 5;

      variable10Offset = 42;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4],
        [variable5, variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a gap between variables (write) and variables are stored out of order", () => {
      /**
       *
       * write: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var5: offset : 2, len: 3, sampleTime: 10,
       *              var4: offset : 5, len: 5, sampleTime: 10,
       *              var3: offset : 10, len: 2, sampleTime: 10,
       * //GAP
       *              var2: offset : 13, len: 4, sampleTime: 10
       *              var10: offset : 17, len: 6, sampleTime: 10
       *              var8: offset : 23, len: 8, sampleTime: 10,
       *              var7: offset : 31, len: 6, sampleTime: 10,
       *              var6: offset : 37, len: 5, sampleTime: 10,
       *              var9: offset : 42, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable5Offset = 2;
      variable5Length = 3;

      variable4Offset = 5;
      variable4Length = 5;

      variable3Offset = 10;
      variable3Length = 2;

      variable2Offset = 13;
      variable2Length = 4;

      variable10Offset = 17;
      variable10Length = 6;

      variable8Offset = 23;
      variable8Length = 8;

      variable7Offset = 31;
      variable7Length = 6;

      variable6Offset = 37;
      variable6Length = 5;

      variable9Offset = 42;
      variable9Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable5, variable4, variable3],
        [variable2, variable10, variable8, variable7, variable6, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a difference between unitIDs in variables (read)", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10,
       * read: UnitId: 2, FCode: 4
       *              var6: offset : 16, len: 6, sampleTime: 10,
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 2;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 2;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 2;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 2;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 2;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4, variable5],
        [variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a difference between unitIDs in variables (write)", () => {
      /**
       *
       * write: UnitId: 1, FCode: 10
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10,
       * write: UnitId: 2, FCode: 10
       *              var6: offset : 16, len: 6, sampleTime: 10,
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 2;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 2;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 2;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 2;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 2;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4, variable5],
        [variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a difference between FCode (read)", () => {
      /**
       *
       * read: UnitId: 1, FCode: 3
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10,
       * read: UnitId: 1, FCode: 4
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 3;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 3;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variable3ReadFCode = 3;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 3;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 3;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4, variable5],
        [variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a difference between FCode (write)", () => {
      /**
       *
       * write: UnitId: 1, FCode: 10
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10,
       * write: UnitId: 1, FCode: 15
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variable3ReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4, variable5],
        [variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a difference between sampleTime (read)", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10
       *              var6: offset : 16, len: 6, sampleTime: 15
       *              var7: offset : 22, len: 8, sampleTime: 15,
       *              var8: offset : 30, len: 6, sampleTime: 15,
       *              var9: offset : 36, len: 5, sampleTime: 15,
       *              var10: offset : 41, len: 4, sampleTime: 15
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 15;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 15;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 15;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 15;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 15;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4, variable5],
        [variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there is a difference between sampleTime (write)", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10
       *              var6: offset : 16, len: 6, sampleTime: 15
       *              var7: offset : 22, len: 8, sampleTime: 15,
       *              var8: offset : 30, len: 6, sampleTime: 15,
       *              var9: offset : 36, len: 5, sampleTime: 15,
       *              var10: offset : 41, len: 4, sampleTime: 15
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 15;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 15;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 15;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 15;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 15;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable1, variable2, variable3, variable4, variable5],
        [variable6, variable7, variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if some variables are marked as ReadSeperately (read) and are ordered", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10, <-- read seperately
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10, <-- read seperately
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = true;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = true;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable3],
        [variable7],
        [variable1, variable2],
        [variable4, variable5, variable6],
        [variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if some variables are marked as ReadSeperately (write) and are ordered", () => {
      /**
       *
       * write: UnitId: 1, FCode: 10
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10, <-- write seperately
       *              var4: offset : 10, len: 2, sampleTime: 10,
       *              var5: offset : 12, len: 4, sampleTime: 10
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10, <-- write seperately
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 2;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = true;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = true;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [variable3],
        [variable7],
        [variable1, variable2],
        [variable4, variable5, variable6],
        [variable8, variable9, variable10],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there are some variables with overlapped range totally (read)", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 6, sampleTime: 10, <-- overlapped range
       *              var5: offset : 12, len: 4, sampleTime: 10, <-- overlapped range
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 6;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there are some variables with overlapped partially (read)", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 4, sampleTime: 10, <-- overlap
       *              var5: offset : 12, len: 4, sampleTime: 10  <-- overlap
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 4;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there are some variables with overlapped range totally (write)", () => {
      /**
       *
       * write: UnitId: 1, FCode: 10
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 6, sampleTime: 10, <-- overlapped range
       *              var5: offset : 12, len: 4, sampleTime: 10, <-- overlapped range
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 6;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there are some variables with overlapped partially (write)", () => {
      /**
       *
       * write: UnitId: 1, FCode: 10
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 4, sampleTime: 10, <-- overlap
       *              var5: offset : 12, len: 4, sampleTime: 10  <-- overlap
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 4;

      variable5Offset = 12;
      variable5Length = 4;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there are some variables with overlapped range totally and overlapping variable is much shorter (read)", () => {
      /**
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 6, sampleTime: 10, <-- overlapped range
       *              var5: offset : 12, len: 2, sampleTime: 10, <-- overlapped range, shorter one
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 6;

      variable5Offset = 12;
      variable5Length = 2;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables if there are some variables with overlapped range totally and overlapping variable is much shorter (write)", () => {
      /**
       *
       * write: UnitId: 1, FCode: 10
       *              var1: offset : 1, len: 1, sampleTime: 10
       *              var2: offset : 2, len: 3, sampleTime: 10,
       *              var3: offset : 5, len: 5, sampleTime: 10,
       *              var4: offset : 10, len: 6, sampleTime: 10, <-- overlapped range
       *              var5: offset : 12, len: 2, sampleTime: 10, <-- overlapped range, shorter one
       *              var6: offset : 16, len: 6, sampleTime: 10
       *              var7: offset : 22, len: 8, sampleTime: 10,
       *              var8: offset : 30, len: 6, sampleTime: 10,
       *              var9: offset : 36, len: 5, sampleTime: 10,
       *              var10: offset : 41, len: 4, sampleTime: 10
       */

      //#region Assing variable value

      variable1Offset = 1;
      variable1Length = 1;

      variable2Offset = 2;
      variable2Length = 3;

      variable3Offset = 5;
      variable3Length = 5;

      variable4Offset = 10;
      variable4Length = 6;

      variable5Offset = 12;
      variable5Length = 2;

      variable6Offset = 16;
      variable6Length = 6;

      variable7Offset = 22;
      variable7Length = 8;

      variable8Offset = 30;
      variable8Length = 6;

      variable9Offset = 36;
      variable9Length = 5;

      variable10Offset = 41;
      variable10Length = 4;

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 10;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;
      variable1SampleTime = 10;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;
      variable2SampleTime = 10;

      variable3UnitId = 1;
      variableReadFCode = 4;
      variable3WriteFCode = 10;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;
      variable3SampleTime = 10;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable41WriteFCode = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;
      variable4SampleTime = 10;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 10;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;
      variable5SampleTime = 10;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;
      variable6SampleTime = 10;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 10;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;
      variable7SampleTime = 10;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 10;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;
      variable8SampleTime = 10;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
      variable9SampleTime = 10;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;
      variable10SampleTime = 10;

      //#endregion Assing variable value

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable2,
          variable3,
          variable4,
          variable5,
          variable6,
          variable7,
          variable8,
          variable9,
          variable10,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("createRequests", () => {
    let initialRequests;

    let variable1;
    let variable2;
    let variable3;
    let variable4;
    let variable5;
    let variable6;
    let variable7;
    let variable8;
    let variable9;
    let variable10;

    let addVariable1;
    let addVariable2;
    let addVariable3;
    let addVariable4;
    let addVariable5;
    let addVariable6;
    let addVariable7;
    let addVariable8;
    let addVariable9;
    let addVariable10;

    let variable1UnitId;
    let variable1ReadFCode;
    let variable1WriteFCode;
    let variable1Offset;
    let variable1Length;
    let variable1Write;
    let variable1Read;
    let variable1WriteSingle;
    let variable1ReadSingle;
    let variable1SampleTime;

    let variable2UnitId;
    let variable2ReadFCode;
    let variable2WriteFCode;
    let variable2Offset;
    let variable2Length;
    let variable2Write;
    let variable2Read;
    let variable2WriteSingle;
    let variable2ReadSingle;
    let variable2SampleTime;

    let variable3UnitId;
    let variable3ReadFCode;
    let variable3WriteFCode;
    let variable3Offset;
    let variable3Length;
    let variable3Write;
    let variable3Read;
    let variable3WriteSingle;
    let variable3ReadSingle;
    let variable3SampleTime;

    let variable4UnitId;
    let variable4ReadFCode;
    let variable4WriteFCode;
    let variable4Offset;
    let variable4Length;
    let variable4Write;
    let variable4Read;
    let variable4WriteSingle;
    let variable4ReadSingle;
    let variable4SampleTime;

    let variable5UnitId;
    let variable5ReadFCode;
    let variable5WriteFCode;
    let variable5Offset;
    let variable5Length;
    let variable5Write;
    let variable5Read;
    let variable5WriteSingle;
    let variable5ReadSingle;
    let variable5SampleTime;

    let variable6UnitId;
    let variable6ReadFCode;
    let variable6WriteFCode;
    let variable6Offset;
    let variable6Length;
    let variable6Write;
    let variable6Read;
    let variable6WriteSingle;
    let variable6ReadSingle;
    let variable6SampleTime;

    let variable7UnitId;
    let variable7ReadFCode;
    let variable7WriteFCode;
    let variable7Offset;
    let variable7Length;
    let variable7Write;
    let variable7Read;
    let variable7WriteSingle;
    let variable7ReadSingle;
    let variable7SampleTime;

    let variable8UnitId;
    let variable8ReadFCode;
    let variable8WriteFCode;
    let variable8Offset;
    let variable8Length;
    let variable8Write;
    let variable8Read;
    let variable8WriteSingle;
    let variable8ReadSingle;
    let variable8SampleTime;

    let variable9UnitId;
    let variable9ReadFCode;
    let variable9WriteFCode;
    let variable9Offset;
    let variable9Length;
    let variable9Write;
    let variable9Read;
    let variable9WriteSingle;
    let variable9ReadSingle;
    let variable9SampleTime;

    let variable10UnitId;
    let variable10ReadFCode;
    let variable10WriteFCode;
    let variable10Offset;
    let variable10Length;
    let variable10Write;
    let variable10Read;
    let variable10WriteSingle;
    let variable10ReadSingle;
    let variable10SampleTime;

    let variables;

    let requestManager;

    beforeEach(() => {
      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: UnitId: 1, FCode: 10
       *              var4: offset : 20, len: 1, sampleTime: 15
       *              var2: offset : 21, len: 2, sampleTime: 15,
       *              var6: offset : 24, len: 1, sampleTime: 15,
       *              var10: offset : 25, len: 1, sampleTime: 15, writeSingle: true
       *              var9: offset : 26, len: 1, sampleTime: 10
       */

      variable1UnitId = 1;
      variable1ReadFCode = 4;
      variable1WriteFCode = 16;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7UnitId = 1;
      variable7ReadFCode = 4;
      variable7WriteFCode = 16;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5UnitId = 1;
      variable5ReadFCode = 4;
      variable5WriteFCode = 16;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3UnitId = 1;
      variable3ReadFCode = 4;
      variable3WriteFCode = 16;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = true;

      variable8UnitId = 1;
      variable8ReadFCode = 4;
      variable8WriteFCode = 16;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4UnitId = 1;
      variable4ReadFCode = 4;
      variable4WriteFCode = 16;
      variable4Offset = 20;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2UnitId = 1;
      variable2ReadFCode = 4;
      variable2WriteFCode = 16;
      variable2Offset = 21;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6UnitId = 1;
      variable6ReadFCode = 4;
      variable6WriteFCode = 16;
      variable6Offset = 24;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10UnitId = 1;
      variable10ReadFCode = 4;
      variable10WriteFCode = 16;
      variable10Offset = 25;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = true;
      variable10ReadSingle = false;

      variable9UnitId = 1;
      variable9ReadFCode = 4;
      variable9WriteFCode = 16;
      variable9Offset = 26;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      addVariable1 = true;
      addVariable2 = true;
      addVariable3 = true;
      addVariable4 = true;
      addVariable5 = true;
      addVariable6 = true;
      addVariable7 = true;
      addVariable8 = true;
      addVariable9 = true;
      addVariable10 = true;

      initialRequests = [];
    });

    let exec = () => {
      variable1 = createFakeMBVariable(
        null,
        null,
        "variabl1Id",
        "variable1Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable1SampleTime,
        [],
        variable1Offset,
        variable1Length,
        () => 0,
        () => [],
        variable1UnitId,
        variable1ReadFCode,
        variable1WriteFCode,
        variable1Read,
        variable1Write,
        variable1ReadSingle,
        variable1WriteSingle
      );
      variable2 = createFakeMBVariable(
        null,
        null,
        "variabl2Id",
        "variable2Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable2SampleTime,
        [],
        variable2Offset,
        variable2Length,
        () => 0,
        () => [],
        variable2UnitId,
        variable2ReadFCode,
        variable2WriteFCode,
        variable2Read,
        variable2Write,
        variable2ReadSingle,
        variable2WriteSingle
      );
      variable3 = createFakeMBVariable(
        null,
        null,
        "variabl3Id",
        "variable3Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable3SampleTime,
        [],
        variable3Offset,
        variable3Length,
        () => 0,
        () => [],
        variable3UnitId,
        variable3ReadFCode,
        variable3WriteFCode,
        variable3Read,
        variable3Write,
        variable3ReadSingle,
        variable3WriteSingle
      );
      variable4 = createFakeMBVariable(
        null,
        null,
        "variabl4Id",
        "variable4Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable4SampleTime,
        [],
        variable4Offset,
        variable4Length,
        () => 0,
        () => [],
        variable4UnitId,
        variable4ReadFCode,
        variable4WriteFCode,
        variable4Read,
        variable4Write,
        variable4ReadSingle,
        variable4WriteSingle
      );
      variable5 = createFakeMBVariable(
        null,
        null,
        "variabl5Id",
        "variable5Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable5SampleTime,
        [],
        variable5Offset,
        variable5Length,
        () => 0,
        () => [],
        variable5UnitId,
        variable5ReadFCode,
        variable5WriteFCode,
        variable5Read,
        variable5Write,
        variable5ReadSingle,
        variable5WriteSingle
      );
      variable6 = createFakeMBVariable(
        null,
        null,
        "variabl6Id",
        "variable6Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable6SampleTime,
        [],
        variable6Offset,
        variable6Length,
        () => 0,
        () => [],
        variable6UnitId,
        variable6ReadFCode,
        variable6WriteFCode,
        variable6Read,
        variable6Write,
        variable6ReadSingle,
        variable6WriteSingle
      );
      variable7 = createFakeMBVariable(
        null,
        null,
        "variabl7Id",
        "variable7Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable7SampleTime,
        [],
        variable7Offset,
        variable7Length,
        () => 0,
        () => [],
        variable7UnitId,
        variable7ReadFCode,
        variable7WriteFCode,
        variable7Read,
        variable7Write,
        variable7ReadSingle,
        variable7WriteSingle
      );
      variable8 = createFakeMBVariable(
        null,
        null,
        "variabl8Id",
        "variable8Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable8SampleTime,
        [],
        variable8Offset,
        variable8Length,
        () => 0,
        () => [],
        variable8UnitId,
        variable8ReadFCode,
        variable8WriteFCode,
        variable8Read,
        variable8Write,
        variable8ReadSingle,
        variable8WriteSingle
      );
      variable9 = createFakeMBVariable(
        null,
        null,
        "variabl9Id",
        "variable9Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable9SampleTime,
        [],
        variable9Offset,
        variable9Length,
        () => 0,
        () => [],
        variable9UnitId,
        variable9ReadFCode,
        variable9WriteFCode,
        variable9Read,
        variable9Write,
        variable9ReadSingle,
        variable9WriteSingle
      );
      variable10 = createFakeMBVariable(
        null,
        null,
        "variabl10Id",
        "variable10Name",
        "FakeMBVariable",
        0,
        "FakeUnit",
        variable10SampleTime,
        [],
        variable10Offset,
        variable10Length,
        () => 0,
        () => [],
        variable10UnitId,
        variable10ReadFCode,
        variable10WriteFCode,
        variable10Read,
        variable10Write,
        variable10ReadSingle,
        variable10WriteSingle
      );

      variables = [];

      if (addVariable1) variables.push(variable1);
      if (addVariable2) variables.push(variable2);
      if (addVariable3) variables.push(variable3);
      if (addVariable4) variables.push(variable4);
      if (addVariable5) variables.push(variable5);
      if (addVariable6) variables.push(variable6);
      if (addVariable7) variables.push(variable7);
      if (addVariable8) variables.push(variable8);
      if (addVariable9) variables.push(variable9);
      if (addVariable10) variables.push(variable10);

      requestManager = new MBRequestManager();
      requestManager._requests = initialRequests;

      return requestManager.createRequests(variables);
    };

    it("should divide variables into group and create requests based on created groups", async () => {
      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: UnitId: 1, FCode: 4
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: UnitId: 1, FCode: 16
       *              var4: offset : 20, len: 1, sampleTime: 15
       *              var2: offset : 21, len: 2, sampleTime: 15,
       *              var6: offset : 24, len: 1, sampleTime: 15,
       *              var10: offset : 25, len: 1, sampleTime: 15, writeSingle: true
       *              var9: offset : 26, len: 1, sampleTime: 10
       */

      await exec();

      expect(requestManager.Requests).toBeDefined();

      //8 requests should be created
      // 0) offset: 8, length: 2, sampleTime: 10, read: true, write: false, fCode: 4, variables: var3
      // 1) offset: 25, length: 1, sampleTime: 15, read: false, write: true, fCode: 16, variables: var10
      // 2) offset: 6, length: 2, sampleTime: 10, read: true, write: false, fCode: 4, variables: var5
      // 3) offset: 10, length: 1, sampleTime: 10, read: true, write: false, fCode: 4, variables: var8
      // 4) offset: 1, length: 5, sampleTime: 15, read: true, write: false, fCode: 4, variables: var1, var7
      // 5) offset: 26, length: 1, sampleTime: 10, read: false, write: true, fCode: 16, variables: var9
      // 6) offset: 20, length: 3, sampleTime: 15, read: false, write: true, fCode: 16, variables: var4,var2
      // 7) offset: 24, length: 1, sampleTime: 15, read: false, write: true, fCode: 16, variables: var6

      expect(requestManager.Requests.length).toEqual(8);

      expect(requestManager.Requests[0].Offset).toEqual(8);
      expect(requestManager.Requests[0].Length).toEqual(2);
      expect(requestManager.Requests[0].SampleTime).toEqual(10);
      expect(requestManager.Requests[0].ReadRequest).toEqual(true);
      expect(requestManager.Requests[0].WriteRequest).toEqual(false);
      expect(requestManager.Requests[0].FCode).toEqual(4);
      expect(requestManager.Requests[0].Variables).toEqual([variable3]);

      expect(requestManager.Requests[1].Offset).toEqual(25);
      expect(requestManager.Requests[1].Length).toEqual(1);
      expect(requestManager.Requests[1].SampleTime).toEqual(15);
      expect(requestManager.Requests[1].ReadRequest).toEqual(false);
      expect(requestManager.Requests[1].WriteRequest).toEqual(true);
      expect(requestManager.Requests[1].FCode).toEqual(16);
      expect(requestManager.Requests[1].Variables).toEqual([variable10]);

      expect(requestManager.Requests[2].Offset).toEqual(6);
      expect(requestManager.Requests[2].Length).toEqual(2);
      expect(requestManager.Requests[2].SampleTime).toEqual(10);
      expect(requestManager.Requests[2].ReadRequest).toEqual(true);
      expect(requestManager.Requests[2].WriteRequest).toEqual(false);
      expect(requestManager.Requests[2].FCode).toEqual(4);
      expect(requestManager.Requests[2].Variables).toEqual([variable5]);

      expect(requestManager.Requests[3].Offset).toEqual(10);
      expect(requestManager.Requests[3].Length).toEqual(1);
      expect(requestManager.Requests[3].SampleTime).toEqual(10);
      expect(requestManager.Requests[3].ReadRequest).toEqual(true);
      expect(requestManager.Requests[3].WriteRequest).toEqual(false);
      expect(requestManager.Requests[3].FCode).toEqual(4);
      expect(requestManager.Requests[3].Variables).toEqual([variable8]);

      expect(requestManager.Requests[4].Offset).toEqual(1);
      expect(requestManager.Requests[4].Length).toEqual(5);
      expect(requestManager.Requests[4].SampleTime).toEqual(15);
      expect(requestManager.Requests[4].ReadRequest).toEqual(true);
      expect(requestManager.Requests[4].WriteRequest).toEqual(false);
      expect(requestManager.Requests[4].FCode).toEqual(4);
      expect(requestManager.Requests[4].Variables).toEqual([
        variable1,
        variable7,
      ]);

      expect(requestManager.Requests[5].Offset).toEqual(26);
      expect(requestManager.Requests[5].Length).toEqual(1);
      expect(requestManager.Requests[5].SampleTime).toEqual(10);
      expect(requestManager.Requests[5].ReadRequest).toEqual(false);
      expect(requestManager.Requests[5].WriteRequest).toEqual(true);
      expect(requestManager.Requests[5].FCode).toEqual(16);
      expect(requestManager.Requests[5].Variables).toEqual([variable9]);

      expect(requestManager.Requests[6].Offset).toEqual(20);
      expect(requestManager.Requests[6].Length).toEqual(3);
      expect(requestManager.Requests[6].SampleTime).toEqual(15);
      expect(requestManager.Requests[6].ReadRequest).toEqual(false);
      expect(requestManager.Requests[6].WriteRequest).toEqual(true);
      expect(requestManager.Requests[6].FCode).toEqual(16);
      expect(requestManager.Requests[6].Variables).toEqual([
        variable4,
        variable2,
      ]);

      expect(requestManager.Requests[7].Offset).toEqual(24);
      expect(requestManager.Requests[7].Length).toEqual(1);
      expect(requestManager.Requests[7].SampleTime).toEqual(15);
      expect(requestManager.Requests[7].ReadRequest).toEqual(false);
      expect(requestManager.Requests[7].WriteRequest).toEqual(true);
      expect(requestManager.Requests[7].FCode).toEqual(16);
      expect(requestManager.Requests[7].Variables).toEqual([variable6]);
    });

    it("should divide variables into group  - if there are no variables", async () => {
      addVariable1 = false;
      addVariable2 = false;
      addVariable3 = false;
      addVariable4 = false;
      addVariable5 = false;
      addVariable6 = false;
      addVariable7 = false;
      addVariable8 = false;
      addVariable9 = false;
      addVariable10 = false;

      await exec();

      expect(requestManager.Requests).toBeDefined();

      expect(requestManager.Requests).toEqual([]);
    });

    it("should override requests - if the already exists", async () => {
      initialRequest = ["fake", "requests", "array"];
      await exec();

      expect(requestManager.Requests).toBeDefined();

      //8 requests should be created
      // 0) offset: 8, length: 2, sampleTime: 10, read: true, write: false, fCode: 4, variables: var3
      // 1) offset: 25, length: 1, sampleTime: 15, read: false, write: true, fCode: 16, variables: var10
      // 2) offset: 6, length: 2, sampleTime: 10, read: true, write: false, fCode: 4, variables: var5
      // 3) offset: 10, length: 1, sampleTime: 10, read: true, write: false, fCode: 4, variables: var8
      // 4) offset: 1, length: 5, sampleTime: 15, read: true, write: false, fCode: 4, variables: var1, var7
      // 5) offset: 26, length: 1, sampleTime: 10, read: false, write: true, fCode: 16, variables: var9
      // 6) offset: 20, length: 3, sampleTime: 15, read: false, write: true, fCode: 16, variables: var4,var2
      // 7) offset: 24, length: 1, sampleTime: 15, read: false, write: true, fCode: 16, variables: var6

      expect(requestManager.Requests.length).toEqual(8);

      expect(requestManager.Requests[0].Offset).toEqual(8);
      expect(requestManager.Requests[0].Length).toEqual(2);
      expect(requestManager.Requests[0].SampleTime).toEqual(10);
      expect(requestManager.Requests[0].ReadRequest).toEqual(true);
      expect(requestManager.Requests[0].WriteRequest).toEqual(false);
      expect(requestManager.Requests[0].FCode).toEqual(4);
      expect(requestManager.Requests[0].Variables).toEqual([variable3]);

      expect(requestManager.Requests[1].Offset).toEqual(25);
      expect(requestManager.Requests[1].Length).toEqual(1);
      expect(requestManager.Requests[1].SampleTime).toEqual(15);
      expect(requestManager.Requests[1].ReadRequest).toEqual(false);
      expect(requestManager.Requests[1].WriteRequest).toEqual(true);
      expect(requestManager.Requests[1].FCode).toEqual(16);
      expect(requestManager.Requests[1].Variables).toEqual([variable10]);

      expect(requestManager.Requests[2].Offset).toEqual(6);
      expect(requestManager.Requests[2].Length).toEqual(2);
      expect(requestManager.Requests[2].SampleTime).toEqual(10);
      expect(requestManager.Requests[2].ReadRequest).toEqual(true);
      expect(requestManager.Requests[2].WriteRequest).toEqual(false);
      expect(requestManager.Requests[2].FCode).toEqual(4);
      expect(requestManager.Requests[2].Variables).toEqual([variable5]);

      expect(requestManager.Requests[3].Offset).toEqual(10);
      expect(requestManager.Requests[3].Length).toEqual(1);
      expect(requestManager.Requests[3].SampleTime).toEqual(10);
      expect(requestManager.Requests[3].ReadRequest).toEqual(true);
      expect(requestManager.Requests[3].WriteRequest).toEqual(false);
      expect(requestManager.Requests[3].FCode).toEqual(4);
      expect(requestManager.Requests[3].Variables).toEqual([variable8]);

      expect(requestManager.Requests[4].Offset).toEqual(1);
      expect(requestManager.Requests[4].Length).toEqual(5);
      expect(requestManager.Requests[4].SampleTime).toEqual(15);
      expect(requestManager.Requests[4].ReadRequest).toEqual(true);
      expect(requestManager.Requests[4].WriteRequest).toEqual(false);
      expect(requestManager.Requests[4].FCode).toEqual(4);
      expect(requestManager.Requests[4].Variables).toEqual([
        variable1,
        variable7,
      ]);

      expect(requestManager.Requests[5].Offset).toEqual(26);
      expect(requestManager.Requests[5].Length).toEqual(1);
      expect(requestManager.Requests[5].SampleTime).toEqual(10);
      expect(requestManager.Requests[5].ReadRequest).toEqual(false);
      expect(requestManager.Requests[5].WriteRequest).toEqual(true);
      expect(requestManager.Requests[5].FCode).toEqual(16);
      expect(requestManager.Requests[5].Variables).toEqual([variable9]);

      expect(requestManager.Requests[6].Offset).toEqual(20);
      expect(requestManager.Requests[6].Length).toEqual(3);
      expect(requestManager.Requests[6].SampleTime).toEqual(15);
      expect(requestManager.Requests[6].ReadRequest).toEqual(false);
      expect(requestManager.Requests[6].WriteRequest).toEqual(true);
      expect(requestManager.Requests[6].FCode).toEqual(16);
      expect(requestManager.Requests[6].Variables).toEqual([
        variable4,
        variable2,
      ]);

      expect(requestManager.Requests[7].Offset).toEqual(24);
      expect(requestManager.Requests[7].Length).toEqual(1);
      expect(requestManager.Requests[7].SampleTime).toEqual(15);
      expect(requestManager.Requests[7].ReadRequest).toEqual(false);
      expect(requestManager.Requests[7].WriteRequest).toEqual(true);
      expect(requestManager.Requests[7].FCode).toEqual(16);
      expect(requestManager.Requests[7].Variables).toEqual([variable6]);
    });
  });
});
