const User = require("../../classes/User/User");
const {
  exists,
  hashString,
  generateRandomNumberString,
} = require("../../utilities/utilities");

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
