const Sampler = require("../../../../classes/Sampler/Sampler");
const { snooze } = require("../../../../utilities/utilities");

describe("Sampler", () => {
  describe("constructor", () => {
    let exec = () => {
      return new Sampler();
    };

    it("should create new Sampler and init its properties", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result._internalTickHandler).toEqual(null);
      expect(result._active).toEqual(false);
      expect(result._internalTickInterval).toEqual(100);
      expect(result._lastExternalTickNumber).toEqual(0);
      expect(result._externalTickHandler).toEqual(null);
    });
  });

  describe("doesTickIdMatchesTick", () => {
    let tickId;
    let tickNumber;

    beforeEach(() => {
      tickId = 15;
      tickNumber = 150;
    });

    let exec = () => {
      return Sampler.doesTickIdMatchesTick(tickNumber, tickId);
    };

    it("should return true if tickNumber matches tickId", () => {
      let result = exec();

      expect(result).toBeTruthy();
    });

    it("should return true if tickNumber doest not match tickId", () => {
      tickNumber = 151;

      let result = exec();

      expect(result).toBeFalsy();
    });

    it("should always return false if tickId is zero", () => {
      tickId = 0;

      let result = exec();

      expect(result).toBeFalsy();
    });
  });

  describe("convertDateToTickNumber", () => {
    let date;

    beforeEach(() => {
      date = 1234;
    });

    let exec = () => {
      return Sampler.convertDateToTickNumber(date);
    };

    it("should convert date to tickId - divide it by 1000 and round", () => {
      let result = exec();

      expect(result).toEqual(1);
    });

    it("should round to nearest value if value is lesser", () => {
      date = 2999;
      let result = exec();

      expect(result).toEqual(3);
    });

    it("should round to nearest value if value is greater", () => {
      date = 3001;
      let result = exec();

      expect(result).toEqual(3);
    });

    it("should round to nearest value if value is lesser", () => {
      date = 2999;
      let result = exec();

      expect(result).toEqual(3);
    });

    it("should round to nearest value if value is greater", () => {
      date = 3001;
      let result = exec();

      expect(result).toEqual(3);
    });
  });

  describe("convertTickNumberToDate", () => {
    let tickNumber;

    beforeEach(() => {
      tickNumber = 1234;
    });

    let exec = () => {
      return Sampler.convertTickNumberToDate(tickNumber);
    };

    it("should convert tickNumber to date - multiply it by 1000 ", () => {
      let result = exec();

      expect(result).toEqual(1234*1000);
    });

  });

  describe("_shouldExternalTickBeEmitted", () => {
    let sampler;
    let lastTickTimeNumber;
    let timeNumber;

    beforeEach(() => {
      sampler = new Sampler();
      lastTickTimeNumber = 100;
      timeNumber = 100;
    });

    let exec = () => {
      sampler._lastExternalTickNumber = lastTickTimeNumber;
      return sampler._shouldExternalTickBeEmitted(timeNumber);
    };

    it("should return false if _lastExternalTickNumber is equal actual tickTimeNumber", () => {
      let result = exec();

      expect(result).toBeFalsy();
    });

    it("should return true if _lastExternalTickNumber is different than actual tickTimeNumber", () => {
      timeNumber = 150;
      let result = exec();

      expect(result).toBeTruthy();
    });
  });

  describe("_onInternalTick", () => {
    let sampler;
    let externalTickHandler;
    let externalTickHandlerInnerMock;
    let shouldEmitMockFunc;
    let shouldEmit;
    let active;

    beforeEach(() => {
      active = true;
      //additional method in order to check whether externalTickHandler was awaited
      externalTickHandlerInnerMock = jest.fn();
      externalTickHandler = jest.fn(async(tickNumber)=>{
        await snooze(100);
        externalTickHandlerInnerMock(tickNumber);
      });
      sampler = new Sampler();
      shouldEmit = true;
    });

    let exec = () => {
      sampler._active = active;
      sampler.ExternalTickHandler = externalTickHandler;
      shouldEmitMockFunc = jest.fn(()=>{return shouldEmit});
      sampler._shouldExternalTickBeEmitted = shouldEmitMockFunc;
      return sampler._onInternalTick();
    };

    it("Should invoke externalTickHandler and await for externalTickHandlerInnerMock with argument of new timeNumber", async () => {
      let firstDate = Sampler.convertDateToTickNumber(Date.now());

      await exec();

      let lastDate = Sampler.convertDateToTickNumber(Date.now());

      expect(externalTickHandler).toHaveBeenCalledTimes(1);
      expect(externalTickHandler.mock.calls[0][0]).toBeGreaterThanOrEqual(firstDate);
      expect(externalTickHandler.mock.calls[0][0]).toBeLessThanOrEqual(lastDate);

      expect(externalTickHandlerInnerMock).toHaveBeenCalledTimes(1);
      expect(externalTickHandlerInnerMock.mock.calls[0][0]).toBeGreaterThanOrEqual(firstDate);
      expect(externalTickHandlerInnerMock.mock.calls[0][0]).toBeLessThanOrEqual(lastDate);
    });

    it("Should not call anything if sampler is not active", async () => {
      active = false;
      
      await exec();

      expect(externalTickHandler).not.toHaveBeenCalled();

      expect(externalTickHandlerInnerMock).not.toHaveBeenCalled();
    });

    it("Should not call anything if should emit return false", async () => {
      shouldEmit = false;
      
      await exec();

      expect(externalTickHandler).not.toHaveBeenCalled();

      expect(externalTickHandlerInnerMock).not.toHaveBeenCalled();
    });

    it("Should not call anything and not throw if there is no TickHandler", async () => {
      externalTickHandler = null;
      
      await exec();
    });


    it("Should not throw if external tick handler throws", async () => {
      externalTickHandler = jest.fn(async()=>{throw new Error("test error")});
      
      await expect(new Promise(async(resolve,reject)=>{
        try
        {
          await exec();
          return resolve(true);
        }
        catch(err)
        {
          return reject(err);
        }
      })).resolves.toBeDefined();
    });
  });

  describe("start", () => {
    let sampler;
    let onInternalTickMock;
    let active;

    beforeEach(() => {
      jest.useFakeTimers();

      active = false;
      onInternalTickMock = jest.fn();

      sampler = new Sampler();
    });

    let exec = () => {
      sampler._onInternalTick = onInternalTickMock;
      sampler._active = active;
      return sampler.start();
    };

    it("Should start handler invoking tick every 100 ms", () => {
      exec();
      jest.advanceTimersByTime(1000);

      expect(onInternalTickMock).toHaveBeenCalledTimes(10);
      expect(sampler._internalTickHandler).toBeDefined();
    });

    it("Should set active to true", () => {
      exec();
      expect(sampler.Active).toEqual(true);
    });

    it("Should not start handler invoking tick every 100 ms if sampler already active", () => {
      active = true;
      exec();
      jest.advanceTimersByTime(1000);

      expect(onInternalTickMock).not.toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    let sampler;
    let onInternalTickMock;

    beforeEach(() => {
      sampler = new Sampler();
      onInternalTickMock = jest.fn();
      sampler._onInternalTick = onInternalTickMock;
    });

    let exec = () => {
      jest.useFakeTimers();

      sampler.start();
      
      return sampler.stop();
    };

    it("Should stop sampler intervalHandler and stop invoking onInternalTick", () => {
      exec();
      expect(sampler._internalTickHandler).toEqual(null);

      jest.advanceTimersByTime(1000);

      expect(onInternalTickMock).not.toHaveBeenCalled();

    });

    it("Should set active to false", () => {
      exec();
      expect(sampler.Active).toEqual(false);
    });
  });

  describe("LastExternalTickNumber", () => {
    let sampler;

    let exec = () => {
      sampler = new Sampler();
      return sampler.LastExternalTickNumber;
    };

    it("should return LastExternalTickNumber", () => {
      expect(exec()).toEqual(sampler._lastExternalTickNumber);
    });
  });

  describe("InternalTickInterval", () => {
    let sampler;

    let exec = () => {
      sampler = new Sampler();
      return sampler.InternalTickInterval;
    };

    it("should return InternalTickInterval", () => {
      expect(exec()).toEqual(sampler._internalTickInterval);
    });
  });

  describe("Active", () => {
    let sampler;

    let exec = () => {
      sampler = new Sampler();
      return sampler.Active;
    };

    it("should return Active", () => {
      expect(exec()).toEqual(sampler._active);
    });
  });

});
