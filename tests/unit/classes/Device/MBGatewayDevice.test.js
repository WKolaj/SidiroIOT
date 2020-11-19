const MBGatewayDevice = require("../../../../classes/Device/ConnectableDevice/MBGatewayDevice");
const MBDriver = require("../../../../classes/Driver/MBDriver");
const MBRequestManager = require("../../../../classes/Request/MBRequest/MBRequestManager");

describe("MBGatewayDevice", () => {
  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "fakeProject";
    });

    let exec = () => {
      return new MBGatewayDevice(project);
    };

    it("should create new MBGatewayDevice and set its RequestManager to MBRequestManager and Driver to MBDriver", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.RequestManager).toBeDefined();
      expect(result.RequestManager instanceof MBRequestManager).toEqual(true);

      expect(result.Driver).toBeDefined();
      expect(result.Driver instanceof MBDriver).toEqual(true);
    });

    it("should assign project to MBDevice", () => {
      let result = exec();

      expect(result._project).toEqual(project);
    });

    it("should set _continueIfRequestThrows to true", () => {
      let result = exec();

      expect(result._continueIfRequestThrows).toEqual(true);
    });
  });

  describe("validatePayload", () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: "device1ID",
        name: "device1Name",
        type: "MBGatewayDevice",
        variables: {
          testVariable1ID: {
            id: "testVariable1ID",
            name: "testVariable1Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable2ID: {
            id: "testVariable2ID",
            name: "testVariable2Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable3ID: {
            id: "testVariable3ID",
            name: "testVariable3Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 1,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable4ID: {
            id: "testVariable4ID",
            name: "testVariable4Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable5ID: {
            id: "testVariable5ID",
            name: "testVariable5Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable6ID: {
            id: "testVariable6ID",
            name: "testVariable6Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 2,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable7ID: {
            id: "testVariable7ID",
            name: "testVariable7Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 123.456,
            offset: 1,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable8ID: {
            id: "testVariable8ID",
            name: "testVariable8Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 321.654,
            offset: 3,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
          testVariable9ID: {
            id: "testVariable9ID",
            name: "testVariable9Name",
            type: "MBSwappedFloat",
            unit: "FakeUnit",
            sampleTime: 1,
            defaultValue: 789.654,
            offset: 5,
            length: 2,
            read: true,
            write: false,
            readFCode: 3,
            writeFCode: 16,
            unitID: 3,
            readAsSingle: false,
            writeAsSingle: false,
          },
        },
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.10.100",
        portNumber: 502,
        timeout: 500,
      };
    });

    let exec = () => {
      return MBGatewayDevice.validatePayload(payload);
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

      expect(result).toEqual(`"type" must be [MBGatewayDevice]`);
    });

    it("should return message if type is empty string", () => {
      payload.type = "";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBGatewayDevice]`);
    });

    it("should return message if type is invalid string", () => {
      payload.type = "MBVariable";

      let result = exec();

      expect(result).toEqual(`"type" must be [MBGatewayDevice]`);
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

    it("should return message if portNumber is not defined", () => {
      delete payload.portNumber;

      let result = exec();

      expect(result).toEqual(`"portNumber" is required`);
    });

    it("should return message if portNumber is null", () => {
      payload.portNumber = null;

      let result = exec();

      expect(result).toEqual(`"portNumber" must be a number`);
    });

    it("should return message if portNumber is a float", () => {
      payload.portNumber = 123.321;

      let result = exec();

      expect(result).toEqual(`"portNumber" must be an integer`);
    });

    it("should return message if portNumber is smaller than 1", () => {
      payload.portNumber = 0;

      let result = exec();

      expect(result).toEqual(`"portNumber" must be greater than or equal to 1`);
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
      payload.variables.testVariable1ID = {
        id: "testVariable99ID",
        name: "testVariable1Name",
        type: "MBFloat",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 321.654,
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 3,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

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

    it("should return message if one of variables payload is invalid - id different than id inside payload", () => {
      payload.variables.testVariable1ID = {
        id: "testVariable99ID",
        name: "testVariable1Name",
        type: "MBFloat",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 321.654,
        offset: 3,
        length: 2,
        read: true,
        write: false,
        readFCode: 3,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`variable's id as key and in payload differs!`);
    });

    it("should return message if one of variables payload is invalid - MBBoolean", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBBoolean",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: 321.654,
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

      expect(result).toEqual(`"defaultValue" must be a boolean`);
    });

    it("should return message if one of variables payload is invalid - MBByteArray", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBByteArray",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: [1, 2],
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

      expect(result).toEqual(`"defaultValue" must contain ref:length items`);
    });

    it("should return message if one of variables payload is invalid - MBDouble", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBDouble",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 4,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBFloat", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBFloat",
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

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBInt16", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBInt16",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 1,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBInt32",
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

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedDouble", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedDouble",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 4,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedFloat", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedFloat",
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

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedInt32",
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

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBSwappedUInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBSwappedUInt32",
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

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBUInt16", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBUInt16",
        unit: "FakeUnit",
        sampleTime: 1,
        defaultValue: "fakeValue",
        offset: 3,
        length: 1,
        read: true,
        write: false,
        readFCode: 1,
        writeFCode: 16,
        unitID: 1,
        readAsSingle: false,
        writeAsSingle: false,
      };

      let result = exec();

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    it("should return message if one of variables payload is invalid - MBUInt32", () => {
      //invalid default value
      payload.variables.testVariable1ID = {
        id: "testVariable1ID",
        name: "testVariable1Name",
        type: "MBUInt32",
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

      expect(result).toEqual(`"defaultValue" must be a number`);
    });

    //TODO - add tests for associated variables and internal variables

    it("should return message if one of variables types is not recognized", () => {
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

    //TODO - add tests for types of calcElements

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

    //TODO - add tests for types of alerts
  });
});