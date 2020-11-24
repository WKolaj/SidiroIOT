const StandardProtocolVariable = require("../../classes/Element/Variable/ConnectableVariable/StandardProtocolVariable");
const ConnectableDevice = require("../../classes/Device/ConnectableDevice/ConnectableDevice");
const CalcElement = require("../../classes/Element/CalcElement/CalcElement");
const RequestManager = require("../../classes/Request/RequestManager");
const ProtocolRequest = require("../../classes/Request/ProtocolRequest");
const StandardProtocolRequest = require("../../classes/Request/StandardProtocolRequest");
const ConnectableVariable = require("../../classes/Element/Variable/ConnectableVariable/ConnectableVariable");
const Device = require("../../classes/Device/Device");
const Driver = require("../../classes/Driver/Driver");
const User = require("../../classes/User/User");
const {
  exists,
  hashString,
  generateRandomNumberString,
  snooze,
} = require("../../utilities/utilities");
const { sample } = require("lodash");
const Variable = require("../../classes/Element/Variable/Variable");
const Alert = require("../../classes/Element/Alerts/Alert");
const MBVariable = require("../../classes/Element/Variable/ConnectableVariable/MBVariable/MBVariable");
const MBRequest = require("../../classes/Request/MBRequest/MBRequest");
const InternalDevice = require("../../classes/Device/InternalDevice/InternalDevice");

const testUselessUserID = "uselessUserID";
const testAdminID = "adminID";
const testUserID = "userID";
const testUserAndAdminID = "userAndAdminID";
const testSuperAdminID = "superAdminID";
const testAdminAndSuperAdminID = "adminAndSuperAdminID";
const testUserAndAdminAndSuperAdminID = "userAndAdminAndSuperAdminID";

const testUselessUserName = "uselessUserName";
const testAdminName = "adminName";
const testUserName = "userName";
const testUserAndAdminName = "userAndAdminName";
const testSuperAdminName = "superAdminName";
const testAdminAndSuperAdminName = "adminAndSuperAdminName";
const testUserAndAdminAndSuperAdminName = "userAndAdminAndSuperAdminName";

const testUselessUserPassword = "testUselessUserPassword";
const testAdminPassword = "testAdminPassword";
const testUserPassword = "testUserPassword";
const testUserAndAdminPassword = "testUserAndAdminPassword";
const testSuperAdminPassword = "testSuperAdminPassword";
const testAdminAndSuperAdminPassword = "superAdminAndAdminPassword";
const testUserAndAdminAndSuperAdminPassword =
  "userAndSuperAdminAndAdminPassword";

module.exports.testUselessUserID = testUselessUserID;
module.exports.testAdminID = testAdminID;
module.exports.testUserID = testUserID;
module.exports.testUserAndAdminID = testUserAndAdminID;
module.exports.testSuperAdminID = testSuperAdminID;
module.exports.testAdminAndSuperAdminID = testAdminAndSuperAdminID;
module.exports.testUserAndAdminAndSuperAdminID = testUserAndAdminAndSuperAdminID;

module.exports.testUselessUserName = testUselessUserName;
module.exports.testAdminName = testAdminName;
module.exports.testUserName = testUserName;
module.exports.testUserAndAdminName = testUserAndAdminName;
module.exports.testSuperAdminName = testSuperAdminName;
module.exports.testAdminAndSuperAdminName = testAdminAndSuperAdminName;
module.exports.testUserAndAdminAndSuperAdminName = testUserAndAdminAndSuperAdminName;

module.exports.testUselessUserPassword = testUselessUserPassword;
module.exports.testAdminPassword = testAdminPassword;
module.exports.testUserPassword = testUserPassword;
module.exports.testUserAndAdminPassword = testUserAndAdminPassword;
module.exports.testSuperAdminPassword = testSuperAdminPassword;
module.exports.testAdminAndSuperAdminPassword = testAdminAndSuperAdminPassword;
module.exports.testUserAndAdminAndSuperAdminPassword = testUserAndAdminAndSuperAdminPassword;

//Method for generating useless (without permissions) user directly into database
module.exports.generateUselessUser = async () => {
  let user = await User.GetUserFromFileById(testUselessUserID);
  if (exists(user)) return user;

  user = await User.CreateFromPayload(
    {
      _id: testUselessUserID,
      name: testUselessUserName,
      password: testUselessUserPassword,
      permissions: 0,
    },
    true
  );

  await user.Save();

  return user;
};

