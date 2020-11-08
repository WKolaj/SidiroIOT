const MBDriver = require("../../../../classes/Driver/MBDriver");
const MBRequest = require("../../../../classes/Request/MBRequest/MBRequest");
const { snooze } = require("../../../../utilities/utilities");
const { createFakeMBVariable } = require("../../../utilities/testUtilities");

describe("MBDriver", () => {
  describe("constructor", () => {
    let exec = () => {
      return new MBDriver();
    };

    it("should create new Driver and initialize its properties properly", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.IsActive).toEqual(false);
      expect(result.Timeout).toEqual(null);
      expect(result.Busy).toEqual(false);

      //Default values
      expect(result.Client).toBeDefined();
      expect(result.IPAddress).toEqual("192.168.0.1");
      expect(result.PortNumber).toEqual(502);
    });

    it("should properly set flags associated with invoking requests", () => {
      let result = exec();

      expect(result._enableConnectTimeout).toEqual(false);
      expect(result._disconnectOnConnectTimeout).toEqual(false);
      expect(result._disconnectOnConnectError).toEqual(false);
      expect(result._disconnectOnProcessTimeout).toEqual(false);
      expect(result._disconnectOnProcessError).toEqual(false);
      expect(result._enableProcessTimeout).toEqual(false);
      expect(result._connectWhenDisconnectedOnProcess).toEqual(true);
    });
  });

  describe("_getIsConnectedState", () => {
    let driver;
    let isOpenMockState;

    beforeEach(() => {
      isOpenMockState = true;
    });

    let exec = () => {
      driver = new MBDriver();
      driver.Client.isOpen = isOpenMockState;

      return driver._getIsConnectedState();
    };

    it("should return isOpen state of Modbus RTU client - isOpen is true", () => {
      isOpenMockState = true;

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return isOpen state of Modbus RTU client - isOpen is false", () => {
      isOpenMockState = false;
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("_connect", () => {
    let driver;

    let exec = async () => {
      driver = new MBDriver();
      return driver._connect();
    };

    it("should call connectTCP of Modbus RTU client with ipAddress and PortNumber", async () => {
      await exec();

      expect(driver.Client.connectTCP).toHaveBeenCalledTimes(1);

      expect(driver.Client.connectTCP.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );

      expect(driver.Client.connectTCP.mock.calls[0][1]).toEqual({
        port: driver.PortNumber,
      });
    });
  });

  describe("_disconnect", () => {
    let driver;
    let disconnectThrow;
    let timeout;

    beforeEach(() => {
      disconnectThrow = false;
      timeout = 500;
    });

    let exec = async () => {
      driver = new MBDriver();
      driver.setTimeout(timeout);
      if (disconnectThrow)
        driver.Client.close = () => {
          throw new Error("Test disconnect error");
        };

      return driver._disconnect();
    };

    it("should call close of Modbus RTU client and wait for callback to be called", async () => {
      await exec();

      expect(driver.Client.close).toHaveBeenCalledTimes(1);
      expect(driver.Client._internalDisconnect).toHaveBeenCalledTimes(1);
    });

    it("should wait at least one timeout before disconnecting - if timeout is assigned", async () => {
      let begin = Date.now();
      await exec();
      let end = Date.now();

      expect(end - begin >= timeout).toEqual(true);
    });

    it("should not  wait - if timeout is not assigned (null)", async () => {
      timeout = null;

      let begin = Date.now();
      await exec();
      let end = Date.now();

      expect(end - begin < 100).toEqual(true);

      //waiting 200 ms at least for closing to end
      await snooze(200);
    });

    it("should not hang and throw if disconnect throws", async () => {
      disconnectThrow = true;

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

      expect(error.message).toEqual("Test disconnect error");
    });
  });

  describe("_processRequest", () => {
    let driver;
    let variable1;
    let variable1SampleTime;
    let variable1Offset;
    let variable1UnitID;
    let variable1Length;
    let variable1Read;
    let variable1ReadFCode;
    let variable1ReadAsSeperate;
    let variable1Write;
    let variable1WriteFCode;
    let variable1WriteAsSeperate;

    let variable2;
    let variable2SampleTime;
    let variable2Offset;
    let variable2UnitID;
    let variable2Length;
    let variable2Read;
    let variable2ReadFCode;
    let variable2ReadAsSeperate;
    let variable2Write;
    let variable2WriteFCode;
    let variable2WriteAsSeperate;

    let variable3;
    let variable3SampleTime;
    let variable3Offset;
    let variable3UnitID;
    let variable3Length;
    let variable3Read;
    let variable3ReadFCode;
    let variable3ReadAsSeperate;
    let variable3Write;
    let variable3WriteFCode;
    let variable3WriteAsSeperate;

    let sampleTime;
    let writeRequest;
    let fCode;
    let unitID;

    let request;
    let tickId;

    beforeEach(() => {
      tickId = 105;
      sampleTime = 15;
      writeRequest = false;
      fCode = 4;
      unitID = 1;

      variable1SampleTime = 15;
      variable1Offset = 1;
      variable1UnitID = 1;
      variable1Length = 2;
      variable1Read = true;
      variable1ReadFCode = 4;
      variable1ReadAsSeperate = false;
      variable1Write = false;
      variable1WriteFCode = 16;
      variable1WriteAsSeperate = false;

      variable2SampleTime = 15;
      variable2Offset = 3;
      variable2UnitID = 1;
      variable2Length = 3;
      variable2Read = true;
      variable2ReadFCode = 4;
      variable2ReadAsSeperate = false;
      variable2Write = false;
      variable2WriteFCode = 16;
      variable2WriteAsSeperate = false;

      variable3SampleTime = 15;
      variable3Offset = 6;
      variable3UnitID = 1;
      variable3Length = 2;
      variable3Read = true;
      variable3ReadFCode = 4;
      variable3ReadAsSeperate = false;
      variable3Write = false;
      variable3WriteFCode = 16;
      variable3WriteAsSeperate = false;
    });

    let exec = async () => {
      variable1 = createFakeMBVariable(
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
        variable1UnitID,
        variable1ReadFCode,
        variable1WriteFCode,
        variable1Read,
        variable1Write,
        variable1ReadAsSeperate,
        variable1WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variable2 = createFakeMBVariable(
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
        variable2UnitID,
        variable2ReadFCode,
        variable2WriteFCode,
        variable2Read,
        variable2Write,
        variable2ReadAsSeperate,
        variable2WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variable3 = createFakeMBVariable(
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
        variable3UnitID,
        variable3ReadFCode,
        variable3WriteFCode,
        variable3Read,
        variable3Write,
        variable3ReadAsSeperate,
        variable3WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variables = [variable1, variable2, variable3];

      //Total offset = 1
      //Total length = 7

      request = new MBRequest(
        variables,
        sampleTime,
        writeRequest,
        fCode,
        unitID
      );

      driver = new MBDriver();
      //Mocked RTU Client has to be connected to invoke any method - otherwise it throws error
      await driver._connect();
      return driver._processRequest(request, tickId);
    };

    it("should call setID to set proper unitID and than readHoldingRegisters - if fCode is 3", async () => {
      //Setting variables fCode
      variable1ReadFCode = 3;
      variable2ReadFCode = 3;
      variable3ReadFCode = 3;

      //Setting request fCode
      fCode = 3;

      //Setting variables Read / write
      variable1Read = true;
      variable2Read = true;
      variable3Read = true;
      variable1Write = false;
      variable2Write = false;
      variable3Write = false;

      //Setting request Read / write
      writeRequest = false;

      let result = await exec();

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.readHoldingRegisters
      );

      expect(driver.Client.readHoldingRegisters).toHaveBeenCalledTimes(1);
      //total offset is 1 and total length is 7
      expect(driver.Client.readHoldingRegisters.mock.calls[0][0]).toEqual(1);
      expect(driver.Client.readHoldingRegisters.mock.calls[0][1]).toEqual(7);

      //Method should return result of invoke - data in mocked RTU client is [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

      expect(result).toEqual([2, 3, 4, 5, 6, 7, 8]);
    });

    it("should call setID to set proper unitID and than readInputRegisters - if fCode is 4", async () => {
      //Setting variables fCode
      variable1ReadFCode = 4;
      variable2ReadFCode = 4;
      variable3ReadFCode = 4;

      //Setting request fCode
      fCode = 4;

      //Setting variables Read / write
      variable1Read = true;
      variable2Read = true;
      variable3Read = true;
      variable1Write = false;
      variable2Write = false;
      variable3Write = false;

      //Setting request Read / write
      writeRequest = false;

      let result = await exec();

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.readHoldingRegisters
      );

      expect(driver.Client.readInputRegisters).toHaveBeenCalledTimes(1);
      //total offset is 1 and total length is 7
      expect(driver.Client.readInputRegisters.mock.calls[0][0]).toEqual(1);
      expect(driver.Client.readInputRegisters.mock.calls[0][1]).toEqual(7);

      //Method should return result of invoke - data in mocked RTU client is [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

      expect(result).toEqual([15, 14, 13, 12, 11, 10, 9]);
    });

    it("should call setID to set proper unitID and than readDiscreteInputs - if fCode is 2", async () => {
      //Setting variables fCode
      variable1ReadFCode = 2;
      variable2ReadFCode = 2;
      variable3ReadFCode = 2;

      //Setting request fCode
      fCode = 2;

      //Setting variables Read / write
      variable1Read = true;
      variable2Read = true;
      variable3Read = true;
      variable1Write = false;
      variable2Write = false;
      variable3Write = false;

      //Setting request Read / write
      writeRequest = false;

      let result = await exec();

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.readHoldingRegisters
      );

      expect(driver.Client.readDiscreteInputs).toHaveBeenCalledTimes(1);
      //total offset is 1 and total length is 7
      expect(driver.Client.readDiscreteInputs.mock.calls[0][0]).toEqual(1);
      expect(driver.Client.readDiscreteInputs.mock.calls[0][1]).toEqual(7);

      //Method should return result of invoke - data in mocked RTU client is [false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true]
      expect(result).toEqual([true, false, true, false, true, false, true]);
    });

    it("should call setID to set proper unitID and than readCoils - if fCode is 1", async () => {
      //Setting variables fCode
      variable1ReadFCode = 1;
      variable2ReadFCode = 1;
      variable3ReadFCode = 1;

      //Setting request fCode
      fCode = 1;

      //Setting variables Read / write
      variable1Read = true;
      variable2Read = true;
      variable3Read = true;
      variable1Write = false;
      variable2Write = false;
      variable3Write = false;

      //Setting request Read / write
      writeRequest = false;

      let result = await exec();

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.readHoldingRegisters
      );

      expect(driver.Client.readCoils).toHaveBeenCalledTimes(1);
      //total offset is 1 and total length is 7
      expect(driver.Client.readCoils.mock.calls[0][0]).toEqual(1);
      expect(driver.Client.readCoils.mock.calls[0][1]).toEqual(7);

      //Method should return result of invoke - data in mocked RTU client is [true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,]
      expect(result).toEqual([false, true, false, true, false, true, false]);
    });

    it("should call setID to set proper unitID and than writeRegisters - if fCode is 16", async () => {
      //Setting variables fCode
      variable1ReadFCode = 16;
      variable2ReadFCode = 16;
      variable3ReadFCode = 16;

      //Setting request fCode
      fCode = 16;

      //Setting variables Read / write
      variable1Read = false;
      variable2Read = false;
      variable3Read = false;
      variable1Write = true;
      variable2Write = true;
      variable3Write = true;

      //Setting request Read / write
      writeRequest = true;

      let result = await exec();

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.writeRegisters
      );

      expect(driver.Client.writeRegisters).toHaveBeenCalledTimes(1);
      //total offset is 1 and total length is 7
      expect(driver.Client.writeRegisters.mock.calls[0][0]).toEqual(1);
      //data of request should be sent
      let totalData = request.getTotalData();
      expect(driver.Client.writeRegisters.mock.calls[0][1]).toEqual(totalData);
    });

    it("should not call anything and throw - if fCode is invalid and request is to read", async () => {
      //Setting variables fCode
      variable1ReadFCode = 123;
      variable2ReadFCode = 123;
      variable3ReadFCode = 123;

      //Setting request fCode
      fCode = 123;

      //Setting variables Read / write
      variable1Read = true;
      variable2Read = true;
      variable3Read = true;
      variable1Write = false;
      variable2Write = false;
      variable3Write = false;

      //Setting request Read / write
      writeRequest = false;

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

      expect(error.message).toEqual("Invalid MB read function code 123");

      expect(driver.Client.setID).not.toHaveBeenCalled();
      expect(driver.Client.readCoils).not.toHaveBeenCalled();
      expect(driver.Client.readDiscreteInputs).not.toHaveBeenCalled();
      expect(driver.Client.readHoldingRegisters).not.toHaveBeenCalled();
      expect(driver.Client.readInputRegisters).not.toHaveBeenCalled();
      expect(driver.Client.writeRegisters).not.toHaveBeenCalled();
    });

    it("should not call anything and throw - if fCode is invalid and request is to write", async () => {
      //Setting variables fCode
      variable1WriteFCode = 123;
      variable2WriteFCode = 123;
      variable3WriteFCode = 123;

      //Setting request fCode
      fCode = 123;

      //Setting variables Read / write
      variable1Read = false;
      variable2Read = false;
      variable3Read = false;
      variable1Write = true;
      variable2Write = true;
      variable3Write = true;

      //Setting request Read / write
      writeRequest = true;

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

      expect(error.message).toEqual("Invalid MB write function code 123");

      expect(driver.Client.setID).not.toHaveBeenCalled();
      expect(driver.Client.readCoils).not.toHaveBeenCalled();
      expect(driver.Client.readDiscreteInputs).not.toHaveBeenCalled();
      expect(driver.Client.readHoldingRegisters).not.toHaveBeenCalled();
      expect(driver.Client.readInputRegisters).not.toHaveBeenCalled();
      expect(driver.Client.writeRegisters).not.toHaveBeenCalled();
    });
  });

  describe("invokeRequest", () => {
    let driver;
    let variable1;
    let variable1SampleTime;
    let variable1Offset;
    let variable1UnitID;
    let variable1Length;
    let variable1Read;
    let variable1ReadFCode;
    let variable1ReadAsSeperate;
    let variable1Write;
    let variable1WriteFCode;
    let variable1WriteAsSeperate;

    let variable2;
    let variable2SampleTime;
    let variable2Offset;
    let variable2UnitID;
    let variable2Length;
    let variable2Read;
    let variable2ReadFCode;
    let variable2ReadAsSeperate;
    let variable2Write;
    let variable2WriteFCode;
    let variable2WriteAsSeperate;

    let variable3;
    let variable3SampleTime;
    let variable3Offset;
    let variable3UnitID;
    let variable3Length;
    let variable3Read;
    let variable3ReadFCode;
    let variable3ReadAsSeperate;
    let variable3Write;
    let variable3WriteFCode;
    let variable3WriteAsSeperate;

    let sampleTime;
    let writeRequest;
    let fCode;
    let unitID;

    let request;
    let tickId;
    let isActive;
    let isConnected;
    let isBusy;
    let connectThrows;
    let readHoldingRegistersThrows;
    let clientDelay;

    beforeEach(() => {
      tickId = 105;
      sampleTime = 15;
      writeRequest = false;
      fCode = 3;
      unitID = 1;
      driverTimeout = 500;
      isActive = true;
      isConnected = false;
      isBusy = false;
      connectThrows = false;
      readHoldingRegistersThrows = false;
      clientDelay = 100;

      variable1SampleTime = 15;
      variable1Offset = 1;
      variable1UnitID = 1;
      variable1Length = 2;
      variable1Read = true;
      variable1ReadFCode = 3;
      variable1ReadAsSeperate = false;
      variable1Write = false;
      variable1WriteFCode = 16;
      variable1WriteAsSeperate = false;

      variable2SampleTime = 15;
      variable2Offset = 3;
      variable2UnitID = 1;
      variable2Length = 3;
      variable2Read = true;
      variable2ReadFCode = 3;
      variable2ReadAsSeperate = false;
      variable2Write = false;
      variable2WriteFCode = 16;
      variable2WriteAsSeperate = false;

      variable3SampleTime = 15;
      variable3Offset = 6;
      variable3UnitID = 1;
      variable3Length = 2;
      variable3Read = true;
      variable3ReadFCode = 3;
      variable3ReadAsSeperate = false;
      variable3Write = false;
      variable3WriteFCode = 16;
      variable3WriteAsSeperate = false;
    });

    let exec = async () => {
      variable1 = createFakeMBVariable(
        "var1Id",
        "var1Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable1SampleTime,
        [1, 1],
        variable1Offset,
        variable1Length,
        () => 0,
        () => [1, 1],
        variable1UnitID,
        variable1ReadFCode,
        variable1WriteFCode,
        variable1Read,
        variable1Write,
        variable1ReadAsSeperate,
        variable1WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variable2 = createFakeMBVariable(
        "var2Id",
        "var2Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable2SampleTime,
        [2, 2, 2],
        variable2Offset,
        variable2Length,
        () => 0,
        () => [2, 2, 2],
        variable2UnitID,
        variable2ReadFCode,
        variable2WriteFCode,
        variable2Read,
        variable2Write,
        variable2ReadAsSeperate,
        variable2WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variable3 = createFakeMBVariable(
        "var3Id",
        "var3Name",
        "FakeVar",
        0,
        "FakeUnit",
        variable3SampleTime,
        [3, 3],
        variable3Offset,
        variable3Length,
        () => 0,
        () => [3, 3],
        variable3UnitID,
        variable3ReadFCode,
        variable3WriteFCode,
        variable3Read,
        variable3Write,
        variable3ReadAsSeperate,
        variable3WriteAsSeperate,
        () => [1, 2, 3, 4],
        () => [16]
      );

      variables = [variable1, variable2, variable3];

      //Total offset = 1
      //Total length = 7

      request = new MBRequest(
        variables,
        sampleTime,
        writeRequest,
        fCode,
        unitID
      );

      driver = new MBDriver();

      driver.setTimeout(driverTimeout);
      driver._isActive = isActive;
      if (isConnected) driver.Client.isOpen = true;
      driver._busy = isBusy;
      if (connectThrows)
        driver.Client.connectTCP = async () => {
          await snooze(100);
          throw new Error("Connection Test Error");
        };
      if (readHoldingRegistersThrows)
        driver.Client.readHoldingRegisters = async () => {
          await snooze(100);
          throw new Error("Reading Test Error");
        };
      driver.Client.timeDelay = clientDelay;
      return driver.invokeRequest(request, tickId);
    };

    it("should connect first (if not connected) and then properly call _processRequest  - call setID to set proper unitID and than readHoldingRegisters", async () => {
      let result = await exec();

      //Checking id connect was called
      expect(driver.Client.connectTCP).toHaveBeenCalledTimes(1);
      expect(driver.Client.connectTCP.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );
      expect(driver.Client.connectTCP.mock.calls[0][1]).toEqual({
        port: driver.PortNumber,
      });

      //connect should be called before setID
      expect(driver.Client.connectTCP).toHaveBeenCalledBefore(
        driver.Client.setID
      );

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.readHoldingRegisters
      );

      expect(driver.Client.readHoldingRegisters).toHaveBeenCalledTimes(1);
      //total offset is 1 and total length is 7
      expect(driver.Client.readHoldingRegisters.mock.calls[0][0]).toEqual(1);
      expect(driver.Client.readHoldingRegisters.mock.calls[0][1]).toEqual(7);

      //Method should return result of invoke - data in mocked RTU client is [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

      expect(result).toEqual([2, 3, 4, 5, 6, 7, 8]);

      //Busy should be false at the end
      expect(driver.Client.busy).toEqual(false);
    });

    it("should not connect - if already connected - and properly call _processRequest  - call setID to set proper unitID and than readHoldingRegisters", async () => {
      isConnected = true;

      let result = await exec();

      //Connect should not be called - already connected
      expect(driver.Client.connectTCP).not.toHaveBeenCalled();

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.readHoldingRegisters
      );

      expect(driver.Client.readHoldingRegisters).toHaveBeenCalledTimes(1);
      //total offset is 1 and total length is 7
      expect(driver.Client.readHoldingRegisters.mock.calls[0][0]).toEqual(1);
      expect(driver.Client.readHoldingRegisters.mock.calls[0][1]).toEqual(7);

      //Method should return result of invoke - data in mocked RTU client is [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      expect(result).toEqual([2, 3, 4, 5, 6, 7, 8]);

      //Busy should be false at the end
      expect(driver.Client.busy).toEqual(false);
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
      expect(driver.Client.close).not.toHaveBeenCalled();

      //Set client id should not be called - no processing request
      expect(driver.Client.setID).not.toHaveBeenCalled();

      //read holding registers should not be called - no processing request
      expect(driver.Client.readHoldingRegisters).not.toHaveBeenCalled();

      //Busy should be false at the end
      expect(driver.Client.busy).toEqual(false);
    });

    it("should reject but not disconnect - if connect takes too much time - DUE TO INTERNAL modbus-serial, not driver", async () => {
      isConnected = false;
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

      expect(error.message).toEqual("Error while trying to connect");

      //Disconnect should not be called
      expect(driver.Client.close).not.toHaveBeenCalled();

      //Set client id should not be called - no processing request
      expect(driver.Client.setID).not.toHaveBeenCalled();

      //read holding registers should not be called - no processing request
      expect(driver.Client.readHoldingRegisters).not.toHaveBeenCalled();

      //Busy should be false at the end
      expect(driver.Client.busy).toEqual(false);
    });

    it("should reject but not disconnect - if processing request takes too much time - DUE TO INTERNAL modbus-serial, not driver", async () => {
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

      expect(error.message).toEqual("Handler timeout");

      //Disconnect should not be called
      expect(driver.Client.close).not.toHaveBeenCalled();

      //Busy should be false at the end
      expect(driver.Client.busy).toEqual(false);
    });

    it("should reject but not disconnect - if processing (reading data) throws", async () => {
      readHoldingRegistersThrows = true;

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

      expect(error.message).toEqual("Reading Test Error");

      //Connect should be  called properly
      expect(driver.Client.connectTCP).toHaveBeenCalledTimes(1);
      expect(driver.Client.connectTCP.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );
      expect(driver.Client.connectTCP.mock.calls[0][1]).toEqual({
        port: driver.PortNumber,
      });

      expect(driver.Client.connectTCP).toHaveBeenCalledBefore(
        driver.Client.setID
      );

      //Setting unitID should be called properly
      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Disconnect should not be called
      expect(driver.Client.close).not.toHaveBeenCalled();

      //Busy should be false at the end
      expect(driver.Client.busy).toEqual(false);
    });

    it("should connect first (if not connected) and then properly call _processRequest  - call setID to set proper unitID and than writeHoldingRegisters - if request is to write", async () => {
      writeRequest = true;
      fCode = 16;

      variable1Write = true;
      variable2Write = true;
      variable3Write = true;

      variable1Read = false;
      variable2Read = false;
      variable3Read = false;

      let result = await exec();

      //Checking id connect was called
      expect(driver.Client.connectTCP).toHaveBeenCalledTimes(1);
      expect(driver.Client.connectTCP.mock.calls[0][0]).toEqual(
        driver.IPAddress
      );
      expect(driver.Client.connectTCP.mock.calls[0][1]).toEqual({
        port: driver.PortNumber,
      });

      //connect should be called before setID
      expect(driver.Client.connectTCP).toHaveBeenCalledBefore(
        driver.Client.setID
      );

      expect(driver.Client.setID).toHaveBeenCalledTimes(1);
      expect(driver.Client.setID.mock.calls[0][0]).toEqual(unitID);

      //Setting unitID has to be called before
      expect(driver.Client.setID).toHaveBeenCalledBefore(
        driver.Client.writeRegisters
      );

      expect(driver.Client.writeRegisters).toHaveBeenCalledTimes(1);
      //total offset is 1 and data is [1,1,2,2,2,3,3]
      expect(driver.Client.writeRegisters.mock.calls[0][0]).toEqual(1);
      expect(driver.Client.writeRegisters.mock.calls[0][1]).toEqual([
        1,
        1,
        2,
        2,
        2,
        3,
        3,
      ]);

      //Busy should be false at the end
      expect(driver.Client.busy).toEqual(false);
    });
  });
});
