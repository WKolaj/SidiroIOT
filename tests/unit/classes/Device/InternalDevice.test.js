const { snooze } = require("../../../../utilities/utilities");
const {
  createFakeVariable,
  createFakeAlert,
  createFakeCalcElement,
  createFakeInternalDevice,
  wrapMethodToInvokeAfter,
  createFakeProtocolRequest,
  createFakeDevice,
} = require("../../../utilities/testUtilities");
const logger = require("../../../../logger/logger");
const InternalDevice = require("../../../../classes/Device/InternalDevice/InternalDevice");

describe("InternalDevice", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "testProject";
    });

    let exec = () => {
      return new InternalDevice(project);
    };

    it("should create new InternalDevice and assign project to Device", () => {
      let result = exec();

      expect(result instanceof InternalDevice).toEqual(true);
      expect(result._project).toEqual(project);
    });
  });

  describe("init", () => {
    let project;
    let payload;
    let device;
    let getElementMockFunc;
    let getElementReturnValue;

    beforeEach(() => {
      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {};

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "InternalDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
          },
          cpuLoadVariableID: {
            id: "cpuLoadVariableID",
            name: "cpuLoadVariableName",
            type: "CPULoadVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          cpuTemperatureVariableID: {
            id: "cpuTemperatureVariableID",
            name: "cpuTemperatureVariableName",
            type: "CPUTemperatureVariable",
            unit: "°C",
            sampleTime: 1,
            defaultValue: 0,
          },
          diskUsageVariableID: {
            id: "diskUsageVariableID",
            name: "diskUsageVariableName",
            type: "DiskUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          ramUsageVariableID: {
            id: "ramUsageVariableID",
            name: "ramUsageVariableName",
            type: "RAMUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          lastCycleDurationVariableID: {
            id: "lastCycleDurationVariableID",
            name: "lastCycleDurationVariableName",
            type: "LastCycleDurationVariable",
            unit: "ms",
            sampleTime: 1,
            defaultValue: 0,
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
      };
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      device = new InternalDevice(project);

      return device.init(payload);
    };

    it("should initialize device based on given payload", async () => {
      await exec();

      let expectedPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "InternalDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
            defaultValue: getElementReturnValue.DefaultValue,
            value: getElementReturnValue.DefaultValue,
            lastValueTick: 0,
            deviceId: "deviceID",
          },
          cpuLoadVariableID: {
            id: "cpuLoadVariableID",
            name: "cpuLoadVariableName",
            type: "CPULoadVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
            value: 0,
            lastValueTick: 0,
            deviceId: "deviceID",
          },
          cpuTemperatureVariableID: {
            id: "cpuTemperatureVariableID",
            name: "cpuTemperatureVariableName",
            type: "CPUTemperatureVariable",
            unit: "°C",
            sampleTime: 1,
            defaultValue: 0,
            value: 0,
            lastValueTick: 0,
            deviceId: "deviceID",
          },
          diskUsageVariableID: {
            id: "diskUsageVariableID",
            name: "diskUsageVariableName",
            type: "DiskUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
            value: 0,
            lastValueTick: 0,
            deviceId: "deviceID",
          },
          ramUsageVariableID: {
            id: "ramUsageVariableID",
            name: "ramUsageVariableName",
            type: "RAMUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
            value: 0,
            lastValueTick: 0,
            deviceId: "deviceID",
          },
          lastCycleDurationVariableID: {
            id: "lastCycleDurationVariableID",
            name: "lastCycleDurationVariableName",
            type: "LastCycleDurationVariable",
            unit: "ms",
            sampleTime: 1,
            defaultValue: 0,
            value: 0,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            lastValueTick: 0,
            deviceId: "deviceID",
            value: 123456.654321,
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
            lastValueTick: 0,
            deviceId: "deviceID",
            value: 123456.654321,
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
            lastValueTick: 0,
            deviceId: "deviceID",
            value: 123456.654321,
          },
          sumCalculatorID: {
            id: "sumCalculatorID",
            name: "sumCalculatorName",
            type: "SumCalculator",
            unit: "FakeUnit",
            sampleTime: 15,
            defaultValue: 123456.654321,
            lastValueTick: 0,
            deviceId: "deviceID",
            variableIDs: [
              { variableID: "fakeVariableID1", factor: 1 },
              { variableID: "fakeVariableID2", factor: 2 },
              { variableID: "fakeVariableID3", factor: 3 },
            ],
            value: 123456.654321,
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
            lastValueTick: 0,
            deviceId: "deviceID",
            value: 15,
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
            value: null,
            variableID: "fakeVariableID",
            highLimit: 100,
            lowLimit: -50,
            severity: 1,
            hysteresis: 15,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
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
            value: null,
            timeOnDelay: 5,
            timeOffDelay: 10,
            lastValueTick: 0,
            deviceId: "deviceID",
            texts: {
              pl: "fakeTextPL",
              en: "fakeTextEN",
            },
          },
        },
        isActive: true,
      };

      expect(device.generatePayload()).toEqual(expectedPayload);
    });

    it("should activate if isActive is set to true in payload", async () => {
      await exec();

      expect(device.IsActive).toEqual(true);
    });

    it("should not activate if isActive is set to false in payload", async () => {
      payload.isActive = false;

      await exec();

      expect(device.IsActive).toEqual(false);
    });

    it("should throw if variable's type is not recognized", async () => {
      payload.variables["associatedVariableID"].type = "FakeVariable";

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

      expect(error.message).toEqual(`Unrecognized Variable type: FakeVariable`);
    });

    it("should throw if calcElement's type is not recognized", async () => {
      payload.calcElements["averageCalculatorID"].type = "FakeCalcElement";

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

      expect(error.message).toEqual(
        `Unrecognized CalcElement type: FakeCalcElement`
      );
    });

    it("should throw if alert's type is not recognized", async () => {
      payload.alerts["bandwidthLimitAlertID"].type = "FakeAlert";

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

      expect(error.message).toEqual(`Unrecognized Alert type: FakeAlert`);
    });
  });

  describe("generatePayload", () => {
    let project;
    let device;
    let deviceId;
    let deviceName;
    let deviceType;
    let deviceActive;
    let variable1;
    let variable2;
    let variable3;
    let variable4;
    let variable5;
    let variables;
    let variable1ConvertDataToValueMockFunc;
    let variable2ConvertDataToValueMockFunc;
    let variable3ConvertDataToValueMockFunc;
    let variable4ConvertDataToValueMockFunc;
    let variable5ConvertDataToValueMockFunc;
    let variable1ConvertValueToDataMockFunc;
    let variable2ConvertValueToDataMockFunc;
    let variable3ConvertValueToDataMockFunc;
    let variable4ConvertValueToDataMockFunc;
    let variable5ConvertValueToDataMockFunc;
    let calcElement1;
    let calcElement2;
    let calcElement3;
    let calcElements;
    let calcElement1SampleTime;
    let calcElement2SampleTime;
    let calcElement3SampleTime;
    let calcElement1RefreshMock;
    let calcElement2RefreshMock;
    let calcElement3RefreshMock;
    let alert1;
    let alert2;
    let alert3;
    let alerts;
    let alert1SampleTime;
    let alert2SampleTime;
    let alert3SampleTime;
    let alert1RefreshMock;
    let alert2RefreshMock;
    let alert3RefreshMock;
    let addVariable1;
    let addVariable2;
    let addVariable3;
    let addVariable4;
    let addVariable5;
    let addCalcElement1;
    let addCalcElement2;
    let addCalcElement3;
    let addAlert1;
    let addAlert2;
    let addAlert3;

    beforeEach(() => {
      project = "testProject";
      deviceId = "device1ID";
      deviceName = "device1Name";
      deviceType = "FakeDevice";
      deviceActive = true;

      addVariable1 = true;
      addVariable2 = true;
      addVariable3 = true;
      addVariable4 = true;
      addVariable5 = true;
      addCalcElement1 = true;
      addCalcElement2 = true;
      addCalcElement3 = true;
      addAlert1 = true;
      addAlert2 = true;
      addAlert3 = true;

      //#region init variables

      variable1ConvertDataToValueMockFunc = jest.fn().mockReturnValue(1111);
      variable1ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([1, 1, 1, 1]);

      variable2ConvertDataToValueMockFunc = jest.fn().mockReturnValue(2222);
      variable2ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([2, 2, 2, 2]);

      variable3ConvertDataToValueMockFunc = jest.fn().mockReturnValue(3333);
      variable3ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([3, 3, 3, 3]);

      variable4ConvertDataToValueMockFunc = jest.fn().mockReturnValue(4444);
      variable4ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([4, 4, 4, 4]);

      variable5ConvertDataToValueMockFunc = jest.fn().mockReturnValue(5555);
      variable5ConvertValueToDataMockFunc = jest
        .fn()
        .mockReturnValue([5, 5, 5, 5]);

      //#endregion init variables

      //#region init calcElements

      calcElement1RefreshMock = jest.fn();
      calcElement2RefreshMock = jest.fn();
      calcElement3RefreshMock = jest.fn();

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 2;
      calcElement3SampleTime = 3;

      //#endregion init calcElements

      //#region init alerts

      alert1RefreshMock = jest.fn();
      alert2RefreshMock = jest.fn();
      alert3RefreshMock = jest.fn();

      alert1SampleTime = 1;
      alert2SampleTime = 2;
      alert3SampleTime = 3;

      //#endregion init alerts
    });

    let exec = async () => {
      //#region create variables

      variables = [];

      variable1 = createFakeVariable(
        project,
        null,
        "variable1ID",
        "variable1Name",
        "FakeVariable",
        1,
        "FakeUnit",
        1
      );

      variable2 = createFakeVariable(
        project,
        null,
        "variable2ID",
        "variable2Name",
        "FakeVariable",
        2,
        "FakeUnit",
        2
      );

      variable3 = createFakeVariable(
        project,
        null,
        "variable3ID",
        "variable3Name",
        "FakeVariable",
        3,
        "FakeUnit",
        3
      );

      variable4 = createFakeVariable(
        project,
        null,
        "variable4ID",
        "variable4Name",
        "FakeVariable",
        4,
        "FakeUnit",
        1
      );

      variable5 = createFakeVariable(
        project,
        null,
        "variable5ID",
        "variable5Name",
        "FakeVariable",
        5,
        "FakeUnit",
        2
      );

      if (addVariable1) variables.push(variable1);
      if (addVariable2) variables.push(variable2);
      if (addVariable3) variables.push(variable3);
      if (addVariable4) variables.push(variable4);
      if (addVariable5) variables.push(variable5);

      //#endregion create variables

      //#region create calcElements

      calcElements = [];

      calcElement1 = createFakeCalcElement(
        project,
        null,
        "calcElement1ID",
        "calcElement1Name",
        "FakeCalcElement",
        1,
        "FakeUnit",
        calcElement1SampleTime,
        calcElement1RefreshMock
      );

      calcElement2 = createFakeCalcElement(
        project,
        null,
        "calcElement2ID",
        "calcElement2Name",
        "FakeCalcElement",
        2,
        "FakeUnit",
        calcElement2SampleTime,
        calcElement2RefreshMock
      );

      calcElement3 = createFakeCalcElement(
        project,
        null,
        "calcElement3ID",
        "calcElement3Name",
        "FakeCalcElement",
        3,
        "FakeUnit",
        calcElement3SampleTime,
        calcElement3RefreshMock
      );

      if (addCalcElement1) calcElements.push(calcElement1);
      if (addCalcElement2) calcElements.push(calcElement2);
      if (addCalcElement3) calcElements.push(calcElement3);

      //#endregion create calcElements

      //#region create alerts

      alerts = [];

      alert1 = createFakeAlert(
        project,
        null,
        "alert1ID",
        "alert1Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert1SampleTime,
        alert1RefreshMock
      );

      alert2 = createFakeAlert(
        project,
        null,
        "alert2ID",
        "alert2Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert2SampleTime,
        alert2RefreshMock
      );

      alert3 = createFakeAlert(
        project,
        null,
        "alert3ID",
        "alert3Name",
        "FakeAlert",
        true,
        "FakeUnit",
        alert3SampleTime,
        alert3RefreshMock
      );

      if (addAlert1) alerts.push(alert1);
      if (addAlert2) alerts.push(alert2);
      if (addAlert3) alerts.push(alert3);

      //#endregion create alerts

      device = new InternalDevice(project);

      await device.init({
        id: deviceId,
        name: deviceName,
        type: deviceType,
        isActive: deviceActive,
        calcElements: {},
        variables: {},
        alerts: {},
      });

      for (let variable of variables) {
        device.Variables[variable.ID] = variable;
        variable._device = device;
      }

      for (let calcElement of calcElements) {
        device.CalcElements[calcElement.ID] = calcElement;
        calcElement._device = device;
      }

      for (let alert of alerts) {
        device.Alerts[alert.ID] = alert;
        alert._device = device;
      }

      return device.generatePayload();
    };

    it("should return valid payload of device - if active is true", async () => {
      isDeviceActive = true;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: deviceActive,
        variables: {},
        alerts: {},
        calcElements: {},
      };

      for (let variable of variables) {
        let payload = variable.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.variables[variable.ID] = payload;
      }

      for (let calcElement of calcElements) {
        let payload = calcElement.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.calcElements[calcElement.ID] = payload;
      }

      for (let alert of alerts) {
        let payload = alert.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.alerts[alert.ID] = payload;
      }

      expect(result).toEqual(expectedPayload);
    });

    it("should return valid payload of device - if active is false", async () => {
      isDeviceActive = false;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: deviceActive,
        variables: {},
        alerts: {},
        calcElements: {},
      };

      for (let variable of variables) {
        let payload = variable.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.variables[variable.ID] = payload;
      }

      for (let calcElement of calcElements) {
        let payload = calcElement.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.calcElements[calcElement.ID] = payload;
      }

      for (let alert of alerts) {
        let payload = alert.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.alerts[alert.ID] = payload;
      }

      expect(result).toEqual(expectedPayload);
    });

    it("should return valid payload of device - there are no variables, calcElements or alerts", async () => {
      addVariable1 = false;
      addVariable2 = false;
      addVariable3 = false;
      addVariable4 = false;
      addVariable5 = false;
      addCalcElement1 = false;
      addCalcElement2 = false;
      addCalcElement3 = false;
      addAlert1 = false;
      addAlert2 = false;
      addAlert3 = false;

      let result = await exec();

      let expectedPayload = {
        id: deviceId,
        type: deviceType,
        name: deviceName,
        isActive: deviceActive,
        variables: {},
        alerts: {},
        calcElements: {},
      };

      for (let variable of variables) {
        let payload = variable.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.variables[variable.ID] = payload;
      }

      for (let calcElement of calcElements) {
        let payload = calcElement.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.calcElements[calcElement.ID] = payload;
      }

      for (let alert of alerts) {
        let payload = alert.generatePayload();
        payload.deviceId = deviceId;
        expectedPayload.alerts[alert.ID] = payload;
      }

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("refresh", () => {
    let project;
    let device;
    let isDeviceActive;
    let variable1;
    let variable2;
    let variable3;
    let variables;
    let variable1SampleTime;
    let variable2SampleTime;
    let variable3SampleTime;
    let variable1RefreshMock;
    let variable2RefreshMock;
    let variable3RefreshMock;
    let createVariables;
    let calcElement1;
    let calcElement2;
    let calcElement3;
    let calcElements;
    let calcElement1SampleTime;
    let calcElement2SampleTime;
    let calcElement3SampleTime;
    let calcElement1RefreshMock;
    let calcElement2RefreshMock;
    let calcElement3RefreshMock;
    let createCalcElements;
    let alert1;
    let alert2;
    let alert3;
    let alerts;
    let alert1SampleTime;
    let alert2SampleTime;
    let alert3SampleTime;
    let alert1RefreshMock;
    let alert2RefreshMock;
    let alert3RefreshMock;
    let createAlerts;
    let tickNumber;
    let loggerWarnMock;
    let loggerWarnOriginal;

    beforeEach(() => {
      project = "fakeProject";
      loggerWarnMock = jest.fn();
      loggerWarnOriginal = logger.warn;
      logger.warn = loggerWarnMock;

      createCalcElements = true;
      createAlerts = true;
      createVariables = true;

      tickNumber = 1234;

      variable1RefreshMock = jest.fn();
      variable2RefreshMock = jest.fn();
      variable3RefreshMock = jest.fn();

      variable1SampleTime = 1;
      variable2SampleTime = 1;
      variable3SampleTime = 1;

      calcElement1RefreshMock = jest.fn();
      calcElement2RefreshMock = jest.fn();
      calcElement3RefreshMock = jest.fn();

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 1;
      calcElement3SampleTime = 1;

      alert1RefreshMock = jest.fn();
      alert2RefreshMock = jest.fn();
      alert3RefreshMock = jest.fn();

      alert1SampleTime = 1;
      alert2SampleTime = 1;
      alert3SampleTime = 1;

      isDeviceActive = true;
    });

    afterEach(() => {
      logger.warn = loggerWarnOriginal;
    });

    let exec = async () => {
      variable1 = createFakeVariable(
        project,
        null,
        "variable1ID",
        "variable1Name",
        "FakeVariable",
        0,
        "FakeUnit",
        variable1SampleTime,
        wrapMethodToInvokeAfter(variable1RefreshMock, 100)
      );

      variable2 = createFakeVariable(
        project,
        null,
        "variable2ID",
        "variable2Name",
        "FakeVariable",
        0,
        "FakeUnit",
        variable2SampleTime,
        wrapMethodToInvokeAfter(variable2RefreshMock, 200)
      );

      variable3 = createFakeVariable(
        project,
        null,
        "variable3ID",
        "variable3Name",
        "FakeVariable",
        0,
        "FakeUnit",
        variable3SampleTime,
        wrapMethodToInvokeAfter(variable3RefreshMock, 300)
      );

      variables = [];
      if (createVariables) variables = [variable1, variable2, variable3];

      calcElement1 = createFakeCalcElement(
        project,
        null,
        "calcElement1ID",
        "calcElement1Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement1SampleTime,
        wrapMethodToInvokeAfter(calcElement1RefreshMock, 100)
      );

      calcElement2 = createFakeCalcElement(
        project,
        null,
        "calcElement2ID",
        "calcElement2Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement2SampleTime,
        wrapMethodToInvokeAfter(calcElement2RefreshMock, 200)
      );

      calcElement3 = createFakeCalcElement(
        project,
        null,
        "calcElement3ID",
        "calcElement3Name",
        "FakeCalcElement",
        0,
        "FakeUnit",
        calcElement3SampleTime,
        wrapMethodToInvokeAfter(calcElement3RefreshMock, 300)
      );

      calcElements = [];
      if (createCalcElements)
        calcElements = [calcElement1, calcElement2, calcElement3];

      alert1 = createFakeAlert(
        project,
        null,
        "alert1ID",
        "alert1Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert1SampleTime,
        wrapMethodToInvokeAfter(alert1RefreshMock, 100)
      );

      alert2 = createFakeAlert(
        project,
        null,
        "alert2ID",
        "alert2Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert2SampleTime,
        wrapMethodToInvokeAfter(alert2RefreshMock, 200)
      );

      alert3 = createFakeAlert(
        project,
        null,
        "alert3ID",
        "alert3Name",
        "FakeAlert",
        0,
        "FakeUnit",
        alert3SampleTime,
        wrapMethodToInvokeAfter(alert3RefreshMock, 300)
      );

      alerts = [];
      if (createAlerts) alerts = [alert1, alert2, alert3];

      device = createFakeInternalDevice(
        project,
        "device1ID",
        "InternalDevice",
        "device1Name",
        calcElements,
        alerts,
        variables,
        isDeviceActive
      );

      return device.refresh(tickNumber);
    };

    it("should refresh all variables one by one, than refresh all calcElement one by one and than refresh all alerts one by one - if every calcElement and alert sampleTime suits tickNumber", async () => {
      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable2RefreshMock);

      expect(variable2RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);

      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );

      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );

      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should not refresh anything if device is not active", async () => {
      isDeviceActive = false;

      await exec();

      expect(variable1RefreshMock).not.toHaveBeenCalled();
      expect(variable2RefreshMock).not.toHaveBeenCalled();
      expect(variable3RefreshMock).not.toHaveBeenCalled();
      expect(calcElement1RefreshMock).not.toHaveBeenCalled();
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).not.toHaveBeenCalled();
      expect(alert1RefreshMock).not.toHaveBeenCalled();
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).not.toHaveBeenCalled();
    });

    it("should refresh all variables one by one that suits tickId, than refresh calcElements that suits tickId one by one and than refresh alerts that suits tickId one by one", async () => {
      variable1SampleTime = 1;
      variable2SampleTime = 2;
      variable3SampleTime = 3;

      calcElement1SampleTime = 1;
      calcElement2SampleTime = 2;
      calcElement3SampleTime = 3;

      alert1SampleTime = 1;
      alert2SampleTime = 2;
      alert3SampleTime = 3;

      tickNumber = 3;

      //Only first and third should be invoked

      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).not.toHaveBeenCalled();
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).not.toHaveBeenCalled();
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).not.toHaveBeenCalled();
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);
      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should refresh all variables one by one, than refresh all calcElement one by one and than refresh all alerts one by one - if there are no variables", async () => {
      createVariables = false;

      await exec();

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should refresh all variables one by one, than refresh all calcElement one by one and than refresh all alerts one by one - if there are no calcElements", async () => {
      createCalcElements = false;

      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable2RefreshMock);
      expect(variable2RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);
      expect(variable3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);
    });

    it("should refresh all variables one by one, than refresh all calcElement one by one and than refresh all alerts one by one - if there are no alerts", async () => {
      createAlerts = false;

      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);

      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable2RefreshMock);
      expect(variable2RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);
      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
    });

    it("should refresh all variables one by one, then all calcElement one by one and than refresh all alerts one by one - even if one of variables throws while refreshing", async () => {
      variable2RefreshMock = async () => {
        throw new Error("testError");
      };

      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);

      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(variable1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(variable3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);
      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);

      //logger warn should have been called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError");
    });

    it("should refresh all variables one by one, than refresh all calcElement one by one and than refresh all alerts one by one - even if one of calcElement throws while refreshing", async () => {
      calcElement2RefreshMock = async () => {
        throw new Error("testError");
      };
      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert2RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable2RefreshMock);
      expect(variable2RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);
      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert2RefreshMock);
      expect(alert2RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);

      //logger warn should have been called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError");
    });

    it("should refresh all variables one by one,, than refresh all calcElement one by one and than refresh all alerts one by one - event if one of alerts throws while refreshing", async () => {
      alert2RefreshMock = async () => {
        throw new Error("testError");
      };

      await exec();

      expect(variable1RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable2RefreshMock).toHaveBeenCalledTimes(1);
      expect(variable3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement2RefreshMock).toHaveBeenCalledTimes(1);
      expect(calcElement3RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert1RefreshMock).toHaveBeenCalledTimes(1);
      expect(alert3RefreshMock).toHaveBeenCalledTimes(1);

      expect(calcElement1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement2RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(calcElement3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert1RefreshMock.mock.calls[0][0]).toEqual(tickNumber);
      expect(alert3RefreshMock.mock.calls[0][0]).toEqual(tickNumber);

      expect(variable1RefreshMock).toHaveBeenCalledBefore(variable2RefreshMock);
      expect(variable2RefreshMock).toHaveBeenCalledBefore(variable3RefreshMock);
      expect(variable3RefreshMock).toHaveBeenCalledBefore(
        calcElement1RefreshMock
      );
      expect(calcElement1RefreshMock).toHaveBeenCalledBefore(
        calcElement2RefreshMock
      );
      expect(calcElement2RefreshMock).toHaveBeenCalledBefore(
        calcElement3RefreshMock
      );
      expect(calcElement3RefreshMock).toHaveBeenCalledBefore(alert1RefreshMock);
      expect(alert1RefreshMock).toHaveBeenCalledBefore(alert3RefreshMock);

      //logger warn should have been called
      expect(loggerWarnMock).toHaveBeenCalledTimes(1);
      expect(loggerWarnMock.mock.calls[0][0]).toEqual("testError");
    });
  });

  describe("getRefreshGroupID", () => {
    let project;
    let payload;
    let device;
    let getElementMockFunc;
    let getElementReturnValue;

    beforeEach(() => {
      getElementReturnValue = {
        LastValueTick: 123,
        Value: 456.789,
        DefaultValue: 987.321,
      };

      project = {};

      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "InternalDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
          },
          cpuLoadVariableID: {
            id: "cpuLoadVariableID",
            name: "cpuLoadVariableName",
            type: "CPULoadVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          cpuTemperatureVariableID: {
            id: "cpuTemperatureVariableID",
            name: "cpuTemperatureVariableName",
            type: "CPUTemperatureVariable",
            unit: "°C",
            sampleTime: 1,
            defaultValue: 0,
          },
          diskUsageVariableID: {
            id: "diskUsageVariableID",
            name: "diskUsageVariableName",
            type: "DiskUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          ramUsageVariableID: {
            id: "ramUsageVariableID",
            name: "ramUsageVariableName",
            type: "RAMUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          lastCycleDurationVariableID: {
            id: "lastCycleDurationVariableID",
            name: "lastCycleDurationVariableName",
            type: "LastCycleDurationVariable",
            unit: "ms",
            sampleTime: 1,
            defaultValue: 0,
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
      };
    });

    let exec = async () => {
      getElementMockFunc = jest.fn(() => getElementReturnValue);
      project.getElement = getElementMockFunc;

      device = new InternalDevice(project);

      await device.init(payload);

      return device.getRefreshGroupID();
    };

    it("should return ID of device", async () => {
      let result = await exec();

      expect(result).toEqual("deviceID");
    });
  });

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: "deviceID",
        name: "deviceName",
        type: "InternalDevice",
        variables: {
          associatedVariableID: {
            id: "associatedVariableID",
            name: "associatedVariableName",
            type: "AssociatedVariable",
            unit: "A",
            sampleTime: 1,
            associatedElementID: "fakeDeviceID",
            associatedDeviceID: "fakeVariableID",
          },
          cpuLoadVariableID: {
            id: "cpuLoadVariableID",
            name: "cpuLoadVariableName",
            type: "CPULoadVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          cpuTemperatureVariableID: {
            id: "cpuTemperatureVariableID",
            name: "cpuTemperatureVariableName",
            type: "CPUTemperatureVariable",
            unit: "°C",
            sampleTime: 1,
            defaultValue: 0,
          },
          diskUsageVariableID: {
            id: "diskUsageVariableID",
            name: "diskUsageVariableName",
            type: "DiskUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          ramUsageVariableID: {
            id: "ramUsageVariableID",
            name: "ramUsageVariableName",
            type: "RAMUsageVariable",
            unit: "%",
            sampleTime: 1,
            defaultValue: 0,
          },
          lastCycleDurationVariableID: {
            id: "lastCycleDurationVariableID",
            name: "lastCycleDurationVariableName",
            type: "LastCycleDurationVariable",
            unit: "ms",
            sampleTime: 1,
            defaultValue: 0,
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
      };
    });

    let exec = () => {
      return InternalDevice.validatePayload(payload);
    };

    it("should return null if payload of device is valid", async () => {
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

      expect(result).toEqual(`"type" must be [InternalDevice]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [InternalDevice]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [InternalDevice]`);
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
      payload.variables.associatedVariableID.id =
        "modifiedAssociatedVariableID";

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

    it("should return message if one of variables payload is invalid - AssociatedVariable", () => {
      payload.variables.associatedVariableID.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if one of variables payload is invalid - CPULoadVariable", () => {
      payload.variables.cpuLoadVariableID.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if one of variables payload is invalid - CPUTemperatureVariable", () => {
      payload.variables.cpuTemperatureVariableID.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if one of variables payload is invalid - RAMUsageVariable", () => {
      payload.variables.ramUsageVariableID.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if one of variables payload is invalid - DiskUsageVariable", () => {
      payload.variables.diskUsageVariableID.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if one of variables payload is invalid - LastCycleDurationVariable", () => {
      payload.variables.lastCycleDurationVariableID.name = null;

      let result = exec();

      expect(result).toEqual(`"name" must be a string`);
    });

    it("should return message if variables type is not recognized", () => {
      payload.variables.associatedVariableID.type = "FakeType";

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
});
