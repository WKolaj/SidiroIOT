const { last } = require("lodash");
const BandwidthLimitAlert = require("../../../../../classes/Element/Alerts/BandwidthLimitAlert");
const {
  createFakeDevice,
  createFakeVariable,
  createFakeCalcElement,
} = require("../../../../utilities/testUtilities");

describe("BandwidthLimitAlert", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new BandwidthLimitAlert(project, device);
    };

    it("should create new BandwidthLimitAlert and set all its properties to null", () => {
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
      expect(result.LowLimit).toEqual(null);
      expect(result.Texts).toEqual(null);
      expect(result.Severity).toEqual(null);
      expect(result.Hysteresis).toEqual(null);
      expect(result.TimeOnDelay).toEqual(null);
      expect(result.TimeOffDelay).toEqual(null);

      expect(result.AlertActive).toEqual(null);

      expect(result._highAlertTurnOffValue).toEqual(null);
      expect(result._lowAlertTurnOffValue).toEqual(null);
      expect(result._highAlertActive).toEqual(null);
      expect(result._lowAlertActive).toEqual(null);
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
        type: "BandwidthLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
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

      alert = new BandwidthLimitAlert(project, device);

      return alert.init(payload);
    };

    it("should initialized BandwidthLimitAlert based on its payload", async () => {
      await exec();

      let calcElementPayload = alert.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
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
      };

      expect(calcElementPayload).toEqual(expectedPayload);
    });

    it("should not throw and set default texts - if texts are not defined", async () => {
      delete payload.texts;

      await exec();

      let defaultTexts = {
        highLimit: {
          pl: "Przekroczenie granicy alarmowej: $VALUE",
          en: "High limit alert: $VALUE",
        },
        lowLimit: {
          pl: "Przekroczenie dolnej granicy alarmowej: $VALUE",
          en: "Low limit alert: $VALUE",
        },
      };

      let calcElementPayload = alert.generatePayload();

      let expectedPayload = {
        ...payload,
        lastValueTick: 0,
        value: payload.defaultValue,
        texts: defaultTexts,
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

    it("should properly calculate lowAlertTurnOffValue - histeresis > 0, lowLimit > 0", async () => {
      payload.lowLimit = 100;
      payload.hysteresis = 20;

      await exec();
      expect(alert._lowAlertTurnOffValue).toEqual(120);
    });

    it("should properly calculate lowAlertTurnOffValue - histeresis = 0, lowLimit > 0", async () => {
      payload.lowLimit = 100;
      payload.hysteresis = 0;

      await exec();
      expect(alert._lowAlertTurnOffValue).toEqual(100);
    });

    it("should properly calculate lowAlertTurnOffValue - histeresis > 0, lowLimit < 0", async () => {
      payload.lowLimit = -100;
      payload.hysteresis = 20;

      await exec();
      expect(alert._lowAlertTurnOffValue).toEqual(-80);
    });

    it("should properly calculate lowAlertTurnOffValue - histeresis = 0, lowLimit < 0", async () => {
      payload.lowLimit = -100;
      payload.hysteresis = 0;

      await exec();
      expect(alert._lowAlertTurnOffValue).toEqual(-100);
    });

    it("should initialize other flags", async () => {
      await exec();
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._lowAlertActive).toEqual(false);
      expect(alert._highAlertActive).toEqual(false);
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
      device = "fakeDevice";

      payload = {
        id: "fakeElement1ID",
        name: "fakeElement1Name",
        type: "BandwidthLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
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
      };
    });

    let exec = async () => {
      alert = new BandwidthLimitAlert(project, device);
      await alert.init(payload);
      return alert.generatePayload();
    };

    it("should return a valid BandwidthLimitAlert payload", async () => {
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
        type: "BandwidthLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
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
      };
    });

    let exec = () => {
      return BandwidthLimitAlert.validatePayload(payload);
    };

    it("should return null if BandwidthLimitAlert payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [BandwidthLimitAlert]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [BandwidthLimitAlert]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [BandwidthLimitAlert]`);
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

    it("should return message if lowLimit is not defined", () => {
      delete payload.lowLimit;

      let result = exec();

      expect(result).toEqual(`"lowLimit" is required`);
    });

    it("should return message if lowLimit is null", () => {
      payload.lowLimit = null;

      let result = exec();

      expect(result).toEqual(`"lowLimit" must be a number`);
    });

    it("should return null if lowLimit is smaller then 0", () => {
      payload.lowLimit = -100;

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

    it("should return message if texts is there is no highLimit in object of translation", () => {
      delete payload.texts.highLimit;

      let result = exec();

      expect(result).toEqual(`"texts.highLimit" is required`);
    });

    it("should return message if highLimit in object of translation is null", () => {
      payload.texts.highLimit = null;

      let result = exec();

      expect(result).toEqual(`"texts.highLimit" must be of type object`);
    });

    it("should return message if highLimit in object of translation is not a translationObject", () => {
      payload.texts.highLimit = "fakeText";

      let result = exec();

      expect(result).toEqual(`"texts.highLimit" must be of type object`);
    });

    it("should return null if highLimit in object of translation is a valid translation object - only english translation", () => {
      payload.texts.highLimit = {
        en: "sometext",
      };

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if highLimit in object of translation is a valid translation object - only polish translation", () => {
      payload.texts.highLimit = {
        pl: "sometext",
      };

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return message if texts is there is no lowLimit in object of translation", () => {
      delete payload.texts.lowLimit;

      let result = exec();

      expect(result).toEqual(`"texts.lowLimit" is required`);
    });

    it("should return message if highLimit in object of translation is null", () => {
      payload.texts.lowLimit = null;

      let result = exec();

      expect(result).toEqual(`"texts.lowLimit" must be of type object`);
    });

    it("should return message if lowLimit in object of translation is not a translationObject", () => {
      payload.texts.lowLimit = "fakeText";

      let result = exec();

      expect(result).toEqual(`"texts.lowLimit" must be of type object`);
    });

    it("should return null if lowLimit in object of translation is a valid translation object - only english translation", () => {
      payload.texts.lowLimit = {
        en: "sometext",
      };

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if lowLimit in object of translation is a valid translation object - only polish translation", () => {
      payload.texts.lowLimit = {
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
      alert = new BandwidthLimitAlert(project, device);
      await alert.init(payload);
      return alert.checkIfValueCanBeSet(value);
    };

    it("should always return a message that AverageCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("BandwidthLimitAlert value is readonly");
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

    let lowAlertActive;
    let highAlertActive;

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
        type: "BandwidthLimitAlert",
        unit: "FakeUnit",
        sampleTime: 15,
        defaultValue: null,
        variableID: "variable2ID",
        highLimit: 500,
        lowLimit: 250,
        severity: 1,
        hysteresis: 10,
        timeOnDelay: 5,
        timeOffDelay: 10,
        texts: {
          lowLimit: {
            pl: "fakeTextLowLimitPL, value: $VALUE, time: $TIME",
            en: "fakeTextLowLimitEN, value: $VALUE, time: $TIME",
          },
          highLimit: {
            pl: "fakeTextHighLimitPL, value: $VALUE, time: $TIME",
            en: "fakeTextHighLimitEN, value: $VALUE, time: $TIME",
          },
        },
      };

      highAlertActive = false;
      lowAlertActive = false;
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

      alert = new BandwidthLimitAlert(project, device);

      await alert.init(payload);

      alert._highAlertActive = highAlertActive;
      alert._lowAlertActive = lowAlertActive;
      alert._onDelayTimeStarted = onDelayTimeStarted;
      alert._offDelayTimeStarted = offDelayTimeStarted;
      alert._tickIdOfStartingOnTimeDelay = tickIdOfStartingOnTimeDelay;
      alert._tickIdOfStartingOffTimeDelay = tickIdOfStartingOffTimeDelay;
      alert.setValue(value, lastValueTick);
      return alert.refresh(tickId);
    };

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is below highAlert (inc. hyst.), off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
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
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert (inc. hyst.) but not highAlert, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
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
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert (inc. hyst.) but not highAlert, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
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
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start on delay - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
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
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(
        variable2LastValueTick
      );
    });

    it("should stop on delay - if lowAlert is not active, highAlert is not active, value is below highAlert, off delay time is not started, on delay time is started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = 99;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 499;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is started but not elapsed", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = 99;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(99);
    });

    it("should set high alert and stop on delay - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is started and elapsed", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = 99;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 105;
      value = null;
      lastValueTick = 0;

      await exec();

      const expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:45.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:45.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(105);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is active, value is above highAlert, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 100;
      value = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:45.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:45.000Z",
      };
      lastValueTick = 90;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(90);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is active, value is below highAlert but above highAlert with hysteresis, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 475;
      variable2LastValueTick = 100;
      value = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:45.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:45.000Z",
      };
      lastValueTick = 90;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(90);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start off time delay - if lowAlert is not active, highAlert is active, value is below highAlert with hysteresis, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 440;
      variable2LastValueTick = 100;
      value = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:45.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:45.000Z",
      };
      lastValueTick = 90;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(90);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(100);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should stop off time delay - if lowAlert is not active, highAlert is active, value is below highAlert with hysteresis, off delay time is started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 99;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 475;
      variable2LastValueTick = 100;
      value = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:45.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:45.000Z",
      };
      lastValueTick = 90;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(90);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is active, value is below highAlert with hysteresis, off delay time is started but not elapsed, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 99;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 440;
      variable2LastValueTick = 100;
      value = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:45.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:45.000Z",
      };
      lastValueTick = 90;

      await exec();

      expect(alert.Value).toEqual(value);
      expect(alert.LastValueTick).toEqual(90);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(99);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should stop high alert and deactive off delay - if lowAlert is not active, highAlert is active, value is below highAlert with hysteresis, off delay time is started and elapsed, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = true;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 94;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 440;
      variable2LastValueTick = 105;
      value = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:45.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:45.000Z",
      };
      lastValueTick = 90;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(105);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above lowAlert (inc. hyst.), off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 300;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above lowAlert, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 251;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start on delay - if lowAlert is not active, highAlert is not active, value is below lowAlert, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 249;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
    });

    it("should stop on delay - if lowAlert is not active, highAlert is not active, value is above lowAlert, off delay time is not started, on delay time is started", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = 100;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 251;
      variable2LastValueTick = 101;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is below lowAlert, off delay time is not started, on delay time is started but not elapsed", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = 100;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 249;
      variable2LastValueTick = 101;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
    });

    it("should activate low alert and stop on delay - if lowAlert is not active, highAlert is not active, value is below lowAlert, off delay time is not started, on delay time is started and elapsed", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = 100;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 249;
      variable2LastValueTick = 106;
      value = null;
      lastValueTick = 0;

      await exec();

      const expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is active, highAlert is not active, value is below lowAlert, off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = true;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 249;
      variable2LastValueTick = 107;
      value = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };
      lastValueTick = 106;

      await exec();

      const expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is active, highAlert is not active, value is above lowAlert but not lowAlert (inc. hys.), off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = true;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 260;
      variable2LastValueTick = 107;
      value = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };
      lastValueTick = 106;

      await exec();

      const expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start off delay - if lowAlert is active, highAlert is not active, value is above lowAlert (inc. hys.), off delay time is not started, on delay time is not started", async () => {
      lowAlertActive = true;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 276;
      variable2LastValueTick = 107;
      value = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };
      lastValueTick = 106;

      await exec();

      const expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(107);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should stop off delay - if lowAlert is active, highAlert is not active, value is below lowAlert (inc. hys.), off delay time is started, on delay time is not started", async () => {
      lowAlertActive = true;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 106;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 274;
      variable2LastValueTick = 107;
      value = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };
      lastValueTick = 106;

      await exec();

      const expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is active, highAlert is not active, value is above lowAlert (inc. hys.), off delay time is started but not elapsed, on delay time is not started", async () => {
      lowAlertActive = true;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 106;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 276;
      variable2LastValueTick = 107;
      value = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };
      lastValueTick = 106;

      await exec();

      const expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(106);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should deactivate lowAlert and stop off delay - if lowAlert is active, highAlert is not active, value is above lowAlert (inc. hys.), off delay time is started and elapsed, on delay time is not started", async () => {
      lowAlertActive = true;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 106;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 276;
      variable2LastValueTick = 117;
      value = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };
      lastValueTick = 106;

      await exec();

      const expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(117);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do a proper cycle if ranges are inverted", async () => {
      payload.highLimit = 400;
      payload.lowLimit = 500;
      payload.hysteresis = 20;

      // LowLimitStop    --- 600 ---
      // LowLimit        --- 500 ---
      // HighLimit       --- 400 ---
      // HighLimitStop   --- 320 ---

      //Value in the middle - high alert has larger priority - start onDelay
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 450;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      //starting on delay

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //on delay not elapsed - do nothing
      variable2.setValue(450, 101);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //on delay elapsed - activiting high alert
      variable2.setValue(450, 106);
      await alert.refresh(100);

      let expectedValue = {
        pl: "fakeTextHighLimitPL, value: 450, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextHighLimitEN, value: 450, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //still above high alert - do nothing
      variable2.setValue(450, 107);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 450, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextHighLimitEN, value: 450, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert but not high alert (inc. his.) - do nothing
      variable2.setValue(390, 108);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 450, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextHighLimitEN, value: 450, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) - start off delay
      variable2.setValue(300, 109);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 450, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextHighLimitEN, value: 450, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(109);

      //above high alert (inc. his.) - stop off delay
      variable2.setValue(400, 110);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 450, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextHighLimitEN, value: 450, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) - start off delay
      variable2.setValue(300, 111);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 450, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextHighLimitEN, value: 450, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(111);

      //below high alert (inc. his.), off delay not elapsed
      variable2.setValue(300, 112);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 450, time: 1970-01-01T00:01:46.000Z",
        en: "fakeTextHighLimitEN, value: 450, time: 1970-01-01T00:01:46.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(106);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(111);

      //below high alert (inc. his.), off delay elapsed
      variable2.setValue(300, 122);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) but below low limit, on delay started
      variable2.setValue(300, 123);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(123);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) but below low limit, on delay started not elapsed
      variable2.setValue(300, 124);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(123);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) but below low limit, on delay elapsed
      variable2.setValue(300, 128);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:08.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:08.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) but below low limit
      variable2.setValue(300, 129);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:08.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:08.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) but above low limit but not inc. his.
      variable2.setValue(550, 130);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:08.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:08.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) but above low limit and inc. his.
      variable2.setValue(601, 131);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:08.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:08.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(131);

      //below high alert (inc. his.) but below low limit  inc. his. again
      variable2.setValue(550, 131);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:08.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:08.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) but above low limit and inc. his. again
      variable2.setValue(601, 132);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:08.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:08.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(132);

      //below high alert (inc. his.) but above low limit and inc. his. off delay not elapsed
      variable2.setValue(601, 133);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:08.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:08.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(132);

      //below high alert (inc. his.) but above low limit and inc. his. off delay elapsed
      variable2.setValue(601, 143);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(143);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //above high alert (inc. his.) on delay started
      variable2.setValue(601, 144);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(143);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(144);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //above high alert (inc. his.) on delay started - time not elapsed
      variable2.setValue(601, 145);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(143);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(144);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) and below low limit - time not elapsed but not stopped
      variable2.setValue(300, 146);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(143);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(144);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert (inc. his.) and below low limit - time elapsed
      variable2.setValue(300, 150);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 300, time: 1970-01-01T00:02:30.000Z",
        en: "fakeTextLowLimitEN, value: 300, time: 1970-01-01T00:02:30.000Z",
      };
      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(150);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
    });

    it("should do a proper cycle if variable is calcElement", async () => {
      //Value in the middle - high alert has larger priority - start onDelay
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      payload.variableID = calcElement1ID;
      calcElement1Value = 400;
      calcElement1LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      //doing nothing

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //going above high alert but not above high alert inc. his.

      calcElement1.setValue(475, 101);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //going above high alert and above high alert inc. his.

      calcElement1.setValue(501, 102);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(102);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //going below high alert again

      calcElement1.setValue(499, 103);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //going above high alert again

      calcElement1.setValue(501, 104);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(104);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //going above high alert again - time not elapsed

      calcElement1.setValue(501, 105);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(104);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //going above high alert again - time elapsed

      calcElement1.setValue(501, 110);
      await alert.refresh(100);

      let expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:50.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:50.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(110);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //above high alert again

      calcElement1.setValue(501, 111);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:50.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:50.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(110);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert but not high alert inc his

      calcElement1.setValue(499, 112);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:50.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:50.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(110);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert inc his

      calcElement1.setValue(449, 113);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:50.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:50.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(110);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(113);

      //above high alert inc his

      calcElement1.setValue(451, 114);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:50.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:50.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(110);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert inc his

      calcElement1.setValue(449, 115);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:50.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:50.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(110);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(115);

      //below high alert off time not elapsed

      calcElement1.setValue(449, 120);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextHighLimitPL, value: 501, time: 1970-01-01T00:01:50.000Z",
        en: "fakeTextHighLimitEN, value: 501, time: 1970-01-01T00:01:50.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(110);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(true);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(115);

      //below high alert, off time elapsed

      calcElement1.setValue(449, 126);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(126);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below high alert, above low limit

      calcElement1.setValue(449, 128);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(126);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below low alert (inc. his) but not low limit

      calcElement1.setValue(260, 129);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(126);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below low alert (inc. his) and low limit

      calcElement1.setValue(249, 130);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(126);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(130);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //above low alert (inc. his) and low limit

      calcElement1.setValue(251, 132);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(126);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below low alert (inc. his) and low limit again

      calcElement1.setValue(249, 133);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(126);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(133);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below low alert (inc. his) and low limit again - time not elapsed

      calcElement1.setValue(249, 134);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(126);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(133);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below low alert (inc. his) and low limit again - time elapsed

      calcElement1.setValue(249, 139);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:02:19.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:02:19.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //below low alert (inc. his) and low limit again

      calcElement1.setValue(249, 140);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:02:19.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:02:19.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //above low limit again but not low limit inc. hys.

      calcElement1.setValue(251, 140);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:02:19.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:02:19.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //above low limit and low limit inc. hys.

      calcElement1.setValue(276, 141);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:02:19.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:02:19.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(141);

      //below low limit and low limit inc. hys. again

      calcElement1.setValue(274, 142);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:02:19.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:02:19.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);

      //above low limit and low limit inc. hys. again

      calcElement1.setValue(276, 143);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:02:19.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:02:19.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(143);

      //above low limit and low limit inc. hys.  - time not elapsed

      calcElement1.setValue(276, 144);
      await alert.refresh(100);

      expectedValue = {
        pl: "fakeTextLowLimitPL, value: 249, time: 1970-01-01T00:02:19.000Z",
        en: "fakeTextLowLimitEN, value: 249, time: 1970-01-01T00:02:19.000Z",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(true);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(143);

      //above low limit and low limit inc. hys.  - time elapsed

      calcElement1.setValue(276, 154);
      await alert.refresh(100);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(154);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is not started - but there is no variable and calcElement of given id", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      payload.variableID = "fakeVariableId";

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is not started - and variable has invalid value", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = [1, 2, 3, 4];
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is not started - variable has invalid tickId", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 501;
      variable2LastValueTick = 0;
      value = null;
      lastValueTick = 0;

      payload.variableID = "fakeVariableId";

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is not started - and calcElement has invalid value", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      calcElement1Value = [1, 2, 3, 4];
      calcElement1LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      payload.variableID = calcElement1ID;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if lowAlert is not active, highAlert is not active, value is above highAlert, off delay time is not started, on delay time is not started - calcElement has invalid tickId", async () => {
      lowAlertActive = false;
      highAlertActive = false;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      calcElement1Value = 501;
      calcElement1LastValueTick = 0;
      value = null;
      lastValueTick = 0;

      payload.variableID = calcElement1ID;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.HighAlertActive).toEqual(false);
      expect(alert.LowAlertActive).toEqual(false);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });
  });
});
