const { exists, writeFileAsync, hashString } = require("./utilities/utilities");
const config = require("config");
const path = require("path");

const superAdminID = "superAdminID";
const superAdminName = "superAdmin";
const adminID = "adminID";
const adminName = "admin";
const adminPassword = "admin1234";
const userID = "userID";
const userName = "user";
const userPassword = "user1234";

/**
 * @description Method for creating initial users
 */
const createInitialUsers = async () => {
  try {
    //Retrieving argument - password
    let arguments = process.argv.slice(2);
    let superAdminPassword = arguments[0];
    if (!exists(superAdminPassword))
      throw new Error("Password of test admin should be passed as argument");

    let usersFilePath = path.join(
      config.get("settingsPath"),
      config.get("userFileName")
    );

    let usersPayload = {
      [superAdminID]: {
        _id: superAdminID,
        name: superAdminName,
        password: await hashString(superAdminPassword),
        permissions: 7,
      },
      [adminID]: {
        _id: adminID,
        name: adminName,
        password: await hashString(adminPassword),
        permissions: 3,
      },
      [userID]: {
        _id: userID,
        name: userName,
        password: await hashString(userPassword),
        permissions: 1,
      },
    };

    await writeFileAsync(usersFilePath, JSON.stringify(usersPayload), "utf8");

    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

createInitialUsers();
