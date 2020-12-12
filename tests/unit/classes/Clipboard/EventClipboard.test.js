const { before } = require("lodash");
const EventClipboard = require("../../../../classes/Clipboard/EventClipboard");

describe("EventClipboard", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let exec = () => {
      return new EventClipboard();
    };

    it("should create new EventClipboard and set _data to null", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result._data).toEqual(null);
    });
  });

  describe("init", () => {
    let payload;
    let eventClipboard;

    beforeEach(() => {
      payload = [
        { tickId: 1001, elementId: "testElementId1", value: 101 },
        { tickId: 1002, elementId: "testElementId2", value: 102 },
        { tickId: 1003, elementId: "testElementId3", value: 103 },
        { tickId: 1004, elementId: "testElementId4", value: 104 },
        { tickId: 1005, elementId: "testElementId5", value: 105 },
      ];
    });

    let exec = () => {
      eventClipboard = new EventClipboard();
      return eventClipboard.init(payload);
    };

    it("should initialize data based on payload", () => {
      exec();

      expect(eventClipboard._data).toEqual(payload);
    });

    it("should initialize data based on payload - if payload is empty", () => {
      payload = {};

      exec();

      expect(eventClipboard._data).toEqual(payload);
    });

    it("should initialize data based and set _data as empty - if payload is undefined", () => {
      payload = undefined;

      exec();

      expect(eventClipboard._data).toEqual([]);
    });

    it("should initialize data based and set _data as empty - if payload is null", () => {
      payload = null;

      exec();

      expect(eventClipboard._data).toEqual([]);
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

      initPayload = [
        { tickId: 1001, elementId: "testElementId1", value: 101 },
        { tickId: 1002, elementId: "testElementId2", value: 102 },
        { tickId: 1003, elementId: "testElementId3", value: 103 },
        { tickId: 1004, elementId: "testElementId4", value: 104 },
        { tickId: 1005, elementId: "testElementId5", value: 105 },
      ];
    });

    let exec = () => {
      dataClipboard = new EventClipboard();
      dataClipboard.init(initPayload);

      return dataClipboard.addData(tickId, elementID, elementValue);
    };

    it("should add data to dataClipboard - if there is no data of given tickid", () => {
      exec();

      let expectedData = [
        ...initPayload,
        { tickId: tickId, elementId: elementID, value: elementValue },
      ];

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should add data to dataClipboard - if data is empty", () => {
      initPayload = [];

      exec();

      let expectedData = [
        { tickId: tickId, elementId: elementID, value: elementValue },
      ];

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should extend data of given tick in dataClipboard - if there is data of given tickid", () => {
      tickId = 1004;

      exec();

      let expectedData = [
        ...initPayload,
        { tickId: tickId, elementId: elementID, value: elementValue },
      ];

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should add data to dataClipboard - if value is null", () => {
      elementValue = null;

      exec();

      let expectedData = [
        ...initPayload,
        { tickId: tickId, elementId: elementID, value: elementValue },
      ];

      expect(dataClipboard._data).toEqual(expectedData);
    });
  });

  describe("clearAllData", () => {
    let initPayload;
    let dataClipboard;

    beforeEach(() => {
      initPayload = [
        { tickId: 1001, elementId: "testElementId1", value: 101 },
        { tickId: 1002, elementId: "testElementId2", value: 102 },
        { tickId: 1003, elementId: "testElementId3", value: 103 },
        { tickId: 1004, elementId: "testElementId4", value: 104 },
        { tickId: 1005, elementId: "testElementId5", value: 105 },
      ];
    });

    let exec = () => {
      dataClipboard = new EventClipboard();
      dataClipboard.init(initPayload);

      return dataClipboard.clearAllData();
    };

    it("should remove all data from Clipboard", () => {
      exec();

      let expectedData = [];

      expect(dataClipboard._data).toEqual(expectedData);
    });

    it("should remove all data from Clipboard - if initial data is empty", () => {
      payload = {};

      exec();

      let expectedData = [];

      expect(dataClipboard._data).toEqual(expectedData);
    });
  });

  describe("getAllData", () => {
    let initPayload;
    let dataClipboard;

    beforeEach(() => {
      initPayload = [
        { tickId: 1001, elementId: "testElementId1", value: 101 },
        { tickId: 1002, elementId: "testElementId2", value: 102 },
        { tickId: 1003, elementId: "testElementId3", value: 103 },
        { tickId: 1004, elementId: "testElementId4", value: 104 },
        { tickId: 1005, elementId: "testElementId5", value: 105 },
      ];
    });

    let exec = () => {
      dataClipboard = new EventClipboard();
      dataClipboard.init(initPayload);

      return dataClipboard.getAllData();
    };

    it("should return all data from Clipboard", () => {
      exec();

      expect(dataClipboard._data).toEqual(initPayload);
    });

    it("should return all data from Clipboard - if data is empty", () => {
      initPayload = [];

      exec();

      expect(dataClipboard._data).toEqual(initPayload);
    });
  });
});
