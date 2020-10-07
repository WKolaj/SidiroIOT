describe("projectService", () => {
  let _;
  let path;
  let request;
  let config;
  let jsonWebToken;
  let readFileAsync;
  let checkIfFileExistsAsync;
  let writeFileAsync;
  let roundToPrecision;
  let removeFileIfExistsAsync;
  let exists;
  let settingsDirFilePath;
  let socketFilePath;
  let projectFilePath;
  let logger;
  let projectService;
  let netplanService;
  let runIPConfigServer;
  let ipConfigMockServer;
  let initialIPServerContent;
  let initNetplanService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();
    ipConfigMockServer = require("../../utilities/fakeIPService");
    _ = require("lodash");
    path = require("path");
    request = require("supertest");
    config = require("config");
    jsonWebToken = require("jsonwebtoken");
    projectService = require("../../../services/projectService");
    netplanService = require("../../../services/netplanService");
    logger = require("../../../logger/logger");
    let utilities = require("../../../utilities/utilities");
    readFileAsync = utilities.readFileAsync;
    writeFileAsync = utilities.writeFileAsync;
    checkIfFileExistsAsync = utilities.checkIfFileExistsAsync;
    roundToPrecision = utilities.roundToPrecision;
    removeFileIfExistsAsync = utilities.removeFileIfExistsAsync;
    exists = utilities.exists;
    settingsDirFilePath = config.get("settingsPath");
    let projectFileName = (projectFilePath = config.get("projectFileName"));
    socketFilePath = config.get("netplanConfigSocketFilePath");
    projectFilePath = path.join(settingsDirFilePath, projectFileName);

    //Clearing socket file if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    //Overwriting logger action method
    logActionMock = jest.fn();
    logger.action = logActionMock;
    runIPConfigServer = true;

    initNetplanService = true;

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
    jest.resetModules();

    //Clearing socket file if exists
    await removeFileIfExistsAsync(socketFilePath);

    //Clearing project file if exists
    await removeFileIfExistsAsync(projectFilePath);

    if (ipConfigMockServer) {
      await ipConfigMockServer.Stop();
      ipConfigMockServer = null;
    }
  });

  const initTest = async () => {
    if (runIPConfigServer) {
      await ipConfigMockServer.Start();
      ipConfigMockServer._setContent(initialIPServerContent);
    }

    if (initNetplanService) await require("../../../startup/netplan")();
  };

  describe("startup - project", () => {
    let initialProjectFileContent;
    let createInitialProjectFile;

    beforeEach(async () => {
      createInitialProjectFile = true;
      initialProjectFileContent = {
        ipConfig: {
          eth1: {
            name: "eth1",
            dhcp: true,
            optional: true,
          },
          eth2: {
            name: "eth2",
            dhcp: true,
            optional: true,
          },
        },
        data: {
          testData: "testData1",
        },
      };
    });

    let exec = async () => {
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      await require("../../../startup/project")();
    };

    it("should set ip to netplanService based on project file - if project file exists and is valid", async () => {
      await exec();

      //Testing post mock function

      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(
        Object.values(initialProjectFileContent.ipConfig)
      );

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Testing ipConfig content

      let ipConfig = await netplanService.getInterfaces();

      expect(ipConfig).toEqual(initialProjectFileContent.ipConfig);
    });

    it("should set ip to netplanService based on project file but not invoke post - if project file exists and is valid and initial ipConfig is equal to netplan config", async () => {
      initialProjectFileContent.ipConfig = {};

      for (let inter of initialIPServerContent) {
        initialProjectFileContent.ipConfig[inter.name] = inter;
      }

      await exec();

      //Testing post mock function

      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Testing ipConfig content

      let ipConfig = await netplanService.getInterfaces();

      expect(ipConfig).toEqual(initialProjectFileContent.ipConfig);
    });

    //TODO - finish other tests with project startup
  });
});