//Method for generating test admin user directly into database
module.exports.generateTestAdmin = async () => {
  let user = await User.GetUserFromFileById(testAdminID);
  if (exists(user)) return user;

  user = await User.CreateFromPayload(
    {
      _id: testAdminID,
      name: testAdminName,
      password: testAdminPassword,
      permissions: 2,
    },
    true
  );

  await user.Save();

  return user;
};

//Method for generating test  user directly into database
module.exports.generateTestUser = async () => {
  let user = await User.GetUserFromFileById(testUserID);
  if (exists(user)) return user;

  user = await User.CreateFromPayload(
    {
      _id: testUserID,
      name: testUserName,
      password: testUserPassword,
      permissions: 1,
    },
    true
  );

  await user.Save();

  return user;
};

//Method for generating test user that is also an admin directly into database
module.exports.generateTestAdminAndUser = async () => {
  let user = await User.GetUserFromFileById(testUserAndAdminID);
  if (exists(user)) return user;
  ConnectableDevice;
  user = await User.CreateFromPayload(
    {
      _id: testUserAndAdminID,
      name: testUserAndAdminName,
      password: testUserAndAdminPassword,
      permissions: 3,
    },
    true
  );

  await user.Save();

  return user;
};

//Method for generating test su[er admin user directly into database
module.exports.generateTestSuperAdmin = async () => {
  let user = await User.GetUserFromFileById(testSuperAdminID);
  if (exists(user)) return user;

  user = await User.CreateFromPayload(
    {
      _id: testSuperAdminID,
      name: testSuperAdminName,
      password: testSuperAdminPassword,
      permissions: 4,
    },
    true
  );

  await user.Save();

  return user;
};

//Method for generating test admin that is also a super admin
module.exports.generateTestAdminAndSuperAdmin = async () => {
  let user = await User.GetUserFromFileById(testAdminAndSuperAdminID);
  if (exists(user)) return user;

  user = await User.CreateFromPayload(
    {
      _id: testAdminAndSuperAdminID,
      name: testAdminAndSuperAdminName,
      password: testAdminAndSuperAdminPassword,
      permissions: 6,
    },
    true
  );

  await user.Save();

  return user;
};

//Method for generating test admin that is also a super admin and user
module.exports.generateTestUserAndAdminAndSuperAdmin = async () => {
  let user = await User.GetUserFromFileById(testUserAndAdminAndSuperAdminID);
  if (exists(user)) return user;

  user = await User.CreateFromPayload(
    {
      _id: testUserAndAdminAndSuperAdminID,
      name: testUserAndAdminAndSuperAdminName,
      password: testUserAndAdminAndSuperAdminPassword,
      permissions: 7,
    },
    true
  );

  await user.Save();

  return user;
};

//Method for generating string of given length
module.exports.generateStringOfGivenLength = (sign, length) => {
  return new Array(length + 1).join(sign);
};

//Method to wrap method to be invoked after some time
module.exports.wrapMethodToInvokeAfter = (method, snoozeTime) => {
  return async (...args) => {
    await snooze(snoozeTime);
    return method(...args);
  };
};

module.exports.createFakeConnectableDevice = (
  project,
  id,
  type,
  name,
  variables,
  requests,
  calcElements,
  alerts,
  isDriverActive,
  isDriverConnected,
  isDriverBusy,
  driverConnectMock,
  driverDisconnectMock,
  driverProcessRequestMock,
  driverTimeout,
  continueOnRequestThrow = false
) => {
  let device = new ConnectableDevice(project);
  device._id = id;
  device._type = type;
  device._name = name;

  device._variables = {};
  for (let variable of variables) {
    variable._project = project;
    variable._device = device;
    device._variables[variable.ID] = variable;
  }

  device._calcElements = {};
  for (let calcElement of calcElements) {
    device._calcElements[calcElement.ID] = calcElement;

    calcElement._project = project;
    calcElement._device = device;
  }

  device._alerts = {};
  for (let alert of alerts) {
    device._alerts[alert.ID] = alert;

    alert._project = project;
    alert._device = device;
  }

  //Creating and initializing requets manager
  device._requestManager = new RequestManager();
  device.RequestManager._requests = requests;

  //creating and initilizaing driver
  device._driver = new Driver();
  device.Driver._timeout = driverTimeout;
  device.Driver._isActive = isDriverActive;
  device.Driver._busy = isDriverBusy;
  device.Driver.driver = new Driver();

  device.Driver._getIsConnectedState = () => isDriverConnected;

  device.Driver._processRequest = driverProcessRequestMock;
  device.Driver._connect = driverConnectMock;
  device.Driver._disconnect = driverDisconnectMock;

  device._continueIfRequestThrows = continueOnRequestThrow;

  return device;
};

