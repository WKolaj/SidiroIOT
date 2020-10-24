const path = require("path");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../../../classes/User/User");
const {
  setBit,
  clearBit,
  removeFileIfExistsAsync,
  hashedStringMatch,
  hashString,
  writeFileAsync,
  readFileAsync,
} = require("../../../../utilities/utilities");

const privateKey = config.get("jwtPrivateKey");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);

describe("User", () => {
  beforeEach(async () => {
    await removeFileIfExistsAsync(userFilePath);
  });

  afterEach(async () => {
    await removeFileIfExistsAsync(userFilePath);
  });

  describe("constructor", () => {
    let exec = () => {
      return new User();
    };

    it("should create and return User with all Properties set to null", () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.ID).toEqual(null);
      expect(result.Password).toEqual(null);
      expect(result.Permissions).toEqual(null);
      expect(result.Name).toEqual(null);
    });
  });

  describe("isSuperAdmin", () => {
    let permissions;

    beforeEach(() => {
      permissions = 4;
    });

    let exec = () => {
      return User.isSuperAdmin(permissions);
    };

    it("should return true if bit 2 of permissions is set to 1", () => {
      permissions = setBit(0, 2);

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if bit 2 of permissions is set to 0", () => {
      permissions = clearBit(255, 2);

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return true if several bits (also 1) are set", () => {
      permissions = 255;

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if several bits (also 1) are cleared", () => {
      permissions = 0;

      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("isAdmin", () => {
    let permissions;

    beforeEach(() => {
      permissions = 2;
    });

    let exec = () => {
      return User.isAdmin(permissions);
    };

    it("should return true if bit 1 of permissions is set to 1", () => {
      permissions = setBit(0, 1);

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if bit 1 of permissions is set to 0", () => {
      permissions = clearBit(255, 1);

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return true if several bits (also 1) are set", () => {
      permissions = 255;

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if several bits (also 1) are cleared", () => {
      permissions = 0;

      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("isUser", () => {
    let permissions;

    beforeEach(() => {
      permissions = 1;
    });

    let exec = () => {
      return User.isUser(permissions);
    };

    it("should return true if bit 0 of permissions is set to 1", () => {
      permissions = setBit(0, 0);

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if bit 1 of permissions is set to 0", () => {
      permissions = clearBit(255, 0);

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return true if several bits (also 1) are set", () => {
      permissions = 255;

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if several bits (also 1) are cleared", () => {
      permissions = 0;

      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("Payload", () => {
    let userPayload;
    let user;

    beforeEach(() => {
      userPayload = {
        _id: "testUserId",
        name: "testUserName",
        permissions: 7,
        password: "abcd1234",
      };
    });

    let exec = async () => {
      user = await User.CreateFromPayload(userPayload, true);
      return user.Payload;
    };

    it("should return payload with users properties", async () => {
      let result = await exec();

      let resultToCheck = { ...result };

      delete resultToCheck.password;

      expect(resultToCheck).toEqual({
        _id: userPayload._id,
        name: userPayload.name,
        permissions: userPayload.permissions,
      });

      //Password should have been hashed
      expect(result.password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        userPayload.password,
        result.password
      );
      expect(passwordMatches).toEqual(true);
    });
  });

  describe("PayloadWithoutPassword", () => {
    let userPayload;
    let user;

    beforeEach(() => {
      userPayload = {
        _id: "testUserId",
        name: "testUserName",
        permissions: 7,
        password: "abcd1234",
      };
    });

    let exec = async () => {
      user = await User.CreateFromPayload(userPayload, true);
      return user.PayloadWithoutPassword;
    };

    it("should return payload with users properties", async () => {
      let result = await exec();

      expect(result).toEqual({
        _id: userPayload._id,
        name: userPayload.name,
        permissions: userPayload.permissions,
      });
    });
  });

  describe("CreateFromPayload", () => {
    let userPayload;
    let hashPassword;

    beforeEach(() => {
      userPayload = {
        name: "testUser1",
        password: "abcd1234",
        permissions: 7,
      };
      hashPassword = true;
    });

    let exec = () => {
      return User.CreateFromPayload(userPayload, hashPassword);
    };

    it("should create and initialize User based on given payload - if hashPassword is set to true", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      expect(result.Permissions).toEqual(userPayload.permissions);
      expect(result.Name).toEqual(userPayload.name);

      //ID should be automatically generated if empty
      expect(result.ID).toBeDefined();

      //Password should had been hashed
      expect(result.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        userPayload.password,
        result.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should create and initialize User based on given payload - if hashPassword is undefined", async () => {
      hashPassword = undefined;

      let result = await exec();

      expect(result).toBeDefined();

      expect(result.Permissions).toEqual(userPayload.permissions);
      expect(result.Name).toEqual(userPayload.name);

      //ID should be automatically generated if empty
      expect(result.ID).toBeDefined();

      //Password should had been hashed
      expect(result.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        userPayload.password,
        result.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should create and initialize User based on given payload - if hashPassword is set to false", async () => {
      hashPassword = false;

      let result = await exec();

      expect(result).toBeDefined();

      expect(result.Permissions).toEqual(userPayload.permissions);
      expect(result.Name).toEqual(userPayload.name);

      //ID should be automatically generated if empty
      expect(result.ID).toBeDefined();

      //Password should not had been hashed and be equal to payload
      expect(result.Password).toEqual(userPayload.password);
    });

    it("should generate different IDs for every user", async () => {
      let userIds = [];

      for (let i = 0; i < 10; i++) {
        let payload = { ...userPayload, name: `testUser${i}` };
        let user = await User.CreateFromPayload(payload);
        userIds.push(user.ID);
      }

      //Checking if array contains duplicates
      expect(userIds.length === new Set(userIds).size).toEqual(true);
    });

    it("should set ID if id has been given in payload", async () => {
      userPayload._id = "testID";
      let result = await exec();

      expect(result).toBeDefined();

      //ID should be automatically generated if empty
      expect(result.ID).toBeDefined();
      expect(result.ID).toEqual(userPayload._id);

      expect(result.Permissions).toEqual(userPayload.permissions);
      expect(result.Name).toEqual(userPayload.name);

      //Password should had been hashed
      expect(result.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        userPayload.password,
        result.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should throw if name does not exist", async () => {
      delete userPayload.name;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`"name" is required`);
    });

    it("should throw if permissions does not exist", async () => {
      delete userPayload.permissions;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`"permissions" is required`);
    });

    it("should throw if password does not exist", async () => {
      delete userPayload.password;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`"password" is required`);
    });
  });

  describe("EditWithPayload", () => {
    let initialPayload;
    let editPayload;
    let user;
    let hashPassword;

    beforeEach(() => {
      initialPayload = {
        _id: "testUser1Id",
        name: "testUser1",
        password: "abcd1234",
        permissions: 7,
      };

      editPayload = {
        _id: "testUser1Id",
        name: "testUser1",
        password: "abcde12345",
        permissions: 3,
      };

      hashPassword = true;
    });

    let exec = async () => {
      user = await User.CreateFromPayload(initialPayload);
      return user.EditWithPayload(editPayload, hashPassword);
    };

    it("should edit user based on given payload - and hash new password during edition, if hashPassword is set to true", async () => {
      await exec();

      expect(user.ID).toEqual(editPayload._id);
      expect(user.Name).toEqual(editPayload.name);
      expect(user.Permissions).toEqual(editPayload.permissions);

      //Password should had been hashed
      expect(user.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        editPayload.password,
        user.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should edit user based on given payload - and not hash new password during edition, if hashPassword is set to false", async () => {
      hashPassword = false;

      await exec();

      expect(user.ID).toEqual(editPayload._id);
      expect(user.Name).toEqual(editPayload.name);
      expect(user.Permissions).toEqual(editPayload.permissions);

      //Password should not had been hashed - and be saves as it is
      expect(user.Password).toEqual(editPayload.password);
    });

    it("should edit user based on given payload - and hash new password during edition, if hashPassword is not defined", async () => {
      hashPassword = undefined;

      await exec();

      expect(user.ID).toEqual(editPayload._id);
      expect(user.Name).toEqual(editPayload.name);
      expect(user.Permissions).toEqual(editPayload.permissions);

      //Password should had been hashed
      expect(user.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        editPayload.password,
        user.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should edit user based on given payload - and hash new password during edition, if name is not present in payload", async () => {
      delete editPayload.name;

      await exec();

      expect(user.ID).toEqual(editPayload._id);
      expect(user.Name).toEqual(initialPayload.name);
      expect(user.Permissions).toEqual(editPayload.permissions);

      //Password should had been hashed
      expect(user.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        editPayload.password,
        user.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should throw and not edit user - if there is an attempt to change name", async () => {
      editPayload.name = "fakeName";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(
        "Name fakeName does not correspond to users name testUser1"
      );
    });

    it("should throw and not edit user - if there is an attempt to change id", async () => {
      editPayload._id = "fakeId";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(
        "ID fakeId does not correspond to users id testUser1Id"
      );
    });

    it("should edit user based on given payload - and hash new password during edition, if id is not present in payload", async () => {
      delete editPayload._id;

      await exec();

      expect(user.ID).toEqual(initialPayload._id);
      expect(user.Name).toEqual(editPayload.name);
      expect(user.Permissions).toEqual(editPayload.permissions);

      //Password should had been hashed
      expect(user.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        editPayload.password,
        user.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should edit user based on given payload - if only permissions is present in payload", async () => {
      (editPayload = {
        permissions: 3,
      }),
        await exec();

      expect(user.ID).toEqual(initialPayload._id);
      expect(user.Name).toEqual(initialPayload.name);
      expect(user.Permissions).toEqual(editPayload.permissions);

      //Password should had been hashed
      expect(user.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        initialPayload.password,
        user.Password
      );
      expect(passwordMatches).toEqual(true);
    });

    it("should edit user based on given payload - if only password is present in payload", async () => {
      (editPayload = {
        password: "abcd1234",
      }),
        await exec();

      expect(user.ID).toEqual(initialPayload._id);
      expect(user.Name).toEqual(initialPayload.name);
      expect(user.Permissions).toEqual(initialPayload.permissions);

      //Password should had been hashed
      expect(user.Password).toBeDefined();
      let passwordMatches = await hashedStringMatch(
        editPayload.password,
        user.Password
      );
      expect(passwordMatches).toEqual(true);
    });
  });

  describe("GetUserFromFileById", () => {
    let initialFileContent;
    let userId;

    //$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm is hashed abcd1234
    //$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou is hashed abcd2234
    //$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16 is hashed abcd3234
    //$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC is hashed abcd4234

    beforeEach(() => {
      createFile = true;
      initialFileContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };
      userId = "testUser3Id";
    });

    let exec = async () => {
      await writeFileAsync(
        userFilePath,
        JSON.stringify(initialFileContent),
        "utf8"
      );
      return User.GetUserFromFileById(userId);
    };

    it("should return user object from file of given id", async () => {
      let user = await exec();

      expect(user.ID).toEqual("testUser3Id");
      expect(user.Name).toEqual("testUser3");
      expect(user.Permissions).toEqual(3);
      expect(user.Password).toEqual(
        "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16"
      );
    });

    it("should return null if user of given id does not exist", async () => {
      userId = "fakeId";
      let user = await exec();

      expect(user).toEqual(null);
    });

    it("should return null if id is not defined", async () => {
      userId = undefined;
      let user = await exec();

      expect(user).toEqual(null);
    });

    it("should return null if id is null", async () => {
      userId = null;
      let user = await exec();

      expect(user).toEqual(null);
    });

    it("should return null if there are no users in file", async () => {
      initialFileContent = {};
      let user = await exec();

      expect(user).toEqual(null);
    });
  });

  describe("GetUserFromFileByName", () => {
    let initialFileContent;
    let userName;

    //$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm is hashed abcd1234
    //$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou is hashed abcd2234
    //$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16 is hashed abcd3234
    //$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC is hashed abcd4234

    beforeEach(() => {
      createFile = true;
      initialFileContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };
      userName = "testUser3";
    });

    let exec = async () => {
      await writeFileAsync(
        userFilePath,
        JSON.stringify(initialFileContent),
        "utf8"
      );
      return User.GetUserFromFileByName(userName);
    };

    it("should return user object from file of given name", async () => {
      let user = await exec();

      expect(user.ID).toEqual("testUser3Id");
      expect(user.Name).toEqual("testUser3");
      expect(user.Permissions).toEqual(3);
      expect(user.Password).toEqual(
        "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16"
      );
    });

    it("should return null if user of given name does not exist", async () => {
      userName = "fakeName";
      let user = await exec();

      expect(user).toEqual(null);
    });

    it("should return null if name is not defined", async () => {
      userName = undefined;
      let user = await exec();

      expect(user).toEqual(null);
    });

    it("should return null if name is null", async () => {
      userName = null;
      let user = await exec();

      expect(user).toEqual(null);
    });

    it("should return null if there are no users in file", async () => {
      initialFileContent = {};
      let user = await exec();

      expect(user).toEqual(null);
    });
  });

  describe("_isUserNameUniqueExceptIds", () => {
    let initialFileContent;
    let userName;
    let idsToExcept;

    //$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm is hashed abcd1234
    //$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou is hashed abcd2234
    //$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16 is hashed abcd3234
    //$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC is hashed abcd4234

    beforeEach(() => {
      initialFileContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };
      userName = "testUser2";
      idsToExcept = ["testUser1Id", "testUser2Id"];
    });

    let exec = async () => {
      await writeFileAsync(
        userFilePath,
        JSON.stringify(initialFileContent),
        "utf8"
      );
      return User._isUserNameUniqueExceptIds(userName, idsToExcept);
    };

    it("should return true if user name is uniq except users of given id - due to excepted user ids", async () => {
      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return true if user name is uniq except users of given id - due to userName", async () => {
      userName = "uniqUserName";

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return true if user name is uniq except users of given id - if user except ids is empty", async () => {
      userName = "uniqUserName";
      idsToExcept = [];

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return true if user name is uniq except users of given id - if user except ids is not defined", async () => {
      userName = "uniqUserName";
      idsToExcept = undefined;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return true if user name is uniq except users of given id - no users defined", async () => {
      initialFileContent = {};
      userName = "uniqUserName";
      idsToExcept = [];

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false if user name is not uniq  - if user except ids is not defined", async () => {
      userName = "testUser3";

      let result = await exec();

      expect(result).toEqual(false);
    });
  });

  describe("Save", () => {
    let initialFileContent;
    let userPayload;
    let user;

    //$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm is hashed abcd1234
    //$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou is hashed abcd2234
    //$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16 is hashed abcd3234
    //$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC is hashed abcd4234

    beforeEach(() => {
      createFile = true;
      initialFileContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
      };

      userPayload = {
        _id: "testUser4Id",
        name: "testUser4",
        password:
          "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
        permissions: 4,
      };
    });

    let exec = async () => {
      await writeFileAsync(
        userFilePath,
        JSON.stringify(initialFileContent),
        "utf8"
      );

      //Do not hash password in order to check content of file
      user = await User.CreateFromPayload(userPayload, false);

      await user.Save();
    };

    it("should save new user's data to users file - if user is a new user", async () => {
      await exec();

      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };

      expect(usersFileContent).toEqual(expectedContent);
    });

    it("should save new user's data to users file - if there were no users in file", async () => {
      initialFileContent = {};
      await exec();

      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = {
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };

      expect(usersFileContent).toEqual(expectedContent);
    });

    it("should save new user's data to users file - if users data should be updated", async () => {
      userPayload = {
        _id: "testUser2Id",
        name: "testUser2",
        password:
          "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
        permissions: 6,
      };

      await exec();

      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 6,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
      };

      expect(usersFileContent).toEqual(expectedContent);
    });

    it("should not save new user's data and throw - if there is an attempt to change name", async () => {
      userPayload = {
        _id: "testUser2Id",
        name: "testUserTest",
        password:
          "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
        permissions: 2,
      };

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(
        `Name testUserTest does not correspond to users name testUser2`
      );

      //Users file should not have been changed
      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      expect(usersFileContent).toEqual(initialFileContent);
    });

    it("should not save new user's data and throw - if user of given name already exists", async () => {
      userPayload = {
        _id: "testUser4Id",
        name: "testUser2",
        password:
          "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
        permissions: 3,
      };

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`User's name testUser2 already exists!`);

      //Users file should not have been changed
      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      expect(usersFileContent).toEqual(initialFileContent);
    });

    it("should not save new user's data and throw - if id is null", async () => {
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await writeFileAsync(
              userFilePath,
              JSON.stringify(initialFileContent),
              "utf8"
            );

            //Do not hash password in order to check content of file
            user = await User.CreateFromPayload(userPayload, false);

            user._id = null;

            await user.Save();

            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`"_id" is required`);

      //Users file should not have been changed
      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      expect(usersFileContent).toEqual(initialFileContent);
    });

    it("should not save new user's data and throw - if name is null", async () => {
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await writeFileAsync(
              userFilePath,
              JSON.stringify(initialFileContent),
              "utf8"
            );

            //Do not hash password in order to check content of file
            user = await User.CreateFromPayload(userPayload, false);

            user._name = null;

            await user.Save();

            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`"name" is required`);

      //Users file should not have been changed
      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      expect(usersFileContent).toEqual(initialFileContent);
    });

    it("should not save new user's data and throw - if permissions is null", async () => {
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await writeFileAsync(
              userFilePath,
              JSON.stringify(initialFileContent),
              "utf8"
            );

            //Do not hash password in order to check content of file
            user = await User.CreateFromPayload(userPayload, false);

            user._permissions = null;

            await user.Save();

            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`"permissions" is required`);

      //Users file should not have been changed
      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      expect(usersFileContent).toEqual(initialFileContent);
    });

    it("should not save new user's data and throw - if password is null", async () => {
      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await writeFileAsync(
              userFilePath,
              JSON.stringify(initialFileContent),
              "utf8"
            );

            //Do not hash password in order to check content of file
            user = await User.CreateFromPayload(userPayload, false);

            user._password = null;

            await user.Save();

            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual(`"password" is required`);

      //Users file should not have been changed
      let usersFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      expect(usersFileContent).toEqual(initialFileContent);
    });
  });

  describe("generateJWT", () => {
    let userPayload;
    let user;

    beforeEach(() => {
      userPayload = {
        _id: "testUserId",
        name: "testUserName",
        permissions: 7,
        password: "abcd1234",
      };
    });

    let exec = async () => {
      user = await User.CreateFromPayload(userPayload, true);
      return user.generateJWT();
    };

    it("should return a valid JWT of users payload (without password)", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      //checking jwt private key
      let verified = jwt.verify(result, privateKey);

      expect(verified).toBeTruthy();

      //checking jwt content
      let expectedJWTContent = {
        _id: "testUserId",
        name: "testUserName",
        permissions: 7,
      };

      let decodedJWT = jwt.decode(result);

      //deleting iat from jwt
      delete decodedJWT.iat;

      expect(decodedJWT).toEqual(expectedJWTContent);
    });
  });

  describe("RemoveUserFromFile", () => {
    let initialFileContent;
    let userId;

    //$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm is hashed abcd1234
    //$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou is hashed abcd2234
    //$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16 is hashed abcd3234
    //$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC is hashed abcd4234

    beforeEach(() => {
      initialFileContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };
      userId = "testUser3Id";
    });

    let exec = async () => {
      await writeFileAsync(
        userFilePath,
        JSON.stringify(initialFileContent),
        "utf8"
      );
      await User.RemoveUserFromFile(userId);
    };

    it("should remove user of given id from file content", async () => {
      await exec();

      let userFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };

      expect(userFileContent).toEqual(expectedContent);
    });

    it("should remove user of given id from file content - if there is only one user", async () => {
      initialFileContent = {
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
      };
      await exec();

      let userFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = {};

      expect(userFileContent).toEqual(expectedContent);
    });

    it("should not remove any user if there is no user of given id", async () => {
      userId = "fakeId";

      await exec();

      let userFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = initialFileContent;

      expect(userFileContent).toEqual(expectedContent);
    });

    it("should not remove any user if there no users", async () => {
      initialFileContent = {};

      await exec();

      let userFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = {};

      expect(userFileContent).toEqual(expectedContent);
    });

    it("should not remove any user if id is null", async () => {
      userId = null;

      await exec();

      let userFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = initialFileContent;

      expect(userFileContent).toEqual(expectedContent);
    });

    it("should not remove any user if id is not defined", async () => {
      userId = null;

      await exec();

      let userFileContent = JSON.parse(
        await readFileAsync(userFilePath, "utf8")
      );

      let expectedContent = initialFileContent;

      expect(userFileContent).toEqual(expectedContent);
    });
  });

  describe("GetAllUsersFromFile", () => {
    let initialFileContent;
    let userId;

    //$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm is hashed abcd1234
    //$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou is hashed abcd2234
    //$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16 is hashed abcd3234
    //$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC is hashed abcd4234

    beforeEach(() => {
      initialFileContent = {
        testUser1Id: {
          _id: "testUser1Id",
          name: "testUser1",
          password:
            "$2b$10$aMq3VOxEXUuz/79BqT2qZOdV93VGDZ2SElvIljIAsTsvh1GKvJhCm",
          permissions: 1,
        },
        testUser2Id: {
          _id: "testUser2Id",
          name: "testUser2",
          password:
            "$2b$10$Xs7ycwcoi2kujNzZWCTfIuXRO3R/KFGf6Y2vd8pIOtcjgTvQhxdou",
          permissions: 2,
        },
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
        testUser4Id: {
          _id: "testUser4Id",
          name: "testUser4",
          password:
            "$2b$10$4.HSYaIKlZIkuwlfRXHA/ufw7cRhbetnIZwYJt27H.CM2/td//gyC",
          permissions: 4,
        },
      };
      userId = "testUser3Id";
    });

    let exec = async () => {
      await writeFileAsync(
        userFilePath,
        JSON.stringify(initialFileContent),
        "utf8"
      );
      return User.GetAllUsersFromFile();
    };

    it("should return all users", async () => {
      let result = await exec();

      expect(result).toBeDefined();

      let convertedResult = result.map((user) => user.Payload);

      let expectedResult = Object.values(initialFileContent);
      expect(convertedResult).toEqual(expectedResult);
    });

    it("should return all users - if there is only one user", async () => {
      initialFileContent = {
        testUser3Id: {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
      };
      let result = await exec();

      expect(result).toBeDefined();

      let convertedResult = result.map((user) => user.Payload);

      expect(convertedResult).toEqual([
        {
          _id: "testUser3Id",
          name: "testUser3",
          password:
            "$2b$10$.jzMTWaWt2kYvHK.SPiHpuElEqlFlPQcEfhvlnNZPB/zyY7uD9j16",
          permissions: 3,
        },
      ]);
    });

    it("should return all users - if there is not users", async () => {
      initialFileContent = {};
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });
});
