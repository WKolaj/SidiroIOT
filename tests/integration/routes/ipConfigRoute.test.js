const _ = require("lodash");
const path = require("path");
const request = require("supertest");
const config = require("config");
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

const socketFilePath = config.get("netplanConfigSocketFilePath");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);

const netplanAuthToken = config.get("netplanConfigAuthToken");

let { exists, hashedStringMatch } = require("../../../utilities/utilities");
let server;
let logger = require("../../../logger/logger");

describe("api/devInfo", () => {
  let uselessUser;
  let testAdmin;
  let testUser;
  let testSuperAdmin;
  let testUserAndAdmin;
  let testAdminAndSuperAdmin;
  let testUserAndAdminAndSuperAdmin;
  let logActionMock;
  let runIPConfigServer;
  let ipConfigMockServer;
  let initialIPServerContent;

  beforeEach(async () => {
    jest.resetAllMocks();
    server = await require("../../../startup/app")();
    ipConfigMockServer = require("../../utilities/fakeIPService");

    //Clearing users in database before each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

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
    runIPConfigServer = true;

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
  });

  afterEach(async () => {
    jest.resetAllMocks();
    //Clearing users in database after each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    await server.close();

    if (ipConfigMockServer) await ipConfigMockServer.Stop();
  });

  const initTest = async () => {
    if (runIPConfigServer) {
      await ipConfigMockServer.Start();
      ipConfigMockServer._setContent(initialIPServerContent);
    }
  };

  describe("GET/", () => {
    let jwt;

    beforeEach(async () => {
      jwt = await testUser.generateJWT();
    });

    let exec = async () => {
      await initTest();

      if (exists(jwt))
        return request(server)
          .get("/api/ipConfig")
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get("/api/ipConfig").send();
    };

    it("should result in the invoke of get method of http service", async () => {
      await exec();

      expect(ipConfigMockServer.OnGetMockFn).toHaveBeenCalledTimes(1);

      let request = ipConfigMockServer.OnGetMockFn.mock.calls[0][0];
      expect(request).toBeDefined();

      //Method should be set to get
      expect(request.method).toEqual("GET");

      //Request should have x-auth-token set to valid token
      expect(request.headers["x-auth-token"]).toEqual(netplanAuthToken);
    });

    it("should return 200 and content of netplan service", async () => {
      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        eth1: {
          name: "eth1",
          dhcp: true,
        },
        eth2: {
          name: "eth2",
          dhcp: true,
        },
        eth3: {
          name: "eth3",
          dhcp: false,
          ipAddress: "10.10.10.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.10.1",
          dns: ["10.10.10.1", "1.1.1.1"],
        },
      };
      expect(response.body).toEqual(expectedBody);
    });

    //TODO - add other tests
  });

  describe("GET/:interfaceName", () => {
    let jwt;
    let interfaceName;

    beforeEach(async () => {
      jwt = await testUser.generateJWT();
      interfaceName = "eth3";
    });

    let exec = async () => {
      await initTest();

      if (exists(jwt))
        return request(server)
          .get(`/api/ipConfig/${interfaceName}`)
          .set(config.get("tokenHeader"), jwt)
          .send();
      else return request(server).get(`/api/ipConfig/${interfaceName}`).send();
    };

    it("should result in the invoke of get method of http service", async () => {
      await exec();

      expect(ipConfigMockServer.OnGetMockFn).toHaveBeenCalledTimes(1);

      let request = ipConfigMockServer.OnGetMockFn.mock.calls[0][0];
      expect(request).toBeDefined();

      //Method should be set to get
      expect(request.method).toEqual("GET");

      //Request should have x-auth-token set to valid token
      expect(request.headers["x-auth-token"]).toEqual(netplanAuthToken);
    });

    it("should return 200 and content of given netplan interface", async () => {
      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        name: "eth3",
        dhcp: false,
        ipAddress: "10.10.10.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.10.1",
        dns: ["10.10.10.1", "1.1.1.1"],
      };
      expect(response.body).toEqual(expectedBody);
    });

    //TODO - add other tests
  });

  describe("PUT/:interfaceName", () => {
    let jwt;
    let interfaceName;
    let postContent;

    beforeEach(async () => {
      jwt = await testAdmin.generateJWT();
      interfaceName = "eth2";
      postContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };
    });

    let exec = async () => {
      await initTest();

      if (exists(jwt))
        return request(server)
          .put(`/api/ipConfig/${interfaceName}`)
          .set(config.get("tokenHeader"), jwt)
          .send(postContent);
      else
        return request(server)
          .put(`/api/ipConfig/${interfaceName}`)
          .send(postContent);
    };

    it("should result in the invoke of post method of http service", async () => {
      await exec();
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let request = ipConfigMockServer.OnPostMockFn.mock.calls[0][0];
      expect(request).toBeDefined();

      //Method should be set to get
      expect(request.method).toEqual("POST");

      //Request should have x-auth-token set to valid token
      expect(request.headers["x-auth-token"]).toEqual(netplanAuthToken);

      //Request should have content-type set as JSON
      expect(request.headers["content-type"]).toEqual("application/json");

      let content = JSON.parse(
        ipConfigMockServer.OnPostMockFn.mock.calls[0][1]
      );

      //Should send valid content - with optional parameters set to true
      //ALL INTERFACE CONFIG SHOULD BE SEND!
      let expectedContent = [...initialIPServerContent];

      expectedContent[1] = {
        ...postContent,
        optional: true,
      };

      expect(content).toEqual(expectedContent);
    });

    it("should return 200 and content with new updated interface", async () => {
      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toEqual(postContent);
    });

    //TODO - add rest of tests
  });
});
