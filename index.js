const readline = require("readline");
const MBInt16Variable = require("./classes/Element/Variable/ConnectableVariable/MBVariable/MBInt16");
const MBDevice = require("./classes/Device/ConnectableDevice/MBDevice");

let variable = new MBInt16Variable();
variable._id = "variable1ID";
variable._name = "variable1Name";
variable._offset = 2;
variable._readFCode = 3;
variable._readSeperately = false;
variable._read = true;
variable._sampleTime = 1;
variable._unitID = 1;
variable._length = 1;
variable._data = [0];

let device = new MBDevice();
device._variables = {};
device._calcElements = {};
device._alerts = {};
device.Variables[variable.ID] = variable;

device.RequestManager.createRequests(Object.values(device.Variables));

device.Driver._ipAddress = "192.168.10.100";
device.Driver._portNumber = 502;

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

let exec = async () => {
  await device.activate();

  while (1) {
    await device.refresh(1);
    console.log(variable.Value);
    await askQuestion("Insert any key to continue...");
  }
};

exec();
