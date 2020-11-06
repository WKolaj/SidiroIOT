const MBVariable = require("../../../../../../classes/Element/Variable/ConnectableVariable/MBVariable/MBVariable");

describe("MBVariable", () => {
  describe("constructor", () => {
    let exec = () => {
      return new MBVariable();
    };

    it("should create new MBVariable and set all its properties to null", () => {
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
      expect(result.Offset).toEqual(null);
      expect(result.Length).toEqual(null);
    });

    it("should create new MBVariable and set data to null", () => {
      let result = exec();

      expect(result.Data).toEqual(null);
    });

    it("should create new ConnectableVariable and set read/write/readSeperately/writeSeperately as null", () => {
      let result = exec();

      expect(result.Read).toEqual(null);
      expect(result.Write).toEqual(null);
      expect(result.ReadSeperately).toEqual(null);
      expect(result.WriteSeperately).toEqual(null);
    });

    it("should create new ConnectableVariable and set unitID ReadFCode and WriteFCode as null", () => {
      let result = exec();

      expect(result.UnitID).toEqual(null);
      expect(result.ReadFCode).toEqual(null);
      expect(result.WriteFCode).toEqual(null);
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
        type: "testElementType",
        defaultValue: 10,
        sampleTime: "testElementSampleTime",
        offset: 123,
        length: 456,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        unitID: 12,
        readFCode: 4,
        writeFCode: 16,
      };

      //Creating mocking method for converting data to value
      //Data contains elements [1,2,3,4...]
      //Value contains the sum of all elements in array
      convertDataToValueMockFunc = jest.fn((data) => {
        let valueToReturn = 0;
        for (let value of data) valueToReturn += value;
        return valueToReturn;
      });

      convertValueToDataMockFunc = jest.fn((value) => {
        let dataToReturn = [];
        let index = 1;
        let restOfValue = value;
        while (restOfValue > 0) {
          dataToReturn.push(index);
          restOfValue -= index;
          index++;
        }
        return dataToReturn;
      });

      getPossibleReadCodesMockFunc = jest.fn(() => possibleReadCodes);
      getPossibleWriteCodesMockFunc = jest.fn(() => possibleWriteCodes);
    });

    let exec = async () => {
      variable = new MBVariable();
      variable._convertDataToValue = convertDataToValueMockFunc;
      variable._convertValueToData = convertValueToDataMockFunc;
      variable._getReadPossibleFunctionCodes = getPossibleReadCodesMockFunc;
      variable._getWritePossibleFunctionCodes = getPossibleWriteCodesMockFunc;

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("testElementType");
      expect(variable.DefaultValue).toEqual(10);
      expect(variable.SampleTime).toEqual("testElementSampleTime");

      expect(variable.Value).toEqual(10);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(456);

      //default Value 10 corresponds to [1,2,3,4] in Data;
      expect(variable.Data).toEqual([1, 2, 3, 4]);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(4);
      expect(variable.WriteFCode).toEqual(16);
    });

    it("should call _convertValueToDataMockFunc in order to set Data based on defaultValue", async () => {
      await exec();

      //ConvertValueToData should have been called
      expect(convertValueToDataMockFunc).toHaveBeenCalledTimes(1);
      expect(convertValueToDataMockFunc.mock.calls[0][0]).toEqual(10);
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
      expect(variable.Type).toEqual("testElementType");
      expect(variable.DefaultValue).toEqual(10);
      expect(variable.SampleTime).toEqual("testElementSampleTime");

      expect(variable.Value).toEqual(10);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(456);

      //default Value 10 corresponds to [1,2,3,4] in Data;
      expect(variable.Data).toEqual([1, 2, 3, 4]);

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
      expect(variable.Type).toEqual("testElementType");
      expect(variable.DefaultValue).toEqual(10);
      expect(variable.SampleTime).toEqual("testElementSampleTime");

      expect(variable.Value).toEqual(10);
      expect(variable.LastValueTick).toEqual(0);

      expect(variable.Offset).toEqual(123);
      expect(variable.Length).toEqual(456);

      //default Value 10 corresponds to [1,2,3,4] in Data;
      expect(variable.Data).toEqual([1, 2, 3, 4]);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);

      expect(variable.UnitID).toEqual(12);
      expect(variable.ReadFCode).toEqual(4);
      expect(variable.WriteFCode).toEqual(30);
    });
  });

  describe("generatePayload", () => {
    let payload;
    let getValueMockFunc;
    let element;
    let getPossibleReadCodesMockFunc;
    let getPossibleWriteCodesMockFunc;

    beforeEach(() => {
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "testElementType",
        offset: 123,
        length: 456,
        defaultValue: 10,
        sampleTime: 15,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        unit: "testUnit",
        unitID: 12,
        readFCode: 4,
        writeFCode: 16,
      };

      getValueMockFunc = jest.fn(() => 123);

      getPossibleReadCodesMockFunc = jest.fn(() => [1, 2, 3, 4]);
      getPossibleWriteCodesMockFunc = jest.fn(() => [16]);
    });

    let exec = async () => {
      element = new MBVariable();
      element._getValue = getValueMockFunc;
      element._getReadPossibleFunctionCodes = getPossibleReadCodesMockFunc;
      element._getWritePossibleFunctionCodes = getPossibleWriteCodesMockFunc;
      await element.init(payload);
      return element.generatePayload();
    };

    it("should initialize element's properties based on their payload", async () => {
      let result = await exec();

      let expectedResult = {
        id: "testElementId",
        name: "testElementName",
        type: "testElementType",
        sampleTime: 15,
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
        unit: "testUnit",
        defaultValue: 10,
        value: 123,
        lastValueTick: 0,
        offset: 123,
        length: 456,
        unitID: 12,
        readFCode: 4,
        writeFCode: 16,
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
