const {
  TickIdNormalizer,
} = require("../../../../../classes/Device/AgentDevice/TickIdNormalizer");

describe("TickIdNormalizer", () => {
  describe("constructor", () => {
    let sendingInterval;
    let normalizationType;

    beforeEach(() => {
      sendingInterval = 123;
      normalizationType = "fakeNormalizationType";
    });

    let exec = () => {
      return new TickIdNormalizer(sendingInterval, normalizationType);
    };

    it("should properly create TickIdNormalizer and set its sendingInterval and normalizationType", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result.SendingInterval).toEqual(sendingInterval);
      expect(result.NormalizationType).toEqual(normalizationType);
    });
  });

  describe("normalizeTickId - noNormalization", () => {
    let sendingInterval;
    let tickId;
    let tickIdNormalizer;

    beforeEach(() => {
      sendingInterval = 15;
      tickId = 123;
    });

    let exec = () => {
      tickIdNormalizer = new TickIdNormalizer(
        sendingInterval,
        "noNormalization"
      );

      return tickIdNormalizer.normalizeTickId(tickId);
    };

    it("should return the same tick id as given in argument", () => {
      let result = exec();
      expect(result).toEqual(tickId);
    });

    it("should return the same tick id as given in argument - if tickId is 0", () => {
      tickId = 0;
      let result = exec();
      expect(result).toEqual(tickId);
    });

    it("should return the same tick id as given in argument - if tickId is null", () => {
      tickId = null;
      let result = exec();
      expect(result).toEqual(tickId);
    });
  });

  describe("normalizeTickId - setTickAsBeginOfInterval", () => {
    let sendingInterval;
    let tickId;
    let tickIdNormalizer;

    beforeEach(() => {
      sendingInterval = 15;
      tickId = 123;
    });

    let exec = () => {
      tickIdNormalizer = new TickIdNormalizer(
        sendingInterval,
        "setTickAsBeginOfInterval"
      );

      return tickIdNormalizer.normalizeTickId(tickId);
    };

    it("should return begining of the interval of tickId", () => {
      //123 - 120 --- 135
      let result = exec();
      expect(result).toEqual(120);
    });

    it("should return begining of the interval of tickId - if tickId is an end of interval", () => {
      //123 - 120 --- 135
      tickId = 135;
      let result = exec();
      expect(result).toEqual(120);
    });

    it("should return the same tick id as given in argument - if tickId is null", () => {
      tickId = null;
      let result = exec();
      expect(result).toEqual(tickId);
    });
  });

  describe("normalizeTickId - setTickAsEndOfInterval", () => {
    let sendingInterval;
    let tickId;
    let tickIdNormalizer;

    beforeEach(() => {
      sendingInterval = 15;
      tickId = 123;
    });

    let exec = () => {
      tickIdNormalizer = new TickIdNormalizer(
        sendingInterval,
        "setTickAsEndOfInterval"
      );

      return tickIdNormalizer.normalizeTickId(tickId);
    };

    it("should return ending of the interval of tickId", () => {
      //123 - 120 --- 135
      let result = exec();
      expect(result).toEqual(135);
    });

    it("should return ending of the interval of tickId - if tickId is an end of interval", () => {
      //123 - 120 --- 135
      tickId = 135;
      let result = exec();
      expect(result).toEqual(135);
    });

    it("should return the same tick id as given in argument - if tickId is null", () => {
      tickId = null;
      let result = exec();
      expect(result).toEqual(tickId);
    });
  });

  describe("normalizeTickId - sendOnlyIfTickFitsSendingInterval", () => {
    let sendingInterval;
    let tickId;
    let tickIdNormalizer;

    beforeEach(() => {
      sendingInterval = 15;
      tickId = 123;
    });

    let exec = () => {
      tickIdNormalizer = new TickIdNormalizer(
        sendingInterval,
        "sendOnlyIfTickFitsSendingInterval"
      );

      return tickIdNormalizer.normalizeTickId(tickId);
    };

    it("should return null - if tickId does not fit sending interval", () => {
      //123 - 120 --- 135
      let result = exec();
      expect(result).toEqual(null);
    });

    it("should return tickId - if tickId is an end of interval", () => {
      //123 - 120 --- 135
      tickId = 135;
      let result = exec();
      expect(result).toEqual(135);
    });

    it("should return tickId - if tickId is a begining of interval", () => {
      //123 - 120 --- 135
      tickId = 120;
      let result = exec();
      expect(result).toEqual(120);
    });

    it("should return the same tick id as given in argument - if tickId is null", () => {
      tickId = null;
      let result = exec();
      expect(result).toEqual(tickId);
    });
  });

  describe("normalizeTickId - null", () => {
    let sendingInterval;
    let tickId;
    let tickIdNormalizer;

    beforeEach(() => {
      sendingInterval = 15;
      tickId = 123;
    });

    let exec = () => {
      tickIdNormalizer = new TickIdNormalizer(sendingInterval, null);

      return tickIdNormalizer.normalizeTickId(tickId);
    };

    it("should return the same value - if type is null", () => {
      //123 - 120 --- 135
      let result = exec();
      expect(result).toEqual(123);
    });

    it("should return the same value - if type is null and tickId is null ", () => {
      tickId = null;
      let result = exec();
      expect(result).toEqual(tickId);
    });
  });
});
