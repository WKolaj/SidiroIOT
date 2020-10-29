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
  driverTimeout
) => {
  let device = new ConnectableDevice();
  device._id = id;
  device._type = type;
  device._name = name;

  device._variables = {};
  for (let variable of variables) device._variables[variable.ID] = variable;

  device._calcElements = {};
  for (let calcElement of calcElements)
    device._calcElements[calcElement.ID] = calcElement;

  device._alerts = {};
  for (let alert of alerts) device._alerts[alert.ID] = alert;

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

  return device;
};

module.exports.createFakeVariable = (
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime
) => {
  let variable = new Variable();

  variable._id = id;
  variable._name = name;
  variable._type = type;
  variable._defaultValue = defaultValue;
  variable._unit = unit;
  variable._sampleTime = sampleTime;
  variable._lastValueTick = 0;

  return variable;
};

module.exports.createFakeConnectableVariable = (
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  data,
  convertDataToValueMockFunc,
  convertValueToDataMockFunc
) => {
  let variable = new ConnectableVariable();

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

  return variable;
};

module.exports.createFakeStandardProtocolVariable = (
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
  convertValueToDataMockFunc
) => {
  let variable = new StandardProtocolVariable();

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

  return variable;
};

module.exports.createFakeCalcElement = (
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  refreshMockFunc
) => {
  let calcElement = new CalcElement();

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
  id,
  name,
  type,
  defaultValue,
  unit,
  sampleTime,
  refreshMockFunc
) => {
  let alert = new Alert();

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
  id,
  type,
  name,
  refreshSnooze,
  refreshVariablesMock,
  calcElements,
  alerts,
  isActive
) => {
  let device = new Device();
  device._id = id;
  device._type = type;
  device._name = name;
  device._refreshVariables = async () => {
    await snooze(refreshSnooze);
    await refreshVariablesMock();
  };

  device._calcElements = {};
  for (let calcElement of calcElements)
    device._calcElements[calcElement.ID] = calcElement;

  device._alerts = {};
  for (let alert of alerts) device._alerts[alert.ID] = alert;

  device._isActive = isActive;

  return device;
};
