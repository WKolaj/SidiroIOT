const {
  snooze,
  writeFileAsync,
  readFileAsync,
  removeFileIfExistsAsync,
} = require("../../../utilities/utilities");
const _ = require("lodash");
const path = require("path");
const request = require("supertest");
const bcrypt = require("bcrypt");
const config = require("config");
const jsonWebToken = require("jsonwebtoken");
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

let { exists } = require("../../../utilities/utilities");
let server;
let logger = require("../../../logger/logger");
const netplan = require("../../../startup/netplan");
const projectFileName = config.get("projectFileName");
const projectFilePath = path.join(settingsDirPath, projectFileName);

const socketFilePath = config.get("netplanConfigSocketFilePath");

describe("api/user", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let testUserAndAdmin;
  let testAdminAndSuperAdmin;
  let testUserAndAdminAndSuperAdmin;
  let logActionMock;
  let ipConfigMockServer;
  let initialIPServerContent;

  beforeEach(async () => {
    jest.resetAllMocks();

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    initialIPServerContent = [
      {
        name: "eth1",
        dhcp: true,
        optional: true,
      },
      {
        name: "eth2",
        dhcp: true,
        optional: false,
      },
      {
        name: "eth3",
        dhcp: false,
        optional: true,
        ipAddress: "10.10.10.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.10.1",
        dns: ["10.10.10.1", "1.1.1.1"],
      },
    ];

    ipConfigMockServer = require("../../utilities/fakeIPService");
    ipConfigMockServer._setContent(initialIPServerContent);
    await ipConfigMockServer.Start();

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
    jest.resetAllMocks();

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

  describe("GET/", () => {
    let projectFileContent;
    let createProjectFile;
    let jwt;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
      createProjectFile = true;
      projectFileContent = {
        ipConfig: {
          eth1: {
            name: "eth1",
            dhcp: false,
            optional: true,
            ipAddress: "10.10.13.2",
            subnetMask: "255.255.255.0",
            gateway: "10.10.13.1",
            dns: ["10.10.13.1", "1.1.1.1"],
          },
          eth2: {
            name: "eth2",
            dhcp: true,
            optional: true,
          },
        },
        data: {},
      };
    });

    let exec = async () => {
      if (createProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(projectFileContent),
          "utf8"
        );

      if (exists(jwt))
        return request(server)
          .get("/api/configFile")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/configFile").send();
    };

    it("should return 200 and config file containt projectFile", async () => {
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      let responseBody = JSON.parse(response.body);

      expect(responseBody).toBeDefined();
      expect(responseBody).toEqual(projectFileContent);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and config file containt projectFile if project file is huge", async () => {
      projectFileContent = {
        ...projectFileContent,
        data: {},
      };
      for (let i = 0; i < 1000000; i++) {
        projectFileContent.data[i] = i * i;
      }

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      let responseBody = JSON.parse(response.body);

      expect(responseBody).toBeDefined();
      expect(responseBody).toEqual(projectFileContent);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and config file - if there is initially created project file", async () => {
      createProjectFile = false;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      let responseBody = JSON.parse(response.body);

      let expectedBody = {
        ipConfig: {},
      };

      for (let inter of initialIPServerContent) {
        expectedBody.ipConfig[inter.name] = inter;
      }

      expect(responseBody).toBeDefined();
      expect(responseBody).toEqual(expectedBody);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 404 - if there is no project file", async () => {
      await removeFileIfExistsAsync(projectFilePath);

      createProjectFile = false;
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
      expect(response.text).toEqual(
        "Project file does not exists or is invalid..."
      );

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and config file - even if project file content is invalid", async () => {
      projectFileContent = "asdad9asd8asd8;a'd;asd";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      let responseBody = JSON.parse(response.body);

      expect(responseBody).toBeDefined();
      expect(responseBody).toEqual(projectFileContent);

      //#endregion CHECKING_RESPONSE
    });

    it("should return 200 and config file - even if project file content is empty", async () => {
      projectFileContent = "";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      let responseBody = JSON.parse(response.body);

      expect(responseBody).toBeDefined();
      expect(responseBody).toEqual(projectFileContent);

      //#endregion CHECKING_RESPONSE
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any interface and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - USER", async () => {
      jwt = await testUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if jwt from different private key was provided", async () => {
      let fakeUserPayload = {
        _id: testAdmin._id,
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
});
