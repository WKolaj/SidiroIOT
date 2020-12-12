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

const socketFilePath = config.get("netplanConfigSocketFilePath");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);
const projectFileName = config.get("projectFileName");
const projectFilePath = path.join(settingsDirPath, projectFileName);

const netplanAuthToken = config.get("netplanConfigAuthToken");

const projectService = require("../../../services/projectService");

let { exists, hashedStringMatch } = require("../../../utilities/utilities");
let server;
let logger = require("../../../logger/logger");

describe("api/ipConfig", () => {
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

  //Non-standard methods have to be implemented:
  //IN ORDER FOR SERVER TO START WE NEED TO START NETPLAN SERVICE BEFORE
  //WE NEED TO CONTROL THE START OF NETPLAN SERVICE THEREFORE STARTING SERVER HAS TO BE PERFORMED IN initTest METHOD NOT BEFORE EACH

  //Method invoked after init
  let afterTestInit;

  //Method invoked after method afterTestInit
  let afterAfterTestInit;

  beforeEach(async () => {
    jest.setTimeout(30000);
    jest.resetAllMocks();

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
        optional: true,
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

    afterTestInit = null;
    afterAfterTestInit = null;
  });

  afterEach(async () => {
    jest.resetAllMocks();

    //Clearing users in database after each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    if (server) await server.close();

    if (ipConfigMockServer) {
      await ipConfigMockServer.Stop();
      ipConfigMockServer = null;
    }
  });

  const initTest = async () => {
    ipConfigMockServer = require("../../utilities/fakeIPService");

    //Clearing socket file path if exists
    await removeFileIfExistsAsync(socketFilePath);

    if (runIPConfigServer) {
      await ipConfigMockServer.Start();
      ipConfigMockServer._setContent(initialIPServerContent);
    }

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Clearing users in database before each test
    await writeFileAsync(userFilePath, "{}", "utf8");

    server = await require("../../../startup/app")();

    //generating uslessUser, user, admin and adminUser
    uselessUser = await generateUselessUser();
    testAdmin = await generateTestAdmin();
    testUser = await generateTestUser();
    testSuperAdmin = await generateTestSuperAdmin();
    testUserAndAdmin = await generateTestAdminAndUser();
    testAdminAndSuperAdmin = await generateTestAdminAndSuperAdmin();
    testUserAndAdminAndSuperAdmin = await generateTestUserAndAdminAndSuperAdmin();

    if (afterTestInit) await afterTestInit();

    if (afterAfterTestInit) await afterAfterTestInit();
    //Have to reset all mocks - get was invoked during app startup
    jest.resetAllMocks();
  };

  describe("GET/", () => {
    let jwt;

    beforeEach(() => {
      afterTestInit = async () => {
        jwt = await testUser.generateJWT();
      };
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

    it("should return 200 and content of netplan service - if there are no interfaces", async () => {
      initialIPServerContent = [];

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {};
      expect(response.body).toEqual(expectedBody);
    });

    it("should return 200 and content of netplan service - if there is only one interface", async () => {
      initialIPServerContent = [
        {
          name: "eth2",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.10.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.10.1",
          dns: ["10.10.10.1", "1.1.1.1"],
        },
      ];

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        eth2: {
          name: "eth2",
          dhcp: false,
          ipAddress: "10.10.10.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.10.1",
          dns: ["10.10.10.1", "1.1.1.1"],
        },
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should return 500  - if netplan config service is not available", async () => {
      runIPConfigServer = false;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(500);

      expect(response.text).toEqual(
        "Could not get interfaces - internal error!"
      );
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any interface and return 401 if jwt has not been given", async () => {
      afterAfterTestInit = async () => {
        jwt = undefined;
      };

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - USELESS USER", async () => {
      afterAfterTestInit = async () => {
        jwt = await uselessUser.generateJWT();
      };

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - ADMIN", async () => {
      afterAfterTestInit = async () => {
        jwt = await testAdmin.generateJWT();
      };

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - SUPER ADMIN", async () => {
      afterAfterTestInit = async () => {
        jwt = await testSuperAdmin.generateJWT();
      };

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if invalid jwt has been given", async () => {
      afterAfterTestInit = async () => {
        jwt = "abcd1234";
      };

      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if  jwt from different private key was provided", async () => {
      afterAfterTestInit = async () => {
        let fakeUserPayload = {
          _id: testAdmin._id,
          name: testAdmin.name,
          permissions: testAdmin.permissions,
        };

        jwt = await jsonWebToken.sign(
          fakeUserPayload,
          "differentTestPrivateKey"
        );
      };
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

  describe("GET/:interfaceName", () => {
    let jwt;
    let interfaceName;

    beforeEach(async () => {
      interfaceName = "eth3";

      afterTestInit = async () => {
        jwt = await testUser.generateJWT();
      };
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

    it("should return 200 and content of given netplan interface - if netplanInterface has dhcp = false", async () => {
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

    it("should return 200 and content of given netplan interface - if netplanInterface has dhcp = true", async () => {
      interfaceName = "eth2";
      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);

      expect(response.body).toBeDefined();
      let expectedBody = {
        name: "eth2",
        dhcp: true,
      };
      expect(response.body).toEqual(expectedBody);
    });

    it("should return 200 and content of given netplan interface - if there is only one interface", async () => {
      initialIPServerContent = [
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

    it("should return 404 - if there are not interfaces", async () => {
      initialIPServerContent = [];

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);

      expect(response.text).toBeDefined();
      expect(response.text).toEqual("No interface of given name found!");
    });

    it("should return 404 - if there is no interface of given name", async () => {
      interfaceName = "fakeInterfaceName";

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);

      expect(response.text).toBeDefined();
      expect(response.text).toEqual("No interface of given name found!");
    });

    it("should return 404  - if netplan config service is not available", async () => {
      runIPConfigServer = false;

      let response = await exec();

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);

      expect(response.text).toEqual("No interface of given name found!");
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any interface and return 401 if jwt has not been given", async () => {
      afterAfterTestInit = async () => {
        jwt = undefined;
      };
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(401);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access denied. No token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - USELESS USER", async () => {
      afterAfterTestInit = async () => {
        jwt = await uselessUser.generateJWT();
      };
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - ADMIN", async () => {
      afterAfterTestInit = async () => {
        jwt = await testAdmin.generateJWT();
      };
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 403 - SUPER ADMIN", async () => {
      afterAfterTestInit = async () => {
        jwt = await testSuperAdmin.generateJWT();
      };
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(403);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Access forbidden");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if invalid jwt has been given", async () => {
      afterAfterTestInit = async () => {
        jwt = "abcd1234";
      };
      let response = await exec();

      //#region CHECKING_RESPONSE

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.text).toBeDefined();
      expect(response.text).toContain("Invalid token provided");

      //#endregion CHECKING_RESPONSE
    });

    it("should not return any interface and return 400 if jwt from different private key was provided", async () => {
      afterAfterTestInit = async () => {
        let fakeUserPayload = {
          _id: testAdmin._id,
          name: testAdmin.name,
          permissions: testAdmin.permissions,
        };

        jwt = await jsonWebToken.sign(
          fakeUserPayload,
          "differentTestPrivateKey"
        );
      };

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

  describe("PUT/:interfaceName", () => {
    let jwt;
    let interfaceName;
    let putContent;

    beforeEach(() => {
      interfaceName = "eth2";
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      afterTestInit = async () => {
        jwt = await testAdmin.generateJWT();
      };
    });

    let exec = async () => {
      await initTest();

      if (exists(jwt))
        return request(server)
          .put(`/api/ipConfig/${interfaceName}`)
          .set(config.get("tokenHeader"), jwt)
          .send(putContent);
      else
        return request(server)
          .put(`/api/ipConfig/${interfaceName}`)
          .send(putContent);
    };

    const testIPConfigRoute = async (
      expectValid,
      usersJWT,
      initialPayload,
      interName,
      putPayload,
      errorCode,
      errorText
    ) => {
      jwt = usersJWT;
      initialIPServerContent = initialPayload;
      interfaceName = interName;
      putContent = putPayload;

      let response = await exec();

      if (expectValid) {
        //#region ========= TESTING MOCKED POST CALL =========

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

        //Creating expected content

        let expectedContent = [...initialIPServerContent];

        //Finding index of edited interface
        let editedElement = initialIPServerContent.find(
          (inter) => inter.name === interName
        );
        let indexOfEditedElement = initialIPServerContent.indexOf(
          editedElement
        );

        expectedContent[indexOfEditedElement] = {
          optional: true,
        };

        expectedContent[indexOfEditedElement].name = putContent.name;
        expectedContent[indexOfEditedElement].dhcp = putContent.dhcp;

        if (!putContent.dhcp) {
          expectedContent[indexOfEditedElement].ipAddress =
            putContent.ipAddress;
          expectedContent[indexOfEditedElement].subnetMask =
            putContent.subnetMask;
          expectedContent[indexOfEditedElement].gateway = putContent.gateway;
          expectedContent[indexOfEditedElement].dns = [...putContent.dns];
        }

        expect(content).toEqual(expectedContent);

        //#endregion ========= TESTING MOCKED POST CALL =========

        //#region ========= TESTING RESPONSE CONTENT =========

        expect(response).toBeDefined();
        expect(response.status).toEqual(200);

        //Creating expected response content
        let expectedResponseContent = {};

        expectedResponseContent.name = putContent.name;
        expectedResponseContent.dhcp = putContent.dhcp;

        if (!putContent.dhcp) {
          expectedResponseContent.ipAddress = putContent.ipAddress;
          expectedResponseContent.subnetMask = putContent.subnetMask;
          expectedResponseContent.gateway = putContent.gateway;
          expectedResponseContent.dns = [...putContent.dns];
        }

        expect(response.body).toEqual(expectedResponseContent);

        //#endregion ========= TESTING RESPONSE CONTENT =========

        //#region ========= TESTING PROJECT FILE CONTENT =========

        let projectIPConfig = await projectService.getIPConfig();

        let expectedIPConfigContent = {};

        for (let inter of expectedContent) {
          expectedIPConfigContent[inter.name] = inter;
        }

        expect(projectIPConfig).toEqual(expectedIPConfigContent);

        //#endregion ========= TESTING PROJECT FILE CONTENT =========
      } else {
        //#region ========= TESTING MOCKED POST CALL =========

        expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

        //#endregion ========= TESTING MOCKED POST CALL =========

        //#region ========= TESTING RESPONSE CONTENT =========

        expect(response).toBeDefined();
        expect(response.status).toEqual(errorCode);

        expect(response.text).toEqual(errorText);

        //#endregion ========= TESTING RESPONSE CONTENT =========

        //#region ========= TESTING PROJECT FILE CONTENT =========

        let projectIPConfig = await projectService.getIPConfig();

        let expectedIPConfigContent = {};

        for (let inter of initialIPServerContent) {
          expectedIPConfigContent[inter.name] = inter;
        }

        //If ipconfigserver has not been started - set expectedIPConfig as empty object - settings could not have been set at the begining
        if (!runIPConfigServer) expectedIPConfigContent = {};
        expect(projectIPConfig).toEqual(expectedIPConfigContent);

        //#endregion ========= TESTING PROJECT FILE CONTENT =========
      }
    };

    it("should result in the invoke of post method of http service and return 200 and content with new updated interface - if update interface has dhcp = false", async () => {
      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    it("should result in the invoke of post method of http service and return 200 and content with new updated interface - if update interface has dhcp = true", async () => {
      interfaceName = "eth3";
      putContent = {
        name: "eth3",
        dhcp: true,
      };
      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    it("should return 404 and don't invoke POST - server has not been run", async () => {
      runIPConfigServer = false;

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        404,
        "No interface of given name found!"
      );
    });

    it("should return 404 if there is no interfaces", async () => {
      initialIPServerContent = [];

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        404,
        "No interface of given name found!"
      );
    });

    //#region ========== INVALID NAME ==========

    it("should return 404 if there is no interface of given name", async () => {
      interfaceName = "fakeName";

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        404,
        "No interface of given name found!"
      );
    });

    it("should return 400 if there is an attempt to change name - new name exists", async () => {
      interfaceName = "eth3";

      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        "Name of interface cannot be changed!"
      );
    });

    it("should return 400 if there is an attempt to change name - new name does not exist", async () => {
      interfaceName = "eth3";

      putContent = {
        name: "newFakeName",
        dhcp: false,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        "Name of interface cannot be changed!"
      );
    });

    it("should return 400 - if name is not defined in payload", async () => {
      putContent = {
        dhcp: false,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"name" is required`
      );
    });

    it("should return 400 - if name is null", async () => {
      putContent = {
        name: null,
        dhcp: false,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"name" must be a string`
      );
    });

    it("should return 400 - if name is not a string", async () => {
      putContent = {
        name: 1234,
        dhcp: false,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"name" must be a string`
      );
    });

    //#endregion ========== INVALID NAME ==========

    //#region ========== INVALID DHCP ==========

    it("should return 400 - if dhcp is not defined in payload", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dhcp" is required`
      );
    });

    it("should return 400 - if dhcp is null", async () => {
      putContent = {
        name: "eth2",
        dhcp: null,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dhcp" must be a boolean`
      );
    });

    it("should return 400 - if dhcp is not a boolean", async () => {
      putContent = {
        name: "eth2",
        dhcp: 1234,
        ipAddress: "10.10.11.2",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dhcp" must be a boolean`
      );
    });

    //#endregion ========== INVALID DHCP ==========

    //#region ========== INVALID IPADDRESS ==========

    it("should return 400 - if ipAddress is not defined in payload and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" is required`
      );
    });

    it("should return 400 - if ipAddress is null and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: null,
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a string`
      );
    });

    it("should return 400 - if ipAddress is not a string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: 1234,
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a string`
      );
    });

    it("should return 400 - if ipAddress is not a valid ip string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "fakeIP",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if ipAddress is an ip with CIDR and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12/24",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 200 - if ipAddress is not defined in payload and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    it("should return 400 - if ipAddress is null and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: null,
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a string`
      );
    });

    it("should return 400 - if ipAddress is not a string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: 1234,
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a string`
      );
    });

    it("should return 400 - if ipAddress is not a valid ip string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "fakeIP",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if ipAddress is an ip with CIDR and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12/24",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"ipAddress" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    //#endregion ========== INVALID IPADDRESS ==========

    //#region ========== INVALID SUBNET MASK ==========

    it("should return 400 - if subnetMask is not defined in payload and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        dhcp: false,
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" is required`
      );
    });

    it("should return 400 - if subnetMask is null and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: null,
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a string`
      );
    });

    it("should return 400 - if subnetMask is not a string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: 1234,
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a string`
      );
    });

    it("should return 400 - if subnetMask is not a valid ip string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "fakeIP",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if subnetMask is an ip with CIDR and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0/24",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 200 - if subnetMask is not defined in payload and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        dhcp: true,
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    it("should return 400 - if subnetMask is null and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: null,
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a string`
      );
    });

    it("should return 400 - if subnetMask is not a string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: 1234,
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a string`
      );
    });

    it("should return 400 - if subnetMask is not a valid ip string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "fakeIP",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if subnetMask is an ip with CIDR and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0/24",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"subnetMask" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    //#endregion ========== INVALID SUBNET MASK ==========

    //#region ========== INVALID GATEWAY ==========

    it("should return 400 - if gateway is not defined in payload and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        dhcp: false,
        subnetMask: "255.255.255.0",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" is required`
      );
    });

    it("should return 400 - if gateway is null and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: null,
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a string`
      );
    });

    it("should return 400 - if gateway is not a string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: 1234,
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a string`
      );
    });

    it("should return 400 - if gateway is not a valid ip string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "fakeIP",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if gateway is an ip with CIDR and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1/24",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 200 - if gateway is not defined in payload and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        dhcp: true,
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    it("should return 400 - if gateway is null and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: null,
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a string`
      );
    });

    it("should return 400 - if gateway is not a string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: 1234,
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a string`
      );
    });

    it("should return 400 - if gateway is not a valid ip string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "fakeIP",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if gateway is an ip with CIDR and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1/24",
        dns: ["10.10.11.1", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"gateway" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    //#endregion ========== INVALID GATEWAY ==========

    //#region ========== INVALID DNS ==========

    it("should return 400 - if dns is not defined in payload and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        dhcp: false,
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns" is required`
      );
    });

    it("should return 400 - if dns is null and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: null,
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns" must be an array`
      );
    });

    it("should return 400 - if dns is not an array and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: 1234,
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns" must be an array`
      );
    });

    it("should return 400 - if one of dns is not a valid string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: [1234],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns[0]" must be a string`
      );
    });

    it("should return 400 - if one of dns is not a valid ip string and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["fakeIP"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns[0]" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if one of dns is an ip with CIDR and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        dhcp: false,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1/24", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns[0]" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 200 - if dns is an empty array and dhcp = false", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        dhcp: false,
        gateway: "10.10.11.1",
        dns: [],
      };

      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    it("should return 200 - if dns is not defined in payload and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        dhcp: true,
        gateway: "10.10.11.1",
      };

      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    it("should return 400 - if dns is null and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: null,
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns" must be an array`
      );
    });

    it("should return 400 - if dns is not an array and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: 1234,
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns" must be an array`
      );
    });

    it("should return 400 - if one of dns is not a valid string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: [2134, "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns[0]" must be a string`
      );
    });

    it("should return 400 - if one of dns is not a valid ip string and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["fakeIP", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns[0]" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 400 - if one of dns is an ip with CIDR and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        dhcp: true,
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        gateway: "10.10.11.1",
        dns: ["10.10.11.1/24", "1.1.1.1"],
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        `"dns[0]" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR`
      );
    });

    it("should return 200 - if dns is an empty array and dhcp = true", async () => {
      putContent = {
        name: "eth2",
        ipAddress: "10.10.11.12",
        subnetMask: "255.255.255.0",
        dhcp: true,
        gateway: "10.10.11.1",
        dns: [],
      };

      await testIPConfigRoute(
        true,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        null,
        null
      );
    });

    //#endregion ========== INVALID DNS ==========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should not return any interface and return 401 if jwt has not been given", async () => {
      afterAfterTestInit = async () => {
        jwt = undefined;
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        401,
        `Access denied. No token provided`
      );
    });

    it("should not return any interface and return 403 - USELESS USER", async () => {
      afterAfterTestInit = async () => {
        jwt = await uselessUser.generateJWT();
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        403,
        "Access forbidden."
      );
    });

    it("should not return any interface and return 403 - USER", async () => {
      afterAfterTestInit = async () => {
        jwt = await testUser.generateJWT();
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        403,
        "Access forbidden."
      );
    });

    it("should not return any interface and return 403 - SUPER ADMIN", async () => {
      afterAfterTestInit = async () => {
        jwt = await testSuperAdmin.generateJWT();
      };

      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        403,
        "Access forbidden."
      );
    });

    it("should not return any interface and return 400 if invalid jwt has been given", async () => {
      afterAfterTestInit = async () => {
        jwt = "abcd1234";
      };
      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        "Invalid token provided"
      );
    });

    it("should not return any interface and return 400 if  jwt from different private key was provided", async () => {
      afterAfterTestInit = async () => {
        let fakeUserPayload = {
          _id: testAdmin._id,
          name: testAdmin.name,
          permissions: testAdmin.permissions,
        };

        jwt = await jsonWebToken.sign(
          fakeUserPayload,
          "differentTestPrivateKey"
        );
      };
      await testIPConfigRoute(
        false,
        jwt,
        initialIPServerContent,
        interfaceName,
        putContent,
        400,
        "Invalid token provided"
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });
});
