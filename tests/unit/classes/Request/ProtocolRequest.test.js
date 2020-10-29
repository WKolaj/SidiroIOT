const ProtocolRequest = require("../../../../classes/Request/ProtocolRequest");

describe("ProtocolRequest", () => {
  describe("constructor", () => {
    let variables;
    let sampleTime;
    let writeRequest;

    beforeEach(() => {
      variables = ["variable1", "variable2", "variable3"];
      sampleTime = 123;
      writeRequest = true;
    });

    let exec = () => {
      return new ProtocolRequest(variables, sampleTime, writeRequest);
    };

    it("should create new ProtocolRequest and assign its variable and sampleTime - if writeRequest is set to true", () => {
      writeRequest = true;
      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(true);
      expect(result.ReadRequest).toEqual(false);
    });

    it("should create new ProtocolRequest and assign its variable and sampleTime - if writeRequest is set to false", () => {
      writeRequest = false;
      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
      expect(result.WriteRequest).toEqual(false);
      expect(result.ReadRequest).toEqual(true);
    });
  });

  describe("checkIfShouldBeInvoked", () => {
    let sampleTime;
    let tickNumber;
    let writeRequest;
    let protocolRequest;

    beforeEach(() => {
      writeRequest = false;
      sampleTime = 15;
      tickNumber = 150;
    });

    let exec = () => {
      protocolRequest = new ProtocolRequest([], sampleTime, writeRequest);
      return protocolRequest.checkIfShouldBeInvoked(tickNumber);
    };

    it("should return true if tickNumber matches sampleTime", () => {
      let result = exec();

      expect(result).toBeTruthy();
    });

    it("should return true if tickNumber doest not match sampleTime", () => {
      sampleTime = 151;

      let result = exec();

      expect(result).toBeFalsy();
    });

    it("should always return false if sampleTime is zero", () => {
      sampleTime = 0;

      let result = exec();

      expect(result).toBeFalsy();
    });
  });
});