module.exports.createFakeVariable = (
  project,
  device,
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  refreshMockFunc
) => {
  let variable = new Variable(project, device);

  variable._id = id;
  variable._name = name;
  variable._type = type;
  variable._defaultValue = defaultValue;
  variable._unit = unit;
  variable._sampleTime = sampleTime;
  variable._lastValueTick = 0;
  variable.refresh = refreshMockFunc;

  return variable;
};

module.exports.createFakeConnectableVariable = (
  project,
  device,
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  data,
  convertDataToValueMockFunc,
  convertValueToDataMockFunc,
  read = true,
  write = false,
  readAsSingle = false,
  writeAsSingle = false
) => {
  let variable = new ConnectableVariable(project, device);

  variable._id = id;
  variable._name = name;
  variable._type = type;
  variable._defaultValue = defaultValue;
  variable._unit = unit;
  variable._sampleTime = sampleTime;
  variable._data = data;
  variable._lastValueTick = 0;
  variable._convertDataToValue = convertDataToValueMockFunc;
  variable._convertValueToData = convertValueToDataMockFunc;

  variable._read = read;
  variable._write = write;
  variable._readSeperately = readAsSingle;
  variable._writeSeperately = writeAsSingle;

  return variable;
};

module.exports.createFakeStandardProtocolVariable = (
  project,
  device,
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  data,
  offset,
  length,
  convertDataToValueMockFunc,
  convertValueToDataMockFunc,
  read = true,
  write = false,
  readAsSingle = false,
  writeAsSingle = false
) => {
  let variable = new StandardProtocolVariable(project, device);

  variable._id = id;
  variable._name = name;
  variable._type = type;
  variable._defaultValue = defaultValue;
  variable._unit = unit;
  variable._sampleTime = sampleTime;
  variable._data = data;
  variable._offset = offset;
  variable._length = length;
  variable._lastValueTick = 0;
  variable._convertDataToValue = convertDataToValueMockFunc;
  variable._convertValueToData = convertValueToDataMockFunc;

  variable._read = read;
  variable._write = write;
  variable._readSeperately = readAsSingle;
  variable._writeSeperately = writeAsSingle;

  return variable;
};

module.exports.createFakeMBVariable = (
  project,
  device,
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  data,
  offset,
  length,
  convertDataToValueMockFunc,
  convertValueToDataMockFunc,
  unitID,
  readFCode,
  writeFCode,
  read = true,
  write = false,
  readAsSingle = false,
  writeAsSingle = false,
  getReadFunctionCodesMockFunc = () => [1, 2, 3, 4],
  getWriteFunctionCodesMockFunc = () => [16]
) => {
  let variable = new MBVariable(project, device);

  variable._id = id;
  variable._name = name;
  variable._type = type;
  variable._defaultValue = defaultValue;
  variable._unit = unit;
  variable._sampleTime = sampleTime;
  variable._data = data;
  variable._offset = offset;
  variable._length = length;
  variable._lastValueTick = 0;
  variable._convertDataToValue = convertDataToValueMockFunc;
  variable._convertValueToData = convertValueToDataMockFunc;

  variable._read = read;
  variable._write = write;
  variable._readSeperately = readAsSingle;
  variable._writeSeperately = writeAsSingle;

  variable._unitID = unitID;
  variable._readFCode = readFCode;
  variable._writeFCode = writeFCode;

  variable._getReadPossibleFunctionCodes = getReadFunctionCodesMockFunc;
  variable._getWritePossibleFunctionCodes = getWriteFunctionCodesMockFunc;

  return variable;
};

module.exports.testMBVariable = (
  project,
  device,
  variable,
  payload,
  value,
  lastTickValue,
  variableClass,
  exactValue = false
) => {
  expect(variable._project).toEqual(project);
  expect(variable._device).toEqual(device);
  expect(variable instanceof variableClass).toEqual(true);
  expect(variable.ID).toEqual(payload.id);
  expect(variable.Name).toEqual(payload.name);
  expect(variable.Type).toEqual(payload.type);
  expect(variable.Unit).toEqual(payload.unit);
  expect(variable.SampleTime).toEqual(payload.sampleTime);
  if (exactValue) expect(variable.DefaultValue).toEqual(payload.defaultValue);
  else expect(variable.DefaultValue).toBeCloseTo(payload.defaultValue);
  expect(variable.LastValueTick).toEqual(lastTickValue);
  if (exactValue) expect(variable.Value).toEqual(value);
  else expect(variable.Value).toBeCloseTo(value);
  expect(variable.Offset).toEqual(payload.offset);
  expect(variable.Length).toEqual(payload.length);
  expect(variable.Read).toEqual(payload.read);
  expect(variable.Write).toEqual(payload.write);
  expect(variable.ReadFCode).toEqual(payload.readFCode);
  expect(variable.WriteFCode).toEqual(payload.writeFCode);
  expect(variable.UnitID).toEqual(payload.unitID);
  expect(variable.ReadSeperately).toEqual(payload.readAsSingle);
  expect(variable.WriteSeperately).toEqual(payload.writeAsSingle);
};

