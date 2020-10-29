const Driver = require("../../../../classes/Driver/Driver");
const { snooze } = require("../../../../utilities/utilities");
const { wrapMethodToInvokeAfter } = require("../../../utilities/testUtilities");

describe("Driver", () => {
  describe("constructor", () => {
    let exec = () => {
      return new Driver();
    };

    it("should create new Driver and initialize its properties properly", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.IsActive).toEqual(false);
      expect(result.Timeout).toEqual(500);
      expect(result.Busy).toEqual(false);
    });
  });

  describe("activate", () => {
    let isActiveBefore;
    let driver;
    let connectMock;
    let disconnectMock;

    beforeEach(() => {
      isActiveBefore = false;
      connectMock = jest.fn();
      disconnectMock = jest.fn();
    });

    let exec = async () => {
      driver = new Driver();

      driver._isActive = isActiveBefore;

      driver._connect = connectMock;
      driver._disconnect = disconnectMock;

      return driver.activate();
    };

    it("should set active to true - if active is false", async () => {
      isActiveBefore = false;

      await exec();
      expect(driver.IsActive).toEqual(true);
    });

    it("should set active to true - if active is true", async () => {
      isActiveBefore = true;

      await exec();
      expect(driver.IsActive).toEqual(true);
    });

    it("should not call connect method", async () => {
      await exec();
      expect(connectMock).not.toHaveBeenCalled();
    });
  });

  describe("deactivate", () => {
    let isActiveBefore;
    let isBusyBefore;
    let driver;
    let connectMock;
    let disconnectMock;

    beforeEach(() => {
      isActiveBefore = true;
      isBusyBefore = false;
      connectMock = jest.fn();
      disconnectMock = jest.fn();
    });

    let exec = async () => {
      driver = new Driver();

      driver._busy = isBusyBefore;
      driver._isActive = isActiveBefore;

      driver._connect = wrapMethodToInvokeAfter(connectMock, 100);
      driver._disconnect = wrapMethodToInvokeAfter(disconnectMock, 100);

      return driver.deactivate();
    };

    it("should set active to false and call disconnect - if active is true", async () => {
      isActiveBefore = true;

      await exec();
      expect(driver.IsActive).toEqual(false);

      expect(disconnectMock).toHaveBeenCalledTimes(1);
    });

    it("should set busy to false - if busy was set to true before", async () => {
      isBusyBefore = true;

      await exec();
      expect(driver.Busy).toEqual(false);
    });

    it("should not call disconnect - if active is false", async () => {
      isActiveBefore = false;

      await exec();
      expect(driver.IsActive).toEqual(false);

      expect(disconnectMock).not.toHaveBeenCalled();
    });

    it("should not set busy to false - if active is false", async () => {
      isBusyBefore = true;
      isActiveBefore = false;

      await exec();
      expect(driver.Busy).toEqual(true);
    });
  });

  describe("invokeRequest", () => {
    let driver;
    let driverTimeout;
    let isActive;
    let isBusy;
    let isConnected;
    let processMockFunc;
    let processMockFuncResult;
    let processMockFuncDelay;
    let connectMockFunc;
    let connectMockFuncDelay;
    let disconnectMockFunc;
    let disconnectMockFuncDelay;
    let request;
    let tickNumber;

    beforeEach(() => {
      tickNumber = 1234;
      driverTimeout = 500;
      isActive = true;
      isConnected = true;
      isBusy = false;
      processMockFuncResult = [1, 2, 3, 4];
      processMockFunc = jest.fn().mockReturnValue(processMockFuncResult);
      processMockFuncDelay = 100;
      request = {
        Variables: ["fakeVariables1", "fakeVariables2", "fakeVariables3"],
        SampleTime: 123,
      };
      connectMockFuncDelay = 100;
      connectMockFunc = jest.fn();
      disconnectMockFuncDelay = 100;
      disconnectMockFunc = jest.fn();
    });

    let exec = async () => {
      driver = new Driver();

      driver._timeout = driverTimeout;
      driver._isActive = isActive;
      driver._busy = isBusy;
      driver._getIsConnectedState = () => isConnected;
      driver._processRequest = wrapMethodToInvokeAfter(
        processMockFunc,
        processMockFuncDelay
      );
      driver._connect = wrapMethodToInvokeAfter(
        connectMockFunc,
        connectMockFuncDelay
      );
      driver._disconnect = wrapMethodToInvokeAfter(
        disconnectMockFunc,
        disconnectMockFuncDelay
      );

      return driver.invokeRequest(request, tickNumber);
    };

    it("should invoke process request and return data from processingRequest", async () => {
      let result = await exec();

      expect(processMockFunc).toHaveBeenCalledTimes(1);
      expect(processMockFunc.mock.calls[0][0]).toEqual(request);
      expect(processMockFunc.mock.calls[0][1]).toEqual(tickNumber);
      expect(result).toEqual(processMockFuncResult);
    });

    it("should set busy to false after successfully invoking request", async () => {
      await exec();

      expect(driver.Busy).toEqual(false);
    });

    it("should not invoke connect or disconnect - if device is connected", async () => {
      isConnected = true;

      await exec();

      expect(connectMockFunc).not.toHaveBeenCalled();
      expect(disconnectMockFunc).not.toHaveBeenCalled();
    });

    it("should invoke connect before processing request - if device is not connected", async () => {
      isConnected = false;

      await exec();

      expect(connectMockFunc).toHaveBeenCalledTimes(1);
      expect(connectMockFunc).toHaveBeenCalledBefore(processMockFunc);

      //Disconnect should not have been called

      expect(disconnectMockFunc).not.toHaveBeenCalled();
    });

    it("should reject, not invoke process request and connect and disconnect and leave busy set to true - if driver is busy", async () => {
      //Invoking connect only if device is not connected
      isConnected = false;
      isBusy = true;

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

      expect(error.message).toEqual("Driver is busy");

      expect(processMockFunc).not.toHaveBeenCalled();
      expect(connectMockFunc).not.toHaveBeenCalled();
      expect(disconnectMockFunc).not.toHaveBeenCalled();

      //busy should be set to false
      expect(driver.Busy).toEqual(true);
    });

    it("should reject, not invoke process request and connect and disconnect and leave busy set to false - if driver is not active", async () => {
      //Invoking connect only if device is not connected
      isConnected = false;
      isActive = false;

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

      expect(error.message).toEqual("Driver is not active");

      expect(processMockFunc).not.toHaveBeenCalled();
      expect(connectMockFunc).not.toHaveBeenCalled();
      expect(disconnectMockFunc).not.toHaveBeenCalled();

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject, not invoke process request and invoke disconnect and leave busy set to false - if connect throws", async () => {
      //Invoking connect only if device is not connected
      isConnected = false;

      connectMockFunc = () => {
        throw new Error("testError");
      };

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

      expect(error.message).toEqual("Error while trying to connect");

      //process should not be invoked
      expect(processMockFunc).not.toHaveBeenCalled();

      //disconnect should be invoked
      expect(disconnectMockFunc).toHaveBeenCalledTimes(1);

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject, not invoke process request and leave busy set to false - if connect throws and than disconnect throws", async () => {
      //Invoking connect only if device is not connected
      isConnected = false;

      connectMockFunc = () => {
        throw new Error("testError1");
      };

      disconnectMockFunc = () => {
        throw new Error("testError2");
      };

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

      expect(error.message).toEqual("Error while trying to connect");

      //process should not be invoked
      expect(processMockFunc).not.toHaveBeenCalled();

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject, not invoke process request and invoke disconnect and leave busy set to false - if connecting takes more time than timeout", async () => {
      //Invoking connect only if device is not connected
      isConnected = false;

      connectMockFuncDelay = 1000;

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

      expect(error.message).toEqual("Error while trying to connect");

      //process should not be invoked
      expect(processMockFunc).not.toHaveBeenCalled();

      //disconnect should be invoked
      expect(disconnectMockFunc).toHaveBeenCalledTimes(1);

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject and invoke disconnect and leave busy set to false - if processing request takes more time than timeout", async () => {
      processMockFuncDelay = 1000;

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

      expect(error.message).toEqual("Processing data timeout error");

      //connect should not be invoked
      expect(connectMockFunc).not.toHaveBeenCalled();

      //disconnect should be invoked
      expect(disconnectMockFunc).toHaveBeenCalledTimes(1);

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject and invoke disconnect and leave busy set to false - if processing request takes more time than timeout and disconnect throws", async () => {
      processMockFuncDelay = 1000;

      disconnectMockFunc = () => {
        throw new Error("testError2");
      };

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

      expect(error.message).toEqual("Processing data timeout error");

      //connect should not be invoked
      expect(connectMockFunc).not.toHaveBeenCalled();

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject and invoke disconnect and leave busy set to false - if processing throws an error", async () => {
      processMockFunc = () => {
        throw new Error("testError");
      };

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

      expect(error.message).toEqual("testError");

      //connect should not be invoked
      expect(connectMockFunc).not.toHaveBeenCalled();

      //disconnect should be invoked
      expect(disconnectMockFunc).toHaveBeenCalledTimes(1);

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject and invoke disconnect and leave busy set to false - if processing throws an error and disconnect throws", async () => {
      processMockFunc = () => {
        throw new Error("testError1");
      };

      disconnectMockFunc = () => {
        throw new Error("testError2");
      };

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

      expect(error.message).toEqual("testError1");

      //connect should not be invoked
      expect(connectMockFunc).not.toHaveBeenCalled();

      //busy should be set to false
      expect(driver.Busy).toEqual(false);
    });

    it("should reject, not invoke process request or connect or disconnect - if device is busy due to data processing and there is no need to connect", async () => {
      //isConnected set to true - no need to connect
      isConnected = true;

      driver = new Driver();

      driver._timeout = driverTimeout;
      driver._isActive = isActive;
      driver._busy = isBusy;
      driver._getIsConnectedState = () => isConnected;
      driver._processRequest = wrapMethodToInvokeAfter(
        processMockFunc,
        processMockFuncDelay
      );
      driver._connect = wrapMethodToInvokeAfter(
        connectMockFunc,
        connectMockFuncDelay
      );
      driver._disconnect = wrapMethodToInvokeAfter(
        disconnectMockFunc,
        disconnectMockFuncDelay
      );

      let processRequestResult1 = null;
      let processRequestResult2 = null;

      //invoking requests two times - second time with a litte offset
      let results = await Promise.all([
        new Promise(async (resolve, reject) => {
          try {
            processRequestResult1 = await driver.invokeRequest(request);
            return resolve();
          } catch (err) {
            return resolve(err);
          }
        }),

        new Promise(async (resolve, reject) => {
          try {
            await snooze(50);
            processRequestResult2 = await driver.invokeRequest(request);
            return resolve();
          } catch (err) {
            return resolve(err);
          }
        }),
      ]);

      //First invoke should be ok. - should not resolve error
      expect(results[0]).not.toBeDefined();
      expect(processRequestResult1).toEqual(processMockFuncResult);

      //Second invoke should result in busy error
      expect(results[1]).toBeDefined();
      expect(results[1].message).toEqual("Driver is busy");

      //Process function should be invoked only one time - during first invoke
      expect(processMockFunc).toHaveBeenCalledTimes(1);

      //Connect function should be invoked only one time - during first invoke
      expect(connectMockFunc).not.toHaveBeenCalled();

      //Disconnect function should not be invoked
      expect(disconnectMockFunc).not.toHaveBeenCalled();

      //busy should be set to false at the end
      expect(driver.Busy).toEqual(false);
    });

    it("should reject, not invoke process request or connect or disconnect - if device is busy due to data processing and there is a need to connect", async () => {
      //isConnected set to true - a need to connect
      isConnected = false;

      driver = new Driver();

      driver._timeout = driverTimeout;
      driver._isActive = isActive;
      driver._busy = isBusy;
      driver._getIsConnectedState = () => isConnected;
      driver._processRequest = wrapMethodToInvokeAfter(
        processMockFunc,
        processMockFuncDelay
      );
      driver._connect = wrapMethodToInvokeAfter(
        connectMockFunc,
        connectMockFuncDelay
      );
      driver._disconnect = wrapMethodToInvokeAfter(
        disconnectMockFunc,
        disconnectMockFuncDelay
      );

      let processRequestResult1 = null;
      let processRequestResult2 = null;

      //invoking requests two times - second time with a litte offset
      let results = await Promise.all([
        new Promise(async (resolve, reject) => {
          try {
            processRequestResult1 = await driver.invokeRequest(request);
            return resolve();
          } catch (err) {
            return resolve(err);
          }
        }),

        new Promise(async (resolve, reject) => {
          try {
            await snooze(50);
            processRequestResult2 = await driver.invokeRequest(request);
            return resolve();
          } catch (err) {
            return resolve(err);
          }
        }),
      ]);

      //First invoke should be ok. - should not resolve error
      expect(results[0]).not.toBeDefined();
      expect(processRequestResult1).toEqual(processMockFuncResult);

      //Second invoke should result in busy error
      expect(results[1]).toBeDefined();
      expect(results[1].message).toEqual("Driver is busy");

      //Process function should be invoked only one time - during first invoke
      expect(processMockFunc).toHaveBeenCalledTimes(1);

      //Connect function should be invoked only one time - during first invoke
      expect(connectMockFunc).toHaveBeenCalledTimes(1);

      //Disconnect function should not be invoked
      expect(disconnectMockFunc).not.toHaveBeenCalled();

      //busy should be set to false at the end
      expect(driver.Busy).toEqual(false);
    });
  });
});
