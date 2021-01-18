const { last } = require("lodash");
const HighLimitAlert = require("../../../../../classes/Element/Alerts/HighLimitAlert");
const {
  createFakeDevice,
  createFakeVariable,
  createFakeCalcElement,
} = require("../../../../utilities/testUtilities");

describe("HighLimitAlert", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new HighLimitAlert(project, device);
    };

    it("should create new FactorCalculator and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.Value).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);

      expect(result.VariableID).toEqual(null);
      expect(result.HighLimit).toEqual(null);
      expect(result.Texts).toEqual(null);
      expect(result.Severity).toEqual(null);
      expect(result.Hysteresis).toEqual(null);
      expect(result.TimeOnDelay).toEqual(null);
      expect(result.TimeOffDelay).toEqual(null);

      expect(result.AlertActive).toEqual(null);

      expect(result._highAlertTurnOffValue).toEqual(null);
      expect(result._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(result._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(result._onDelayTimeStarted).toEqual(null);
      expect(result._offDelayTimeStarted).toEqual(null);
    });

    it("should assign project and device", () => {
      let result = exec();

      expect(result._project).toEqual(project);
      expect(result._device).toEqual(device);
    });
  });

  describe("init", () => {
    let project;
    let variable1ID;
    let variable1Value;
    let variable1LastValueTick;
    let variable1Add;
    let variable1;
    let variable2ID;
    let variable2Value;
    let variable2LastValueTick;
    let variable2Add;
    let variable3ID;
    let variable3Value;
    let variable3LastValueTick;
    let variable3Add;
    let device;
    let payload;
    let alert;

    beforeEach(() => {
      variable1ID = "variable1ID";
      variable1Value = 123.321;
      variable1LastValueTick = 100;
      variable1Add = true;

      variable2ID = "variable2ID";
      variable2Value = 223.321;
      variable2LastValueTick = 200;
      variable2Add = true;

      variable3ID = "variable3ID";
      variable3Value = 323.321;
      variable3LastValueTick = 300;
      variable3Add = true;

      project = "fakeProject";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "HighLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
        highLimit: 100,
        severity: 1,
        hysteresis: 15,
        timeOnDelay: 5,
        timeOffDelay: 10,
        texts: {
          pl: "fakeTextPL",
          en: "fakeTextEN",
        },
      };
    });

    let exec = async () => {
      variable1 = createFakeVariable(
        project,
        null,
        variable1ID,
        "variable1Name",
        "FakeVariable",
        variable1Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable1.setValue(variable1Value, variable1LastValueTick);

      variable2 = createFakeVariable(
        project,
        null,
        variable2ID,
        "variable2Name",
        "FakeVariable",
        variable2Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable2.setValue(variable2Value, variable2LastValueTick);

      variable3 = createFakeVariable(
        project,
        null,
        variable3ID,
        "variable3Name",
        "FakeVariable",
        variable3Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable3.setValue(variable3Value, variable3LastValueTick);

      variables = [];
      if (variable1Add) variables.push(variable1);
      if (variable2Add) variables.push(variable2);
      if (variable3Add) variables.push(variable3);

      device = createFakeDevice(
        project,
        "fakeDevice1ID",
        "FakeDevice",
        "fakeDevice1Name",
        [],
        [],
        variables,
        true
      );

      alert = new HighLimitAlert(project, device);

      return alert.init(payload);
    };

    it("should initialized HighLimitAlert based on its payload", async () => {
      await exec();

      let calcElementPayload = alert.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
        deviceId: "fakeDevice1ID",
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should not throw and set invalid variableId - if there is no variable of given id", async () => {
      payload.variableID = "fakeVariableID";
      await exec();

      let calcElementPayload = alert.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
        deviceId: "fakeDevice1ID",
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should not throw and set default texts - if texts are not defined", async () => {
      delete payload.texts;

      await exec();

      let defaultTexts = {
        pl: "Przekroczenie granicy alarmowej: $VALUE",
        en: "High limit alert: $VALUE",
      };

      let calcElementPayload = alert.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
        texts: defaultTexts,
        deviceId: "fakeDevice1ID",
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should properly calculate highAlertTurnOffValue - histeresis > 0, highLimit > 0", async () => {
      payload.highLimit = 100;
      payload.hysteresis = 20;

      await exec();
      expect(alert._highAlertTurnOffValue).toEqual(80);
    });

    it("should properly calculate highAlertTurnOffValue - histeresis = 0, highLimit > 0", async () => {
      payload.highLimit = 100;
      payload.hysteresis = 0;

      await exec();
      expect(alert._highAlertTurnOffValue).toEqual(100);
    });

    it("should properly calculate highAlertTurnOffValue - histeresis > 0, highLimit < 0", async () => {
      payload.highLimit = -100;
      payload.hysteresis = 20;

      await exec();
      expect(alert._highAlertTurnOffValue).toEqual(-120);
    });

    it("should properly calculate highAlertTurnOffValue - histeresis = 0, highLimit < 0", async () => {
      payload.highLimit = -100;
      payload.hysteresis = 0;

      await exec();
      expect(alert._highAlertTurnOffValue).toEqual(-100);
    });

    it("should initialize other flags", async () => {
      await exec();
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._value).toEqual(null);
    });
  });

  describe("generatePayload", () => {
    //No need to create fake devices and variables - variableID is not checked during initialization
    let project;
    let device;
    let payload;
    let alert;

    beforeEach(() => {
      project = "fakeProject";
      device = { ID: "fakeDeviceId" };

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "HighLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
        highLimit: 100,
        severity: 1,
        hysteresis: 15,
        timeOnDelay: 5,
        timeOffDelay: 10,
        deviceId: "fakeDeviceId",
        texts: {
          pl: "fakeTextPL",
          en: "fakeTextEN",
        },
      };
    });

    let exec = async () => {
      alert = new HighLimitAlert(project, device);
      await alert.init(payload);
      return alert.generatePayload();
    };

    it("should return a valid HighLimitAlert payload", async () => {
      let result = await exec();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
      };

      expect(result).toEqual(expectedPayload);
    });
  });

  describe("validatePayload", () => {
    //No need to create fake devices and variables - variableID is not checked during initialization
    let payload;

    beforeEach(() => {
      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "HighLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
        highLimit: 100.12,
        severity: 1,
        hysteresis: 15.12,
        timeOnDelay: 5,
        timeOffDelay: 10,
        texts: {
          pl: "fakeTextPL",
          en: "fakeTextEN",
        },
      };
    });

    let exec = () => {
      return HighLimitAlert.validatePayload(payload);
    };

    it("should return null if HighLimitAlert payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [HighLimitAlert]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [HighLimitAlert]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [HighLimitAlert]`);
    });

    it("should return message if unit is not defined", () => {
      delete payload.unit;

      let result = exec();

      expect(result).toEqual(`"unit" is required`);
    });

    it("should return message if unit is null", () => {
      payload.unit = null;

      let result = exec();

      expect(result).toEqual(`"unit" must be a string`);
    });

    it("should return message if unit is empty string", () => {
      payload.unit = "";

      let result = exec();

      expect(result).toEqual(`"unit" is not allowed to be empty`);
    });

    it("should return message if sampleTime is not defined", () => {
      delete payload.sampleTime;

      let result = exec();

      expect(result).toEqual(`"sampleTime" is required`);
    });

    it("should return message if sampleTime is null", () => {
      payload.sampleTime = null;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be a number`);
    });

    it("should return message if sampleTime is 0", () => {
      payload.sampleTime = 0;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be greater than or equal to 1`);
    });

    it("should return message if sampleTime is a float", () => {
      payload.sampleTime = 123.321;

      let result = exec();

      expect(result).toEqual(`"sampleTime" must be an integer`);
    });

    it("should return message if defaultValue is not defined", () => {
      delete payload.defaultValue;

      let result = exec();

      expect(result).toEqual(`"defaultValue" is required`);
    });

    it("should return null if defaultValue is null", () => {
      payload.defaultValue = null;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if defaultValue is not a null - string", () => {
      payload.defaultValue = "test value";

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be [null]`);
    });

    it("should return message if defaultValue is not a null - valid translation object", () => {
      payload.defaultValue = {
        pl: "Przekroczenie granicy alarmowej: $VALUE",
        en: "High limit alert: $VALUE",
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be [null]`);
    });

    it("should return message if variableID is not defined", () => {
      delete payload.variableID;

      let result = exec();

      expect(result).toEqual(`"variableID" is required`);
    });

    it("should return message if variableID is null", () => {
      payload.variableID = null;

      let result = exec();

      expect(result).toEqual(`"variableID" must be a string`);
    });

    it("should return message if variableID is empty string", () => {
      payload.variableID = "";

      let result = exec();

      expect(result).toEqual(`"variableID" is not allowed to be empty`);
    });

    it("should return message if highLimit is not defined", () => {
      delete payload.highLimit;

      let result = exec();

      expect(result).toEqual(`"highLimit" is required`);
    });

    it("should return message if highLimit is null", () => {
      payload.highLimit = null;

      let result = exec();

      expect(result).toEqual(`"highLimit" must be a number`);
    });

    it("should return null if highLimit is smaller then 0", () => {
      payload.highLimit = -100;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if texts is not defined", () => {
      delete payload.texts;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if texts is null", () => {
      payload.texts = null;

      let result = exec();

      expect(result).toEqual(`"texts" must be of type object`);
    });

    it("should return null if texts is a valid translation object - empty object with no translation", () => {
      payload.texts = {};

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if texts is a valid translation object - only english translation", () => {
      payload.texts = {
        en: "sometext",
      };

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if texts is a valid translation object - only polish translation", () => {
      payload.texts = {
        pl: "sometext",
      };

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if severity is not defined", () => {
      delete payload.severity;

      let result = exec();

      expect(result).toEqual(`"severity" is required`);
    });

    it("should return message if severity is null", () => {
      payload.severity = null;

      let result = exec();

      expect(result).toEqual(`"severity" must be a number`);
    });

    it("should return message if severity is not an integer", () => {
      payload.severity = 123.321;

      let result = exec();

      expect(result).toEqual(`"severity" must be an integer`);
    });

    it("should return message if hysteresis is not defined", () => {
      delete payload.hysteresis;

      let result = exec();

      expect(result).toEqual(`"hysteresis" is required`);
    });

    it("should return message if hysteresis is null", () => {
      payload.hysteresis = null;

      let result = exec();

      expect(result).toEqual(`"hysteresis" must be a number`);
    });

    it("should return message if hysteresis is smaller then 0", () => {
      payload.hysteresis = -1;

      let result = exec();

      expect(result).toEqual(`"hysteresis" must be greater than or equal to 0`);
    });

    it("should return message if hysteresis is greater then 100", () => {
      payload.hysteresis = 101;

      let result = exec();

      expect(result).toEqual(`"hysteresis" must be less than or equal to 100`);
    });

    it("should return message if timeOnDelay is not defined", () => {
      delete payload.timeOnDelay;

      let result = exec();

      expect(result).toEqual(`"timeOnDelay" is required`);
    });

    it("should return message if timeOnDelay is null", () => {
      payload.timeOnDelay = null;

      let result = exec();

      expect(result).toEqual(`"timeOnDelay" must be a number`);
    });

    it("should return message if timeOnDelay is smaller then 0", () => {
      payload.timeOnDelay = -1;

      let result = exec();

      expect(result).toEqual(
        `"timeOnDelay" must be greater than or equal to 0`
      );
    });

    it("should return message if timeOnDelay is not an integer", () => {
      payload.timeOnDelay = 12.34;

      let result = exec();

      expect(result).toEqual(`"timeOnDelay" must be an integer`);
    });

    it("should return message if timeOffDelay is not defined", () => {
      delete payload.timeOffDelay;

      let result = exec();

      expect(result).toEqual(`"timeOffDelay" is required`);
    });

    it("should return message if timeOffDelay is null", () => {
      payload.timeOffDelay = null;

      let result = exec();

      expect(result).toEqual(`"timeOffDelay" must be a number`);
    });

    it("should return message if timeOffDelay is smaller then 0", () => {
      payload.timeOffDelay = -1;

      let result = exec();

      expect(result).toEqual(
        `"timeOffDelay" must be greater than or equal to 0`
      );
    });

    it("should return message if timeOffDelay is not an integer", () => {
      payload.timeOffDelay = 12.34;

      let result = exec();

      expect(result).toEqual(`"timeOffDelay" must be an integer`);
    });
  });

  describe("checkIfValueCanBeSet", () => {
    //No need to create fake devices and variables - variableID is not checked during initialization
    let project;
    let device;
    let payload;
    let alert;
    let value;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "AverageCalculator",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: 123456.654321,
        variableID: "fakeVariableID",
        factor: 5,
      };

      value = 1234;
    });

    let exec = async () => {
      alert = new HighLimitAlert(project, device);
      await alert.init(payload);
      return alert.checkIfValueCanBeSet(value);
    };

    it("should always return a message that AverageCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("HighLimitAlert value is readonly");
    });
  });

  describe("refresh", () => {
    let project;
    let variable1ID;
    let variable1Value;
    let variable1LastValueTick;
    let variable1Add;
    let variable1;
    let variable2ID;
    let variable2Value;
    let variable2LastValueTick;
    let variable2Add;
    let variable2;
    let variable3ID;
    let variable3Value;
    let variable3LastValueTick;
    let variable3Add;
    let variable3;
    let variables;
    let calcElement1ID;
    let calcElement1Value;
    let calcElement1LastValueTick;
    let calcElement1Add;
    let calcElement1;
    let calcElements;
    let device;
    let payload;
    let alert;
    let tickId;
    let value;
    let lastValueTick;

    let alertActive;

    beforeEach(() => {
      variable1ID = "variable1ID";
      variable1Value = 123.321;
      variable1LastValueTick = 100;
      variable1Add = true;

      variable2ID = "variable2ID";
      variable2Value = 223.321;
      variable2LastValueTick = 200;
      variable2Add = true;

      variable3ID = "variable3ID";
      variable3Value = 323.321;
      variable3LastValueTick = 300;
      variable3Add = true;

      calcElement1ID = "calcElement1ID";
      calcElement1Value = 423.321;
      calcElement1LastValueTick = 400;
      calcElement1Add = true;

      project = "fakeProject";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "HighLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
        highLimit: 500,
        severity: 1,
        hysteresis: 10,
        timeOnDelay: 5,
        timeOffDelay: 10,
        texts: {
          pl: "fakeTextPL, value: $VALUE, time: $TIME",
          en: "fakeTextEN, value: $VALUE, time: $TIME",
        },
      };

      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      value = null;
      lastValueTick = 0;
    });

    let exec = async () => {
      variable1 = createFakeVariable(
        project,
        null,
        variable1ID,
        "variable1Name",
        "FakeVariable",
        variable1Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable1.setValue(variable1Value, variable1LastValueTick);

      variable2 = createFakeVariable(
        project,
        null,
        variable2ID,
        "variable2Name",
        "FakeVariable",
        variable2Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable2.setValue(variable2Value, variable2LastValueTick);

      variable3 = createFakeVariable(
        project,
        null,
        variable3ID,
        "variable3Name",
        "FakeVariable",
        variable3Value,
        "FakeUnit",
        1,
        () => {}
      );
      variable3.setValue(variable3Value, variable3LastValueTick);

      variables = [];
      if (variable1Add) variables.push(variable1);
      if (variable2Add) variables.push(variable2);
      if (variable3Add) variables.push(variable3);

      calcElement1 = createFakeCalcElement(
        project,
        null,
        calcElement1ID,
        "calcElement1Name",
        "FakeCalcElement",
        calcElement1Value,
        "FakeUnit",
        1,
        () => {}
      );
      calcElement1.setValue(calcElement1Value, calcElement1LastValueTick);

      calcElements = [];
      if (calcElement1Add) calcElements.push(calcElement1);

      device = createFakeDevice(
        project,
        "fakeDevice1ID",
        "FakeDevice",
        "fakeDevice1Name",
        calcElements,
        [],
        variables,
        true
      );

      alert = new HighLimitAlert(project, device);

      await alert.init(payload);

      alert._alertActive = alertActive;
      alert._onDelayTimeStarted = onDelayTimeStarted;
      alert._offDelayTimeStarted = offDelayTimeStarted;
      alert._tickIdOfStartingOnTimeDelay = tickIdOfStartingOnTimeDelay;
      alert._tickIdOfStartingOffTimeDelay = tickIdOfStartingOffTimeDelay;
      alert.setValue(value, lastValueTick);
      return alert.refresh(tickId);
    };

    it("should do nothing - if alert is not active, value is below highAlert (inc. hyst.), off delay time is not started, on delay time is not started", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 400;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if alert is not active, value is below highAlert (inc. hyst.) but not highAlert, off delay time is not started, on delay time is not started", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 475;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start on delay - if alert is not active, value is above highAlertLimit, off delay time is not started, on delay time is not started", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
    });

    it("should stop on delay - if alert is not active, value is below highAlertLimit, off delay time is not started, on delay time is started", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = 100;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 475;
      variable2LastValueTick = 101;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing and wait for on delay time - if alert is not active, value is above highAlertLimit, off delay time is not started, on delay time is started but not elapsed", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = 100;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 111;
      payload.timeOnDelay = 15;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
    });

    it("should stop on delay and activate alert - if alert is not active, value is above highAlertLimit, off delay time is not started, on delay time is started, on delay time elapsed", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = 100;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 111;
      payload.timeOnDelay = 10;

      await exec();

      const expectedTexts = {
        en: payload.texts.en
          .replace("$VALUE", 501)
          .replace("$TIME", new Date(111000).toISOString()),
        pl: payload.texts.pl
          .replace("$VALUE", 501)
          .replace("$TIME", new Date(111000).toISOString()),
      };

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(variable2LastValueTick);

      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if alert is active, value is above highAlertLimit, off delay time is not started, on delay time is not started", async () => {
      alertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 111;
      payload.timeOnDelay = 10;
      value = {
        pl: "someTextPL",
        en: "someTextEN",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(lastValueTick);

      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if alert is active, value is below highAlertLimit but above highAlertLimit (inc. hys.), off delay time is not started, on delay time is not started", async () => {
      alertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 475;
      variable2LastValueTick = 111;
      payload.timeOnDelay = 10;
      value = {
        pl: "someTextPL",
        en: "someTextEN",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(lastValueTick);

      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start onTimeDelay - if alert is active, value is below highAlertLimit (inc. hys.), off delay time is not started, on delay time is not started", async () => {
      alertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 440;
      variable2LastValueTick = 111;
      payload.timeOnDelay = 10;
      value = {
        pl: "someTextPL",
        en: "someTextEN",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(lastValueTick);

      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(111);
    });

    it("should stop onTimeDelay - if alert is active, value is above highAlertLimit (inc. hys.), off delay time is started, on delay time is not started", async () => {
      alertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 111;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 451;
      variable2LastValueTick = 112;
      payload.timeOnDelay = 10;
      value = {
        pl: "someTextPL",
        en: "someTextEN",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(lastValueTick);

      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
    });

    it("should do nothing - if alert is active, value is below highAlertLimit (inc. hys.), off delay time is started but not elapsed, on delay time is not started", async () => {
      alertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 111;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 440;
      variable2LastValueTick = 120;
      payload.timeOnDelay = 10;
      value = {
        pl: "someTextPL",
        en: "someTextEN",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(lastValueTick);

      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(111);
    });

    it("should deactive alert and stop offTimeDelay - if alert is active, value is below highAlertLimit (inc. hys.), off delay time is not started, on delay time elapsed", async () => {
      alertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 111;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 440;
      variable2LastValueTick = 122;
      payload.timeOnDelay = 10;
      value = {
        pl: "someTextPL",
        en: "someTextEN",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
    });

    it("should do nothing - if there is no variable and calcElement of given id", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      payload.variableID = "fakeVariableID";

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if variables value of given id is not a number", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = [1, 2, 3, 4, 5];
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if variable lastValueTick is 0", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 0;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start on delay - if alert is not active, value is above highAlertLimit, off delay time is not started, on delay time is not started - BUT INSTEAD OF VALUE THERE IS CALC ELEMENT", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      calcElement1Value = 501;
      calcElement1LastValueTick = 100;
      payload.variableID = calcElement1ID;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
    });

    it("should do nothing - if calcElements value of given id is not a number", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      calcElement1Value = [1, 2, 3, 4, 5];
      calcElement1LastValueTick = 100;
      payload.variableID = calcElement1ID;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if calcElements lastValueTick is 0", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      calcElement1Value = 501;
      calcElement1LastValueTick = 0;
      payload.variableID = calcElement1ID;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should invoke proper cycle with variable", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 400;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      //Value below high limit - no change
      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value above limit with hysteresis but not limit  - no change
      variable2.setValue(475, 101);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value above limit  - starting on time delay
      variable2.setValue(501, 102);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(102);

      //Value below limit  - stopping on time delay
      variable2.setValue(499, 103);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value above limit  - starting on time delay
      variable2.setValue(501, 104);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(104);

      //On time delay does not elapsed
      variable2.setValue(501, 105);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(104);

      //On time delay does elapsed
      variable2.setValue(501, 115);
      await alert.refresh(100);

      let expectedTexts = {
        en: payload.texts.en
          .replace("$VALUE", 501)
          .replace("$TIME", new Date(115000).toISOString()),
        pl: payload.texts.pl
          .replace("$VALUE", 501)
          .replace("$TIME", new Date(115000).toISOString()),
      };

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value still above alert - do nothing
      variable2.setValue(501, 116);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value below alert but not alert with hysteresis - do nothing
      variable2.setValue(475, 117);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value below alert with hysteresis - start on delay
      variable2.setValue(440, 118);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(118);

      //Value above alert with hysteresis - stop on delay
      variable2.setValue(451, 119);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //Value below alert with hysteresis again - start on delay
      variable2.setValue(449, 120);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(120);

      //Value below alert with hysteresis again, off time delay not elapsed - do nothing
      variable2.setValue(445, 121);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(120);

      //Value below alert with hysteresis again, off time delay elapsed - deactivate alert
      variable2.setValue(443, 132);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(132);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
    });

    it("should invoke proper cycle with calcElement", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      payload.variableID = calcElement1ID;
      calcElement1Value = 400;
      calcElement1LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      //Value below high limit - no change
      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value above limit with hysteresis but not limit  - no change
      calcElement1.setValue(475, 101);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value above limit  - starting on time delay
      calcElement1.setValue(501, 102);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(102);

      //Value below limit  - stopping on time delay
      calcElement1.setValue(499, 103);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value above limit  - starting on time delay
      calcElement1.setValue(501, 104);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(104);

      //On time delay does not elapsed
      calcElement1.setValue(501, 105);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(104);

      //On time delay does elapsed
      calcElement1.setValue(501, 115);
      await alert.refresh(100);

      let expectedTexts = {
        en: payload.texts.en
          .replace("$VALUE", 501)
          .replace("$TIME", new Date(115000).toISOString()),
        pl: payload.texts.pl
          .replace("$VALUE", 501)
          .replace("$TIME", new Date(115000).toISOString()),
      };

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value still above alert - do nothing
      calcElement1.setValue(501, 116);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value below alert but not alert with hysteresis - do nothing
      calcElement1.setValue(475, 117);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //Value below alert with hysteresis - start on delay
      calcElement1.setValue(440, 118);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(118);

      //Value above alert with hysteresis - stop on delay
      calcElement1.setValue(451, 119);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //Value below alert with hysteresis again - start on delay
      calcElement1.setValue(449, 120);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(120);

      //Value below alert with hysteresis again, off time delay not elapsed - do nothing
      calcElement1.setValue(445, 121);
      await alert.refresh(100);

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(115);
      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(120);

      //Value below alert with hysteresis again, off time delay elapsed - deactivate alert
      calcElement1.setValue(443, 132);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(132);
      expect(alert.AlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
    });

    it("should use value with 3 digits in text if value has 4 digits after comma", async () => {
      alertActive = false;
      tickIdOfStartingOnTimeDelay = 100;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 501.1234;
      variable2LastValueTick = 111;
      payload.timeOnDelay = 10;

      await exec();

      const expectedTexts = {
        en: payload.texts.en
          .replace("$VALUE", "501.123")
          .replace("$TIME", new Date(111000).toISOString()),
        pl: payload.texts.pl
          .replace("$VALUE", "501.123")
          .replace("$TIME", new Date(111000).toISOString()),
      };

      expect(alert.Value).toEqual(expectedTexts);
      expect(alert.LastValueTick).toEqual(variable2LastValueTick);

      expect(alert.AlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });
  });
});
