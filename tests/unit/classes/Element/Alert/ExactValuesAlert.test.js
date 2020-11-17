const ExactValuesAlert = require("../../../../../classes/Element/Alerts/ExactValuesAlert");
const {
  createFakeDevice,
  createFakeVariable,
  createFakeCalcElement,
} = require("../../../../utilities/testUtilities");

describe("ExactValuesAlert", () => {
  describe("constructor", () => {
    let project;
    let device;

    beforeEach(() => {
      project = "fakeProject";
      device = "fakeDevice";
    });

    let exec = () => {
      return new ExactValuesAlert(project, device);
    };

    it("should create new ExactValuesAlert and set all its properties to null", () => {
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
      expect(result.AlertValues).toEqual(null);
      expect(result.Texts).toEqual(null);
      expect(result.Severity).toEqual(null);
      expect(result.ActiveAlertID).toEqual(null);

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
        id: "pac3200-1-current-alert",
        name: "PAC3200-1-current-alert",
        type: "ExactValuesAlert",
        unit: "A",
        sampleTime: 1,
        defaultValue: null,
        variableID: "variable2ID",
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

      alert = new ExactValuesAlert(project, device);

      return alert.init(payload);
    };

    it("should initialized ExactValuesAlert based on its payload", async () => {
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
        10: {
          pl: "Osiągnięcie wartości: $VALUE",
          en: "Achieving value: $VALUE",
        },
        20: {
          pl: "Osiągnięcie wartości: $VALUE",
          en: "Achieving value: $VALUE",
        },
        30: {
          pl: "Osiągnięcie wartości: $VALUE",
          en: "Achieving value: $VALUE",
        },
        40: {
          pl: "Osiągnięcie wartości: $VALUE",
          en: "Achieving value: $VALUE",
        },
        50: {
          pl: "Osiągnięcie wartości: $VALUE",
          en: "Achieving value: $VALUE",
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

    it("should initialize other flags", async () => {
      await exec();
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
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
        id: "pac3200-1-current-alert",
        name: "PAC3200-1-current-alert",
        type: "ExactValuesAlert",
        unit: "A",
        sampleTime: 1,
        defaultValue: null,
        variableID: "variable2ID",
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
      };
    });

    let exec = async () => {
      alert = new ExactValuesAlert(project, device);
      await alert.init(payload);
      return alert.generatePayload();
    };

    it("should return a valid ExactValuesAlert payload", async () => {
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
        id: "pac3200-1-current-alert",
        name: "PAC3200-1-current-alert",
        type: "ExactValuesAlert",
        unit: "A",
        sampleTime: 1,
        defaultValue: null,
        variableID: "variable2ID",
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
      };
    });

    let exec = () => {
      return ExactValuesAlert.validatePayload(payload);
    };

    it("should return null if ExactValuesAlert payload is valid", async () => {
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

      expect(result).toEqual(`"type" must be [ExactValuesAlert]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [ExactValuesAlert]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [ExactValuesAlert]`);
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

    it("should return message if alertValues is not defined", () => {
      delete payload.alertValues;

      let result = exec();

      expect(result).toEqual(`"alertValues" is required`);
    });

    it("should return message if alertValues is null", () => {
      payload.alertValues = null;

      let result = exec();

      expect(result).toEqual(`"alertValues" must be an array`);
    });

    it("should return message if alertValues is not an array - string", () => {
      payload.alertValues = "fakeString";

      let result = exec();

      expect(result).toEqual(`"alertValues" must be an array`);
    });

    it("should return message if alertValues is an empty array", () => {
      payload.alertValues = "[]";

      let result = exec();

      expect(result).toEqual(`"alertValues" must be an array`);
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

    it("should return message if has no keys", () => {
      payload.texts = {};

      let result = exec();

      expect(result).toEqual(
        `"texts" keys have to correspond to the alertValues`
      );
    });

    it("should return message if has no key form alertValues", () => {
      delete payload.texts[10];

      let result = exec();

      expect(result).toEqual(
        `"texts" keys have to correspond to the alertValues`
      );
    });

    it("should return message if has more keys than alertValues", () => {
      payload.texts[60] = {
        en: "step 5: $VALUE",
        pl: "próg 5: $VALUE",
      };

      let result = exec();

      expect(result).toEqual(
        `"texts" keys have to correspond to the alertValues`
      );
    });

    it("should return message if one of key has invalid texts", () => {
      payload.texts[50] = "fakeTexts";

      let result = exec();

      expect(result).toEqual(`"value" must be of type object`);
    });

    it("should return null if one of key has valid texts - empty object", () => {
      payload.texts[50] = {};

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if one of key has valid texts - lack of pl translation", () => {
      delete payload.texts[50]["pl"];

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if one of key has valid texts - lack of en translation", () => {
      delete payload.texts[50]["en"];

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
        id: "pac3200-1-current-alert",
        name: "PAC3200-1-current-alert",
        type: "ExactValuesAlert",
        unit: "A",
        sampleTime: 1,
        defaultValue: null,
        variableID: "variable2ID",
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
      };

      value = 1234;
    });

    let exec = async () => {
      alert = new ExactValuesAlert(project, device);
      await alert.init(payload);
      return alert.checkIfValueCanBeSet(value);
    };

    it("should always return a message that AverageCalculator is read only", async () => {
      let result = await exec();

      expect(result).toEqual("ExactValuesAlert value is readonly");
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
    let activeAlertID;

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
        id: "pac3200-1-current-alert",
        name: "PAC3200-1-current-alert",
        type: "ExactValuesAlert",
        unit: "A",
        sampleTime: 1,
        defaultValue: null,
        variableID: "variable2ID",
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
      };

      activeAlertID = null;
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

      alert = new ExactValuesAlert(project, device);

      await alert.init(payload);

      alert._activeAlertID = activeAlertID;
      alert._onDelayTimeStarted = onDelayTimeStarted;
      alert._offDelayTimeStarted = offDelayTimeStarted;
      alert._tickIdOfStartingOnTimeDelay = tickIdOfStartingOnTimeDelay;
      alert._tickIdOfStartingOffTimeDelay = tickIdOfStartingOffTimeDelay;
      alert.setValue(value, lastValueTick);
      return alert.refresh(tickId);
    };

    it("should do nothing - if value is not a value of any alert, any alert is not active, off delay time is not started, on delay time is not started", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 11;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start on delay - if value is value alert, any alert is not active, off delay time is not started, on delay time is not started", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 20;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(100);
    });

    it("should stop on delay - if value is not a value alert, any alert is not active, off delay time is not started, on delay time is started", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = 99;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 21;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is value alert, any alert is not active, off delay time is not started, on delay time started but not elapsed", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = 99;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 20;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(99);
    });

    it("should activate alert and stop on delay - if value is value of alert, any alert is not active, off delay time is not started, on delay time started and elapsed", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = 94;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = true;
      offDelayTimeStarted = false;
      variable2Value = 20;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;

      await exec();

      const expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(100);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is value of alert, this alert is active, off delay time is not started, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 20;
      variable2LastValueTick = 101;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      const expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(100);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start off delay - if value is not a value of any alert, alert is active, off delay time is not started, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 21;
      variable2LastValueTick = 101;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      const expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(100);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(101);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should stop off delay - if value is a value of  alert, alert is active, off delay time is started, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 100;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 20;
      variable2LastValueTick = 101;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      const expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(100);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is not a value of alert, alert is active, off delay time is started but not elapsed, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 100;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 21;
      variable2LastValueTick = 101;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      const expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(100);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(100);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should deactive an alert and stop off delay - if value is not a value of alert, alert is active, off delay time is started and elapsed, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 100;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 21;
      variable2LastValueTick = 111;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(111);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should start off delay - if value is a value of different alert, alert is active, off delay time is not started, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 30;
      variable2LastValueTick = 101;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      const expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(100);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(101);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is a value of different alert, alert is active, off delay time is started but not elapsed, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 100;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 30;
      variable2LastValueTick = 101;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      const expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(100);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(100);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should deactive an alert and stop off delay and start on delay - if value is a value of different alert, alert is active, off delay time is started and elapsed, on delay time is not started", async () => {
      activeAlertID = 20;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = 100;
      onDelayTimeStarted = false;
      offDelayTimeStarted = true;
      variable2Value = 30;
      variable2LastValueTick = 111;
      value = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };
      lastValueTick = 100;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(111);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(111);
    });

    it("should perform valid cycle for variable", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 11;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;
      payload.variableID = variable2ID;

      //1  - value not a value of any alert - do nothing

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //2  - Value of one of alert - start on delay

      variable2.setValue(20, 101);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(101);

      //3  - Value not a value of any alert - stop on delay

      variable2.setValue(21, 102);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //4  - Value of one of alert - start on delay

      variable2.setValue(20, 103);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(103);

      //5  - On delay not elapsed - do nothing

      variable2.setValue(20, 104);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(103);

      //6  - On delay elapsed - activate alert

      variable2.setValue(20, 108);

      await alert.refresh(tickId);

      let expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //7  - Value of alert - do nothing

      variable2.setValue(20, 109);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //8  - Value not a value of any alert - start off delay

      variable2.setValue(21, 110);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(110);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //9  - Value a value of this alert - stop delay

      variable2.setValue(20, 111);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //10 - Value not a value of any alert - start off delay

      variable2.setValue(21, 112);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(112);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //11 - Value not a value of any alert  - off delay not elapsed - do nothing

      variable2.setValue(21, 113);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(112);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //12 - Value not a value of any alert  - off delay elapsed - deactivate alert

      variable2.setValue(21, 122);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //13 - Value of alert - start on delay

      variable2.setValue(20, 123);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(123);

      //14 - On delay elapsed but value changed do different alert - activate it

      variable2.setValue(30, 128);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 3: 30",
        pl: "próg 3: 30",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(30);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //15 - Value changed to the value of different alert - start off delay

      variable2.setValue(40, 129);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 3: 30",
        pl: "próg 3: 30",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(30);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(129);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //16 - Off delay elapsed - deactivate alert, activate on delay

      variable2.setValue(40, 139);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(139);

      //17 - on delay elapsed - activate alert

      variable2.setValue(40, 144);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 4: 40",
        pl: "próg 4: 40",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(144);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(40);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //18 - value changed to the value of different alert - off delay started

      variable2.setValue(50, 145);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 4: 40",
        pl: "próg 4: 40",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(144);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(40);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(145);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //19 - off delay elapsed but value changed to different alert - stop off delay, start on delay

      variable2.setValue(20, 155);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(155);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(155);

      //20 - on delay elapsed, stop on delay, activate alert

      variable2.setValue(20, 160);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(160);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should perform valid cycle for calcElement", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      calcElement1Value = 11;
      calcElement1LastValueTick = 100;
      value = null;
      lastValueTick = 0;
      payload.variableID = calcElement1ID;

      //1  - value not a value of any alert - do nothing

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //2  - Value of one of alert - start on delay

      calcElement1.setValue(20, 101);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(101);

      //3  - Value not a value of any alert - stop on delay

      calcElement1.setValue(21, 102);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //4  - Value of one of alert - start on delay

      calcElement1.setValue(20, 103);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(103);

      //5  - On delay not elapsed - do nothing

      calcElement1.setValue(20, 104);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(103);

      //6  - On delay elapsed - activate alert

      calcElement1.setValue(20, 108);

      await alert.refresh(tickId);

      let expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //7  - Value of alert - do nothing

      calcElement1.setValue(20, 109);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //8  - Value not a value of any alert - start off delay

      calcElement1.setValue(21, 110);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(110);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //9  - Value a value of this alert - stop delay

      calcElement1.setValue(20, 111);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //10 - Value not a value of any alert - start off delay

      calcElement1.setValue(21, 112);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(112);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //11 - Value not a value of any alert  - off delay not elapsed - do nothing

      calcElement1.setValue(21, 113);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(108);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(112);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //12 - Value not a value of any alert  - off delay elapsed - deactivate alert

      calcElement1.setValue(21, 122);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //13 - Value of alert - start on delay

      calcElement1.setValue(20, 123);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(122);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(123);

      //14 - On delay elapsed but value changed do different alert - activate it

      calcElement1.setValue(30, 128);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 3: 30",
        pl: "próg 3: 30",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(30);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //15 - Value changed to the value of different alert - start off delay

      calcElement1.setValue(40, 129);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 3: 30",
        pl: "próg 3: 30",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(128);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(30);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(129);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //16 - Off delay elapsed - deactivate alert, activate on delay

      calcElement1.setValue(40, 139);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(139);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(139);

      //17 - on delay elapsed - activate alert

      calcElement1.setValue(40, 144);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 4: 40",
        pl: "próg 4: 40",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(144);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(40);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //18 - value changed to the value of different alert - off delay started

      calcElement1.setValue(50, 145);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 4: 40",
        pl: "próg 4: 40",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(144);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(40);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(true);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(145);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);

      //19 - off delay elapsed but value changed to different alert - stop off delay, start on delay

      calcElement1.setValue(20, 155);

      await alert.refresh(tickId);

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(155);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(true);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(155);

      //20 - on delay elapsed, stop on delay, activate alert

      calcElement1.setValue(20, 160);

      await alert.refresh(tickId);

      expectedValue = {
        en: "step 2: 20",
        pl: "próg 2: 20",
      };

      expect(alert.Value).toEqual(expectedValue);
      expect(alert.LastValueTick).toEqual(160);

      expect(alert.AlertActive).toEqual(true);
      expect(alert.ActiveAlertID).toEqual(20);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is value alert, any alert is not active, off delay time is not started, on delay time is not started - variable or calcElement of given id does not exist", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 20;
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;
      payload.variableID = "fakeID";

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is value alert, any alert is not active, off delay time is not started, on delay time is not started - variable value is invalid", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = [1, 2, 3, 4];
      variable2LastValueTick = 100;
      value = null;
      lastValueTick = 0;
      payload.variableID = variable2ID;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is value alert, any alert is not active, off delay time is not started, on delay time is not started - calcElement value is invalid", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      calcElement1Value = [1, 2, 3, 4];
      calcElement1LastValueTick = 100;
      value = null;
      lastValueTick = 0;
      payload.variableID = calcElement1;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });

    it("should do nothing - if value is value alert, any alert is not active, off delay time is not started, on delay time is not started - lastValueTick is 0", async () => {
      activeAlertID = null;
      tickIdOfStartingOnTimeDelay = null;
      tickIdOfStartingOffTimeDelay = null;
      onDelayTimeStarted = false;
      offDelayTimeStarted = false;
      variable2Value = 20;
      variable2LastValueTick = 0;
      value = null;
      lastValueTick = 0;
      payload.variableID = variable2ID;

      await exec();

      expect(alert.Value).toEqual(null);
      expect(alert.LastValueTick).toEqual(0);

      expect(alert.AlertActive).toEqual(false);
      expect(alert.ActiveAlertID).toEqual(null);
      expect(alert._onDelayTimeStarted).toEqual(false);
      expect(alert._offDelayTimeStarted).toEqual(false);
      expect(alert._tickIdOfStartingOffTimeDelay).toEqual(null);
      expect(alert._tickIdOfStartingOnTimeDelay).toEqual(null);
    });
  });
});
