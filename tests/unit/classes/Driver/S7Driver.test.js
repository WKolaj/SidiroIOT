const S7Driver = require("../../../../classes/Driver/S7Driver");
const S7Request = require("../../../../classes/Request/S7Request/S7Request");
const { snooze } = require("../../../../utilities/utilities");
const {
  createFakeMBVariable,
  createFakeS7Variable,
} = require("../../../utilities/testUtilities");

describe("S7Driver", () => {
  describe("constructor", () => {
    let exec = () => {
      return new S7Driver();
    };

    it("should create new Driver and initialize its properties properly", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.IsActive).toEqual(false);
      expect(result.Timeout).toEqual(3000);
      expect(result.Busy).toEqual(false);

      //Default values
      expect(result.Client).toBeDefined();
      expect(result.IPAddress).toEqual("192.168.0.1");
      expect(result.Rack).toEqual(0);
      expect(result.Slot).toEqual(1);
    });

    it("should properly set flags associated with invoking requests", () => {
      let result = exec();

      expect(result._enableConnectTimeout).toEqual(false);
      expect(result._disconnectOnConnectTimeout).toEqual(false);
      expect(result._disconnectOnConnectError).toEqual(false);
      expect(result._disconnectOnProcessTimeout).toEqual(false);
      expect(result._disconnectOnProcessError).toEqual(true);
      expect(result._enableProcessTimeout).toEqual(false);
      expect(result._connectWhenDisconnectedOnProcess).toEqual(true);
      expect(result._includeLastProcessingFailInConnection).toEqual(false);
    });
  });

  describe("_getIsConnectedState", () => {
    let driver;
    let connectedMockState;

    beforeEach(() => {
      connectedMockState = true;
    });

    let exec = () => {
      driver = new S7Driver();
      driver.Client._client._connected = connectedMockState;

      return driver._getIsConnectedState();
    };

    it("should return Connected state of S7 client - Connected is true", () => {
      connectedMockState = true;

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return Connected state of S7 client- Connected is false", () => {
      connectedMockState = false;
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("get Timeout", () => {
    let driver;
    let connectTimeout;
    let recieveTimeout;
    let sendTimeout;

    beforeEach(() => {
      connectTimeout = 100;
      recieveTimeout = 200;
      sendTimeout = 300;
    });

    let exec = () => {
      driver = new S7Driver();

      driver.Client._client._connectTimeout = connectTimeout;
      driver.Client._client._sendTimeout = sendTimeout;
      driver.Client._client._recieveTimeout = recieveTimeout;

      return driver.Timeout;
    };

    it("should return Timeout of of client's recieve timeout", () => {
      recieveTimeout = 200;

      let result = exec();

      expect(result).toEqual(recieveTimeout);
    });
  });

  describe("setTimeout", () => {
    let driver;
    let connectTimeout;
    let recieveTimeout;
    let sendTimeout;
    let timeoutToSet;

    beforeEach(() => {
      connectTimeout = 100;
      recieveTimeout = 200;
      sendTimeout = 300;
      timeoutToSet = 400;
    });

    let exec = () => {
      driver = new S7Driver();

      driver.Client._client._connectTimeout = connectTimeout;
      driver.Client._client._sendTimeout = sendTimeout;
      driver.Client._client._recieveTimeout = recieveTimeout;

      driver.setTimeout(timeoutToSet);
    };

    it("should set the same value to every timeout of client", () => {
      exec();

      expect(driver.Client._client._connectTimeout).toEqual(timeoutToSet);
      expect(driver.Client._client._sendTimeout).toEqual(timeoutToSet);
      expect(driver.Client._client._recieveTimeout).toEqual(timeoutToSet);
    });
  });

  describe("_connect", () => {
    let driver;
    let rack;
    let slot;
    let ipAddress;

    beforeEach(() => {
      rack = 1;
      slot = 2;
      ipAddress = "192.168.100.200";

      jest.resetAllMocks();
    });

    let exec = async () => {
      driver = new S7Driver();

      driver._rack = rack;
      driver._slot = slot;
      driver._ipAddress = ipAddress;

      return driver._connect();
    };

    it("should call ConnectTo of S7Client", async () => {
      await exec();

      expect(driver.Client._client.ConnectTo).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.ConnectTo.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );

      expect(driver.Client._client.ConnectTo.mock.calls[0][1]).toEqual(
        driver.Rack
      );

      expect(driver.Client._client.ConnectTo.mock.calls[0][2]).toEqual(
        driver.Slot
      );
    });
  });

  describe("_disconnect", () => {
    let driver;

    beforeEach(() => {
      jest.resetAllMocks();
    });

    let exec = async () => {
      driver = new S7Driver();
      return driver._disconnect();
    };

    it("should call Disconnect of S7Driver", async () => {
      await exec();

      expect(driver.Client._client.Disconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe("_processRequest", () => {
    let driver;

    let variable1;
    let variable1SampleTime;
    let variable1Offset;
    let variable1Length;
    let variable1MemoryType;
    let variable1DBNumber;
    let variable1Read;
    let variable1ReadAsSeperate;
    let variable1Write;
    let variable1WriteAsSeperate;
    let variable1Data;

    let variable2;
    let variable2SampleTime;
    let variable2Offset;
    let variable2Length;
    let variable2MemoryType;
    let variable2DBNumber;
    let variable2Read;
    let variable2ReadAsSeperate;
    let variable2Write;
    let variable2WriteAsSeperate;
    let variable2Data;

    let variable3;
    let variable3SampleTime;
    let variable3Offset;
    let variable3Length;
    let variable3MemoryType;
    let variable3DBNumber;
    let variable3Read;
    let variable3ReadAsSeperate;
    let variable3Write;
    let variable3WriteAsSeperate;
    let variable3Data;

    let sampleTime;
    let writeRequest;
    let memoryType;
    let dbNumber;

    let request;
    let tickId;

    beforeEach(() => {
      tickId = 105;
      sampleTime = 15;
      writeRequest = false;
      memoryType = "DB";
      dbNumber = 3;

      variable1SampleTime = 15;
      variable1Offset = 1;
      variable1Length = 1;
      variable1MemoryType = "DB";
      variable1DBNumber = 3;
      variable1Read = true;
      variable1ReadAsSeperate = false;
      variable1Write = false;
      variable1WriteAsSeperate = false;

      variable2SampleTime = 15;
      variable2Offset = 2;
      variable2Length = 2;
      variable2MemoryType = "DB";
      variable2DBNumber = 3;
      variable2Read = true;
      variable2ReadAsSeperate = false;
      variable2Write = false;
      variable2WriteAsSeperate = false;

      variable3SampleTime = 15;
      variable3Offset = 4;
      variable3Length = 3;
      variable3MemoryType = "DB";
      variable3DBNumber = 3;
      variable3Read = true;
      variable3ReadAsSeperate = false;
      variable3Write = false;
      variable3WriteAsSeperate = false;

      variable1Data = [1];
      variable2Data = [2, 3];
      variable3Data = [4, 5, 6];

      jest.resetAllMocks();
    });

    let exec = async () => {
      variable1 = createFakeS7Variable(
        null,
        null,
        "var1Id",
        "var1Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable1SampleTime,
        [],
        variable1Offset,
        variable1Length,
        () => 0,
        () => [0],
        variable1MemoryType,
        variable1DBNumber,
        variable1Read,
        variable1Write,
        variable1ReadAsSeperate,
        variable1WriteAsSeperate
      );

      variable2 = createFakeS7Variable(
        null,
        null,
        "var2Id",
        "var2Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable2SampleTime,
        [],
        variable2Offset,
        variable2Length,
        () => 0,
        () => [0],
        variable2MemoryType,
        variable2DBNumber,
        variable2Read,
        variable2Write,
        variable2ReadAsSeperate,
        variable2WriteAsSeperate
      );

      variable3 = createFakeS7Variable(
        null,
        null,
        "var3Id",
        "var3Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable3SampleTime,
        [],
        variable3Offset,
        variable3Length,
        () => 0,
        () => [0],
        variable3MemoryType,
        variable3DBNumber,
        variable3Read,
        variable3Write,
        variable3ReadAsSeperate,
        variable3WriteAsSeperate
      );

      variable1._data = variable1Data;
      variable2._data = variable2Data;
      variable3._data = variable3Data;

      variables = [variable1, variable2, variable3];

      //Total offset = 1
      //Total length = 6

      request = new S7Request(
        variables,
        sampleTime,
        writeRequest,
        memoryType,
        dbNumber
      );

      driver = new S7Driver();

      await driver._connect();
      return driver._processRequest(request, tickId);
    };

    it("should call DBRead of Driver and return data - if request is to read DB", async () => {
      let result = await exec();
      expect(driver.Client._client.DBRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.DBRead.mock.calls[0][0]).toEqual(dbNumber);
      expect(driver.Client._client.DBRead.mock.calls[0][1]).toEqual(1);
      expect(driver.Client._client.DBRead.mock.calls[0][2]).toEqual(6);

      //Mocked DBRead has registers: [15, 16, 17, 18, 19, 20, 21]
      expect(result).toEqual([16, 17, 18, 19, 20, 21]);
    });

    it("should call EBRead of Driver and return data - if request is to read I", async () => {
      memoryType = "I";
      dbNumber = null;
      variable1MemoryType = "I";
      variable1DBNumber = null;
      variable2MemoryType = "I";
      variable2DBNumber = null;
      variable3MemoryType = "I";
      variable3DBNumber = null;

      let result = await exec();
      expect(driver.Client._client.EBRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.EBRead.mock.calls[0][0]).toEqual(1);
      expect(driver.Client._client.EBRead.mock.calls[0][1]).toEqual(6);

      //Mocked DBRead has registers: [12, 13, 14, 15, 16, 17, 18]
      expect(result).toEqual([13, 14, 15, 16, 17, 18]);
    });

    it("should call ABRead of Driver and return data - if request is to read Q", async () => {
      memoryType = "Q";
      dbNumber = null;
      variable1MemoryType = "Q";
      variable1DBNumber = null;
      variable2MemoryType = "Q";
      variable2DBNumber = null;
      variable3MemoryType = "Q";
      variable3DBNumber = null;

      let result = await exec();
      expect(driver.Client._client.ABRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.ABRead.mock.calls[0][0]).toEqual(1);
      expect(driver.Client._client.ABRead.mock.calls[0][1]).toEqual(6);

      //Mocked DBRead has registers: [19, 20, 21, 22, 23, 24, 25]
      expect(result).toEqual([20, 21, 22, 23, 24, 25]);
    });

    it("should call MBRead of Driver and return data - if request is to read M", async () => {
      memoryType = "M";
      dbNumber = null;
      variable1MemoryType = "M";
      variable1DBNumber = null;
      variable2MemoryType = "M";
      variable2DBNumber = null;
      variable3MemoryType = "M";
      variable3DBNumber = null;

      let result = await exec();
      expect(driver.Client._client.MBRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.MBRead.mock.calls[0][0]).toEqual(1);
      expect(driver.Client._client.MBRead.mock.calls[0][1]).toEqual(6);

      //Mocked DBRead has registers: [26, 27, 28, 29, 30, 31, 32]
      expect(result).toEqual([27, 28, 29, 30, 31, 32]);
    });

    it("should call DBWrite of Driver and return data - if request is to write DB", async () => {
      memoryType = "DB";
      dbNumber = 3;
      writeRequest = true;

      variable1MemoryType = "DB";
      variable1DBNumber = 3;
      variable1Write = true;
      variable1;
      variable1Read = false;
      variable2MemoryType = "DB";
      variable2DBNumber = 3;
      variable2Write = true;
      variable2Read = false;
      variable3MemoryType = "DB";
      variable3DBNumber = 3;
      variable3Write = true;
      variable3Read = false;

      let result = await exec();
      expect(driver.Client._client.DBWrite).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.DBWrite.mock.calls[0][0]).toEqual(dbNumber);
      expect(driver.Client._client.DBWrite.mock.calls[0][1]).toEqual(1);
      expect(driver.Client._client.DBWrite.mock.calls[0][2]).toEqual(6);
      expect(driver.Client._client.DBWrite.mock.calls[0][3]).toEqual(
        Buffer.from([1, 2, 3, 4, 5, 6])
      );
    });

    it("should call EBWrite of Driver and return data - if request is to write I", async () => {
      memoryType = "I";
      dbNumber = null;
      writeRequest = true;

      variable1MemoryType = "I";
      variable1DBNumber = null;
      variable1Write = true;
      variable1;
      variable1Read = false;
      variable2MemoryType = "I";
      variable2DBNumber = null;
      variable2Write = true;
      variable2Read = false;
      variable3MemoryType = "I";
      variable3DBNumber = null;
      variable3Write = true;
      variable3Read = false;

      let result = await exec();
      expect(driver.Client._client.EBWrite).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.EBWrite.mock.calls[0][0]).toEqual(1);
      expect(driver.Client._client.EBWrite.mock.calls[0][1]).toEqual(6);
      expect(driver.Client._client.EBWrite.mock.calls[0][2]).toEqual(
        Buffer.from([1, 2, 3, 4, 5, 6])
      );
    });

    it("should call ABWrite of Driver and return data - if request is to write Q", async () => {
      memoryType = "Q";
      dbNumber = null;
      writeRequest = true;

      variable1MemoryType = "Q";
      variable1DBNumber = null;
      variable1Write = true;
      variable1;
      variable1Read = false;
      variable2MemoryType = "Q";
      variable2DBNumber = null;
      variable2Write = true;
      variable2Read = false;
      variable3MemoryType = "Q";
      variable3DBNumber = null;
      variable3Write = true;
      variable3Read = false;

      let result = await exec();
      expect(driver.Client._client.ABWrite).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.ABWrite.mock.calls[0][0]).toEqual(1);
      expect(driver.Client._client.ABWrite.mock.calls[0][1]).toEqual(6);
      expect(driver.Client._client.ABWrite.mock.calls[0][2]).toEqual(
        Buffer.from([1, 2, 3, 4, 5, 6])
      );
    });

    it("should call MBWrite of Driver and return data - if request is to write Q", async () => {
      memoryType = "M";
      dbNumber = null;
      writeRequest = true;

      variable1MemoryType = "M";
      variable1DBNumber = null;
      variable1Write = true;
      variable1;
      variable1Read = false;
      variable2MemoryType = "M";
      variable2DBNumber = null;
      variable2Write = true;
      variable2Read = false;
      variable3MemoryType = "M";
      variable3DBNumber = null;
      variable3Write = true;
      variable3Read = false;

      let result = await exec();
      expect(driver.Client._client.MBWrite).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.MBWrite.mock.calls[0][0]).toEqual(1);
      expect(driver.Client._client.MBWrite.mock.calls[0][1]).toEqual(6);
      expect(driver.Client._client.MBWrite.mock.calls[0][2]).toEqual(
        Buffer.from([1, 2, 3, 4, 5, 6])
      );
    });

    it("should throw and not call any client's method - if memory type is not recognized and read is true", async () => {
      memoryType = "fakeArea";
      dbNumber = null;
      writeRequest = false;

      variable1MemoryType = "fakeArea";
      variable1DBNumber = null;
      variable1Write = false;
      variable1Read = true;
      variable1;
      variable2MemoryType = "fakeArea";
      variable2DBNumber = null;
      variable2Write = false;
      variable2Read = true;
      variable3MemoryType = "fakeArea";
      variable3DBNumber = null;
      variable3Write = false;
      variable3Read = true;

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

      await snooze(1000);

      expect(error.message).toEqual("Invalid S7 memory type fakeArea");

      expect(driver.Client._client.DBRead).not.toHaveBeenCalled();
      expect(driver.Client._client.ABRead).not.toHaveBeenCalled();
      expect(driver.Client._client.EBRead).not.toHaveBeenCalled();
      expect(driver.Client._client.MBRead).not.toHaveBeenCalled();
      expect(driver.Client._client.DBWrite).not.toHaveBeenCalled();
      expect(driver.Client._client.ABWrite).not.toHaveBeenCalled();
      expect(driver.Client._client.EBWrite).not.toHaveBeenCalled();
      expect(driver.Client._client.MBWrite).not.toHaveBeenCalled();
    });

    it("should throw and not call any client's method - if memory type is not recognized and write is true", async () => {
      memoryType = "fakeArea";
      dbNumber = null;
      writeRequest = true;

      variable1MemoryType = "fakeArea";
      variable1DBNumber = null;
      variable1Write = true;
      variable1Read = false;
      variable1;
      variable2MemoryType = "fakeArea";
      variable2DBNumber = null;
      variable2Write = true;
      variable2Read = false;
      variable3MemoryType = "fakeArea";
      variable3DBNumber = null;
      variable3Write = true;
      variable3Read = false;

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

      expect(error.message).toEqual("Invalid S7 memory type fakeArea");

      expect(driver.Client._client.DBRead).not.toHaveBeenCalled();
      expect(driver.Client._client.ABRead).not.toHaveBeenCalled();
      expect(driver.Client._client.EBRead).not.toHaveBeenCalled();
      expect(driver.Client._client.MBRead).not.toHaveBeenCalled();
      expect(driver.Client._client.DBWrite).not.toHaveBeenCalled();
      expect(driver.Client._client.ABWrite).not.toHaveBeenCalled();
      expect(driver.Client._client.EBWrite).not.toHaveBeenCalled();
      expect(driver.Client._client.MBWrite).not.toHaveBeenCalled();
    });
  });

  describe("invokeRequest", () => {
    let driver;

    let variable1;
    let variable1SampleTime;
    let variable1Offset;
    let variable1Length;
    let variable1MemoryType;
    let variable1DBNumber;
    let variable1Read;
    let variable1ReadAsSeperate;
    let variable1Write;
    let variable1WriteAsSeperate;
    let variable1Data;

    let variable2;
    let variable2SampleTime;
    let variable2Offset;
    let variable2Length;
    let variable2MemoryType;
    let variable2DBNumber;
    let variable2Read;
    let variable2ReadAsSeperate;
    let variable2Write;
    let variable2WriteAsSeperate;
    let variable2Data;

    let variable3;
    let variable3SampleTime;
    let variable3Offset;
    let variable3Length;
    let variable3MemoryType;
    let variable3DBNumber;
    let variable3Read;
    let variable3ReadAsSeperate;
    let variable3Write;
    let variable3WriteAsSeperate;
    let variable3Data;

    let sampleTime;
    let writeRequest;
    let memoryType;
    let dbNumber;

    let request;
    let tickId;
    let isActive;
    let driverTimeout;
    let isConnected;
    let isBusy;
    let connectThrows;
    let DBReadThrows;
    let clientDelay;

    beforeEach(() => {
      driverTimeout = 500;
      tickId = 105;
      sampleTime = 15;
      writeRequest = false;
      memoryType = "DB";
      dbNumber = 3;
      isActive = true;
      isConnected = false;
      isBusy = false;
      connectThrows = false;
      DBReadThrows = false;
      clientDelay = 100;

      variable1SampleTime = 15;
      variable1Offset = 1;
      variable1Length = 1;
      variable1MemoryType = "DB";
      variable1DBNumber = 3;
      variable1Read = true;
      variable1ReadAsSeperate = false;
      variable1Write = false;
      variable1WriteAsSeperate = false;

      variable2SampleTime = 15;
      variable2Offset = 2;
      variable2Length = 2;
      variable2MemoryType = "DB";
      variable2DBNumber = 3;
      variable2Read = true;
      variable2ReadAsSeperate = false;
      variable2Write = false;
      variable2WriteAsSeperate = false;

      variable3SampleTime = 15;
      variable3Offset = 4;
      variable3Length = 3;
      variable3MemoryType = "DB";
      variable3DBNumber = 3;
      variable3Read = true;
      variable3ReadAsSeperate = false;
      variable3Write = false;
      variable3WriteAsSeperate = false;

      variable1Data = [1];
      variable2Data = [2, 3];
      variable3Data = [4, 5, 6];

      jest.resetAllMocks();
    });

    let exec = async () => {
      variable1 = createFakeS7Variable(
        null,
        null,
        "var1Id",
        "var1Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable1SampleTime,
        [],
        variable1Offset,
        variable1Length,
        () => 0,
        () => [0],
        variable1MemoryType,
        variable1DBNumber,
        variable1Read,
        variable1Write,
        variable1ReadAsSeperate,
        variable1WriteAsSeperate
      );

      variable2 = createFakeS7Variable(
        null,
        null,
        "var2Id",
        "var2Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable2SampleTime,
        [],
        variable2Offset,
        variable2Length,
        () => 0,
        () => [0],
        variable2MemoryType,
        variable2DBNumber,
        variable2Read,
        variable2Write,
        variable2ReadAsSeperate,
        variable2WriteAsSeperate
      );

      variable3 = createFakeS7Variable(
        null,
        null,
        "var3Id",
        "var3Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable3SampleTime,
        [],
        variable3Offset,
        variable3Length,
        () => 0,
        () => [0],
        variable3MemoryType,
        variable3DBNumber,
        variable3Read,
        variable3Write,
        variable3ReadAsSeperate,
        variable3WriteAsSeperate
      );

      variable1._data = variable1Data;
      variable2._data = variable2Data;
      variable3._data = variable3Data;

      variables = [variable1, variable2, variable3];

      //Total offset = 1
      //Total length = 6

      request = new S7Request(
        variables,
        sampleTime,
        writeRequest,
        memoryType,
        dbNumber
      );

      driver = new S7Driver();

      driver.setTimeout(driverTimeout);
      driver._isActive = isActive;
      if (isConnected) driver.Client._client._connected = true;
      driver._busy = isBusy;
      if (connectThrows)
        driver.Client._client.ConnectTo = async (ip, rack, slot, callback) => {
          await snooze(100);
          await callback(Error("Connection Test Error"));
        };
      if (DBReadThrows)
        driver.Client._client.DBRead = jest.fn(
          async (dbNumber, start, size, callback) => {
            await snooze(100);
            await callback(Error("ReadDB Test Error"));
          }
        );
      driver.Client._client.timeDelay = clientDelay;

      return driver.invokeRequest(request, tickId);
    };

    it("should connect first (if not connected) and then properly call _processRequest  - call setID to set proper unitID and than readHoldingRegisters", async () => {
      let result = await exec();

      //Checking id connect was called
      expect(driver.Client._client.ConnectTo).toHaveBeenCalledTimes(1);
      expect(driver.Client._client.ConnectTo.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );
      expect(driver.Client._client.ConnectTo.mock.calls[0][1]).toEqual(
        driver.Rack
      );
      expect(driver.Client._client.ConnectTo.mock.calls[0][2]).toEqual(
        driver.Slot
      );

      expect(driver.Client._client.DBRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.DBRead.mock.calls[0][0]).toEqual(dbNumber);
      expect(driver.Client._client.DBRead.mock.calls[0][1]).toEqual(1);
      expect(driver.Client._client.DBRead.mock.calls[0][2]).toEqual(6);

      //Mocked DBRead has registers: [15, 16, 17, 18, 19, 20, 21]
      expect(result).toEqual([16, 17, 18, 19, 20, 21]);

      //Busy should be false at the end
      expect(driver.Busy).toEqual(false);
    });

    it("should not connect - if already connected - and properly call _processRequest  - call setID to set proper unitID and than readHoldingRegisters", async () => {
      isConnected = true;

      let result = await exec();

      //Connect should not be called - already connected
      expect(driver.Client._client.ConnectTo).not.toHaveBeenCalled();

      expect(driver.Client._client.DBRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.DBRead.mock.calls[0][0]).toEqual(dbNumber);
      expect(driver.Client._client.DBRead.mock.calls[0][1]).toEqual(1);
      expect(driver.Client._client.DBRead.mock.calls[0][2]).toEqual(6);

      //Mocked DBRead has registers: [15, 16, 17, 18, 19, 20, 21]
      expect(result).toEqual([16, 17, 18, 19, 20, 21]);

      //Busy should be false at the end
      expect(driver.Busy).toEqual(false);
    });

    it("should reject but not disconnect - if connecting throws", async () => {
      isConnected = false;
      connectThrows = true;

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

      //Disconnect should not be called
      expect(driver.Client._client.Disconnect).not.toHaveBeenCalled();

      expect(driver.Client._client.DBRead).not.toHaveBeenCalled();

      expect(driver.Busy).toEqual(false);
    });

    it("should reject but not disconnect - if connect takes too much time - DUE TO INTERNAL modbus-serial, not driver", async () => {
      isConnected = false;
      //timeout is set to 500
      clientDelay = 1000;

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
      let stop = Date.now();

      expect(error.message).toEqual("Error while trying to connect");

      //Disconnect should not be called
      expect(driver.Client._client.Disconnect).not.toHaveBeenCalled();

      expect(driver.Client._client.DBRead).not.toHaveBeenCalled();

      expect(driver.Busy).toEqual(false);
    });

    it("should reject and disconnect - if processing request takes too much time - DUE TO INTERNAL modbus-serial, not driver", async () => {
      //Connection has to be established - in order not throw due to timeout whileConnecting
      isConnected = true;
      clientDelay = 1000;

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

      expect(error.message).toEqual("Read timeout error");

      //Disconnect should not be called
      expect(driver.Client._client.DBRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.Disconnect).toHaveBeenCalledTimes(1);
      expect(driver.Client._client.DBRead).toHaveBeenCalledBefore(
        driver.Client._client.Disconnect
      );

      expect(driver.Busy).toEqual(false);
    });

    it("should reject and disconnect - if processing (reading data) throws", async () => {
      DBReadThrows = true;

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

      expect(error.message).toEqual("ReadDB Test Error");

      //Checking id connect was called
      expect(driver.Client._client.ConnectTo).toHaveBeenCalledTimes(1);
      expect(driver.Client._client.ConnectTo.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );
      expect(driver.Client._client.ConnectTo.mock.calls[0][1]).toEqual(
        driver.Rack
      );
      expect(driver.Client._client.ConnectTo.mock.calls[0][2]).toEqual(
        driver.Slot
      );

      expect(driver.Client._client.DBRead).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.Disconnect).toHaveBeenCalledTimes(1);
      expect(driver.Client._client.ConnectTo).toHaveBeenCalledBefore(
        driver.Client._client.Disconnect
      );
      expect(driver.Client._client.DBRead).toHaveBeenCalledBefore(
        driver.Client._client.Disconnect
      );

      //Busy should be false at the end
      expect(driver.Busy).toEqual(false);

      //IsConnect should be set to false - due to including processing request fail in isConnected
      expect(driver.IsConnected).toEqual(false);
    });

    it("should connect first (if not connected) and then properly call _processRequest  - call setID to set proper unitID and than writeDB - if request is to write", async () => {
      memoryType = "DB";
      dbNumber = 3;
      writeRequest = true;

      variable1MemoryType = "DB";
      variable1DBNumber = 3;
      variable1Write = true;
      variable1;
      variable1Read = false;
      variable2MemoryType = "DB";
      variable2DBNumber = 3;
      variable2Write = true;
      variable2Read = false;
      variable3MemoryType = "DB";
      variable3DBNumber = 3;
      variable3Write = true;
      variable3Read = false;

      let result = await exec();

      //Checking id connect was called
      expect(driver.Client._client.ConnectTo).toHaveBeenCalledTimes(1);
      expect(driver.Client._client.ConnectTo.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );
      expect(driver.Client._client.ConnectTo.mock.calls[0][1]).toEqual(
        driver.Rack
      );
      expect(driver.Client._client.ConnectTo.mock.calls[0][2]).toEqual(
        driver.Slot
      );

      expect(driver.Client._client.DBWrite).toHaveBeenCalledTimes(1);

      expect(driver.Client._client.DBWrite.mock.calls[0][0]).toEqual(dbNumber);
      expect(driver.Client._client.DBWrite.mock.calls[0][1]).toEqual(1);
      expect(driver.Client._client.DBWrite.mock.calls[0][2]).toEqual(6);
      expect(driver.Client._client.DBWrite.mock.calls[0][3]).toEqual(
        Buffer.from([1, 2, 3, 4, 5, 6])
      );

      //Busy should be false at the end
      expect(driver.Busy).toEqual(false);
    });
  });
});
