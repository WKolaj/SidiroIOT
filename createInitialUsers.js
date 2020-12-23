const User = require("./classes/User/User");
const { exists } = require("./utilities/utilities");

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

    let superAdmin = await User.GetUserFromFileById(superAdminID);
    if (!exists(superAdmin)) {
      superAdmin = await User.CreateFromPayload(
        {
          _id: superAdminID,
          name: superAdminName,
          password: superAdminPassword,
          permissions: 7,
        },
        true
      );
      await superAdmin.Save();
    }

    let admin = await User.GetUserFromFileById(adminID);
    if (!exists(admin)) {
      admin = await User.CreateFromPayload(
        {
          _id: adminID,
          name: adminName,
          password: adminPassword,
          permissions: 3,
        },
        true
      );
      await admin.Save();
    }

    let user = await User.GetUserFromFileById(userID);
    if (!exists(user)) {
      user = await User.CreateFromPayload(
        {
          _id: userID,
          name: userName,
          password: userPassword,
          permissions: 1,
        },
        true
      );
      await user.Save();
    }

    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

createInitialUsers();