module.exports.testMBRequest = (
  request,
  sampleTime,
  fCode,
  offset,
  length,
  unitID,
  writeRequest,
  readRequest,
  variables
) => {
  expect(request instanceof MBRequest).toEqual(true);
  expect(request.SampleTime).toEqual(sampleTime);
  expect(request.Offset).toEqual(offset);
  expect(request.Length).toEqual(length);
  expect(request.UnitID).toEqual(unitID);
  expect(request.FCode).toEqual(fCode);
  expect(request.WriteRequest).toEqual(writeRequest);
  expect(request.ReadRequest).toEqual(readRequest);
  expect(request.Variables).toEqual(variables);
};

module.exports.createFakeCalcElement = (
  project,
  device,
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  refreshMockFunc
) => {
  let calcElement = new CalcElement(project, device);

  calcElement._id = id;
  calcElement._name = name;
  calcElement._type = type;
  calcElement._defaultValue = defaultValue;
  calcElement._unit = unit;
  calcElement._sampleTime = sampleTime;
  calcElement._lastValueTick = 0;
  calcElement.refresh = refreshMockFunc;

  return calcElement;
};

module.exports.createFakeAlert = (
  project,
  device,
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  refreshMockFunc
) => {
  let alert = new Alert(project, device);

  alert._id = id;
  alert._name = name;
  alert._type = type;
  alert._defaultValue = defaultValue;
  alert._unit = unit;
  alert._sampleTime = sampleTime;
  alert._lastValueTick = 0;
  alert.refresh = refreshMockFunc;

  return alert;
};

module.exports.createFakeProtocolRequest = (
  variables,
  sampleTime,
  writeRequest,
  writeDataToVariablesMockFunc
) => {
  let protocolRequest = new ProtocolRequest(
    variables,
    sampleTime,
    writeRequest
  );
  protocolRequest.writeDataToVariableValues = writeDataToVariablesMockFunc;
  return protocolRequest;
};

module.exports.createFakeStandardProtocolRequest = (
  variables,
  sampleTime,
  writeRequest
) => {
  let protocolRequest = new StandardProtocolRequest(
    variables,
    sampleTime,
    writeRequest
  );

  return protocolRequest;
};

module.exports.createFakeDevice = (
  project,
  id,
  type,
  name,
  calcElements,
  alerts,
  variables,
  isActive
) => {
  let device = new Device(project);
  device._id = id;
  device._type = type;
  device._name = name;

  device._variables = {};
  for (let variable of variables) {
    variable._project = project;
    variable._device = device;
    device._variables[variable.ID] = variable;
  }

  device._calcElements = {};
  for (let calcElement of calcElements) {
    device._calcElements[calcElement.ID] = calcElement;

    calcElement._project = project;
    calcElement._device = device;
  }

  device._alerts = {};
  for (let alert of alerts) {
    device._alerts[alert.ID] = alert;

    alert._project = project;
    alert._device = device;
  }

  device._isActive = isActive;

  return device;
};

module.exports.createFakeInternalDevice = (
  project,
  id,
  type,
  name,
  calcElements,
  alerts,
  variables,
  isActive
) => {
  let device = new InternalDevice(project);
  device._id = id;
  device._type = type;
  device._name = name;

  device._variables = {};
  for (let variable of variables) {
    variable._project = project;
    variable._device = device;
    device._variables[variable.ID] = variable;
  }

  device._calcElements = {};
  for (let calcElement of calcElements) {
    device._calcElements[calcElement.ID] = calcElement;

    calcElement._project = project;
    calcElement._device = device;
  }

  device._alerts = {};
  for (let alert of alerts) {
    device._alerts[alert.ID] = alert;

    alert._project = project;
    alert._device = device;
  }

  device._isActive = isActive;

  return device;
};
