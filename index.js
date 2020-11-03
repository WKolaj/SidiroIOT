const readline = require("readline");
const MBInt16Variable = require("./classes/Element/Variable/ConnectableVariable/MBVariable/MBInt16");
const MBBoolean = require("./classes/Element/Variable/ConnectableVariable/MBVariable/MBBoolean");
const MBDevice = require("./classes/Device/ConnectableDevice/MBDevice");

let variable1 = new MBBoolean();
variable1._id = "variable1ID";
variable1._name = "variable1Name";
variable1._offset = 0;
variable1._readFCode = 1;
variable1._readSeperately = false;
variable1._read = true;
variable1._sampleTime = 1;
variable1._unitID = 1;
variable1._length = 1;
variable1._data = [0];
variable1._writeFCode = 15;
variable1._writeSeperately = false;
variable1._write = false;

let variable2 = new MBBoolean();
variable2._id = "variable2ID";
variable2._name = "variable2Name";
variable2._offset = 1;
variable2._readFCode = 1;
variable2._readSeperately = false;
variable2._read = true;
variable2._sampleTime = 1;
variable2._unitID = 1;
variable2._length = 1;
variable2._data = [0];
variable2._writeFCode = 15;
variable2._writeSeperately = false;
variable2._write = false;

let variable3 = new MBBoolean();
variable3._id = "variable3ID";
variable3._name = "variable3Name";
variable3._offset = 2;
variable3._readFCode = 1;
variable3._readSeperately = false;
variable3._read = true;
variable3._sampleTime = 1;
variable3._unitID = 1;
variable3._length = 1;
variable3._data = [0];
variable3._writeFCode = 15;
variable3._writeSeperately = false;
variable3._write = false;

let variable4 = new MBBoolean();
variable4._id = "variable4ID";
variable4._name = "variable4Name";
variable4._offset = 3;
variable4._readFCode = 1;
variable4._readSeperately = false;
variable4._read = true;
variable4._sampleTime = 1;
variable4._unitID = 1;
variable4._length = 1;
variable4._data = [0];
variable4._writeFCode = 15;
variable4._writeSeperately = false;
variable4._write = false;

let device = new MBDevice();
device._variables = {};
device._calcElements = {};
device._alerts = {};
device.Variables[variable1.ID] = variable1;
device.Variables[variable2.ID] = variable2;
device.Variables[variable3.ID] = variable3;
device.Variables[variable4.ID] = variable4;

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
    // let answer = JSON.parse(await askQuestion("Insert new values: "));
    // variable1.setValue(answer[0], 1);
    // variable2.setValue(answer[1], 1);
    // variable3.setValue(answer[2], 1);
    // variable4.setValue(answer[3], 1);
    await device.refresh(1);
    console.log(variable1.Value);
    console.log(variable2.Value);
    console.log(variable3.Value);
    console.log(variable4.Value);
    await askQuestion("Click to refresh...");
  }
};

exec();
