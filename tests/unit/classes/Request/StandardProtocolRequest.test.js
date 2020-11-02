const StandardProtocolRequest = require("../../../../classes/Request/StandardProtocolRequest");
const { snooze } = require("../../../../utilities/utilities");
const {
  createFakeStandardProtocolVariable,
} = require("../../../utilities/testUtilities");

const createVariable = (id, name, length, data, offset) => {
  return {
    ID: id,
    Length: length,
    Name: name,
    Data: data,
    Offset: offset,
  };
};

describe("StandardProtocolRequest", () => {
  describe("constructor", () => {
    let variable1;
    let variable2;
    let variable3;
    let variables;
    let sampleTime;
    let writeRequest;

    beforeEach(() => {
      variable1 = createFakeStandardProtocolVariable(
        "var1Id",
        "var1Name",
        "FakeVar",
        0,
        "FakeUnit",
        123,
        [],
        10,
        1,
        () => 0,
        () => [],
        true,
        false,
        false,
        false
      );
      variable2 = createFakeStandardProtocolVariable(
        "var2Id",
        "var2Name",
        "FakeVar",
        0,
        "FakeUnit",
        123,
        [],
        11,
        2,
        () => 0,
        () => [],
        true,
        false,
        false,
        false
      );
      variable3 = createFakeStandardProtocolVariable(
        "var3Id",
        "var3Name",
        "FakeVar",
        0,
        "FakeUnit",
        123,
        [],
        13,
        3,
        () => 0,
        () => [],
        true,
        false,
        false,
        false
      );

      variables = [variable1, variable2, variable3];

      sampleTime = 123;
      writeRequest = false;
    });

    let exec = () => {
      return new StandardProtocolRequest(variables, sampleTime, writeRequest);
    };

    it("should create new ProtocolRequest and assign its variable and sampleTime", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
    });

    it("should create new ProtocolRequest and assign its variable and sampleTime - if there are no variables", () => {
      variables = [];
      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
    });

    it("should properly assign WriteRequest and ReadRequest - if writeRequest is false", () => {
      writeRequest = false;
      let result = exec();

      expect(result.WriteRequest).toEqual(false);
      expect(result.ReadRequest).toEqual(true);
    });

    it("should properly assign WriteRequest and ReadRequest - if writeRequest is true", () => {
      writeRequest = true;
      variable1._read = false;
      variable2._read = false;
      variable3._read = false;
      variable1._write = true;
      variable2._write = true;
      variable3._write = true;
      let result = exec();

      expect(result.WriteRequest).toEqual(true);
      expect(result.ReadRequest).toEqual(false);
    });

    it("should properly calculate variable length and offset", () => {
      let result = exec();

      expect(result.Length).toEqual(
        variable1.Length + variable2.Length + variable3.Length
      );
      expect(result.Offset).toEqual(10);
    });

    it("should properly calculate variable length and offset - if there are no variables", () => {
      variables = [];

      let result = exec();

      expect(result.Length).toEqual(0);
      expect(result.Offset).toEqual(0);
    });

    it("should properly calculate variable length and offset - if there is only one variable", () => {
      variables = [variable1];

      let result = exec();

      expect(result.Length).toEqual(variable1.Length);
      expect(result.Offset).toEqual(10);
    });

    it("should properly calculate variable length and offset - if there is a total overlap between variables", () => {
      variable2.Length = 5;

      let result = exec();

      expect(result.Length).toEqual(6);
      expect(result.Offset).toEqual(10);
    });

    it("should properly calculate variable length and offset - if there is a partial overlap between variables", () => {
      variable2._length = 4;

      let result = exec();

      expect(result.Length).toEqual(6);
      expect(result.Offset).toEqual(10);
    });

    it("should properly calculate variable length and offset - if there is a total overlap between variables and overlapped variable is shorter", () => {
      variable2._length = 5;

      variable3._length = 2;

      let result = exec();

      expect(result.Length).toEqual(6);
      expect(result.Offset).toEqual(10);
    });

    it("should throw if there is a gap between variables", () => {
      variable2._length = 1;

      expect(exec).toThrow(
        "There is a gap between variables in protocol request"
      );
    });

    it("should throw if one of variables has different sampleTime", () => {
      variable2._sampleTime = 2;

      expect(exec).toThrow(
        "Trying to assign variable with different sample time to one request!"
      );
    });

    it("should throw if one of variables has different write", () => {
      variable2._read = false;
      variable2._write = false;

      expect(exec).toThrow(
        "Trying to assign non read variable to read request!"
      );
    });

    it("should throw if one of variables has different read", () => {
      writeRequest = true;
      variable1._read = false;
      variable2._read = true;
      variable3._read = false;
      variable1._write = true;
      variable2._write = false;
      variable3._write = true;

      expect(exec).toThrow(
        "Trying to assign non write variable to write request!"
      );
    });

    it("should throw if one of variables has readSeperately and there are a lot of variables", () => {
      variable2._readSeperately = true;

      expect(exec).toThrow(
        "Trying to assign readSeperately variable to request with other variables!"
      );
    });

    it("should throw if one of variables has write Seperately and there are a lot of variables", () => {
      writeRequest = true;
      variable1._read = false;
      variable2._read = false;
      variable3._read = false;
      variable1._write = true;
      variable2._write = true;
      variable3._write = true;

      variable2._writeSeperately = true;

      expect(exec).toThrow(
        "Trying to assign writeSeperately variable to request with other variables!"
      );
    });

    it("should not throw if one variable has SeperateRead and there is only one variable", () => {
      variable2._readSeperately = true;
      variables = [variable2];

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.Offset).toEqual(11);
      expect(result.Length).toEqual(2);
    });

    it("should not throw if one variable has SeperateWrite and there is only one variable", () => {
      writeRequest = true;
      variable2._writeSeperately = true;
      variable2._read = false;
      variable2._write = true;
      variables = [variable2];

      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.Offset).toEqual(11);
      expect(result.Length).toEqual(2);
    });
  });

  describe("writeDataToVariables", () => {
    let variable1;
    let variable2;
    let variable3;
    let variables;
    let protocolRequest;
    let data;
    let writeRequest;
    let tickId;

    beforeEach(() => {
      tickId = 1234;

      variable1 = createFakeStandardProtocolVariable(
        "var1Id",
        "var1Name",
        "FakeVariable",
        0,
        "FakeUnit",
        1,
        [9],
        10,
        1,
        jest.fn(),
        jest.fn()
      );

      variable2 = createFakeStandardProtocolVariable(
        "var2Id",
        "var2Name",
        "FakeVariable",
        0,
        "FakeUnit",
        1,
        [8, 7],
        11,
        2,
        jest.fn(),
        jest.fn()
      );

      variable3 = createFakeStandardProtocolVariable(
        "var3Id",
        "var3Name",
        "FakeVariable",
        0,
        "FakeUnit",
        1,
        [6, 5, 4],
        13,
        3,
        jest.fn(),
        jest.fn()
      );

      variables = [variable1, variable2, variable3];

      data = [1, 2, 3, 4, 5, 6];
      writeRequest = false;
    });

    let exec = async () => {
      protocolRequest = new StandardProtocolRequest(variables, 1, writeRequest);
      return protocolRequest.writeDataToVariableValues(data, tickId);
    };

    it("should assign data to variables Data and assign its lastTickId", async () => {
      await exec();

      expect(variable1.Data).toEqual([1]);
      expect(variable2.Data).toEqual([2, 3]);
      expect(variable3.Data).toEqual([4, 5, 6]);

      expect(variable1.LastValueTick).toEqual(tickId);
      expect(variable2.LastValueTick).toEqual(tickId);
      expect(variable3.LastValueTick).toEqual(tickId);
    });

    it("should assign data to variables Data - if data has only 0", async () => {
      data = [0, 0, 0, 0, 0, 0];

      await exec();

      expect(variable1.Data).toEqual([0]);
      expect(variable2.Data).toEqual([0, 0]);
      expect(variable3.Data).toEqual([0, 0, 0]);

      expect(variable1.LastValueTick).toEqual(tickId);
      expect(variable2.LastValueTick).toEqual(tickId);
      expect(variable3.LastValueTick).toEqual(tickId);
    });

    it("should throw and not set data to protocolRequest if new data is shorter then total variable length", async () => {
      data = [1, 2, 3, 4, 5];

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      //variables data should not be changed
      expect(variable1.Data).toEqual([9]);
      expect(variable2.Data).toEqual([8, 7]);
      expect(variable3.Data).toEqual([6, 5, 4]);

      expect(variable1.LastValueTick).toEqual(0);
      expect(variable2.LastValueTick).toEqual(0);
      expect(variable3.LastValueTick).toEqual(0);

      expect(error.message).toEqual(
        "Length of data does not correspond to length of request"
      );
    });

    it("should throw and not set data to protocolRequest if new data is longer then total variable length", async () => {
      data = [1, 2, 3, 4, 5, 6, 7];

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      //variables data should not be changed
      expect(variable1.Data).toEqual([9]);
      expect(variable2.Data).toEqual([8, 7]);
      expect(variable3.Data).toEqual([6, 5, 4]);

      expect(variable1.LastValueTick).toEqual(0);
      expect(variable2.LastValueTick).toEqual(0);
      expect(variable3.LastValueTick).toEqual(0);

      expect(error.message).toEqual(
        "Length of data does not correspond to length of request"
      );
    });

    it("should throw and not set data to protocolRequest if new data is empty", async () => {
      data = [];

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      //variables data should not be changed
      expect(variable1.Data).toEqual([9]);
      expect(variable2.Data).toEqual([8, 7]);
      expect(variable3.Data).toEqual([6, 5, 4]);

      expect(variable1.LastValueTick).toEqual(0);
      expect(variable2.LastValueTick).toEqual(0);
      expect(variable3.LastValueTick).toEqual(0);

      expect(error.message).toEqual(
        "Length of data does not correspond to length of request"
      );
    });
  });
});
