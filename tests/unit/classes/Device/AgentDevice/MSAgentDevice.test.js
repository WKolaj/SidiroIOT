const MSAgentDevice = require("../../../../../classes/Device/AgentDevice/MSAgentDevice");
const {
  createDirIfNotExists,
  clearDirectoryAsync,
} = require("../../../../../utilities/utilities");

const AgentsDirPath = "__testDir/settings/agentsData";

describe("MSAgentDevice", () => {
  //TODO add rest of tests
  describe("_convertAgentDataSendPayloadToMCAgentPayload", () => {
    let project;
    let agent;
    let initPayload;
    let payloadToSend;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            qualityCodeEnabled: true,
            datapointId: "aaaa0000",
            dataConverter: {
              conversionType: "fixed",
              precision: 3,
            },
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            qualityCodeEnabled: true,
            datapointId: "bbbb1111",
            dataConverter: {
              conversionType: "precision",
              precision: 3,
            },
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            qualityCodeEnabled: true,
            datapointId: "cccc2222",
            dataConverter: null,
          },
        },
        eventsToSendConfig: {},
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)
      //1607100001000 - Fri Dec 04 2020 17:40:01 GMT+0100 (Central European Standard Time)
      //1607100002000 - Fri Dec 04 2020 17:40:02 GMT+0100 (Central European Standard Time)
      payloadToSend = {
        1607100000: {
          testElement1ID: 1001.1001,
          testElement2ID: 2001.2001,
          testElement3ID: 3001.3001,
        },
        1607100001: {
          testElement1ID: 1002.1002,
          testElement2ID: 2002.2002,
          testElement3ID: 3002.3002,
        },
        1607100002: {
          testElement1ID: 1003.1003,
          testElement2ID: 2003.2003,
          testElement3ID: 3003.3003,
        },
      };
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      return agent._convertAgentDataSendPayloadToMCAgentPayload(payloadToSend);
    };

    it("should properly convert standard payload to send to MindConnect payload to send", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = [
        {
          timestamp: "2020-12-04T16:40:00.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1001.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3001.3001" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:01.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1002.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3002.3002" },
          ],
        },
        {
          timestamp: "2020-12-04T16:40:02.000Z",
          values: [
            { dataPointId: "aaaa0000", qualityCode: "0", value: "1003.100" },
            { dataPointId: "bbbb1111", qualityCode: "0", value: "2.00e+3" },
            { dataPointId: "cccc2222", qualityCode: "0", value: "3003.3003" },
          ],
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    //TODO - add additional tests
  });

  describe("_convertAgentEventSendPayloadToMCAgentPayload", () => {
    let project;
    let agent;
    let initPayload;
    let tickId;
    let elementId;
    let value;

    beforeEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);

      project = {
        AgentsDirPath: AgentsDirPath,
      };

      initPayload = {
        id: "deviceID",
        name: "deviceName",
        type: "AgentDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        sendDataFileInterval: 10,
        sendEventFileInterval: 5,
        dataStorageSize: 20,
        eventStorageSize: 30,
        numberOfDataFilesToSend: 3,
        numberOfEventFilesToSend: 6,
        dataToSendConfig: {},
        eventsToSendConfig: {
          testElement1ID: {
            elementId: "testElement1ID",
            deviceId: "testDevice1ID",
            sendingInterval: 100,
            entityId: "aaaa0000",
            sourceType: "Event",
            sourceId: "application",
            source: "SidiroIOT",
            severity: 20,
          },
          testElement2ID: {
            elementId: "testElement2ID",
            deviceId: "testDevice2ID",
            sendingInterval: 200,
            entityId: "bbbb1111",
            sourceType: "Event",
            sourceId: "application",
            source: "SidiroIOT",
            severity: 30,
          },
          testElement3ID: {
            elementId: "testElement3ID",
            deviceId: "testDevice3ID",
            sendingInterval: 300,
            entityId: "cccc2222",
            sourceType: "Event",
            sourceId: "application",
            source: "SidiroIOT",
            severity: 40,
          },
        },
        numberOfSendDataRetries: 5,
        numberOfSendEventRetries: 3,
        boardingKey: {
          content: {
            baseUrl: "fakeURL",
            iat: "fakeIAT",
            clientCredentialProfile: ["SHARED_SECRET"],
            clientId: "fakeClientId",
            tenant: "fakeTenantId",
          },
          expiration: "fakeExpiratoinDate",
        },
      };

      //1607100000000 - Fri Dec 04 2020 17:40:00 GMT+0100 (Central European Standard Time)

      tickId = 1607100000;
      elementId = "testElement2ID";
      value = { pl: "fakeTestTextPL", en: "fakeTestTextEN" };
    });

    afterEach(async () => {
      await createDirIfNotExists(AgentsDirPath);
      await clearDirectoryAsync(AgentsDirPath);
    });

    let exec = async () => {
      agent = new MSAgentDevice(project);
      await agent.init(initPayload);

      return agent._convertAgentEventSendPayloadToMCAgentPayload(
        tickId,
        elementId,
        value
      );
    };

    it("should properly convert standard payload to send to MindConnect payload to send", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let expectedResult = {
        entityId: "bbbb1111",
        sourceType: "Event",
        sourceId: "application",
        source: "SidiroIOT",
        severity: 30,
        timestamp: "2020-12-04T16:40:00.000Z",
        description: JSON.stringify({
          pl: "fakeTestTextPL",
          en: "fakeTestTextEN",
        }),
      };

      expect(result).toEqual(expectedResult);
    });

    //TODO - add additional tests
  });
});
