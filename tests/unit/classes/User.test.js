const path = require("path");
const config = require("config");
const User = require("../../../classes/User/User");
const {
  setBit,
  clearBit,
  removeFileIfExistsAsync,
  hashedStringMatch,
} = require("../../../utilities/utilities");

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

  describe("CreateFromPayload", () => {
    let userPayload;

    beforeEach(() => {
      userPayload = {
        name: "testUser1",
        password: "abcd1234",
        permissions: 7,
      };
    });

    let exec = () => {
      return User.CreateFromPayload(userPayload);
    };

    it("should create and initialize User based on given payload", async () => {
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

    it("should generate different IDs for every user", async () => {
      let userIds = [];

      for (let i = 0; i < 1000; i++) {
        let payload = { ...userPayload, name: `testUser${i}` };
        let user = await User.CreateFromPayload();
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
});
