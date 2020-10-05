const {
  snooze,
  writeFileAsync,
  removeFileIfExistsAsync,
} = require("../../../utilities/utilities");
const _ = require("lodash");
const request = require("supertest");
const bcrypt = require("bcrypt");
const config = require("config");
const jsonWebToken = require("jsonwebtoken");
const path = require("path");
const privateKey = config.get("jwtPrivateKey");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);

let { User } = require("../../../models/user");
let {
  generateTestAdmin,
  generateTestUser,
  generateTestAdminAndUser,
  generateUselessUser,
  generateTestSuperAdmin,
  generateStringOfGivenLength,
  testAdminAndSuperAdminID,
  testAdminID,
  testSuperAdminID,
  testUselessUserID,
  testUserAndAdminAndSuperAdminID,
  testUserAndAdminID,
  testUserID,
  testAdminAndSuperAdminPassword,
  testAdminPassword,
  testSuperAdminPassword,
  testUselessUserPassword,
  testUserAndAdminAndSuperAdminPassword,
  testUserAndAdminPassword,
  testUserPassword,
  testAdminAndSuperAdminName,
  testAdminName,
  testSuperAdminName,
  testUselessUserName,
  testUserAndAdminAndSuperAdminName,
  testUserAndAdminName,
  testUserName,
} = require("../../utilities/testUtilities");
let server;
let logger = require("../../../logger/logger");

const projectFileName = config.get("projectFileName");
const projectFilePath = path.join(settingsDirPath, projectFileName);

const socketFilePath = config.get("netplanConfigSocketFilePath");

describe("api/auth", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let logActionMock;
  let ipConfigMockServer;

  beforeEach(async () => {
    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    ipConfigMockServer = require("../../utilities/fakeIPService");
    await ipConfigMockServer.Start();

    server = await require("../../../startup/app")();

    //Clearing users in database before each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //generating uslessUser, user, admin and adminUser
    uselessUser = await generateUselessUser();
    testAdmin = await generateTestAdmin();
    testUser = await generateTestUser();
    testSuperAdmin = await generateTestSuperAdmin();

    //Overwriting logget action method
    logActionMock = jest.fn();
    logger.action = logActionMock;
  });

  afterEach(async () => {
    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing users in database after each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    if (ipConfigMockServer) {
      await ipConfigMockServer.Stop();
      ipConfigMockServer = null;
    }
    await server.close();
  });

  describe("POST/", () => {
    let requestPayload;

    beforeEach(async () => {
      requestPayload = {
        name: testUserName,
        password: testUserPassword,
      };
    });

    let exec = async () => {
      return request(server).post("/api/auth").send(requestPayload);
    };

    it("should return 200 if logging in was successful", async () => {
      let result = await exec();

      expect(result.status).toEqual(200);
    });

    it("should return payload of logged user if logging was succesfull", async () => {
      let result = await exec();

      expect(result.body).toBeDefined();

      let expectedBody = {
        _id: testUser.ID,
        name: testUser.Name,
        permissions: testUser.Permissions,
      };

      expect(result.body).toEqual(expectedBody);
    });

    it("should return jwt for user in header if logging was succesfull", async () => {
      let result = await exec();

      expect(result.header["x-auth-token"]).toBeDefined();

      let expectedJWT = await testUser.generateJWT();

      expect(result.header["x-auth-token"]).toEqual(expectedJWT);
    });

    it("should call log action with info that user has logged in", async () => {
      let result = await exec();

      expect(logActionMock).toHaveBeenCalledTimes(1);

      expect(logActionMock.mock.calls[0][0]).toEqual("User userName logged in");
    });

    //#region =========== INVALID NAME ===========

    it("should return 400 and not return jwt in header if users name is empty", async () => {
      delete requestPayload.name;

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual('"name" is required');

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if users name is null", async () => {
      requestPayload.name = null;

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual('"name" must be a string');

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if users name is not a valid string", async () => {
      requestPayload.name = 123;

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual('"name" must be a string');

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if there is no user of given name", async () => {
      requestPayload.name = "fakeName";

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual("Invalid name or password");

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    //#endregion =========== INVALID NAME ===========

    //#region =========== INVALID PASSWORD ===========

    it("should return 400 and not return jwt in header if users password is empty", async () => {
      delete requestPayload.password;

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual('"password" is required');

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if users password is null", async () => {
      requestPayload.password = null;

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual('"password" must be a string');

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if users password is not a valid string", async () => {
      requestPayload.password = 123;

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual('"password" must be a string');

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if users password is to short", async () => {
      requestPayload.password = generateStringOfGivenLength("a", 7);

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual(
        '"password" length must be at least 8 characters long'
      );

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if users password is too long", async () => {
      requestPayload.password = generateStringOfGivenLength("a", 101);

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual(
        '"password" length must be less than or equal to 100 characters long'
      );

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    it("should return 400 and not return jwt in header if users password is invalid", async () => {
      requestPayload.password = "fakeUserPassword";

      let result = await exec();

      expect(result.status).toEqual(400);

      expect(result.text).toEqual("Invalid name or password");

      //Checking if there is no jwt in payload
      expect(result.header["x-auth-token"]).not.toBeDefined();

      //Logging action should not have been called
      expect(logActionMock).not.toHaveBeenCalled();
    });

    //#endregion =========== INVALID PASSWORD ===========
  });
});
