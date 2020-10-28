const ProtocolRequest = require("../../../../classes/Request/ProtocolRequest");

describe("ProtocolRequest", () => {
  describe("constructor", () => {
    let variables;
    let sampleTime;

    beforeEach(() => {
      variables = ["variable1", "variable2", "variable3"];
      sampleTime = 123;
    });

    let exec = () => {
      return new ProtocolRequest(variables, sampleTime);
    };

    it("should create new ProtocolRequest and assign its variable and sampleTime", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.SampleTime).toEqual(sampleTime);
      expect(result.Variables).toEqual(variables);
    });
  });

  describe("checkIfShouldBeInvoked", () => {
    let sampleTime;
    let tickNumber;
    let protocolRequest;

    beforeEach(() => {
      sampleTime = 15;
      tickNumber = 150;
    });

    let exec = () => {
      protocolRequest = new ProtocolRequest([], sampleTime);
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
