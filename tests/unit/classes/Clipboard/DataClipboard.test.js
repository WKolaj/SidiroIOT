const { before } = require("lodash");
const DataClipboard = require("../../../../classes/Clipboard/DataClipboard");

describe("DataClipboard", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let exec = () => {
      return new DataClipboard();
    };

    it("should create new DataClipboard and set _data to null", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result._data).toEqual(null);
    });
  });

  describe("init", () => {
    let payload;
    let dataClipboard;

    beforeEach(() => {
      payload = {
        1000: {
          testElementID0: 0,
          testElementID1: 100,
          testElementID2: 200,
          testElementID3: 300,
          testElementID4: 400,
          testElementID5: 500,
          testElementID6: 600,
          testElementID7: 700,
          testElementID8: 800,
          testElementID9: 900,
        },
        1001: {
          testElementID0: 1,
          testElementID1: 101,
          testElementID2: 201,
          testElementID3: 301,
          testElementID4: 401,
          testElementID5: 501,
          testElementID6: 601,
          testElementID7: 701,
          testElementID8: 801,
          testElementID9: 901,
        },
        1002: {
          testElementID0: 2,
          testElementID1: 102,
          testElementID2: 202,
          testElementID3: 302,
          testElementID4: 402,
          testElementID5: 502,
          testElementID6: 602,
          testElementID7: 702,
          testElementID8: 802,
          testElementID9: 902,
        },
        1003: {
          testElementID0: 3,
          testElementID1: 103,
          testElementID2: 203,
          testElementID3: 303,
          testElementID4: 403,
          testElementID5: 503,
          testElementID6: 603,
          testElementID7: 703,
          testElementID8: 803,
          testElementID9: 903,
        },
        1004: {
          testElementID0: 4,
          testElementID1: 104,
          testElementID2: 204,
          testElementID3: 304,
          testElementID4: 404,
          testElementID5: 504,
          testElementID6: 604,
          testElementID7: 704,
          testElementID8: 804,
          testElementID9: 904,
        },
        1005: {
          testElementID0: 5,
          testElementID1: 105,
          testElementID2: 205,
          testElementID3: 305,
          testElementID4: 405,
          testElementID5: 505,
          testElementID6: 605,
          testElementID7: 705,
          testElementID8: 805,
          testElementID9: 905,
        },
      };
    });

    let exec = () => {
      dataClipboard = new DataClipboard();
      return dataClipboard.init(payload);
    };

    it("should initialize data based on payload", () => {
      exec();

      expect(dataClipboard._data).toEqual(payload);
    });

    it("should initialize data based on payload - if payload is empty", () => {
      payload = {};

      exec();

      expect(dataClipboard._data).toEqual(payload);
    });

    it("should initialize data based and set _data as empty - if payload is undefined", () => {
      payload = undefined;

      exec();

      expect(dataClipboard._data).toEqual({});
    });

    it("should initialize data based and set _data as empty - if payload is null", () => {
      payload = null;

      exec();

      expect(dataClipboard._data).toEqual({});
    });
  });

  describe("setData", () => {
    let initPayload;
    let dataClipboard;
    let elementID;
    let elementValue;
    let tickId;

    beforeEach(() => {
      elementID = "testElementID10";
      elementValue = 123;
      tickId = 456;

      initPayload = {
        1000: {
          testElementID0: 0,
          testElementID1: 100,
          testElementID2: 200,
          testElementID3: 300,
          testElementID4: 400,
          testElementID5: 500,
          testElementID6: 600,
          testElementID7: 700,
          testElementID8: 800,
          testElementID9: 900,
        },
        1001: {
          testElementID0: 1,
          testElementID1: 101,
          testElementID2: 201,
          testElementID3: 301,
          testElementID4: 401,
          testElementID5: 501,
          testElementID6: 601,
          testElementID7: 701,
          testElementID8: 801,
          testElementID9: 901,
        },
        1002: {
          testElementID0: 2,
          testElementID1: 102,
          testElementID2: 202,
          testElementID3: 302,
          testElementID4: 402,
          testElementID5: 502,
          testElementID6: 602,
          testElementID7: 702,
          testElementID8: 802,
          testElementID9: 902,
        },
        1003: {
          testElementID0: 3,
          testElementID1: 103,
          testElementID2: 203,
          testElementID3: 303,
          testElementID4: 403,
          testElementID5: 503,
          testElementID6: 603,
          testElementID7: 703,
          testElementID8: 803,
          testElementID9: 903,
        },
        1004: {
          testElementID0: 4,
          testElementID1: 104,
          testElementID2: 204,
          testElementID3: 304,
          testElementID4: 404,
          testElementID5: 504,
          testElementID6: 604,
          testElementID7: 704,
          testElementID8: 804,
          testElementID9: 904,
        },
        1005: {
          testElementID0: 5,
          testElementID1: 105,
          testElementID2: 205,
          testElementID3: 305,
          testElementID4: 405,
          testElementID5: 505,
          testElementID6: 605,
          testElementID7: 705,
          testElementID8: 805,
          testElementID9: 905,
        },
      };
    });

    let exec = () => {
      dataClipboard = new DataClipboard();
      dataClipboard.init(initPayload);

      return dataClipboard.addData(tickId, elementID, elementValue);
    };

    it("should add data to dataClipboard - if there is no data of given tickid", () => {
      exec();

      let expectedData = {
        ...initPayload,
        [tickId]: {
          [elementID]: elementValue,
        },
      };

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should add data to dataClipboard - if data is empty", () => {
      initPayload = {};

      exec();

      let expectedData = {
        [tickId]: {
          [elementID]: elementValue,
        },
      };

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should extend data of given tick in dataClipboard - if there is data of given tickid", () => {
      tickId = 1004;

      exec();

      let expectedData = {
        ...initPayload,

        1004: {
          testElementID0: 4,
          testElementID1: 104,
          testElementID2: 204,
          testElementID3: 304,
          testElementID4: 404,
          testElementID5: 504,
          testElementID6: 604,
          testElementID7: 704,
          testElementID8: 804,
          testElementID9: 904,
          [elementID]: elementValue,
        },
      };

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should override existing data - if there is data of given tickid with element of given id", () => {
      tickId = 1004;
      elementID = "testElementID6";

      exec();

      let expectedData = {
        ...initPayload,

        1004: {
          testElementID0: 4,
          testElementID1: 104,
          testElementID2: 204,
          testElementID3: 304,
          testElementID4: 404,
          testElementID5: 504,
          testElementID6: elementValue,
          testElementID7: 704,
          testElementID8: 804,
          testElementID9: 904,
        },
      };

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should add data to dataClipboard - if value is null", () => {
      elementValue = null;

      exec();

      let expectedData = {
        ...initPayload,
        [tickId]: {
          [elementID]: elementValue,
        },
      };

      expect(dataClipboard._data).toEqual(expectedData);
    });
  });

  describe("clearAllData", () => {
    let initPayload;
    let dataClipboard;

    beforeEach(() => {
      initPayload = {
        1000: {
          testElementID0: 0,
          testElementID1: 100,
          testElementID2: 200,
          testElementID3: 300,
          testElementID4: 400,
          testElementID5: 500,
          testElementID6: 600,
          testElementID7: 700,
          testElementID8: 800,
          testElementID9: 900,
        },
        1001: {
          testElementID0: 1,
          testElementID1: 101,
          testElementID2: 201,
          testElementID3: 301,
          testElementID4: 401,
          testElementID5: 501,
          testElementID6: 601,
          testElementID7: 701,
          testElementID8: 801,
          testElementID9: 901,
        },
        1002: {
          testElementID0: 2,
          testElementID1: 102,
          testElementID2: 202,
          testElementID3: 302,
          testElementID4: 402,
          testElementID5: 502,
          testElementID6: 602,
          testElementID7: 702,
          testElementID8: 802,
          testElementID9: 902,
        },
        1003: {
          testElementID0: 3,
          testElementID1: 103,
          testElementID2: 203,
          testElementID3: 303,
          testElementID4: 403,
          testElementID5: 503,
          testElementID6: 603,
          testElementID7: 703,
          testElementID8: 803,
          testElementID9: 903,
        },
        1004: {
          testElementID0: 4,
          testElementID1: 104,
          testElementID2: 204,
          testElementID3: 304,
          testElementID4: 404,
          testElementID5: 504,
          testElementID6: 604,
          testElementID7: 704,
          testElementID8: 804,
          testElementID9: 904,
        },
        1005: {
          testElementID0: 5,
          testElementID1: 105,
          testElementID2: 205,
          testElementID3: 305,
          testElementID4: 405,
          testElementID5: 505,
          testElementID6: 605,
          testElementID7: 705,
          testElementID8: 805,
          testElementID9: 905,
        },
      };
    });

    let exec = () => {
      dataClipboard = new DataClipboard();
      dataClipboard.init(initPayload);

      return dataClipboard.clearAllData();
    };

    it("should remove all data from Clipboard", () => {
      exec();

      let expectedData = {};

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should remove all data from Clipboard - if initial data is empty", () => {
      payload = {};

      exec();

      let expectedData = {};

      expect(dataClipboard._data).toEqual(expectedData);
    });
  });

  describe("getAllData", () => {
    let initPayload;
    let dataClipboard;

    beforeEach(() => {
      initPayload = {
        1000: {
          testElementID0: 0,
          testElementID1: 100,
          testElementID2: 200,
          testElementID3: 300,
          testElementID4: 400,
          testElementID5: 500,
          testElementID6: 600,
          testElementID7: 700,
          testElementID8: 800,
          testElementID9: 900,
        },
        1001: {
          testElementID0: 1,
          testElementID1: 101,
          testElementID2: 201,
          testElementID3: 301,
          testElementID4: 401,
          testElementID5: 501,
          testElementID6: 601,
          testElementID7: 701,
          testElementID8: 801,
          testElementID9: 901,
        },
        1002: {
          testElementID0: 2,
          testElementID1: 102,
          testElementID2: 202,
          testElementID3: 302,
          testElementID4: 402,
          testElementID5: 502,
          testElementID6: 602,
          testElementID7: 702,
          testElementID8: 802,
          testElementID9: 902,
        },
        1003: {
          testElementID0: 3,
          testElementID1: 103,
          testElementID2: 203,
          testElementID3: 303,
          testElementID4: 403,
          testElementID5: 503,
          testElementID6: 603,
          testElementID7: 703,
          testElementID8: 803,
          testElementID9: 903,
        },
        1004: {
          testElementID0: 4,
          testElementID1: 104,
          testElementID2: 204,
          testElementID3: 304,
          testElementID4: 404,
          testElementID5: 504,
          testElementID6: 604,
          testElementID7: 704,
          testElementID8: 804,
          testElementID9: 904,
        },
        1005: {
          testElementID0: 5,
          testElementID1: 105,
          testElementID2: 205,
          testElementID3: 305,
          testElementID4: 405,
          testElementID5: 505,
          testElementID6: 605,
          testElementID7: 705,
          testElementID8: 805,
          testElementID9: 905,
        },
      };
    });

    let exec = () => {
      dataClipboard = new DataClipboard();
      dataClipboard.init(initPayload);

      return dataClipboard.getAllData();
    };

    it("should return all data from Clipboard", () => {
      exec();

      expect(dataClipboard._data).toEqual(initPayload);
    });

    it("should return all data from Clipboard - if data is empty", () => {
      initPayload = {};

      exec();

      expect(dataClipboard._data).toEqual(initPayload);
    });
  });
});
