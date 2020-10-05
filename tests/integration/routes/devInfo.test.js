const _ = require("lodash");
const path = require("path");
const request = require("supertest");
const config = require("config");
const jsonWebToken = require("jsonwebtoken");
const {
  writeFileAsync,
  roundToPrecision,
  removeFileIfExistsAsync,
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

let { exists, hashedStringMatch } = require("../../../utilities/utilities");
let server;
let logger = require("../../../logger/logger");
const {
  _currentTemperatureData,
  cpuTemperature,
} = require("../../../__mocks__/systeminformation");

describe("api/devInfo", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let testUserAndAdmin;
  let testAdminAndSuperAdmin;
  let testUserAndAdminAndSuperAdmin;
  let logActionMock;

  beforeEach(async () => {
    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

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
    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing users in database after each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    await server.close();
  });

  describe("GET/", () => {
    let jwt;
    let currentCPUload;
    let maxTemp;
    let memoryUsageActive;
    let memoryUsageTotal;
    let rootPartitionDataPayload;
    let bootPartitionDataPayload;
    let partitionsDataPayload;

    beforeEach(async () => {
      jwt = await testUser.generateJWT();
      currentCPUload = 54.321;
      maxTemp = 43.321;
      memoryUsageActive = 1000000;
      memoryUsageTotal = 3000000;
      rootPartitionDataPayload = {
        fs: "fakeRootPartition",
        type: "ext4",
        size: 3000000,
        used: 2000000,
        use: 66.66,
        mount: "/",
      };
      bootPartitionDataPayload = {
        fs: "fakeBootPartition",
        type: "ext4",
        size: 300000,
        used: 200000,
        use: 66.66,
        mount: "/boot",
      };

      partitionsDataPayload = [
        rootPartitionDataPayload,
        bootPartitionDataPayload,
      ];
    });

    let exec = async () => {
      si._currentLoadData.currentload = currentCPUload;

      si._currentTemperatureData.max = maxTemp;

      si._currentMemoryData.total = memoryUsageTotal;
      si._currentMemoryData.active = memoryUsageActive;

      si._currentFSData = partitionsDataPayload;

      if (exists(jwt))
        return request(server)
          .get("/api/devInfo")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/devInfo").send();
    };

    it("should return 200 and proper cpu data values", async () => {
      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as cpuUsage if si.currentLoad throws", async () => {
      let originalCurrentLoad = si.currentLoad;
      si.currentLoad = async () => {
        throw new Error("Test error");
      };

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: null,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);

      si.currentLoad = originalCurrentLoad;
    });

    it("should not throw and return null as cpuUsage if si.currentLoadData.currentload returns undefined", async () => {
      currentCPUload = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: null,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as cpuUsage if si.currentLoadData.currentload returns null", async () => {
      currentCPUload = null;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: null,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as cpuUsage if si.currentLoadData.currentload returns not a number", async () => {
      currentCPUload = "abcd";

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: null,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as ramUsage if si.mem throws", async () => {
      let originalMem = si.mem;
      si.mem = async () => {
        throw new Error("Test error");
      };

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: null,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);

      si.mem = originalMem;
    });

    it("should not throw and return null as ramUsage if total memory usage is undefined", async () => {
      memoryUsageTotal = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: null,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as ramUsage if total memory usage is null", async () => {
      memoryUsageTotal = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: null,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as ramUsage if total memory usage is 0 (division by 0)", async () => {
      memoryUsageTotal = 0;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: null,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as ramUsage if active memory usage is undefined", async () => {
      memoryUsageActive = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: null,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as ramUsage if active memory usage is null", async () => {
      memoryUsageActive = null;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: null,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as ramUsage if active memory usage is not a number", async () => {
      memoryUsageActive = "abcd";

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: null,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return 0 as ramUsage if active memory usage is 0", async () => {
      memoryUsageActive = 0;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 0,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as cpuTemperature if si.cpuTemperature throws", async () => {
      let originalTemperature = si.cpuTemperature;
      si.cpuTemperature = async () => {
        throw new Error("Test error");
      };

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: null,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);

      si.cpuTemperature = originalTemperature;
    });

    it("should not throw and return null as cpuTemperature if si.cpuTemperature is undefined", async () => {
      maxTemp = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: null,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as cpuTemperature if si.cpuTemperature is null", async () => {
      maxTemp = null;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: null,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as cpuTemperature if si.cpuTemperature is not a number", async () => {
      maxTemp = "abcd";

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: null,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if si.fsSize throws", async () => {
      let originalFSSize = si.fsSize;
      si.fsSize = async () => {
        throw new Error("Test error");
      };

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);

      si.fsSize = originalFSSize;
    });

    it("should not throw and return valid values if there is more partitions", async () => {
      partitionsDataPayload = [
        rootPartitionDataPayload,
        {
          fs: "fakeFakePartition",
          type: "ext4",
          size: 32400,
          used: 2000,
          use: (100 * 2000) / 32400,
          mount: "/fakePath",
        },
        bootPartitionDataPayload,
      ];

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return valid values if boot partition has mount that contains (and is not equal to) /boot", async () => {
      bootPartitionDataPayload.mount = "/boot/some/fake/path";

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 76.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if boot partition has no boot Partition", async () => {
      partitionsDataPayload = [bootPartitionDataPayload];

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if boot partition has no root Partition", async () => {
      partitionsDataPayload = [rootPartitionDataPayload];

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if root partition has size as 0", async () => {
      rootPartitionDataPayload.size = 0;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if root partition has size as undefined", async () => {
      rootPartitionDataPayload.size = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if root partition has size as null", async () => {
      rootPartitionDataPayload.size = null;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return valid value as diskUsage if boot partition has size as 0", async () => {
      bootPartitionDataPayload.size = 0;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 66.67,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if boot partition has size as null", async () => {
      bootPartitionDataPayload.size = null;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if boot partition has size as undefined", async () => {
      bootPartitionDataPayload.size = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return valid value as diskUsage if root partition has used as 0", async () => {
      rootPartitionDataPayload.used = 0;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: 10,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if root partition has used as null", async () => {
      rootPartitionDataPayload.used = null;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should not throw and return null as diskUsage if root partition has used as undefined", async () => {
      rootPartitionDataPayload.used = undefined;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        cpuUsage: 54.32,
        cpuTemperature: 43.32,
        ramUsage: 33.33,
        diskUsage: null,
      };
      expect(response.body).toEqual(expectedBody);
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any device info and return 401 if jwt has not been given", async () => {
      jwt = undefined;

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any device info and return 403 - USELESS USER", async () => {
      jwt = await uselessUser.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any device info and return 403 - ADMIN", async () => {
      jwt = await testAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any device info and return 403 - SUPER ADMIN", async () => {
      jwt = await testSuperAdmin.generateJWT();

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any device info and return 400 if invalid jwt has been given", async () => {
      jwt = "abcd1234";

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any device info and return 400 if  jwt from different private key was provided", async () => {
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
