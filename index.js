const DataClipboard = require("./classes/Clipboard/DataClipboard");
const AgentDevice = require("./classes/Device/AgentDevice/AgentDevice");

let exec = async () => {
  //starting the server
  let server = await require("./startup/app")();

  let projectService = require("./services/projectService");

  let project = projectService._getProject();

  let agent = new AgentDevice(project);

  let payload = {
    id: "testAgent1ID",
    name: "testAgentName",
    type: "AgentDevice",
    variables: {},
    calcElements: {},
    alerts: {},
    sendDataFileInterval: 12,
    sendEventFileInterval: 23,
    dataStorageSize: 3,
    eventStorageSize: 4,
    numberOfDataFilesToSend: 5,
    numberOfEventFilesToSend: 6,
    dataToSendConfig: {},
    eventsToSendConfig: {},
  };

  await agent.init(payload);

  console.log(agent.generatePayload());
};

exec();
