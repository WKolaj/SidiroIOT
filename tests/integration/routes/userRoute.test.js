const {
  snooze,
  writeFileAsync,
  readFileAsync,
} = require("../../../utilities/utilities");
const _ = require("lodash");
const path = require("path");
const request = require("supertest");
const bcrypt = require("bcrypt");
const config = require("config");
const jsonWebToken = require("jsonwebtoken");
let User = require("../../../classes/User/User");
let {
  generateTestAdmin,
  generateTestUser,
  generateTestAdminAndUser,
  generateUselessUser,
  generateTestSuperAdmin,
  generateTestAdminAndSuperAdmin,
  generateTestUserAndAdminAndSuperAdmin,
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

const privateKey = config.get("jwtPrivateKey");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);

let { exists, hashedStringMatch } = require("../../../utilities/utilities");
let server;
let logger = require("../../../logger/logger");
const { pathToFileURL } = require("url");
const { not } = require("joi");
const { initial } = require("lodash");

describe("api/user", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let testUserAndAdmin;
  let testAdminAndSuperAdmin;
  let testUserAndAdminAndSuperAdmin;
  let logActionMock;

  const getUserPayload = (user) => {
    return user.PayloadWithoutPassword;
  };

  const getAllInitialUsersPayload = (user) => {
    return [
      getUserPayload(uselessUser),
      getUserPayload(testAdmin),
      getUserPayload(testUser),
      getUserPayload(testSuperAdmin),
      getUserPayload(testUserAndAdmin),
      getUserPayload(testAdminAndSuperAdmin),
      getUserPayload(testUserAndAdminAndSuperAdmin),
    ];
  };

  beforeEach(async () => {
    server = await require("../../../startup/app")();

    //Clearing users in database before each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //generating uslessUser, user, admin and adminUser
    uselessUser = await generateUselessUser();
    testAdmin = await generateTestAdmin();
    testUser = await generateTestUser();
    testSuperAdmin = await generateTestSuperAdmin();
    testUserAndAdmin = await generateTestAdminAndUser();
    testAdminAndSuperAdmin = await generateTestAdminAndSuperAdmin();
    testUserAndAdminAndSuperAdmin = await generateTestUserAndAdminAndSuperAdmin();

    //Overwriting logget action method
    logActionMock = jest.fn();
    logger.action = logActionMock;
  });

  afterEach(async () => {
    //Clearing users in database after each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    await server.close();
  });

  describe("GET/", () => {
    let jwt;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
    });

    let exec = async () => {
      if (exists(jwt))
        return request(server)
          .get("/api/user")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/user").send();
    };

    it("should return 200 and a list of all users - if there are some users", async () => {
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      //There should be 5 users - useless, normal, admin, and  superAdmin
      expect(response.body.length).toEqual(7);

      let expectedBody = getAllInitialUsersPayload();

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and an empty list - if there are no users", async () => {
      //Clearing users in database after each test
      await writeFileAsync(userFilePath, "{}", "utf8");

      //JWT should still be valid - regarding its content
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      //There should be empty array - no users
      expect(response.body).toEqual([]);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and proper list - if there is only one users", async () => {
      //Clearing users in database after each test
      await writeFileAsync(userFilePath, "{}", "utf8");

      testUser = await generateTestUser();

      //JWT should still be valid - regarding its content
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      //There should be empty array - no users
      expect(response.body).toEqual([testUser.PayloadWithoutPassword]);

      //#endregion CHECKING_RESPONSE
    });

    it("should not call logger action method", async () => {
      await exec();

      expect(logActionMock).not.toHaveBeenCalled();
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - USER", async () => {
      jwt = await testUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        email: testAdmin.email,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("GET/:id", () => {
    let jwt;
    let userId;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
      userId = testUser.ID;
    });

    let exec = async () => {
      if (exists(jwt))
        return request(server)
          .get("/api/user/" + userId)
          .set(config.get("tokenHeader"), jwt)
          .send();
      else
        return request(server)
          .get("/api/user/" + userId)
          .send();
    };

    it("should return 200 and payload of given user - if there is user of given id", async () => {
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      let expectedBody = getUserPayload(testUser);

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE
    });

    it("should not call logger action method", async () => {
      await exec();

      expect(logActionMock).not.toHaveBeenCalled();
    });

    //#region ========== INVALID ID ==========

    it("should return 404 - if there is no user of given id", async () => {
      userId = "fakeUserId";

      //JWT should still be valid - regarding its content
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
      expect(response.text).toEqual("User not found");

      //#endregion CHECKING_RESPONSE
    });

    //#endregion ========== INVALID ID ==========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    //Only admins can get users and others admins payload

    it("should return 200 and payload of given user - if admin is sending request for useless user", async () => {
      userId = uselessUser.ID;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      let expectedBody = getUserPayload(uselessUser);

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and payload of given user - if admin is sending request for admin", async () => {
      userId = testAdmin.ID;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      let expectedBody = getUserPayload(testAdmin);

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and payload of given user - if admin is sending request for superAdmin", async () => {
      userId = testSuperAdmin.ID;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      let expectedBody = getUserPayload(testSuperAdmin);

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - USER", async () => {
      jwt = await testUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin.ID,
        name: testAdmin.Name,
        permissions: testAdmin.Permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("GET/me", () => {
    let jwt;
    let userId;

    beforeEach(async () => {
      jwt = await testUser.generateJWT();
    });

    let exec = async () => {
      if (exists(jwt))
        return request(server)
          .get("/api/user/me")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/user/me").send();
    };

    it("should return 200 and payload of logged user", async () => {
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      let expectedBody = getUserPayload(testUser);

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE
    });

    it("should not call logger action method", async () => {
      await exec();

      expect(logActionMock).not.toHaveBeenCalled();
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    //Only users can get info about theirselves

    it("should not return any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - ADMIN", async () => {
      jwt = await testAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        name: testAdmin.Name,
        permissions: testAdmin.Permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("POST/", () => {
    let jwt;
    let userPayload;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
      userPayload = {
        name: "newUserName",
        permissions: 1,
        password: "abcd1234",
      };
    });

    let exec = async () => {
      if (exists(jwt))
        return request(server)
          .post("/api/user")
          .set(config.get("tokenHeader"), jwt)
          .send(userPayload);
      else return request(server).post("/api/user").send(userPayload);
    };

    it("should return 200 and create new user in file", async () => {
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      //id should be generated
      expect(response.body._id).toBeDefined();

      let expectedBody = {
        ...userPayload,
        _id: response.body._id,
      };

      //password should not be returned
      delete expectedBody.password;

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let createdUser = await User.GetUserFromFileById(response.body._id);

      //User should exists
      expect(createdUser).toBeDefined();

      //User should have valid payload
      let createdUserPayload = getUserPayload(createdUser);

      let expectedPayload = { ...userPayload, _id: response.body._id };

      //Do not check password - it should have been hashed
      delete expectedPayload.password;
      expect(createdUserPayload).toEqual(expectedPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        userPayload.password,
        createdUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should call logger action method", async () => {
      await exec();

      expect(logActionMock).toHaveBeenCalledTimes(1);

      expect(logActionMock.mock.calls[0][0]).toEqual(
        "User adminName created user newUserName"
      );
    });

    //#region  ========== INVALID NAME ==========

    it("should not create any user and return 400 if name is not defined", async () => {
      delete userPayload.name;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"name" is required');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if name is null", async () => {
      userPayload.name = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"name" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if name is not a valid string", async () => {
      userPayload.name = 123;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"name" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if name is longer than 100 signs", async () => {
      userPayload.name = generateStringOfGivenLength("a", 101);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        '"name" length must be less than or equal to 100 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if name is shorter than 3 signs", async () => {
      userPayload.name = generateStringOfGivenLength("a", 2);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        '"name" length must be at least 3 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if there is an attempt to create user with the same name", async () => {
      userPayload.name = testUser.Name;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        "User with given name already registered..."
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    //#endregion  ========== INVALID NAME ==========

    //#region  ========== INVALID PERMISSIONS ==========

    it("should not create any user and return 400 if permissions is not defined", async () => {
      delete userPayload.permissions;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"permissions" is required');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if permissions is null", async () => {
      userPayload.permissions = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"permissions" must be a number');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if permissions is not a valid int - string", async () => {
      userPayload.permissions = "abcde";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"permissions" must be a number');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if permissions is not a valid int - double", async () => {
      userPayload.permissions = 123.321;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"permissions" must be an integer');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if permissions are greater than 255", async () => {
      userPayload.permissions = 256;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        '"permissions" must be less than or equal to 255'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if permissions are smaller than 0", async () => {
      userPayload.permissions = -1;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        '"permissions" must be greater than or equal to 0'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    //#endregion  ========== INVALID PERMISSIONS ==========

    //#region  ========== INVALID PASSWORD ==========

    it("should not create any user and return 400 if password is not defined in payload", async () => {
      delete userPayload.password;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        '"password" is required when creating an user'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if password is null", async () => {
      userPayload.password = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"password" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if name is not a valid string", async () => {
      userPayload.password = 123;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain('"password" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if password is longer than 100 signs", async () => {
      userPayload.password = generateStringOfGivenLength("a", 101);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        '"password" length must be less than or equal to 100 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if password is shorter than 8 signs", async () => {
      userPayload.password = generateStringOfGivenLength("a", 7);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain(
        '"password" length must be at least 8 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    //#endregion  ========== INVALID PASSWORD ==========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not create any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    it("should not create any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        email: testAdmin.email,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      //There should be 7 users in array - no user should be added
      let createdUserArray = Object.values(
        JSON.parse(await readFileAsync(userFilePath, "utf8"))
      );

      expect(createdUserArray.length).toEqual(7);

      //#endregion CHECKING_DATABASE
    });

    /**
     * @description Method for testing user creation
     * @param {Object} loggedUser User who attempts to create another user
     * @param {Number} permissions permissions of new user
     * @param {Boolean} expectValidCreation should creation be successfull
     * @param {Number} errorCode Error code in case of an error
     * @param {String} errorText Error text in case of na error
     */
    const testUserCreation = async (
      loggedUser,
      permissions,
      expectValidCreation,
      errorCode = null,
      errorText = null
    ) => {
      jwt = await loggedUser.generateJWT();

      userPayload = {
        name: "newUserName",
        permissions: permissions,
        password: "abcd1234",
      };

      let response = await exec();

      if (expectValidCreation) {
        //#region CHECKING_RESPONSE

        expect(response).toBeDefined();
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined();

        //id should be generated
        expect(response.body._id).toBeDefined();

        let expectedBody = {
          ...userPayload,
          _id: response.body._id,
        };

        //Response should not have password
        delete expectedBody.password;

        //after sorting - both array should be the same
        expect(response.body).toEqual(expectedBody);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        let createdUser = await User.GetUserFromFileById(response.body._id);

        //User should exists
        expect(createdUser).toBeDefined();

        //User should have valid payload
        let createdUserPayload = getUserPayload(createdUser);

        let expectedPayload = { ...userPayload, _id: response.body._id };

        //Do not check password - it should have been hashed
        delete expectedPayload.password;
        expect(createdUserPayload).toEqual(expectedPayload);

        //Checking if hashed password corresponds to the previous one

        let passwordMatch = await hashedStringMatch(
          userPayload.password,
          createdUser.Password
        );
        expect(passwordMatch).toEqual(true);

        //#endregion CHECKING_DATABASE
      } else {
        //#region CHECKING_RESPONSE

        expect(response).toBeDefined();
        expect(response.status).toEqual(errorCode);
        expect(response.text).toBeDefined();
        expect(response.text).toEqual(errorText);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        //There should be 7 users in array - no user should be added
        let createdUserArray = Object.values(
          JSON.parse(await readFileAsync(userFilePath, "utf8"))
        );

        expect(createdUserArray.length).toEqual(7);

        //#endregion CHECKING_DATABASE
      }
    };

    //#region USELESS USER CREATES ANOTHER USER

    it("useless user creates useless user - should return 403", async () => {
      await testUserCreation(uselessUser, 0, false, 403, "Access forbidden.");
    });

    it("useless user creates user - should return 403", async () => {
      await testUserCreation(uselessUser, 1, false, 403, "Access forbidden.");
    });

    it("useless user creates admin - should return 403", async () => {
      await testUserCreation(uselessUser, 2, false, 403, "Access forbidden.");
    });

    it("useless user creates superAdmin - should return 403", async () => {
      await testUserCreation(uselessUser, 4, false, 403, "Access forbidden.");
    });

    //#endregion USELESS USER CREATES ANOTHER USER

    //#region USER CREATES ANOTHER USER

    it("user creates useless user - should return 403", async () => {
      await testUserCreation(testUser, 0, false, 403, "Access forbidden.");
    });

    it("user creates user - should return 403", async () => {
      await testUserCreation(testUser, 1, false, 403, "Access forbidden.");
    });

    it("user creates admin - should return 403", async () => {
      await testUserCreation(testUser, 2, false, 403, "Access forbidden.");
    });

    it("user creates superAdmin - should return 403", async () => {
      await testUserCreation(testUser, 4, false, 403, "Access forbidden.");
    });

    //#endregion USER CREATES ANOTHER USER

    //#region ADMIN CREATES ANOTHER USER

    it("admin creates useless user - should return 200", async () => {
      await testUserCreation(testAdmin, 0, true);
    });

    it("admin creates user - should return 200", async () => {
      await testUserCreation(testAdmin, 1, true);
    });

    it("admin creates admin - should return 403", async () => {
      await testUserCreation(testAdmin, 2, false, 403, "Access forbidden.");
    });

    it("admin creates superAdmin - should return 403", async () => {
      await testUserCreation(testAdmin, 4, false, 403, "Access forbidden.");
    });

    //#endregion ADMIN CREATES ANOTHER USER

    //#region SUPER ADMIN CREATES ANOTHER USER

    it("admin creates useless user - should return 403", async () => {
      await testUserCreation(
        testSuperAdmin,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("admin creates user - should return 403", async () => {
      await testUserCreation(
        testSuperAdmin,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("admin creates admin - should return 403", async () => {
      await testUserCreation(
        testSuperAdmin,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("admin creates superAdmin - should return 403", async () => {
      await testUserCreation(
        testSuperAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    //#endregion SUPER ADMIN CREATES ANOTHER USER

    //#region ADMIN AND SUPER ADMIN CREATES ANOTHER USER

    it("admin creates useless user - should return 200", async () => {
      await testUserCreation(testAdminAndSuperAdmin, 0, true);
    });

    it("admin creates user - should return 200", async () => {
      await testUserCreation(testAdminAndSuperAdmin, 1, true);
    });

    it("admin creates admin - should return 200", async () => {
      await testUserCreation(testAdminAndSuperAdmin, 2, true);
    });

    it("admin creates superAdmin - should return 200", async () => {
      await testUserCreation(testAdminAndSuperAdmin, 4, true);
    });

    //#endregion ADMIN AND SUPER ADMIN CREATES ANOTHER USER

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("DELETE/:id", () => {
    let jwt;
    let userId;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
      userId = testUser._id;
    });

    let exec = async () => {
      if (exists(jwt))
        return request(server)
          .delete("/api/user/" + userId)
          .set(config.get("tokenHeader"), jwt)
          .send();
      else
        return request(server)
          .delete("/api/user/" + userId)
          .send();
    };

    /**
     * @description Method for testring deleting a user
     * @param {Object} loggedUser Logged user which performs action
     * @param {String} userToDeleteId User id to delete
     * @param {String} userToDeletePassword Password of user to delete
     * @param {Boolean} expectValidDelete Should deletion be performed properly
     * @param {Number} errorCode error code - if error occurs
     * @param {String} errorText error text - if error occurs
     */
    const testUserDelete = async (
      loggedUser,
      userToDeleteId,
      userToDeletePassword,
      expectValidDelete,
      errorCode = null,
      errorText = null,
      userToDeleteExists = true
    ) => {
      jwt = await loggedUser.generateJWT();
      userId = userToDeleteId;

      //Getting initial user if exissts
      let userToDelete = await User.GetUserFromFileById(userToDeleteId);
      let initialUserPayload = null;

      if (userToDelete) {
        initialUserPayload = getUserPayload(userToDelete);
      }

      let response = await exec();

      if (expectValidDelete) {
        //#region CHECKING_RESPONSE

        //Looking for deleted user

        expect(response).toBeDefined();
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined();

        let expectedBody = initialUserPayload;

        //Response body should not contain password
        delete expectedBody.password;

        //after sorting - both array should be the same
        expect(response.body).toEqual(expectedBody);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        //There should be no user of given id in database anymore
        let deletedUser = await User.GetUserFromFileByName(userToDeleteId);

        expect(deletedUser).toEqual(null);

        //#endregion CHECKING_DATABASE
      } else {
        //#region CHECKING_RESPONSE

        expect(response).toBeDefined();
        expect(response.status).toEqual(errorCode);
        expect(response.text).toEqual(errorText);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        //Checking only if user to delete exists
        if (userToDeleteExists) {
          let deletedUser = await User.GetUserFromFileById(userToDeleteId);

          //User should exists
          expect(deletedUser).toBeDefined();

          //User should have valid payload
          let deletedUserPayload = getUserPayload(deletedUser);

          expect(deletedUserPayload).toEqual(initialUserPayload);

          //Checking if hashed password corresponds to the previous one

          let passwordMatch = await hashedStringMatch(
            userToDeletePassword,
            deletedUser.Password
          );

          expect(passwordMatch).toEqual(true);
        }
        //#endregion CHECKING_DATABASE
      }
    };

    it("should return 200 and delete user - if there is user of given id", async () => {
      await testUserDelete(testAdmin, testUser.ID, testUserPassword, true);
    });

    it("should call logger action method", async () => {
      await exec();

      expect(logActionMock).toHaveBeenCalledTimes(1);

      expect(logActionMock.mock.calls[0][0]).toEqual(
        "User adminName deleted user userName"
      );
    });

    it("should return 404 and not delete user - if user of given id was not found", async () => {
      await testUserDelete(
        testAdmin,
        "fakeId",
        testUserPassword,
        false,
        404,
        "User not found",
        false
      );
    });

    //#region  ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not delete any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let initialUserPayload = getUserPayload(testUser);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let deletedUser = await User.GetUserFromFileById(userId);

      //User should exists
      expect(deletedUser).toBeDefined();

      //User should have valid payload
      let deletedUserPayload = getUserPayload(testUser);

      //Password should not be checked - it is hashed
      let expectedPayload = { ...initialUserPayload };
      delete expectedPayload.password;

      expect(deletedUserPayload).toEqual(initialUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        deletedUser.Password
      );

      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should not return any user and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let initialUserPayload = getUserPayload(testUser);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let deletedUser = await User.GetUserFromFileById(userId);

      //User should exists
      expect(deletedUser).toBeDefined();

      //User should have valid payload
      let deletedUserPayload = getUserPayload(testUser);

      //Password should not be checked - it is hashed
      let expectedPayload = { ...initialUserPayload };
      delete expectedPayload.password;

      expect(deletedUserPayload).toEqual(initialUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        deletedUser.Password
      );

      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should not return any user and return 400 if  jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        email: testAdmin.email,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let initialUserPayload = getUserPayload(testUser);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let deletedUser = await User.GetUserFromFileById(userId);

      //User should exists
      expect(deletedUser).toBeDefined();

      //User should have valid payload
      let deletedUserPayload = getUserPayload(testUser);

      //Password should not be checked - it is hashed
      let expectedPayload = { ...initialUserPayload };
      delete expectedPayload.password;

      expect(deletedUserPayload).toEqual(initialUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        deletedUser.Password
      );

      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("useless user deletes useless user - return 403", async () => {
      await testUserDelete(
        uselessUser,
        uselessUser._id.toString(),
        testUselessUserPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("useless user deletes user - return 403", async () => {
      await testUserDelete(
        uselessUser,
        testUser._id.toString(),
        testUserPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("useless user deletes admin - return 403", async () => {
      await testUserDelete(
        uselessUser,
        testAdmin._id.toString(),
        testAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("useless user deletes superAdmin - return 403", async () => {
      await testUserDelete(
        uselessUser,
        testSuperAdmin._id.toString(),
        testSuperAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("user deletes useless user - return 403", async () => {
      await testUserDelete(
        testUser,
        uselessUser._id.toString(),
        testUselessUserPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("user deletes user - return 403", async () => {
      await testUserDelete(
        testUser,
        testUser._id.toString(),
        testUserPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("user deletes admin - return 403", async () => {
      await testUserDelete(
        testUser,
        testAdmin._id.toString(),
        testAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("user deletes superAdmin - return 403", async () => {
      await testUserDelete(
        testUser,
        testSuperAdmin._id.toString(),
        testSuperAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("admin deletes useless user - return 200", async () => {
      await testUserDelete(
        testAdmin,
        uselessUser._id.toString(),
        testUselessUserPassword,
        true
      );
    });

    it("admin deletes user - return 200", async () => {
      await testUserDelete(
        testAdmin,
        testUser._id.toString(),
        testUserPassword,
        true
      );
    });

    it("admin deletes admin - return 403", async () => {
      await testUserDelete(
        testAdmin,
        testAdmin._id.toString(),
        testAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("admin deletes superAdmin - return 403", async () => {
      await testUserDelete(
        testAdmin,
        testSuperAdmin._id.toString(),
        testSuperAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("superAdmin deletes useless user - return 403", async () => {
      await testUserDelete(
        testSuperAdmin,
        uselessUser._id.toString(),
        testUselessUserPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("superAdmin deletes user - return 403", async () => {
      await testUserDelete(
        testSuperAdmin,
        testUser._id.toString(),
        testUserPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("superAdmin deletes admin - return 403", async () => {
      await testUserDelete(
        testSuperAdmin,
        testAdmin._id.toString(),
        testAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("superAdmin deletes superAdmin - return 403", async () => {
      await testUserDelete(
        testSuperAdmin,
        testSuperAdmin._id.toString(),
        testSuperAdminPassword,
        false,
        403,
        "Access forbidden."
      );
    });

    it("adminAndSuperAdmin deletes useless user - return 200", async () => {
      await testUserDelete(
        testAdminAndSuperAdmin,
        uselessUser._id.toString(),
        testUselessUserPassword,
        true
      );
    });

    it("adminAndSuperAdmin deletes user - return 200", async () => {
      await testUserDelete(
        testAdminAndSuperAdmin,
        testUser._id.toString(),
        testUserPassword,
        true
      );
    });

    it("adminAndSuperAdmin deletes admin - return 200", async () => {
      await testUserDelete(
        testAdminAndSuperAdmin,
        testAdmin._id.toString(),
        testAdminPassword,
        true
      );
    });

    it("adminAndSuperAdmin deletes superAdmin - return 200", async () => {
      await testUserDelete(
        testAdminAndSuperAdmin,
        testSuperAdmin._id.toString(),
        testSuperAdminPassword,
        true
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("PUT/:id", () => {
    let jwt;
    let editUserId;
    let editPayload;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
      editUserId = testUser._id.toString();
      editPayload = {
        name: testUserName,
        permissions: 0,
        password: "abcd1234",
      };
    });

    let exec = async () => {
      if (exists(jwt))
        return request(server)
          .put("/api/user/" + editUserId)
          .set(config.get("tokenHeader"), jwt)
          .send(editPayload);
      else
        return request(server)
          .put("/api/user/" + editUserId)
          .send(editPayload);
    };

    it("should return 200 and edit user in database", async () => {
      let response = await exec();
      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      let expectedBody = { ...editPayload, _id: editUserId };

      //new password should not be returned
      delete expectedBody.password;

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(editUserId);

      //User should exists
      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);

      let expectedPayload = {
        ...editPayload,
        _id: editUserId,
      };

      //Do not check password - it should have been hashed
      delete expectedPayload.password;
      expect(editedUserPayload).toEqual(expectedPayload);

      //Checking if hashed password corresponds to the previous onex
      let passwordMatch = await hashedStringMatch(
        editPayload.password,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should call logger action method", async () => {
      await exec();

      expect(logActionMock).toHaveBeenCalledTimes(1);

      expect(logActionMock.mock.calls[0][0]).toEqual(
        "User adminName updated profile data of user userName"
      );
    });

    //#region  ========== INVALID ID ==========

    it("should return 404 and not edit user in database - if there is no user of given id", async () => {
      editUserId = "fakeUserId";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
      expect(response.text).toEqual("User not found");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 404 and not edit user in database - if valid id is given in payload", async () => {
      editPayload._id = editUserId;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(`"_id" is not allowed`);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 404 and not edit user in database - if invalid id is given in payload", async () => {
      editPayload._id = "fakeId";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(`"_id" is not allowed`);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    //#endregion  ========== INVALID ID ==========

    //#region  ========== INVALID NAME ==========

    it("should return 400 and not edit user in database - if name is not defined in edit payload", async () => {
      delete editPayload.name;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"name" is required');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if name is is different than original - trying to update users name", async () => {
      editPayload.name = "fakeName";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Invalid name for given user");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if name is is different than original - trying to update users name with already existing user", async () => {
      editPayload.name = testAdminAndSuperAdminName;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Invalid name for given user");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if name is null", async () => {
      editPayload.name = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"name" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if name is not a valid string", async () => {
      editPayload.name = 123;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"name" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if name is shorter than 3 signs", async () => {
      editPayload.name = generateStringOfGivenLength("a", 2);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        '"name" length must be at least 3 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if name is longer than 100 signs", async () => {
      editPayload.name = generateStringOfGivenLength("a", 101);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        '"name" length must be less than or equal to 100 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    //#endregion  ========== INVALID NAME ==========

    //#region  ========== INVALID PERMISSIONS ==========

    it("should return 400 and not edit user in database - if permissions is not defined in edit payload", async () => {
      delete editPayload.permissions;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"permissions" is required');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if permissions is null", async () => {
      editPayload.permissions = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"permissions" must be a number');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if permissions is not a valid number - string", async () => {
      editPayload.permissions = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"permissions" must be a number');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if permissions is not a valid number - double", async () => {
      editPayload.permissions = 1234.4321;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"permissions" must be an integer');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if permissions are greater than 255", async () => {
      editPayload.permissions = 256;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        '"permissions" must be less than or equal to 255'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if permissions are lower than 0", async () => {
      editPayload.permissions = -1;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        '"permissions" must be greater than or equal to 0'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    //#endregion  ========== INVALID PERMISSIONS ==========

    //#region  ========== INVALID PASSWORD ==========

    it("should return 200 and edit user without password - if password is not defined in edit payload", async () => {
      delete editPayload.password;

      let initialUserPayload = testUser.Payload;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();

      let expectedBody = { ...editPayload, _id: editUserId };

      //after sorting - both array should be the same
      expect(response.body).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(editUserId);

      //User should exists
      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);

      let expectedPayload = {
        ...editPayload,
        _id: editUserId,
      };

      expect(editedUserPayload).toEqual(expectedPayload);

      //Password should not have been changed
      expect(editedUser.Password).toEqual(initialUserPayload.password);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if password is null", async () => {
      editPayload.password = null;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"password" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if password is not a valid string", async () => {
      editPayload.password = 123;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"password" must be a string');

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if password is shorter than 8 signs", async () => {
      editPayload.password = generateStringOfGivenLength("a", 7);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        '"password" length must be at least 8 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 400 and not edit user in database - if password is longer than 100 signs", async () => {
      editPayload.password = generateStringOfGivenLength("a", 101);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toEqual(
        '"password" length must be less than or equal to 100 characters long'
      );

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    //#endregion  ========== INVALID PASSWORD ==========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not create any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should not edit any user and return 400 if jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        email: testAdmin.email,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);
      let originalUserPayload = getUserPayload(testUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    /**
     * @description Method for testing attempt to edit user by another user
     * @param {Object} loggedUser user logged in - user who send request
     * @param {Object} userToEdit user to edit
     * @param {Number} newPermissions new Permissions
     * @param {Boolean} expectValidEdition Should edition be performed successfully
     * @param {Number} expectedErrorCode Expected error code - if occurs
     * @param {String} expectedErrorText Expected error text - if occurs
     */
    const testAuthorizationAndAuthentication = async (
      loggedUser,
      userToEdit,
      newPermissions,
      expectValidEdition,
      expectedErrorCode = null,
      expectedErrorText = null
    ) => {
      let originalUserPayload = getUserPayload(userToEdit);
      let originalUserHashedPassword = userToEdit.Password;

      jwt = await loggedUser.generateJWT();

      editUserId = userToEdit.ID;

      editPayload = {
        name: userToEdit.Name,
        permissions: newPermissions,
        password: "abcd1234",
      };

      let response = await exec();

      // Expect valid edition
      if (expectValidEdition) {
        //#region CHECKING_RESPONSE

        //Edition should return body with edited user without password
        expect(response).toBeDefined();
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined();

        let expectedBody = { ...editPayload, _id: editUserId };

        //new password should not be returned
        delete expectedBody.password;

        expect(response.body).toEqual(expectedBody);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        //Edition should update user of given id in database

        let editedUser = await User.GetUserFromFileById(editUserId);

        //User should exists
        expect(editedUser).toBeDefined();

        //User should have valid payload
        let editedUserPayload = getUserPayload(editedUser);

        let expectedPayload = {
          ...editPayload,
          _id: editUserId,
        };

        //Do not check password - it should have been hashed
        delete expectedPayload.password;
        expect(editedUserPayload).toEqual(expectedPayload);

        //Checking if hashed password corresponds to the previous one

        let passwordMatch = await hashedStringMatch(
          editPayload.password,
          editedUser.Password
        );
        expect(passwordMatch).toEqual(true);

        //#endregion CHECKING_DATABASE
      }
      // Expect invalid edtion
      else {
        //#region CHECKING_RESPONSE

        expect(response).toBeDefined();
        expect(response.status).toEqual(expectedErrorCode);
        expect(response.text).toBeDefined();
        expect(response.text).toContain(expectedErrorText);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        let editedUser = await User.GetUserFromFileById(editUserId);

        //User should exists
        expect(editedUser).toBeDefined();

        //User should have valid payload
        let editedUserPayload = getUserPayload(editedUser);

        expect(editedUserPayload).toEqual(originalUserPayload);

        //Checking if hashed password corresponds to the hashed previous one
        expect(editedUser.Password).toEqual(originalUserHashedPassword);

        //#endregion CHECKING_DATABASE
      }
    };

    // #region NO ATTEMPT TO CHANGE PERMISSIONS

    it("no attempt to change persmission - user edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testUser,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - user edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testAdmin,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - user edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testSuperAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - admin edits user - should return 200", async () => {
      await testAuthorizationAndAuthentication(testAdmin, testUser, 1, true);
    });

    it("no attempt to change persmission - admin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testAdmin,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - admin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testSuperAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - superAdmin edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testUser,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - superAdmin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testAdmin,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - superAdmin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testSuperAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("no attempt to change persmission - adminAndSuperAdmin edits user - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testUser,
        1,
        true
      );
    });

    it("no attempt to change persmission - adminAndSuperAdmin edits admin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testAdmin,
        2,
        true
      );
    });

    it("no attempt to change persmission - adminAndSuperAdmin edits superAdmin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testSuperAdmin,
        4,
        true
      );
    });

    //#endregion NO ATTEMPT TO CHANGE PERMISSIONS

    //#region CHANGE PERMISSIONS TO USELESS USER

    it("change permissions to useless user - user edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testUser,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - user edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testAdmin,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - user edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testSuperAdmin,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - admin edits user - should return 200", async () => {
      await testAuthorizationAndAuthentication(testAdmin, testUser, 0, true);
    });

    it("change permissions to useless user - admin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testAdmin,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - admin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testSuperAdmin,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - superAdmin edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testUser,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - superAdmin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testAdmin,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - superAdmin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testSuperAdmin,
        0,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to useless user - adminAndSuperAdmin edits user - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testUser,
        0,
        true
      );
    });

    it("change permissions to useless user - adminAndSuperAdmin edits admin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testAdmin,
        0,
        true
      );
    });

    it("change permissions to useless user - adminAndSuperAdmin edits superAdmin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testSuperAdmin,
        0,
        true
      );
    });

    //#endregion CHANGE PERMISSIONS TO USELESS USER

    //#region CHANGE PERMISSIONS TO USER

    it("change permissions to user - user edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testAdmin,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to user - user edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testSuperAdmin,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to user - admin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testAdmin,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to user - admin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testSuperAdmin,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to user - superAdmin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testAdmin,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to user - superAdmin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testSuperAdmin,
        1,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to user - adminAndSuperAdmin edits admin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testAdmin,
        1,
        true
      );
    });

    it("change permissions to user - adminAndSuperAdmin edits superAdmin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testSuperAdmin,
        1,
        true
      );
    });

    //#endregion CHANGE PERMISSIONS TO USER

    //#region CHANGE PERMISSIONS TO ADMIN

    it("change permissions to admin - user edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testUser,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to admin - user edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testSuperAdmin,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to admin - admin edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testUser,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to admin - admin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testSuperAdmin,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to admin - superAdmin edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testUser,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to admin - superAdmin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testSuperAdmin,
        2,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to admin - adminAndSuperAdmin edits user - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testUser,
        2,
        true
      );
    });

    it("change permissions to admin - adminAndSuperAdmin edits superAdmin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testSuperAdmin,
        2,
        true
      );
    });

    //#endregion CHANGE PERMISSIONS TO ADMIN

    //#region CHANGE PERMISSIONS TO SUPER ADMIN

    it("change permissions to super admin - user edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testUser,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - user edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - user edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testUser,
        testSuperAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - admin edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testUser,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - admin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - admin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testAdmin,
        testSuperAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - superAdmin edits user - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testUser,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - superAdmin edits admin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - superAdmin edits superAdmin - should return 403", async () => {
      await testAuthorizationAndAuthentication(
        testSuperAdmin,
        testSuperAdmin,
        4,
        false,
        403,
        "Access forbidden."
      );
    });

    it("change permissions to super admin - adminAndSuperAdmin edits user - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testUser,
        4,
        true
      );
    });

    it("change permissions to super admin - adminAndSuperAdmin edits admin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testAdmin,
        4,
        true
      );
    });

    it("change permissions to super admin - adminAndSuperAdmin edits superAdmin - should return 200", async () => {
      await testAuthorizationAndAuthentication(
        testAdminAndSuperAdmin,
        testSuperAdmin,
        4,
        true
      );
    });

    //#endregion CHANGE PERMISSIONS TO SUPER ADMIN

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("PUT/me", () => {
    let jwt;
    let editPayload;

    beforeEach(async () => {
      jwt = await testUser.generateJWT();
      editPayload = {
        name: testUserName,
        permissions: testUser.Permissions,
        password: "abcd1234",
        oldPassword: testUserPassword,
      };
    });

    let exec = async () => {
      if (exists(jwt))
        return request(server)
          .put("/api/user/me")
          .set(config.get("tokenHeader"), jwt)
          .send(editPayload);
      else return request(server).put("/api/user/me").send(editPayload);
    };

    /**
     * @description Method for test user edition route
     * @param {Object} loggedUser user to be edited
     * @param {String} initialUserPassword initial users password
     * @param {JSON} newUserPayload new edit payload
     * @param {Boolean} expectValidEdition should edition be performed without problem
     * @param {Number} errorCode expected error code - if error occurs
     * @param {String} errorText expected error text - if error occurs
     * @param {Boolean} passwordShouldHaveChanged should password have changed - for valid edition
     */
    const testUserEdition = async (
      loggedUser,
      initialUserPassword,
      newUserPayload,
      expectValidEdition,
      errorCode = null,
      errorText = null,
      passwordShouldHaveChanged = true
    ) => {
      jwt = await loggedUser.generateJWT();
      editPayload = newUserPayload;
      let initialUserPayload = getUserPayload(loggedUser);
      let editUserId = initialUserPayload._id;

      let response = await exec();

      if (expectValidEdition) {
        //#region CHECKING_RESPONSE

        expect(response).toBeDefined();
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined();

        let expectedBody = { ...editPayload, _id: editUserId };

        //new password and old password should not be returned
        delete expectedBody.password;
        delete expectedBody.oldPassword;

        expect(response.body).toEqual(expectedBody);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        let editedUser = await User.GetUserFromFileById(editUserId);

        expect(editedUser).toBeDefined();

        //User should have valid payload
        let editedUserPayload = getUserPayload(editedUser);

        let expectedPayload = {
          ...editPayload,
          _id: editUserId,
        };

        //Do not check password - it should have been hashed
        delete expectedPayload.password;
        delete expectedPayload.oldPassword;
        expect(editedUserPayload).toEqual(expectedPayload);

        //Checking if hashed password corresponds to the previous one

        let passwordMatch = passwordShouldHaveChanged
          ? await hashedStringMatch(editPayload.password, editedUser.Password)
          : await hashedStringMatch(initialUserPassword, editedUser.Password);

        expect(passwordMatch).toEqual(true);

        //#endregion CHECKING_DATABASE
      } else {
        //#region CHECKING_RESPONSE

        expect(response).toBeDefined();
        expect(response.status).toEqual(errorCode);
        expect(response.text).toEqual(errorText);

        //#endregion CHECKING_RESPONSE

        //#region CHECKING_DATABASE

        let editedUser = await User.GetUserFromFileById(editUserId);

        //User should exists
        expect(editedUser).toBeDefined();

        //User should have valid payload
        let editedUserPayload = getUserPayload(editedUser);

        expect(editedUserPayload).toEqual(initialUserPayload);

        //Checking if hashed password corresponds to the previous one

        let passwordMatch = await hashedStringMatch(
          initialUserPassword,
          editedUser.Password
        );

        expect(passwordMatch).toEqual(true);

        //#endregion CHECKING_DATABASE
      }
    };

    it("should return 200 and edit user in database", async () => {
      await testUserEdition(testUser, testUserPassword, editPayload, true);
    });

    it("should call logger action method", async () => {
      await exec();

      expect(logActionMock).toHaveBeenCalledTimes(1);

      expect(logActionMock.mock.calls[0][0]).toEqual(
        "User userName updated their profile data"
      );
    });

    //#region  ========== INVALID NAME ==========

    it("should return 400 and not edit user in database - if name is not defined in edit payload", async () => {
      delete editPayload.name;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"name" is required'
      );
    });

    it("should return 400 and not edit user in database - if there is na attempt to change name, for completle new value", async () => {
      editPayload.name = "fakeName";

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        "Invalid name for given user"
      );
    });

    it("should return 400 and not edit user in database - if there is na attempt to change name, for value of existing user", async () => {
      editPayload.name = testAdminName;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        "Invalid name for given user"
      );
    });

    it("should return 400 and not edit user in database - if name is null", async () => {
      editPayload.name = null;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"name" must be a string'
      );
    });

    it("should return 400 and not edit user in database - if name is not a valid string", async () => {
      editPayload.name = 123;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"name" must be a string'
      );
    });

    it("should return 400 and not edit user in database - if name is shorter than 3 signs", async () => {
      editPayload.name = generateStringOfGivenLength("a", 2);

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"name" length must be at least 3 characters long'
      );
    });

    it("should return 400 and not edit user in database - if name is longer than 100 signs", async () => {
      editPayload.name = generateStringOfGivenLength("a", 101);

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"name" length must be less than or equal to 100 characters long'
      );
    });

    //#endregion  ========== INVALID NAME ==========

    //#region  ========== INVALID PERMISSIONS ==========

    it("should return 400 and not edit user in database - if permissions is not defined in edit payload", async () => {
      delete editPayload.permissions;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"permissions" is required'
      );
    });

    it("should return 400 and not edit user in database - if permissions is null", async () => {
      editPayload.permissions = null;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"permissions" must be a number'
      );
    });

    it("should return 400 and not edit user in database - if permissions is not a valid number - string", async () => {
      editPayload.permissions = "abcd1234";

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"permissions" must be a number'
      );
    });

    it("should return 400 and not edit user in database - if permissions is not a valid number - double", async () => {
      editPayload.permissions = 1234.4321;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"permissions" must be an integer'
      );
    });

    it("should return 400 and not edit user in database - if permissions differs from value in user", async () => {
      editPayload.permissions = 0;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        "Invalid permissions for given user"
      );
    });

    //#endregion  ========== INVALID PERMISSIONS ==========

    //#region  ========== INVALID PASSWORD ==========

    it("should return 200 and edit user without editing password - if password is not defined in edit payload", async () => {
      delete editPayload.password;

      //Password should not have changed
      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        true,
        null,
        null,
        false
      );
    });

    it("should return 200 and edit user without editing password - if password and oldPassword are not defined in edit payload", async () => {
      delete editPayload.password;
      delete editPayload.oldPassword;

      //Password should not have changed
      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        true,
        null,
        null,
        false
      );
    });

    it("should return 400 and not edit user in database - if password is null", async () => {
      editPayload.password = null;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"password" must be a string'
      );
    });

    it("should return 400 and not edit user in database - if password is not a valid string", async () => {
      editPayload.password = 123;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"password" must be a string'
      );
    });

    it("should return 400 and not edit user in database - if password is shorter than 8 signs", async () => {
      editPayload.password = generateStringOfGivenLength("a", 7);

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"password" length must be at least 8 characters long'
      );
    });

    it("should return 400 and not edit user in database - if password is longer than 100 signs", async () => {
      editPayload.password = generateStringOfGivenLength("a", 101);

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"password" length must be less than or equal to 100 characters long'
      );
    });

    it("should return 400 and not edit user in database - if password is defined but oldPassword is not", async () => {
      delete editPayload.oldPassword;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        "Old password should be provided"
      );
    });

    it("should return 400 and not edit user in database - if password is defined but oldPassword is null", async () => {
      editPayload.oldPassword = null;

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        '"oldPassword" must be a string'
      );
    });

    it("should return 400 and not edit user in database - if old password does not correspond to actual password", async () => {
      editPayload.oldPassword = "fakePasswordThatDoesntWork";

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        "Invalid old password"
      );
    });

    //#endregion  ========== INVALID PASSWORD ==========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not create any user and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let originalUserPayload = getUserPayload(testUser);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      //User should exists
      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should not edit any user and return 400 if jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
        email: testAdmin.email,
        name: testAdmin.name,
        permissions: testAdmin.permissions,
      };

      jwt = await jsonWebToken.sign(fakeUserPayload, "differentTestPrivateKey");

      let originalUserPayload = getUserPayload(testUser);

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE

      //#region CHECKING_DATABASE

      let editedUser = await User.GetUserFromFileById(testUser.ID);

      //User should exists
      expect(editedUser).toBeDefined();

      //User should have valid payload
      let editedUserPayload = getUserPayload(editedUser);

      expect(editedUserPayload).toEqual(originalUserPayload);

      //Checking if hashed password corresponds to the previous one

      let passwordMatch = await hashedStringMatch(
        testUserPassword,
        editedUser.Password
      );
      expect(passwordMatch).toEqual(true);

      //#endregion CHECKING_DATABASE
    });

    it("should return 200 and edit user if useless user is trying to edit its own properties", async () => {
      editPayload = {
        name: uselessUser.Name,
        permissions: uselessUser.Permissions,
        password: "abcd1234",
        oldPassword: testUselessUserPassword,
      };

      await testUserEdition(
        uselessUser,
        testUselessUserPassword,
        editPayload,
        true
      );
    });

    it("should return 200 and edit user if user is trying to edit its own properties", async () => {
      editPayload = {
        name: testUser.Name,
        permissions: testUser.Permissions,
        password: "abcd1234",
        oldPassword: testUserPassword,
      };

      await testUserEdition(testUser, testUserPassword, editPayload, true);
    });

    it("should return 200 and edit user if admin is trying to edit its own properties", async () => {
      editPayload = {
        name: testAdmin.Name,
        permissions: testAdmin.Permissions,
        password: "abcd1234",
        oldPassword: testAdminPassword,
      };

      await testUserEdition(testAdmin, testAdminPassword, editPayload, true);
    });

    it("should return 200 and edit user if superAdmin is trying to edit its own properties", async () => {
      editPayload = {
        name: testSuperAdmin.Name,
        permissions: testSuperAdmin.Permissions,
        password: "abcd1234",
        oldPassword: testSuperAdminPassword,
      };

      await testUserEdition(
        testSuperAdmin,
        testSuperAdminPassword,
        editPayload,
        true
      );
    });

    it("should return 400 and not edit user if uselessUser is trying to promote himself to user", async () => {
      editPayload = {
        name: uselessUser.Name,
        permissions: 1,
        password: "abcd1234",
        oldPassword: testUselessUserPassword,
      };

      await testUserEdition(
        uselessUser,
        testUselessUserPassword,
        editPayload,
        false,
        400,
        "Invalid permissions for given user"
      );
    });

    it("should return 400 and not edit user if uselessUser is trying to promote himself to admin", async () => {
      editPayload = {
        name: uselessUser.Name,
        permissions: 2,
        password: "abcd1234",
        oldPassword: testUselessUserPassword,
      };

      await testUserEdition(
        uselessUser,
        testUselessUserPassword,
        editPayload,
        false,
        400,
        "Invalid permissions for given user"
      );
    });

    it("should return 400 and not edit user if uselessUser is trying to promote himself to superAdmin", async () => {
      editPayload = {
        name: uselessUser.Name,
        permissions: 4,
        password: "abcd1234",
        oldPassword: testUselessUserPassword,
      };

      await testUserEdition(
        uselessUser,
        testUselessUserPassword,
        editPayload,
        false,
        400,
        "Invalid permissions for given user"
      );
    });

    it("should return 400 and not edit user if user is trying to promote himself to admin", async () => {
      editPayload = {
        name: testUser.Name,
        permissions: 2,
        password: "abcd1234",
        oldPassword: testUserPassword,
      };

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        "Invalid permissions for given user"
      );
    });

    it("should return 400 and not edit user if user is trying to promote himself to superAdmin", async () => {
      editPayload = {
        name: testUser.Name,
        permissions: 4,
        password: "abcd1234",
        oldPassword: testUserPassword,
      };

      await testUserEdition(
        testUser,
        testUserPassword,
        editPayload,
        false,
        400,
        "Invalid permissions for given user"
      );
    });

    it("should return 400 and not edit user if admin is trying to promote himself to superAdmin", async () => {
      editPayload = {
        name: testAdmin.Name,
        permissions: 4,
        password: "abcd1234",
        oldPassword: testAdminPassword,
      };

      await testUserEdition(
        testAdmin,
        testAdminPassword,
        editPayload,
        false,
        400,
        "Invalid permissions for given user"
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });
});
