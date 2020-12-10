const S7Device = require("../../../../classes/Device/ConnectableDevice/S7Device");

const {
  createFakeCalcElement,
  createFakeAlert,
  testMBVariable,
  testMBRequest,
  testS7Request,
} = require("../../../utilities/testUtilities");
const { snooze } = require("../../../../utilities/utilities");
const S7RequestManager = require("../../../../classes/Request/S7Request/S7RequestManager");
const S7Driver = require("../../../../classes/Driver/S7Driver");

describe("S7Device", () => {
  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "fakeProject";
    });

    let exec = () => {
      return new S7Device(project);
    };

    it("should create new S7Device and set its RequestManager to S7RequestManager and Driver to S7Driver", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.RequestManager).toBeDefined();
      expect(result.RequestManager instanceof S7RequestManager).toEqual(true);

      expect(result.Driver).toBeDefined();
      expect(result.Driver instanceof S7Driver).toEqual(true);
    });

    it("should assign project to S7Device", () => {
      let result = exec();

      expect(result._project).toEqual(project);
    });

    it("should set _continueIfRequestThrows to false", () => {
      let result = exec();

      expect(result._continueIfRequestThrows).toEqual(false);
    });
  });

  describe("init", () => {
    let project;
    let device;
    let payload;

    beforeEach(() => {
      project = "testProject";
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
      };
    });

    let exec = async () => {
      device = new S7Device(project);
      return device.init(payload);
    };

    it("should initialize S7Device based on given payload - if variables are S7Real", async () => {
      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      delete payloadOfDevice.variables["testVariable1ID"].value;
      delete payloadOfDevice.variables["testVariable2ID"].value;
      delete payloadOfDevice.variables["testVariable3ID"].value;

      expect(payloadOfDevice).toEqual(expectedPayload);

      //checking values

      expect(device.Variables["testVariable1ID"].Value).toBeCloseTo(
        payload.variables["testVariable1ID"].defaultValue
      );

      expect(device.Variables["testVariable2ID"].Value).toBeCloseTo(
        payload.variables["testVariable2ID"].defaultValue
      );

      expect(device.Variables["testVariable3ID"].Value).toBeCloseTo(
        payload.variables["testVariable3ID"].defaultValue
      );

      //#endregion Checking payload

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        12,
        3,
        false,
        true,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if variables are S7Int, S7SInt, S7DInt", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        7,
        3,
        false,
        true,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if variables are S7UInt, S7USInt, S7UDInt", async () => {
      payload.variables.testVariable1ID.type = "S7UInt";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7USInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7UDInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7UInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7USInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7UDInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        7,
        3,
        false,
        true,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if variables are DeviceConnectionVariable, S7ByteArray, S7DTL", async () => {
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        deviceId: "testDeviceID",
        name: "testVariable1Name",
        type: "DeviceConnectionVariable",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: false,
      };

      payload.variables.testVariable2ID.type = "S7ByteArray";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 4;
      payload.variables.testVariable2ID.defaultValue = [1, 2, 3, 4];
      payload.variables.testVariable3ID.type = "S7DTL";
      payload.variables.testVariable3ID.offset = 16;
      payload.variables.testVariable3ID.length = 12;
      payload.variables.testVariable3ID.defaultValue = 1607615536646;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "DeviceConnectionVariable",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: false,
            lastValueTick: 0,
            value: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7ByteArray",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: [1, 2, 3, 4],
            offset: 12,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: [1, 2, 3, 4],
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DTL",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 1607615536646,
            offset: 16,
            length: 12,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 1607615536646,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        12,
        16,
        3,
        false,
        true,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if there is no variable", async () => {
      payload.variables = {};

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {},
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toEqual([]);

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if there is no calcElement", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      payload.calcElements = {};

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {},
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        7,
        3,
        false,
        true,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if there is no alert", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      payload.alerts = {};

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {},
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        7,
        3,
        false,
        true,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should not initialize S7Device and throw - if type of one of variable is not recoginzed", async () => {
      payload.variables["testVariable1ID"].type = "FakeType";

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

      expect(error.message).toEqual("Unrecognized Variable type: FakeType");
    });

    it("should throw - if there is associatedVariable - associatedVariables is not permitted in connecableDevice", async () => {
      payload.variables = {
        associatedVariableID: {
          id: "associatedVariableID",
          name: "associatedVariableName",
          type: "AssociatedVariable",
          unit: "A",
          sampleTime: 1,
          associatedElementID: "fakeDeviceID",
          associatedDeviceID: "fakeVariableID",
        },
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

      expect(error.message).toEqual(
        "Unrecognized Variable type: AssociatedVariable"
      );
    });

    it("should initialize S7Device based on given payload - if variables are to write", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable1ID.write = true;
      payload.variables.testVariable1ID.read = false;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable2ID.write = true;
      payload.variables.testVariable2ID.read = false;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;
      payload.variables.testVariable3ID.write = true;
      payload.variables.testVariable3ID.read = false;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(1);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        7,
        3,
        true,
        false,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if variables is a split between variables and variables are to read", async () => {
      payload.variables.testVariable1ID.type = "S7UInt";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7USInt";
      payload.variables.testVariable2ID.offset = 13;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7UDInt";
      payload.variables.testVariable3ID.offset = 14;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7UInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7USInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 13,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7UDInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        2,
        3,
        false,
        true,
        [device.Variables["testVariable1ID"]]
      );

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        13,
        5,
        3,
        false,
        true,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if variables is a split between variables and variables are to write", async () => {
      payload.variables.testVariable1ID.type = "S7UInt";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable1ID.write = true;
      payload.variables.testVariable1ID.read = false;
      payload.variables.testVariable2ID.type = "S7USInt";
      payload.variables.testVariable2ID.offset = 13;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable2ID.write = true;
      payload.variables.testVariable2ID.read = false;
      payload.variables.testVariable3ID.type = "S7UDInt";
      payload.variables.testVariable3ID.offset = 14;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;
      payload.variables.testVariable3ID.write = true;
      payload.variables.testVariable3ID.read = false;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7UInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7USInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 13,
            length: 1,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7UDInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 14,
            length: 4,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        2,
        3,
        true,
        false,
        [device.Variables["testVariable1ID"]]
      );

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        13,
        5,
        3,
        true,
        false,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if there are some variables to read some to write", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable1ID.write = false;
      payload.variables.testVariable1ID.read = true;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable2ID.write = true;
      payload.variables.testVariable2ID.read = false;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;
      payload.variables.testVariable3ID.write = true;
      payload.variables.testVariable3ID.read = false;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        2,
        3,
        false,
        true,
        [device.Variables["testVariable1ID"]]
      );

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        12,
        5,
        3,
        true,
        false,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if there are some variables with readAsSingle", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;
      payload.variables.testVariable3ID.readAsSingle = true;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: true,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        10,
        3,
        3,
        false,
        true,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
        ]
      );

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        13,
        4,
        3,
        false,
        true,
        [device.Variables["testVariable3ID"]]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if there are some variables with writeAsSingle", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable1ID.write = true;
      payload.variables.testVariable1ID.read = false;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable2ID.write = true;
      payload.variables.testVariable2ID.read = false;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;
      payload.variables.testVariable3ID.write = true;
      payload.variables.testVariable3ID.read = false;
      payload.variables.testVariable3ID.writeAsSingle = true;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: false,
            write: true,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: true,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        10,
        3,
        3,
        true,
        false,
        [
          device.Variables["testVariable1ID"],
          device.Variables["testVariable2ID"],
        ]
      );

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        13,
        4,
        3,
        true,
        false,
        [device.Variables["testVariable3ID"]]
      );

      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if some variable have different sample time", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable1ID.sampleTime = 10;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 10,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[0],
        10,
        "DB",
        10,
        2,
        3,
        false,
        true,
        [device.Variables["testVariable1ID"]]
      );

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        12,
        5,
        3,
        false,
        true,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );
      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if some variable have different dbNumber", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable1ID.dbNumber = 2;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 2,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "DB",
        10,
        2,
        2,
        false,
        true,
        [device.Variables["testVariable1ID"]]
      );

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        12,
        5,
        3,
        false,
        true,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );
      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if some variable have different memoryType, dbNumber is null in non DB", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.memoryType = "I";
      payload.variables.testVariable1ID.dbNumber = null;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "I",
            dbNumber: null,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "I",
        10,
        2,
        null,
        false,
        true,
        [device.Variables["testVariable1ID"]]
      );

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        12,
        5,
        3,
        false,
        true,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );
      //#endregion Checking requests
    });

    it("should initialize S7Device based on given payload - if some variable have different memoryType, dbNumber is undefined in non DB", async () => {
      payload.variables.testVariable1ID.type = "S7Int";
      payload.variables.testVariable1ID.offset = 10;
      payload.variables.testVariable1ID.length = 2;
      payload.variables.testVariable1ID.memoryType = "I";
      delete payload.variables.testVariable1ID.dbNumber;
      payload.variables.testVariable1ID.defaultValue = 12;
      payload.variables.testVariable2ID.type = "S7SInt";
      payload.variables.testVariable2ID.offset = 12;
      payload.variables.testVariable2ID.length = 1;
      payload.variables.testVariable2ID.defaultValue = 34;
      payload.variables.testVariable3ID.type = "S7DInt";
      payload.variables.testVariable3ID.offset = 13;
      payload.variables.testVariable3ID.length = 4;
      payload.variables.testVariable3ID.defaultValue = 56;

      await exec();

      //#region Checking payload

      //Float values are exactly the same - check it seperately
      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7Int",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 12,
            offset: 10,
            length: 2,
            read: true,
            write: false,
            memoryType: "I",
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 12,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7SInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 34,
            offset: 12,
            length: 1,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 34,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 56,
            offset: 13,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 56,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      //Check without REAL values

      let payloadOfDevice = device.generatePayload();
      expect(payloadOfDevice).toEqual(expectedPayload);

      //#region Checking requests

      expect(device.RequestManager.Requests).toBeDefined();
      expect(device.RequestManager.Requests.length).toEqual(2);

      testS7Request(
        device.RequestManager.Requests[0],
        15,
        "I",
        10,
        2,
        null,
        false,
        true,
        [device.Variables["testVariable1ID"]]
      );

      testS7Request(
        device.RequestManager.Requests[1],
        15,
        "DB",
        12,
        5,
        3,
        false,
        true,
        [
          device.Variables["testVariable2ID"],
          device.Variables["testVariable3ID"],
        ]
      );
      //#endregion Checking requests
    });
  });

  describe("generatePayload", () => {
    let project;
    let device;
    let payload;
    let connectDevice;

    beforeEach(() => {
      connectDevice = false;
      project = "testProject";
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 456,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
      };
    });

    let exec = async () => {
      device = new S7Device(project);
      await device.init(payload);
      if (connectDevice) device.Driver.Client._client._connected = true;
      return device.generatePayload();
    };

    it("should return valid payload of device and its variables - if is connected is false", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 123,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 456,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 456,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 789,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      expect(result).toEqual(expectedPayload);
    });

    it("should return valid payload of device and its variables - if is connected is true", async () => {
      connectDevice = true;
      let result = await exec();

      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 123,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 456,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 456,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
            lastValueTick: 0,
            value: 789,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            deviceId: "testDeviceID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            value: 123456.654321,
            lastValueTick: 0,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            deviceId: "testDeviceID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            value: 123456.654321,
            lastValueTick: 0,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            deviceId: "testDeviceID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
            value: 123456.654321,
            lastValueTick: 0,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            deviceId: "testDeviceID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
            lastValueTick: 0,
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            deviceId: "testDeviceID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
            value: 15,
            lastValueTick: 0,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            deviceId: "testDeviceID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            deviceId: "testDeviceID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
            value: null,
            lastValueTick: 0,
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            deviceId: "testDeviceID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            deviceId: "testDeviceID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
            value: null,
            lastValueTick: 0,
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: true,
      };

      expect(result).toEqual(expectedPayload);
    });

    it("should return valid payload of device and its variables - if there are no variables, calcElements and alerts", async () => {
      payload.variables = {};
      payload.calcElements = {};
      payload.alerts = {};

      let result = await exec();

      let expectedPayload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
        isConnected: false,
      };

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123.456,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 321.654,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "S7Real",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789.654,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
      };
    });

    let exec = () => {
      return S7Device.validatePayload(payload);
    };

    it("should return null if payload is valid", () => {
      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if id is not defined", () => {
      delete payload.id;

      let result = exec();

      expect(result).toEqual(`"id" is required`);
    });

    it("should return message if id is null", () => {
      payload.id = null;

      let result = exec();

      expect(result).toEqual(`"id" must be a string`);
    });

    it("should return message if id is empty string", () => {
      payload.id = "";

      let result = exec();

      expect(result).toEqual(`"id" is not allowed to be empty`);
    });

    it("should return message if name is not defined", () => {
      delete payload.name;

      let result = exec();

      expect(result).toEqual(`"name" is required`);
    });

    it("should return message if name is null", () => {
      payload.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if name is empty string", () => {
      payload.name = "";

      let result = exec();

      expect(result).toEqual(`"name" is not allowed to be empty`);
    });

    it("should return message if type is not defined", () => {
      delete payload.type;

      let result = exec();

      expect(result).toEqual(`"type" is required`);
    });

    it("should return message if type is null", () => {
      payload.type = null;

      let result = exec();

      expect(result).toEqual(`"type" must be [S7Device]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [S7Device]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [S7Device]`);
    });

    it("should return message if ipAddress is not defined", () => {
      delete payload.ipAddress;

      let result = exec();

      expect(result).toEqual(`"ipAddress" is required`);
    });

    it("should return message if ipAddress is null", () => {
      payload.ipAddress = null;

      let result = exec();

      expect(result).toEqual(`"ipAddress" must be a string`);
    });

    it("should return message if ipAddress is empty string", () => {
      payload.ipAddress = "";

      let result = exec();

      expect(result).toEqual(`"ipAddress" is not allowed to be empty`);
    });

    it("should return message if ipAddress is invalid ipAddress", () => {
      payload.ipAddress = "fakeIP";

      let result = exec();

      expect(result).toEqual(
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return message if ipAddress is a valid IP with CIDR", () => {
      payload.ipAddress = "192.168.10.10/24";

      let result = exec();

      expect(result).toEqual(
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return message if rack is not defined", () => {
      delete payload.rack;

      let result = exec();

      expect(result).toEqual(`"rack" is required`);
    });

    it("should return message if rack is null", () => {
      payload.rack = null;

      let result = exec();

      expect(result).toEqual(`"rack" must be a number`);
    });

    it("should return message if rack is a float", () => {
      payload.rack = 123.321;

      let result = exec();

      expect(result).toEqual(`"rack" must be an integer`);
    });

    it("should return message if rack is smaller than 0", () => {
      payload.rack = -1;

      let result = exec();

      expect(result).toEqual(`"rack" must be greater than or equal to 0`);
    });

    it("should return message if slot is not defined", () => {
      delete payload.slot;

      let result = exec();

      expect(result).toEqual(`"slot" is required`);
    });

    it("should return message if slot is null", () => {
      payload.slot = null;

      let result = exec();

      expect(result).toEqual(`"slot" must be a number`);
    });

    it("should return message if slot is a float", () => {
      payload.slot = 123.321;

      let result = exec();

      expect(result).toEqual(`"slot" must be an integer`);
    });

    it("should return message if slot is smaller than 1", () => {
      payload.slot = 0;

      let result = exec();

      expect(result).toEqual(`"slot" must be greater than or equal to 1`);
    });

    it("should return message if timeout is not defined", () => {
      delete payload.timeout;

      let result = exec();

      expect(result).toEqual(`"timeout" is required`);
    });

    it("should return message if timeout is null", () => {
      payload.timeout = null;

      let result = exec();

      expect(result).toEqual(`"timeout" must be a number`);
    });

    it("should return message if timeout is a float", () => {
      payload.timeout = 123.321;

      let result = exec();

      expect(result).toEqual(`"timeout" must be an integer`);
    });

    it("should return message if timeout is smaller than 1", () => {
      payload.timeout = 0;

      let result = exec();

      expect(result).toEqual(`"timeout" must be greater than or equal to 1`);
    });

    it("should return message if isActive is not defined", () => {
      delete payload.isActive;

      let result = exec();

      expect(result).toEqual(`"isActive" is required`);
    });

    it("should return message if isActive is null", () => {
      payload.isActive = null;

      let result = exec();

      expect(result).toEqual(`"isActive" must be a boolean`);
    });

    it("should return message if isActive is not a boolean", () => {
      payload.isActive = 123.321;

      let result = exec();

      expect(result).toEqual(`"isActive" must be a boolean`);
    });

    it("should return message if one of variables payload is invalid - id different than id inside payload", () => {
      //invalid default value
      payload.variables.testVariable1ID.id = "testVariable99ID";

      let result = exec();

      expect(result).toEqual(`variable's id as key and in payload differs!`);
    });

    it("should return message if variables is not defined", () => {
      delete payload.variables;

      let result = exec();

      expect(result).toEqual(`"variables" is required`);
    });

    it("should return message if variables is null", () => {
      payload.variables = null;

      let result = exec();

      expect(result).toEqual(`"variables" cannot be null`);
    });

    it("should return message if one of variables payload is invalid - S7USInt", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7USInt",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 1,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7UInt", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7UInt",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 2,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7UDInt", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7UDInt",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 4,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7SInt", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7SInt",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 1,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7Int", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7Int",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 2,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7DInt", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7DInt",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 4,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7Real", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7Real",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 4,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7DTL", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7DTL",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 12,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - S7ByteArray", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "S7ByteArray",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: true,
        offset: 10,
        length: 4,
        read: true,
        write: false,
        memoryType: "DB",
        dbNumber: 3,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be an array`);
    });

    it("should return message if one of variables payload is invalid - DeviceConnectionVariable", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "DeviceConnectionVariable",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: "asdasd",
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a boolean`);
    });

    it("should return message if there is associated variable present", () => {
      //invalid default value
      payload.variables.associatedVariableID = {
        id: "associatedVariableID",
        name: "associatedVariableName",
        type: "AssociatedVariable",
        unit: "A",
        sampleTime: 1,
        associatedElementID: "fakeDeviceID",
        associatedDeviceID: "fakeVariableID",
      };

      let result = exec();

      expect(result).toEqual(`variable type not recognized`);
    });

    it("should return message if variables type is not recognized", () => {
      //invalid default value
      payload.variables.testVariable1ID.type = "FakeType";

      let result = exec();

      expect(result).toEqual(`variable type not recognized`);
    });

    it("should return message if one of calcElement payload is invalid - id different than id inside payload", () => {
      payload.calcElements.averageCalculatorID.id = "fakeID";

      let result = exec();

      expect(result).toEqual(`calcElement's id as key and in payload differs!`);
    });

    it("should return message if one of calcElement payload is invalid - AverageCalculator", () => {
      //Invalid variableID type
      payload.calcElements.averageCalculatorID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of calcElement payload is invalid - FactorCalculator", () => {
      //Invalid variableID type
      payload.calcElements.factorCalculatorID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of calcElement payload is invalid - IncreaseCalculator", () => {
      //Invalid variableID type
      payload.calcElements.increaseCalculatorID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of calcElement payload is invalid - SumCalculator", () => {
      //Invalid variableID type
      payload.calcElements.sumCalculatorID.variableIDs = 12345;

      let result = exec();

      expect(result).toEqual(`"variableIDs" must be an array`);
    });

    it("should return message if one of calcElement types is not recognized", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "FakeType",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`variable type not recognized`);
    });

    it("should return message if calcElement type is not recognized", () => {
      //invalid default value
      payload.calcElements.averageCalculatorID.type = "FakeType";

      let result = exec();

      expect(result).toEqual(`calcElement type not recognized`);
    });

    it("should return message if calcElements is not defined", () => {
      delete payload.calcElements;

      let result = exec();

      expect(result).toEqual(`"calcElements" is required`);
    });

    it("should return message if calcElements is null", () => {
      payload.calcElements = null;

      let result = exec();

      expect(result).toEqual(`"calcElements" cannot be null`);
    });

    it("should return message if one of alert payload is invalid - id different than id inside payload", () => {
      payload.alerts.highLimitAlertID.id = "fakeID";

      let result = exec();

      expect(result).toEqual(`alert's id as key and in payload differs!`);
    });

    it("should return message if alerts type is not recognized", () => {
      //invalid default value
      payload.alerts.highLimitAlertID.type = "FakeType";

      let result = exec();

      expect(result).toEqual(`alert type not recognized`);
    });

    it("should return message if alerts is not defined", () => {
      delete payload.alerts;

      let result = exec();

      expect(result).toEqual(`"alerts" is required`);
    });

    it("should return message if alerts is null", () => {
      payload.alerts = null;

      let result = exec();

      expect(result).toEqual(`"alerts" cannot be null`);
    });

    it("should return message if one of alert payload is invalid - BandwidthLimitAlert", () => {
      //Invalid variableID type
      payload.alerts.bandwidthLimitAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of alert payload is invalid - ExactValuesAlert", () => {
      //Invalid variableID type
      payload.alerts.exactValuesAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of alert payload is invalid - HighLimitAlert", () => {
      //Invalid variableID type
      payload.alerts.highLimitAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if one of alert payload is invalid - LowLimitAlert", () => {
      //Invalid variableID type
      payload.alerts.lowLimitAlertID.variableID = 12345;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });
  });

  describe("getRefreshGroupID", () => {
    let project;
    let device;
    let payload;

    beforeEach(() => {
      project = "testProject";
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "S7Device",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            deviceId: "testDeviceID",
            name: "testVariable1Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123,
            offset: 10,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            deviceId: "testDeviceID",
            name: "testVariable2Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 456,
            offset: 14,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            deviceId: "testDeviceID",
            name: "testVariable3Name",
            type: "S7DInt",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 789,
            offset: 18,
            length: 4,
            read: true,
            write: false,
            memoryType: "DB",
            dbNumber: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {
          averageCalculatorID: {
            id: "averageCalculatorID",
            name: "averageCalculatorName",
            type: "AverageCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
          },
          factorCalculatorID: {
            id: "factorCalculatorID",
            name: "factorCalculatorName",
            type: "FactorCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
          },
          increaseCalculatorID: {
            id: "increaseCalculatorID",
            name: "increaseCalculatorName",
            type: "IncreaseCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableID: "fakeVariableID",
            factor: 5,
            calculationInterval: 15,
            overflow: 1234,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
          },
          valueFromByteArrayCalculatorID: {
            id: "valueFromByteArrayCalculatorID",
            name: "valueFromByteArrayCalculatorName",
            type: "ValueFromByteArrayCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 15,
            variableID: "fakeVariableID",
            bitNumber: 4,
            byteNumber: 3,
            length: 2,
          },
        },
        alerts: {
          bandwidthLimitAlertID: {
            id: "bandwidthLimitAlertID",
            name: "bandwidthLimitAlertName",
            type: "BandwidthLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              highLimit: {
                pl: "fakeHighLimitTextPL",
                en: "fakeHighLimitTextEN",
              },
              lowLimit: {
                pl: "fakeLowLimitTextPL",
                en: "fakeLowLimitTextEN",
              },
            },
          },
          exactValuesAlertID: {
            id: "exactValuesAlertID",
            name: "exactValuesAlertName",
            type: "ExactValuesAlert",
            unit: "A",
            sampleTime: 1,
            defaultValue: null,
            variableID: "fakeVariableID",
            alertValues: [10, 20, 30, 40, 50],
            severity: 10,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              10: {
                en: "step 1: $VALUE",
                pl: "próg 1: $VALUE",
              },
              20: {
                en: "step 2: $VALUE",
                pl: "próg 2: $VALUE",
              },
              30: {
                en: "step 3: $VALUE",
                pl: "próg 3: $VALUE",
              },
              40: {
                en: "step 4: $VALUE",
                pl: "próg 4: $VALUE",
              },
              50: {
                en: "step 5: $VALUE",
                pl: "próg 5: $VALUE",
              },
            },
          },
          highLimitAlertID: {
            id: "highLimitAlertID",
            name: "highLimitAlertName",
            type: "HighLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
          lowLimitAlertID: {
            id: "lowLimitAlertID",
            name: "lowLimitAlertName",
            type: "LowLimitAlert",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: null,
            variableID: "fakeVariableID",
            lowLimit: 100,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
        ipAddress: "192.168.100.100",
        rack: 1,
        slot: 2,
        timeout: 123,
      };
    });

    let exec = async () => {
      device = new S7Device(project);
      await device.init(payload);
      return device.getRefreshGroupID();
    };

    it("should return ipAddress as a group id", async () => {
      let result = await exec();

      expect(result).toEqual(`${payload.ipAddress}`);
    });
  });
});
