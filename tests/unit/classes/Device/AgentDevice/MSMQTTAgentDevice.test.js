const MSAgentDevice = require("../../../../../classes/Device/AgentDevice/MSAgentDevice");
const {} = require("../../../../../utilities/utilities");
const mqtt = require("async-mqtt");
const logger = require("../../../../../logger/logger");
const MSMQTTAgentDevice = require("../../../../../classes/Device/AgentDevice/MSMQTTAgentDevice");

const AgentsDirPath = "__testDir/settings/agentsData";

describe("MSMQTTAgentDevice", () => {
  let loggerWarnMock;

  beforeEach(() => {
    jest.setTimeout(30000);
    jest.clearAllMocks();
    loggerWarnMock = jest.fn();
    logger.warn = loggerWarnMock;
  });

  describe("constructor", () => {
    let project;

    beforeEach(() => {
      project = "testProject";
    });

    let exec = () => {
      return new MSMQTTAgentDevice(project);
    };

    it("should create new MSMQTTAgentDevice and set all properties to null", () => {
      let device = exec();

      expect(device._dirPath).toEqual(null);
      expect(device._dataClipboard).toEqual(null);
      expect(device._eventClipboard).toEqual(null);
      expect(device._tryBoardOnSendData).toEqual(null);
      expect(device._tryBoardOnSendEvent).toEqual(null);
      expect(device._lastDataValues).toEqual(null);
      expect(device._dataStorage).toEqual(null);
      expect(device._eventStorage).toEqual(null);
      expect(device.SendDataFileInterval).toEqual(null);
      expect(device.SendEventFileInterval).toEqual(null);
      expect(device.DataStorageSize).toEqual(null);
      expect(device.EventStorageSize).toEqual(null);
      expect(device.NumberOfDataFilesToSend).toEqual(null);
      expect(device.NumberOfEventFilesToSend).toEqual(null);
      expect(device.DataToSendConfig).toEqual(null);
      expect(device.EventsToSendConfig).toEqual(null);
      expect(device.Boarded).toEqual(null);
      expect(device._busy).toEqual(null);
      expect(device._valueConverters).toEqual(null);
      expect(device._mqttClient).toEqual(null);
      expect(device._mqttName).toEqual(null);
      expect(device._clientId).toEqual(null);
      expect(device._checkStateInterval).toEqual(null);
      expect(device._model).toEqual(null);
      expect(device._revision).toEqual(null);
      expect(device._tenantName).toEqual(null);
      expect(device._userName).toEqual(null);
      expect(device._userPassword).toEqual(null);
      expect(device._serialNumber).toEqual(null);
      expect(device._mqttMessagesLimit).toEqual(null);
      expect(device._deviceCreatedViaMQTT).toEqual(null);
    });

    it("should assign project to MSMQTTAgentDevice", () => {
      let result = exec();

      expect(result._project).toEqual(project);
    });
  });
});
