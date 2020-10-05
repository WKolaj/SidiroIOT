describe("projectService", () => {
  let _;
  let path;
  let request;
  let config;
  let jsonWebToken;
  let writeFileAsync;
  let roundToPrecision;
  let removeFileIfExistsAsync;
  let exists;
  let settingsDirFilePath;
  let socketFilePath;
  let projectFilePath;
  let logger;
  let projectService;
  let runIPConfigServer;
  let ipConfigMockServer;
  let initialIPServerContent;

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
    logger = require("../../../logger/logger");
    let utilities = require("../../../utilities/utilities");
    writeFileAsync = utilities.writeFileAsync;
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

    //Initializing netplan service
    await require("../../../startup/netplan")();

    //Overwriting logger action method
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
  };

  describe("getProjectContentFromFile", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;

    beforeEach(async () => {
      initProjectService = true;
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

      if (initProjectService) await projectService.init(projectFilePath);

      return projectService.getProjectContentFromFile();
    };

    it("should return project content from file", async () => {
      let result = await exec();

      expect(result).toEqual(initialProjectFileContent);
    });

    it("should return project content from file - if content is empty", async () => {
      initialProjectFileContent = {};

      let result = await exec();

      expect(result).toEqual(initialProjectFileContent);
    });

    it("should throw if there is no file", async () => {
      createInitialProjectFile = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("no such file or directory");
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("project service not initialized");
    });
  });

  //TODO - finish testing other methods
});
