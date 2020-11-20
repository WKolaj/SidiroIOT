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

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual(initialProjectFileContent);
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

    it("should create new project file if not exists - together with setting ip from netplan", async () => {
      createInitialProjectFile = false;

      await exec();

      //Testing post mock function - post mock fn should not have been called
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Testing get mock function - get mock fn should have been called - CAN BE CALLED SEVERAL TIMES
      expect(ipConfigMockServer.OnGetMockFn).toHaveBeenCalled();

      //Testing interfaces in project
      let ipConfig = await projectService.getIPConfig();

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }
      expect(ipConfig).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual({
        ipConfig: { ...expectedPayload },
      });

      //Testing netplan ipConfig

      let netplanIPConfig = await netplanService.getInterfaces();

      expect(netplanIPConfig).toEqual(expectedPayload);
    });

    it("should create new project file if is not valid - together with setting ip from netplan", async () => {
      createInitialProjectFile = false;

      await exec();

      //Testing post mock function - post mock fn should not have been called
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Testing get mock function - get mock fn should have been called - CAN BE CALLED SEVERAL TIMES
      expect(ipConfigMockServer.OnGetMockFn).toHaveBeenCalled();

      //Testing interfaces in project file
      let ipConfig = await projectService.getIPConfig();

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }
      expect(ipConfig).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual({
        ipConfig: { ...expectedPayload },
      });

      //Testing netplan ipConfig

      let netplanIPConfig = await netplanService.getInterfaces();

      expect(netplanIPConfig).toEqual(expectedPayload);
    });

    it("should not call post on netplanService - if ipConfig in project and in netplan are the same", async () => {
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

    it("should not throw and start project - if netplanService is not active and project file exists", async () => {
      runIPConfigServer = false;

      await exec();

      //Testing interfaces in project
      let ipConfig = await projectService.getIPConfig();

      let expectedPayload = initialProjectFileContent.ipConfig;
      expect(ipConfig).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should not throw and start project - if netplanService is not active and project file does not exist", async () => {
      runIPConfigServer = false;
      createInitialProjectFile = false;

      await exec();

      //Testing interfaces in project
      let projectContent = await projectService.getProjectContentFromFile();

      let expectedPayload = { ipConfig: {} };
      expect(projectContent).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual(expectedPayload);
    });

    it("should not throw and start project - if netplanService is not active and project file is not valid", async () => {
      runIPConfigServer = false;
      initialProjectFileContent = "[asd]dasdlsf'asd]asd";
      await exec();

      //Testing interfaces in project
      let ipConfig = await projectService.getIPConfig();

      let expectedPayload = initialProjectFileContent.ipConfig;
      expect(ipConfig).toEqual(expectedPayload);

      //Testing content of file
      let fileExists = await checkIfFileExistsAsync(
        projectService.getProjectFilePath()
      );

      expect(fileExists).toEqual(true);

      let fileContent = JSON.parse(
        await readFileAsync(projectService.getProjectFilePath())
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });
});
