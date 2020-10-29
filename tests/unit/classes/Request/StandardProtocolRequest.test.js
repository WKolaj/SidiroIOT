const StandardProtocolRequest = require("../../../../classes/Request/StandardProtocolRequest");
const { snooze } = require("../../../../utilities/utilities");
const {
  createFakeStandardProtocolVariable,
} = require("../../../utilities/testUtilities");

const createVariable = (id, name, length, data) => {
  return {
    ID: id,
    Length: length,
    Name: name,
    Data: data,
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
      variable1 = createVariable("var1Id", "var1Name", 1, []);
      variable2 = createVariable("var2Id", "var2Name", 2, []);
      variable3 = createVariable("var3Id", "var3Name", 3, []);

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

    it("should properly assign WriteRequest and ReadRequest - if writeRequest is false", () => {
      writeRequest = false;
      let result = exec();

      expect(result.WriteRequest).toEqual(false);
      expect(result.ReadRequest).toEqual(true);
    });

    it("should properly assign WriteRequest and ReadRequest - if writeRequest is true", () => {
      writeRequest = true;
      let result = exec();

      expect(result.WriteRequest).toEqual(true);
      expect(result.ReadRequest).toEqual(false);
    });

    it("should properly calculate variable length", () => {
      let result = exec();

      expect(result.Length).toEqual(
        variable1.Length + variable2.Length + variable3.Length
      );
    });

    it("should properly calculate variable length - if there are no variables", () => {
      variables = [];

      let result = exec();

      expect(result.Length).toEqual(0);
    });

    it("should properly calculate variable length - if there is only one variable", () => {
      variables = [variable1];

      let result = exec();

      expect(result.Length).toEqual(variable1.Length);
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
        0,
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
        0,
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
        0,
        3,
        jest.fn(),
        jest.fn()
      );

      variables = [variable1, variable2, variable3];

      data = [1, 2, 3, 4, 5, 6];
      writeRequest = false;
    });

    let exec = async () => {
      protocolRequest = new StandardProtocolRequest(
        variables,
        null,
        writeRequest
      );
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
