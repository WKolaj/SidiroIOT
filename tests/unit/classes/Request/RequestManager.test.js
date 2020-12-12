const RequestManager = require("../../../../classes/Request/RequestManager");

describe("RequestManager", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let exec = () => {
      return new RequestManager();
    };

    it("should create new RequestManager and assign its request as empty array", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.Requests).toEqual([]);
    });
  });
});
