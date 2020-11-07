const Project = require("./classes/Project/Project");
let payload = {
  connectableDevices: {
    device1ID: {
      id: "device1ID",
      name: "device1Name",
      type: "MBDevice",
      variables: {
        testVariable1ID: {
          id: "testVariable1ID",
          deviceId: "testDeviceID",
          name: "testVariable1Name",
          type: "MBFloat",
          unit: "FakeUnit",
          sampleTime: 5,
          defaultValue: 123.456,
          offset: 10,
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
          deviceId: "testDeviceID",
          name: "testVariable2Name",
          type: "MBFloat",
          unit: "FakeUnit",
          sampleTime: 5,
          defaultValue: 321.654,
          offset: 12,
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
          deviceId: "testDeviceID",
          name: "testVariable3Name",
          type: "MBFloat",
          unit: "FakeUnit",
          sampleTime: 5,
          defaultValue: 789.654,
          offset: 14,
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
          deviceId: "testDeviceID",
          name: "testVariable4Name",
          type: "MBFloat",
          unit: "FakeUnit",
          sampleTime: 5,
          defaultValue: 123.456,
          offset: 10,
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
          deviceId: "testDeviceID",
          name: "testVariable5Name",
          type: "MBFloat",
          unit: "FakeUnit",
          sampleTime: 5,
          defaultValue: 321.654,
          offset: 12,
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
          deviceId: "testDeviceID",
          name: "testVariable6Name",
          type: "MBFloat",
          unit: "FakeUnit",
          sampleTime: 5,
          defaultValue: 789.654,
          offset: 14,
          length: 2,
          read: true,
          write: false,
          readFCode: 3,
          writeFCode: 16,
          unitID: 2,
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
    },
  },
  internalDevices: {},
  agentDevices: {},
};

const displayVariables = (device) => {
  for (let variable of Object.values(device.Variables)) {
    console.log(
      `${device.Name}: ${variable.Name}: ${variable.LastValueTick} : ${variable.Value}`
    );
  }
};

let exec = async () => {
  let project = new Project();
  await project.load(payload);

  setInterval(() => {
    for (let device of Object.values(project.Devices)) {
      displayVariables(device);
    }
  }, 1000);
};

exec();
