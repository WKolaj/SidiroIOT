const S7RequestManager = require("../../../../classes/Request/S7Request/S7RequestManager");
const {
  createFakeS7Variable,
  testS7Request,
} = require("../../../utilities/testUtilities");

describe("S7RequestManager", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("groupS7Variables", () => {
    //#region VARIABLES

    let variable1;
    let variable2;
    let variable3;
    let variable4;
    let variable5;
    let variable6;
    let variable7;
    let variable8;
    let variable9;

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

    let variable1MemoryType;
    let variable1DBNumber;
    let variable1Offset;
    let variable1Length;
    let variable1Write;
    let variable1Read;
    let variable1WriteSingle;
    let variable1ReadSingle;
    let variable1SampleTime;

    let variable2MemoryType;
    let variable2DBNumber;
    let variable2Offset;
    let variable2Length;
    let variable2Write;
    let variable2Read;
    let variable2WriteSingle;
    let variable2ReadSingle;
    let variable2SampleTime;

    let variable3MemoryType;
    let variable3DBNumber;
    let variable3Offset;
    let variable3Length;
    let variable3Write;
    let variable3Read;
    let variable3WriteSingle;
    let variable3ReadSingle;
    let variable3SampleTime;

    let variable4MemoryType;
    let variable4DBNumber;
    let variable4Offset;
    let variable4Length;
    let variable4Write;
    let variable4Read;
    let variable4WriteSingle;
    let variable4ReadSingle;
    let variable4SampleTime;

    let variable5MemoryType;
    let variable5DBNumber;
    let variable5Offset;
    let variable5Length;
    let variable5Write;
    let variable5Read;
    let variable5WriteSingle;
    let variable5ReadSingle;
    let variable5SampleTime;

    let variable6MemoryType;
    let variable6DBNumber;
    let variable6Offset;
    let variable6Length;
    let variable6Write;
    let variable6Read;
    let variable6WriteSingle;
    let variable6ReadSingle;
    let variable6SampleTime;

    let variable7MemoryType;
    let variable7DBNumber;
    let variable7Offset;
    let variable7Length;
    let variable7Write;
    let variable7Read;
    let variable7WriteSingle;
    let variable7ReadSingle;
    let variable7SampleTime;

    let variable8MemoryType;
    let variable8DBNumber;
    let variable8Offset;
    let variable8Length;
    let variable8Write;
    let variable8Read;
    let variable8WriteSingle;
    let variable8ReadSingle;
    let variable8SampleTime;

    let variable9MemoryType;
    let variable9DBNumber;
    let variable9Offset;
    let variable9Length;
    let variable9Write;
    let variable9Read;
    let variable9WriteSingle;
    let variable9ReadSingle;
    let variable9SampleTime;

    let variable10MemoryType;
    let variable10DBNumber;
    let variable10Offset;
    let variable10Length;
    let variable10Write;
    let variable10Read;
    let variable10WriteSingle;
    let variable10ReadSingle;
    let variable10SampleTime;

    let variables;

    //#endregion VARIABLES

    beforeEach(() => {
      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: AreaType: Q, DBNumber: undefined
       *              var4: offset : 20, len: 1, sampleTime: 15
       *              var2: offset : 21, len: 2, sampleTime: 15,
       *              var6: offset : 24, len: 1, sampleTime: 15,
       *              var10: offset : 25, len: 1, sampleTime: 15, writeSingle: true
       *              var9: offset : 26, len: 1, sampleTime: 10
       */

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

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = true;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "Q";
      variable4DBNumber = undefined;
      variable4Offset = 20;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "Q";
      variable2DBNumber = undefined;
      variable2Offset = 21;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "Q";
      variable6DBNumber = undefined;
      variable6Offset = 24;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "Q";
      variable10DBNumber = undefined;
      variable10Offset = 25;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = true;
      variable10ReadSingle = false;

      variable9MemoryType = "Q";
      variable9DBNumber = undefined;
      variable9Offset = 26;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
    });

    let exec = () => {
      variable1 = createFakeS7Variable(
        null,
        null,
        "variable1Id",
        "variable1Name",
        "FakeS7Variable",
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
        variable1ReadSingle,
        variable1WriteSingle
      );

      variable2 = createFakeS7Variable(
        null,
        null,
        "variable2Id",
        "variable2Name",
        "FakeS7Variable",
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
        variable2ReadSingle,
        variable2WriteSingle
      );

      variable3 = createFakeS7Variable(
        null,
        null,
        "variable3Id",
        "variable3Name",
        "FakeS7Variable",
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
        variable3ReadSingle,
        variable3WriteSingle
      );

      variable4 = createFakeS7Variable(
        null,
        null,
        "variable4Id",
        "variable4Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable4SampleTime,
        [],
        variable4Offset,
        variable4Length,
        () => 0,
        () => [],
        variable4MemoryType,
        variable4DBNumber,
        variable4Read,
        variable4Write,
        variable4ReadSingle,
        variable4WriteSingle
      );

      variable4 = createFakeS7Variable(
        null,
        null,
        "variable4Id",
        "variable4Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable4SampleTime,
        [],
        variable4Offset,
        variable4Length,
        () => 0,
        () => [],
        variable4MemoryType,
        variable4DBNumber,
        variable4Read,
        variable4Write,
        variable4ReadSingle,
        variable4WriteSingle
      );

      variable5 = createFakeS7Variable(
        null,
        null,
        "variable5Id",
        "variable5Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable5SampleTime,
        [],
        variable5Offset,
        variable5Length,
        () => 0,
        () => [],
        variable5MemoryType,
        variable5DBNumber,
        variable5Read,
        variable5Write,
        variable5ReadSingle,
        variable5WriteSingle
      );

      variable6 = createFakeS7Variable(
        null,
        null,
        "variable6Id",
        "variable6Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable6SampleTime,
        [],
        variable6Offset,
        variable6Length,
        () => 0,
        () => [],
        variable6MemoryType,
        variable6DBNumber,
        variable6Read,
        variable6Write,
        variable6ReadSingle,
        variable6WriteSingle
      );

      variable7 = createFakeS7Variable(
        null,
        null,
        "variable7Id",
        "variable7Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable7SampleTime,
        [],
        variable7Offset,
        variable7Length,
        () => 0,
        () => [],
        variable7MemoryType,
        variable7DBNumber,
        variable7Read,
        variable7Write,
        variable7ReadSingle,
        variable7WriteSingle
      );

      variable8 = createFakeS7Variable(
        null,
        null,
        "variable8Id",
        "variable8Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable8SampleTime,
        [],
        variable8Offset,
        variable8Length,
        () => 0,
        () => [],
        variable8MemoryType,
        variable8DBNumber,
        variable8Read,
        variable8Write,
        variable8ReadSingle,
        variable8WriteSingle
      );

      variable9 = createFakeS7Variable(
        null,
        null,
        "variable9Id",
        "variable9Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable9SampleTime,
        [],
        variable9Offset,
        variable9Length,
        () => 0,
        () => [],
        variable9MemoryType,
        variable9DBNumber,
        variable9Read,
        variable9Write,
        variable9ReadSingle,
        variable9WriteSingle
      );

      variable10 = createFakeS7Variable(
        null,
        null,
        "variable10Id",
        "variable10Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable10SampleTime,
        [],
        variable10Offset,
        variable10Length,
        () => 0,
        () => [],
        variable10MemoryType,
        variable10DBNumber,
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

      return S7RequestManager.groupS7Variables(variables);
    };

    it("should properly group variables based on MemoryType, Read/Write, DBNumber, SampleTime, and proper offset/length", () => {
      let result = exec();

      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: AreaType: Q, DBNumber: undefined
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

    it("should properly group variables - if there is only one variable", () => {
      addVariable1 = false;
      addVariable2 = false;
      addVariable3 = false;
      addVariable4 = false;
      addVariable5 = true;
      addVariable6 = false;
      addVariable7 = false;
      addVariable8 = false;
      addVariable9 = false;
      addVariable10 = false;

      let result = exec();

      let expectedResult = [[variable5]];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables - if there are no variables", () => {
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

      let result = exec();

      let expectedResult = [];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on AreaType - read is true", () => {
      /**
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *
       * read: AreaType: Q, DBNumber: undefined
       *              var4: offset : 11, len: 1, sampleTime: 15
       *              var2: offset : 12, len: 2, sampleTime: 15,
       *              var6: offset : 14, len: 1, sampleTime: 15,
       *              var10: offset : 15, len: 1, sampleTime: 15,
       *              var9: offset : 16, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "Q";
      variable4DBNumber = undefined;
      variable4Offset = 11;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "Q";
      variable2DBNumber = undefined;
      variable2Offset = 12;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "Q";
      variable6DBNumber = undefined;
      variable6Offset = 14;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "Q";
      variable10DBNumber = undefined;
      variable10Offset = 15;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "Q";
      variable9DBNumber = undefined;
      variable9Offset = 16;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on AreaType - write is true", () => {
      /**
       * write: AreaType: I, DBNumber: undefined,
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *
       * write: AreaType: Q, DBNumber: undefined,
       *              var4: offset : 11, len: 1, sampleTime: 15
       *              var2: offset : 12, len: 2, sampleTime: 15,
       *              var6: offset : 14, len: 1, sampleTime: 15,
       *              var10: offset : 15, len: 1, sampleTime: 15,
       *              var9: offset : 16, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "Q";
      variable4DBNumber = undefined;
      variable4Offset = 11;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "Q";
      variable2DBNumber = undefined;
      variable2Offset = 12;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "Q";
      variable6DBNumber = undefined;
      variable6Offset = 14;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "Q";
      variable10DBNumber = undefined;
      variable10Offset = 15;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "Q";
      variable9DBNumber = undefined;
      variable9Offset = 16;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on DBNumber - if area type is DB, read is true", () => {
      /**
       * read: AreaType: DB, DBNumber: 1, read: true
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *
       * read: AreaType: DB, DBNumber: 2, read: true
       *              var4: offset : 11, len: 1, sampleTime: 15
       *              var2: offset : 12, len: 2, sampleTime: 15,
       *              var6: offset : 14, len: 1, sampleTime: 15,
       *              var10: offset : 15, len: 1, sampleTime: 15,
       *              var9: offset : 16, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 2;
      variable4Offset = 11;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 2;
      variable2Offset = 12;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 2;
      variable6Offset = 14;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 2;
      variable10Offset = 15;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 2;
      variable9Offset = 16;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on DBNumber - if area type is DB, write is true", () => {
      /**
       * write: AreaType: DB, DBNumber: 1, read: true
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *
       * write: AreaType: DB, DBNumber: 2, read: true
       *              var4: offset : 11, len: 1, sampleTime: 15
       *              var2: offset : 12, len: 2, sampleTime: 15,
       *              var6: offset : 14, len: 1, sampleTime: 15,
       *              var10: offset : 15, len: 1, sampleTime: 15,
       *              var9: offset : 16, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 2;
      variable4Offset = 11;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 2;
      variable2Offset = 12;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 2;
      variable6Offset = 14;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 2;
      variable10Offset = 15;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 2;
      variable9Offset = 16;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables not based on DBNumber - if area type is not DB, read is true", () => {
      /**
       * read: AreaType: I, DBNumber: 1, read: true
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *
       * read: AreaType: I, DBNumber: 2, read: true
       *              var4: offset : 11, len: 1, sampleTime: 15
       *              var2: offset : 12, len: 2, sampleTime: 15,
       *              var6: offset : 14, len: 1, sampleTime: 15,
       *              var10: offset : 15, len: 1, sampleTime: 15,
       *              var9: offset : 16, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8,var4,var2,var6,var10,var9],
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = 2;
      variable4Offset = 11;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = 2;
      variable2Offset = 12;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = 2;
      variable6Offset = 14;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = 2;
      variable10Offset = 15;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = 2;
      variable9Offset = 16;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables not based on DBNumber - if area type is not DB, write is true", () => {
      /**
       * write: AreaType: Q, DBNumber: 1, read: true
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *
       * write: AreaType: Q, DBNumber: 2, read: true
       *              var4: offset : 11, len: 1, sampleTime: 15
       *              var2: offset : 12, len: 2, sampleTime: 15,
       *              var6: offset : 14, len: 1, sampleTime: 15,
       *              var10: offset : 15, len: 1, sampleTime: 15,
       *              var9: offset : 16, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8,var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "Q";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "Q";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "Q";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "Q";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "Q";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "Q";
      variable4DBNumber = 2;
      variable4Offset = 11;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "Q";
      variable2DBNumber = 2;
      variable2Offset = 12;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "Q";
      variable6DBNumber = 2;
      variable6Offset = 14;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "Q";
      variable10DBNumber = 2;
      variable10Offset = 15;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "Q";
      variable9DBNumber = 2;
      variable9Offset = 16;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on offset - read is true, AreaType is not DB", () => {
      /**
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 11, len: 1, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on offset - write is true, AreaType is not DB", () => {
      /**
       * write: AreaType: Q, DBNumber: undefined,
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 15, len: 1, sampleTime: 15,
       *              var10: offset : 16, len: 1, sampleTime: 15,
       *              var9: offset : 17, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "Q";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "Q";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "Q";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "Q";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "Q";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "Q";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "Q";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "Q";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "Q";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "Q";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on offset - read is true, AreaType is DB", () => {
      /**
       * read: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 11, len: 1, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on offset - write is true, AreaType is DB", () => {
      /**
       * write: AreaType: DB, DBNumber: 1,
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 15, len: 1, sampleTime: 15,
       *              var10: offset : 16, len: 1, sampleTime: 15,
       *              var9: offset : 17, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on read and write - AreaType is DB", () => {
      /**
       * read: AreaType: DB, DBNumber: 1,
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       * write: AreaType: DB, DBNumber: 1,
       *              var4: offset : 12, len: 1, sampleTime: 15
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 15, len: 1, sampleTime: 15,
       *              var10: offset : 16, len: 1, sampleTime: 15,
       *              var9: offset : 17, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *       ]
       *
       * write: [
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on read and write - AreaType is not DB", () => {
      /**
       * read: AreaType: I, DBNumber: undefined,
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       * write: AreaType: I, DBNumber: undefined,
       *              var4: offset : 12, len: 1, sampleTime: 15
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 15, len: 1, sampleTime: 15,
       *              var10: offset : 16, len: 1, sampleTime: 15,
       *              var9: offset : 17, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *       ]
       *
       * write: [
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable1, variable7, variable5, variable3, variable8],
        [variable4, variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on read single - read is true, AreaType is not DB", () => {
      /**
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, readSingle: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var4],
       *             [var1,var7,var5,var3 ,var8],
       *             [var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = true;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4],
        [variable1, variable7, variable5, variable3, variable8],
        [variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on read single - read is true, AreaType is DB", () => {
      /**
       * read: AreaType: I, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, readSingle: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var4],
       *             [var1,var7,var5,var3 ,var8],
       *             [var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = true;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4],
        [variable1, variable7, variable5, variable3, variable8],
        [variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on read single - write is true, AreaType is not DB", () => {
      /**
       * write: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 3, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, readSingle: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8, var4, var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = true;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on read single - write is true, AreaType is DB", () => {
      /**
       * write: AreaType: I, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, readSingle: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8, var4, var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = true;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];
      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on write single - write is true, AreaType is not DB", () => {
      /**
       * write: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 3, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, writeSingle: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var4]
       *             [var1,var7,var5,var3 ,var8]
       *             [var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = true;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4],
        [variable1, variable7, variable5, variable3, variable8],
        [variable2, variable6, variable10, variable9],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on write single - write is true, AreaType is DB", () => {
      /**
       * write: AreaType: I, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, write single: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var4]
       *             [var1,var7,var5,var3 ,var8]
       *             [var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = true;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4],
        [variable1, variable7, variable5, variable3, variable8],
        [variable2, variable6, variable10, variable9],
      ];
      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on write single - read is true, AreaType is not DB", () => {
      /**
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, writeSingle: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8,var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = true;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on write single - read is true, AreaType is DB", () => {
      /**
       * read: AreaType: I, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *              var4: offset : 12, len: 1, sampleTime: 15, writeSingle: true
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8,var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = true;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on sampleTime - read is true, AreaType is not DB", () => {
      /**
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       * read: AreaType: I, DBNumber: undefined
       *              var4: offset : 12, len: 1, sampleTime: 10
       *              var2: offset : 13, len: 2, sampleTime: 10,
       *              var6: offset : 16, len: 1, sampleTime: 10,
       *              var10: offset : 17, len: 1, sampleTime: 10,
       *              var9: offset : 18, len: 1, sampleTime: 10
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4, variable2, variable6, variable10, variable9],
        [variable1, variable7, variable5, variable3, variable8],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on sampleTime - read is true, AreaType is DB", () => {
      /**
       * read: AreaType: I, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *
       * read: AreaType: I, DBNumber: 1
       *              var4: offset : 12, len: 1, sampleTime: 10,
       *              var2: offset : 13, len: 2, sampleTime: 10,
       *              var6: offset : 16, len: 1, sampleTime: 10,
       *              var10: offset : 17, len: 1, sampleTime: 10,
       *              var9: offset : 18, len: 1, sampleTime: 10
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 10;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 10;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 10;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 10;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4, variable2, variable6, variable10, variable9],
        [variable1, variable7, variable5, variable3, variable8],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on sampleTime - write is true, AreaType is not DB", () => {
      /**
       * write: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       * write: AreaType: I, DBNumber: undefined
       *              var4: offset : 12, len: 1, sampleTime: 10
       *              var2: offset : 13, len: 2, sampleTime: 10,
       *              var6: offset : 16, len: 1, sampleTime: 10,
       *              var10: offset : 17, len: 1, sampleTime: 10,
       *              var9: offset : 18, len: 1, sampleTime: 10
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4, variable2, variable6, variable10, variable9],
        [variable1, variable7, variable5, variable3, variable8],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables based on sampleTime - write is true, AreaType is DB", () => {
      /**
       * write: AreaType: I, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15
       *
       * write: AreaType: I, DBNumber: 1
       *              var4: offset : 12, len: 1, sampleTime: 10,
       *              var2: offset : 13, len: 2, sampleTime: 10,
       *              var6: offset : 16, len: 1, sampleTime: 10,
       *              var10: offset : 17, len: 1, sampleTime: 10,
       *              var9: offset : 18, len: 1, sampleTime: 10
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var8],
       *             [var4,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 12;
      variable4Length = 1;
      variable4SampleTime = 10;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 10;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 10;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 10;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [variable4, variable2, variable6, variable10, variable9],
        [variable1, variable7, variable5, variable3, variable8],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back- read is true, AreaType is not DB", () => {
      /**
       *          variable8 - range
       *          #################
       *
       *      variable4 - range
       *      ##################################
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 4, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 9;
      variable4Length = 4;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back- read is true, AreaType is DB", () => {
      /**
       *          variable8 - range
       *          #################
       *
       *      variable4 - range
       *      ##################################
       *
       * read: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 4, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 9;
      variable4Length = 4;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back- write is true, AreaType is not DB", () => {
      /**
       *          variable8 - range
       *          #################
       *
       *      variable4 - range
       *      ##################################
       *
       * write: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 4, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 9;
      variable4Length = 4;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back- write is true, AreaType is DB", () => {
      /**
       *          variable8 - range
       *          #################
       *
       *      variable4 - range
       *      ##################################
       *
       * write: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 4, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 9;
      variable4Length = 4;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps partially to front and back- read is true, AreaType is not DB", () => {
      /**
       *      variable8 - range            variable2 - range
       *      #################            #################
       *
       *                variable4 - range
       *                ##################################
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 11, len: 3, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 11;
      variable4Length = 3;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps partially to front and back-- read is true, AreaType is DB", () => {
      /**
       *      variable8 - range            variable2 - range
       *      #################            #################
       *
       *                variable4 - range
       *                ##################################
       *
       * read: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 11, len: 3, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 11;
      variable4Length = 3;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps partially to front and back-- write is true, AreaType is not DB", () => {
      /**
       *      variable8 - range            variable2 - range
       *      #################            #################
       *
       *                variable4 - range
       *                ##################################
       *
       * write: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 11, len: 3, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 11;
      variable4Length = 3;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps partially to front and back-- write is true, AreaType is DB", () => {
      /**
       *      variable8 - range            variable2 - range
       *      #################            #################
       *
       *                variable4 - range
       *                ##################################
       *
       * write: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 11, len: 3, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 11;
      variable4Length = 3;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to front- read is true, AreaType is not DB", () => {
      /**
       *      variable8 - range
       *      #################################
       *
       *               variable4 - range
       *               #################
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 4, sampleTime: 15,
       *              var4: offset : 11, len: 2, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 4;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 11;
      variable4Length = 2;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to front- read is true, AreaType is DB", () => {
      /**
       *      variable8 - range
       *      #################################
       *
       *               variable4 - range
       *               #################
       *
       * read: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 4, sampleTime: 15,
       *              var4: offset : 11, len: 2, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 4;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 11;
      variable4Length = 2;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to front- write is true, AreaType is not DB", () => {
      /**
       *      variable8 - range
       *      #################################
       *
       *               variable4 - range
       *               #################
       *
       * write: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 4, sampleTime: 15,
       *              var4: offset : 11, len: 2, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 4;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 11;
      variable4Length = 2;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to front- write is true, AreaType is DB", () => {
      /**
       *      variable8 - range
       *      #################################
       *
       *               variable4 - range
       *               #################
       *
       * write: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 4, sampleTime: 15,
       *              var4: offset : 11, len: 2, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 4;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 11;
      variable4Length = 2;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable8,
          variable4,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back and front - read is true, AreaType is not DB", () => {
      /**
       *          variable8 - range        variable2 - range
       *          #################        #################
       *
       *                   variable4 - range
       *      ##################################################
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 8, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 9;
      variable4Length = 8;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back and front - read is true, AreaType is DB", () => {
      /**
       *          variable8 - range        variable2 - range
       *          #################        #################
       *
       *                   variable4 - range
       *      ##################################################
       *
       * read: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 8, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *       ]
       *
       * write: [
       *
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 9;
      variable4Length = 8;
      variable4SampleTime = 15;
      variable4Write = false;
      variable4Read = true;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = false;
      variable2Read = true;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = false;
      variable6Read = true;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = false;
      variable10Read = true;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = false;
      variable9Read = true;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back and front - write is true, AreaType is not DB", () => {
      /**
       *          variable8 - range        variable2 - range
       *          #################        #################
       *
       *                   variable4 - range
       *      ##################################################
       *
       * write: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 8, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "I";
      variable4DBNumber = undefined;
      variable4Offset = 9;
      variable4Length = 8;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "I";
      variable2DBNumber = undefined;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "I";
      variable6DBNumber = undefined;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "I";
      variable10DBNumber = undefined;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "I";
      variable9DBNumber = undefined;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should properly group variables even if variable overlaps totally to back and front - write is true, AreaType is DB", () => {
      /**
       *          variable8 - range        variable2 - range
       *          #################        #################
       *
       *                   variable4 - range
       *      ##################################################
       *
       * write: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 2, sampleTime: 15,
       *              var4: offset : 9, len: 8, sampleTime: 15,
       *              var2: offset : 13, len: 2, sampleTime: 15,
       *              var6: offset : 16, len: 1, sampleTime: 15,
       *              var10: offset : 17, len: 1, sampleTime: 15,
       *              var9: offset : 18, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *       ]
       *
       * write: [
       *             [var1,var7,var5,var3 ,var4, var8,var2,var6,var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = true;
      variable1Read = false;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = true;
      variable7Read = false;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = true;
      variable5Read = false;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 1;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = true;
      variable3Read = false;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 1;
      variable8Offset = 10;
      variable8Length = 2;
      variable8SampleTime = 15;
      variable8Write = true;
      variable8Read = false;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 9;
      variable4Length = 8;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 13;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 15;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 1;
      variable10Offset = 16;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 1;
      variable9Offset = 17;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      let result = exec();

      let expectedResult = [
        [
          variable1,
          variable7,
          variable5,
          variable3,
          variable4,
          variable8,
          variable2,
          variable6,
          variable10,
          variable9,
        ],
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("createRequests", () => {
    //#region VARIABLES

    let variable1;
    let variable2;
    let variable3;
    let variable4;
    let variable5;
    let variable6;
    let variable7;
    let variable8;
    let variable9;

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

    let variable1MemoryType;
    let variable1DBNumber;
    let variable1Offset;
    let variable1Length;
    let variable1Write;
    let variable1Read;
    let variable1WriteSingle;
    let variable1ReadSingle;
    let variable1SampleTime;

    let variable2MemoryType;
    let variable2DBNumber;
    let variable2Offset;
    let variable2Length;
    let variable2Write;
    let variable2Read;
    let variable2WriteSingle;
    let variable2ReadSingle;
    let variable2SampleTime;

    let variable3MemoryType;
    let variable3DBNumber;
    let variable3Offset;
    let variable3Length;
    let variable3Write;
    let variable3Read;
    let variable3WriteSingle;
    let variable3ReadSingle;
    let variable3SampleTime;

    let variable4MemoryType;
    let variable4DBNumber;
    let variable4Offset;
    let variable4Length;
    let variable4Write;
    let variable4Read;
    let variable4WriteSingle;
    let variable4ReadSingle;
    let variable4SampleTime;

    let variable5MemoryType;
    let variable5DBNumber;
    let variable5Offset;
    let variable5Length;
    let variable5Write;
    let variable5Read;
    let variable5WriteSingle;
    let variable5ReadSingle;
    let variable5SampleTime;

    let variable6MemoryType;
    let variable6DBNumber;
    let variable6Offset;
    let variable6Length;
    let variable6Write;
    let variable6Read;
    let variable6WriteSingle;
    let variable6ReadSingle;
    let variable6SampleTime;

    let variable7MemoryType;
    let variable7DBNumber;
    let variable7Offset;
    let variable7Length;
    let variable7Write;
    let variable7Read;
    let variable7WriteSingle;
    let variable7ReadSingle;
    let variable7SampleTime;

    let variable8MemoryType;
    let variable8DBNumber;
    let variable8Offset;
    let variable8Length;
    let variable8Write;
    let variable8Read;
    let variable8WriteSingle;
    let variable8ReadSingle;
    let variable8SampleTime;

    let variable9MemoryType;
    let variable9DBNumber;
    let variable9Offset;
    let variable9Length;
    let variable9Write;
    let variable9Read;
    let variable9WriteSingle;
    let variable9ReadSingle;
    let variable9SampleTime;

    let variable10MemoryType;
    let variable10DBNumber;
    let variable10Offset;
    let variable10Length;
    let variable10Write;
    let variable10Read;
    let variable10WriteSingle;
    let variable10ReadSingle;
    let variable10SampleTime;

    let variables;

    let requestManager;

    //#endregion VARIABLES

    beforeEach(() => {
      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: AreaType: Q, DBNumber: undefined
       *              var4: offset : 20, len: 1, sampleTime: 15
       *              var2: offset : 21, len: 2, sampleTime: 15,
       *              var6: offset : 24, len: 1, sampleTime: 15,
       *              var10: offset : 25, len: 1, sampleTime: 15, writeSingle: true
       *              var9: offset : 26, len: 1, sampleTime: 10
       */

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

      variable1MemoryType = "I";
      variable1DBNumber = undefined;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "I";
      variable7DBNumber = undefined;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "I";
      variable5DBNumber = undefined;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 10;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "I";
      variable3DBNumber = undefined;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 10;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = true;

      variable8MemoryType = "I";
      variable8DBNumber = undefined;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 10;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "Q";
      variable4DBNumber = undefined;
      variable4Offset = 20;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "Q";
      variable2DBNumber = undefined;
      variable2Offset = 21;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "Q";
      variable6DBNumber = undefined;
      variable6Offset = 24;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "Q";
      variable10DBNumber = undefined;
      variable10Offset = 25;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = true;
      variable10ReadSingle = false;

      variable9MemoryType = "Q";
      variable9DBNumber = undefined;
      variable9Offset = 26;
      variable9Length = 1;
      variable9SampleTime = 10;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;
    });

    let exec = () => {
      variable1 = createFakeS7Variable(
        null,
        null,
        "variable1Id",
        "variable1Name",
        "FakeS7Variable",
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
        variable1ReadSingle,
        variable1WriteSingle
      );

      variable2 = createFakeS7Variable(
        null,
        null,
        "variable2Id",
        "variable2Name",
        "FakeS7Variable",
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
        variable2ReadSingle,
        variable2WriteSingle
      );

      variable3 = createFakeS7Variable(
        null,
        null,
        "variable3Id",
        "variable3Name",
        "FakeS7Variable",
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
        variable3ReadSingle,
        variable3WriteSingle
      );

      variable4 = createFakeS7Variable(
        null,
        null,
        "variable4Id",
        "variable4Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable4SampleTime,
        [],
        variable4Offset,
        variable4Length,
        () => 0,
        () => [],
        variable4MemoryType,
        variable4DBNumber,
        variable4Read,
        variable4Write,
        variable4ReadSingle,
        variable4WriteSingle
      );

      variable4 = createFakeS7Variable(
        null,
        null,
        "variable4Id",
        "variable4Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable4SampleTime,
        [],
        variable4Offset,
        variable4Length,
        () => 0,
        () => [],
        variable4MemoryType,
        variable4DBNumber,
        variable4Read,
        variable4Write,
        variable4ReadSingle,
        variable4WriteSingle
      );

      variable5 = createFakeS7Variable(
        null,
        null,
        "variable5Id",
        "variable5Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable5SampleTime,
        [],
        variable5Offset,
        variable5Length,
        () => 0,
        () => [],
        variable5MemoryType,
        variable5DBNumber,
        variable5Read,
        variable5Write,
        variable5ReadSingle,
        variable5WriteSingle
      );

      variable6 = createFakeS7Variable(
        null,
        null,
        "variable6Id",
        "variable6Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable6SampleTime,
        [],
        variable6Offset,
        variable6Length,
        () => 0,
        () => [],
        variable6MemoryType,
        variable6DBNumber,
        variable6Read,
        variable6Write,
        variable6ReadSingle,
        variable6WriteSingle
      );

      variable7 = createFakeS7Variable(
        null,
        null,
        "variable7Id",
        "variable7Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable7SampleTime,
        [],
        variable7Offset,
        variable7Length,
        () => 0,
        () => [],
        variable7MemoryType,
        variable7DBNumber,
        variable7Read,
        variable7Write,
        variable7ReadSingle,
        variable7WriteSingle
      );

      variable8 = createFakeS7Variable(
        null,
        null,
        "variable8Id",
        "variable8Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable8SampleTime,
        [],
        variable8Offset,
        variable8Length,
        () => 0,
        () => [],
        variable8MemoryType,
        variable8DBNumber,
        variable8Read,
        variable8Write,
        variable8ReadSingle,
        variable8WriteSingle
      );

      variable9 = createFakeS7Variable(
        null,
        null,
        "variable9Id",
        "variable9Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable9SampleTime,
        [],
        variable9Offset,
        variable9Length,
        () => 0,
        () => [],
        variable9MemoryType,
        variable9DBNumber,
        variable9Read,
        variable9Write,
        variable9ReadSingle,
        variable9WriteSingle
      );

      variable10 = createFakeS7Variable(
        null,
        null,
        "variable10Id",
        "variable10Name",
        "FakeS7Variable",
        0,
        "FakeUnit",
        variable10SampleTime,
        [],
        variable10Offset,
        variable10Length,
        () => 0,
        () => [],
        variable10MemoryType,
        variable10DBNumber,
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

      requestManager = new S7RequestManager();

      return requestManager.createRequests(variables);
    };

    it("should create requests properly based on MemoryType, Read/Write, DBNumber, SampleTime, and proper offset/length - if are is not DB", () => {
      exec();

      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: AreaType: I, DBNumber: undefined
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 10,
       *              var3: offset : 8, len: 2, sampleTime: 10, readSingle: true,
       *              var8: offset : 10, len: 1, sampleTime: 10
       *
       * write: AreaType: Q, DBNumber: undefined
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

      expect(requestManager.Requests.length).toEqual(8);

      testS7Request(
        requestManager.Requests[0],
        10,
        "I",
        8,
        2,
        null,
        false,
        true,
        [variable3]
      );

      testS7Request(
        requestManager.Requests[1],
        15,
        "Q",
        25,
        1,
        null,
        true,
        false,
        [variable10]
      );

      testS7Request(
        requestManager.Requests[2],
        10,
        "I",
        6,
        2,
        null,
        false,
        true,
        [variable5]
      );

      testS7Request(
        requestManager.Requests[3],
        10,
        "I",
        10,
        1,
        null,
        false,
        true,
        [variable8]
      );

      testS7Request(
        requestManager.Requests[4],
        15,
        "I",
        1,
        5,
        null,
        false,
        true,
        [variable1, variable7]
      );

      testS7Request(
        requestManager.Requests[5],
        10,
        "Q",
        26,
        1,
        null,
        true,
        false,
        [variable9]
      );

      testS7Request(
        requestManager.Requests[6],
        15,
        "Q",
        20,
        3,
        null,
        true,
        false,
        [variable4, variable2]
      );

      testS7Request(
        requestManager.Requests[7],
        15,
        "Q",
        24,
        1,
        null,
        true,
        false,
        [variable6]
      );
    });

    it("should create requests properly based on MemoryType, Read/Write, DBNumber, SampleTime, and proper offset/length - if are is DB", () => {
      /**
       * By default we have 10 variables - 5 for read, 5 for write
       *
       * read: AreaType: DB, DBNumber: 1
       *              var1: offset : 1, len: 3, sampleTime: 15
       *              var7: offset : 4, len: 2, sampleTime: 15,
       *              var5: offset : 6, len: 2, sampleTime: 15,
       * read: AreaType: DB, DBNumber: 2
       *              var3: offset : 8, len: 2, sampleTime: 15,
       *              var8: offset : 10, len: 1, sampleTime: 15
       *
       * write: AreaType: DB, DBNumber: 1
       *              var4: offset : 20, len: 1, sampleTime: 15
       *              var2: offset : 21, len: 2, sampleTime: 15,
       *              var6: offset : 23, len: 1, sampleTime: 15,
       * write: AreaType: DB, DBNumber: 2
       *              var10: offset : 24, len: 1, sampleTime: 15,
       *              var9: offset : 25, len: 1, sampleTime: 15
       *
       * Groups should be:
       *
       * read: [
       *             [var1,var7, var5],
       *             [var3,var8]
       *       ]
       *
       * write: [
       *             [var4,var2, var6],
       *             [var10,var9]
       *        ]
       *
       */

      variable1MemoryType = "DB";
      variable1DBNumber = 1;
      variable1Offset = 1;
      variable1Length = 3;
      variable1SampleTime = 15;
      variable1Write = false;
      variable1Read = true;
      variable1WriteSingle = false;
      variable1ReadSingle = false;

      variable7MemoryType = "DB";
      variable7DBNumber = 1;
      variable7Offset = 4;
      variable7Length = 2;
      variable7SampleTime = 15;
      variable7Write = false;
      variable7Read = true;
      variable7WriteSingle = false;
      variable7ReadSingle = false;

      variable5MemoryType = "DB";
      variable5DBNumber = 1;
      variable5Offset = 6;
      variable5Length = 2;
      variable5SampleTime = 15;
      variable5Write = false;
      variable5Read = true;
      variable5WriteSingle = false;
      variable5ReadSingle = false;

      variable3MemoryType = "DB";
      variable3DBNumber = 2;
      variable3Offset = 8;
      variable3Length = 2;
      variable3SampleTime = 15;
      variable3Write = false;
      variable3Read = true;
      variable3WriteSingle = false;
      variable3ReadSingle = false;

      variable8MemoryType = "DB";
      variable8DBNumber = 2;
      variable8Offset = 10;
      variable8Length = 1;
      variable8SampleTime = 15;
      variable8Write = false;
      variable8Read = true;
      variable8WriteSingle = false;
      variable8ReadSingle = false;

      variable4MemoryType = "DB";
      variable4DBNumber = 1;
      variable4Offset = 20;
      variable4Length = 1;
      variable4SampleTime = 15;
      variable4Write = true;
      variable4Read = false;
      variable4WriteSingle = false;
      variable4ReadSingle = false;

      variable2MemoryType = "DB";
      variable2DBNumber = 1;
      variable2Offset = 21;
      variable2Length = 2;
      variable2SampleTime = 15;
      variable2Write = true;
      variable2Read = false;
      variable2WriteSingle = false;
      variable2ReadSingle = false;

      variable6MemoryType = "DB";
      variable6DBNumber = 1;
      variable6Offset = 23;
      variable6Length = 1;
      variable6SampleTime = 15;
      variable6Write = true;
      variable6Read = false;
      variable6WriteSingle = false;
      variable6ReadSingle = false;

      variable10MemoryType = "DB";
      variable10DBNumber = 2;
      variable10Offset = 24;
      variable10Length = 1;
      variable10SampleTime = 15;
      variable10Write = true;
      variable10Read = false;
      variable10WriteSingle = false;
      variable10ReadSingle = false;

      variable9MemoryType = "DB";
      variable9DBNumber = 2;
      variable9Offset = 25;
      variable9Length = 1;
      variable9SampleTime = 15;
      variable9Write = true;
      variable9Read = false;
      variable9WriteSingle = false;
      variable9ReadSingle = false;

      exec();

      expect(requestManager.Requests.length).toEqual(4);

      testS7Request(
        requestManager.Requests[0],
        15,
        "DB",
        1,
        7,
        1,
        false,
        true,
        [variable1, variable7, variable5]
      );

      testS7Request(
        requestManager.Requests[1],
        15,
        "DB",
        8,
        3,
        2,
        false,
        true,
        [variable3, variable8]
      );

      testS7Request(
        requestManager.Requests[2],
        15,
        "DB",
        20,
        4,
        1,
        true,
        false,
        [variable4, variable2, variable6]
      );

      testS7Request(
        requestManager.Requests[3],
        15,
        "DB",
        24,
        2,
        2,
        true,
        false,
        [variable10, variable9]
      );
    });

    it("should create requests properly - if there is only one variable", () => {
      addVariable1 = false;
      addVariable2 = false;
      addVariable3 = false;
      addVariable4 = false;
      addVariable5 = true;
      addVariable6 = false;
      addVariable7 = false;
      addVariable8 = false;
      addVariable9 = false;
      addVariable10 = false;

      exec();

      expect(requestManager.Requests.length).toEqual(1);

      testS7Request(
        requestManager.Requests[0],
        10,
        "I",
        6,
        2,
        null,
        false,
        true,
        [variable5]
      );
    });

    it("should create requests properly - if there are no variables", () => {
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

      exec();

      expect(requestManager.Requests).toEqual([]);
    });
  });
});
