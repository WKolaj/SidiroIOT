const _ = require("lodash");
const path = require("path");
const request = require("supertest");
const config = require("config");
const jsonWebToken = require("jsonwebtoken");
const {
  writeFileAsync,
  roundToPrecision,
  removeFileIfExistsAsync,
  clearDirectoryAsync,
  snooze,
  createFileAsync,
} = require("../../../utilities/utilities");
let {
  generateTestAdmin,
  generateTestUser,
  generateTestAdminAndUser,
  generateUselessUser,
  generateTestSuperAdmin,
  generateTestAdminAndSuperAdmin,
  generateTestUserAndAdminAndSuperAdmin,
} = require("../../utilities/testUtilities");
const si = require("systeminformation");

const privateKey = config.get("jwtPrivateKey");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);

const projectFileName = config.get("projectFileName");
const projectFilePath = path.join(settingsDirPath, projectFileName);

const socketFilePath = config.get("netplanConfigSocketFilePath");
const projectService = require("../../../services/projectService");
const logDirPath = "__testDir/logs";

let { exists, hashedStringMatch } = require("../../../utilities/utilities");
let server;
let logger = require("../../../logger/logger");
const {
  _currentTemperatureData,
  cpuTemperature,
} = require("../../../__mocks__/systeminformation");

describe("api/log", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let testUserAndAdmin;
  let testAdminAndSuperAdmin;
  let testUserAndAdminAndSuperAdmin;
  let logActionMock;
  let ipConfigMockServer;

  beforeEach(async () => {
    jest.setTimeout(30000);
    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    ipConfigMockServer = require("../../utilities/fakeIPService");
    await ipConfigMockServer.Start();

    server = await require("../../../startup/app")();

    //Clearing users in database before each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //Clear logs directory
    await clearDirectoryAsync(logDirPath);

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
    let jwt;
    let filesToCreatePaths;
    let filesToCreateContents;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();

      filesToCreatePaths = [
        `${logDirPath}/info1.log`,
        `${logDirPath}/info2.log`,
        `${logDirPath}/info3.log`,
        `${logDirPath}/error1.log`,
        `${logDirPath}/error2.log`,
        `${logDirPath}/error3.log`,
        `${logDirPath}/warn1.log`,
        `${logDirPath}/warn2.log`,
        `${logDirPath}/warn3.log`,
        `${logDirPath}/fakeLogFile1.txt`,
        `${logDirPath}/fakeLogFile2.txt`,
        `${logDirPath}/fakeLogFile3.txt`,
      ];

      filesToCreateContents = [
        `Content of log file - 1`,
        `Content of log file - 2`,
        `Content of log file - 3`,
        `Content of error file - 1`,
        `Content of error file - 2`,
        `Content of error file - 3`,
        `Content of warning file - 1`,
        `Content of warning file - 2`,
        `Content of warning file - 3`,
        `Content of fake log file - 1`,
        `Content of fake log file - 2`,
        `Content of fake log file - 3`,
      ];
    });

    let exec = async () => {
      for (let fileIndex in filesToCreatePaths) {
        let filePath = filesToCreatePaths[fileIndex];
        let fileContent = filesToCreateContents[fileIndex];

        //snoozing 100ms in order not to create files at the same time
        await snooze(100);

        await createFileAsync(filePath, fileContent);
      }

      if (exists(jwt))
        return request(server)
          .get("/api/log")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/log").send();
    };

    it("should return 200 and proper content of last modified log file", async () => {
      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.text).toBeDefined();
      let expectedText = `Content of log file - 3`;
      expect(response.text).toEqual(expectedText);
    });

    it("should return 200 and proper content of last modified log file - if log file content is huge", async () => {
      let fileContent = "";
      for (let i = 0; i < 100000; i++) {
        fileContent += `New line number ${i} \n`;
      }
      filesToCreateContents[2] = fileContent;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.text).toBeDefined();
      let expectedText = fileContent;
      expect(response.text).toEqual(expectedText);
    });

    it("should return 200 and empty string - if log file content is an empty string", async () => {
      let fileContent = "";
      filesToCreateContents[2] = fileContent;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.text).toBeDefined();
      let expectedText = "";
      expect(response.text).toEqual(expectedText);
    });

    it("should return 200 and empty string - if there are no log files", async () => {
      filesToCreateContents = [];
      filesToCreatePaths = [];

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.text).toBeDefined();
      let expectedText = "";
      expect(response.text).toEqual(expectedText);
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
