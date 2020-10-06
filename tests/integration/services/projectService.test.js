const {
  createNewProjectFile,
  getProjectContentFromFile,
} = require("../../../services/projectService");

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

  describe("saveProjectContentToFile", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let contentToSaveProjectFile;

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
        data: {},
      };
      contentToSaveProjectFile = {
        ipConfig: {
          eth1: {
            name: "eth2",
            dhcp: false,
            optional: true,
            ipAddress: "10.10.10.2",
            subnetMask: "255.255.255.0",
            gateway: "10.10.10.1",
            dns: ["10.10.10.1", "1.1.1.1"],
          },
          eth2: {
            name: "eth3",
            dhcp: false,
            optional: true,
            ipAddress: "10.10.11.2",
            subnetMask: "255.255.255.0",
            gateway: "10.10.11.1",
            dns: ["10.10.11.1", "2.2.2.2"],
          },
        },
        data: {},
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

      return projectService.saveProjectContentToFile(contentToSaveProjectFile);
    };

    it("should edit project file content", async () => {
      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(contentToSaveProjectFile);
    });

    it("should edit project file content - if content is empty", async () => {
      //In the future it can change - after adding project content validation
      initialProjectFileContent = {};

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(contentToSaveProjectFile);
    });

    it("should not throw if there is no file", async () => {
      createInitialProjectFile = false;

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(contentToSaveProjectFile);
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

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is undefined", async () => {
      contentToSaveProjectFile = undefined;

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

      expect(error.message).toContain("project content must exists!");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });

    it("should throw if content is null", async () => {
      contentToSaveProjectFile = null;

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

      expect(error.message).toContain("project content must exists!");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });

  describe("createNewProjectFile", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let ipConfigContent;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = {
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
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService) await projectService.init(projectFilePath);

      await projectService.createNewProjectFile();
    };

    it("should create completely new project file with content from ipConfig - if project file already exists", async () => {
      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
      };

      for (let inter of initialIPServerContent) {
        expectedContent.ipConfig[inter.name] = inter;
      }

      expect(fileContent).toEqual(expectedContent);
    });

    it("should create completely new project file with content from ipConfig - if project file doen't exist", async () => {
      createInitialProjectFile = false;

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
      };

      for (let inter of initialIPServerContent) {
        expectedContent.ipConfig[inter.name] = inter;
      }

      expect(fileContent).toEqual(expectedContent);
    });

    it("should create completely new project file with content from ipConfig - even if netplan service is down", async () => {
      runIPConfigServer = false;

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should create completely new project file with content from ipConfig - if netplan service contains empty array of interfaces", async () => {
      initialIPServerContent = [];

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ipConfig: {},
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should throw and not create new project file - if project service was not initialized", async () => {
      createInitialProjectFile = false;
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");

      //Project file should not have been created
      let fileExists = await checkIfFileExistsAsync(projectFilePath);

      expect(fileExists).toEqual(false);
    });
  });

  describe("checkIfProjFileExistsAndIsValid", () => {
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
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService) await projectService.init(projectFilePath);

      return projectService.checkIfProjFileExistsAndIsValid();
    };

    it("should return true if project file exists and is valid", async () => {
      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return true if project file exists and ipConfig is empty", async () => {
      //CAN BE CHANGED IN THE FUTURE AFTER ADDING VALIDATION!

      initialProjectFileContent = {
        ipConfig: {},
      };

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false if project file does not exist", async () => {
      createInitialProjectFile = false;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file is not a valid JSON", async () => {
      createInitialProjectFile = false;
      //lack of ""

      await writeFileAsync(projectFilePath, "{ abcd: 1234}", "utf8");

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if project file is empty", async () => {
      createInitialProjectFile = false;
      //lack of ""

      await writeFileAsync(projectFilePath, "");

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("getIPConfig", () => {
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
      await initTest();

      if (createInitialProjectFile)
        await writeFileAsync(
          projectFilePath,
          JSON.stringify(initialProjectFileContent),
          "utf8"
        );

      if (initProjectService) await projectService.init(projectFilePath);

      return projectService.getIPConfig();
    };

    it("should return valid ipConfig", async () => {
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(initialProjectFileContent.ipConfig);
    });

    it("should return valid ipConfig - if ipConfig is empty", async () => {
      initialProjectFileContent = {
        ipConfig: {},
        data: {},
      };

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual({});
    });

    it("should throw if project file does not exists", async () => {
      createInitialProjectFile = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
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
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");
    });
  });

  describe("setIPConfig", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let ipConfigToSetContent;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = {
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
      ipConfigToSetContent = {
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth3",
          dhcp: true,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
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

      return projectService.setIPConfig(ipConfigToSetContent);
    };

    it("should set new ipConfig", async () => {
      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ...initialProjectFileContent,
        ipConfig: ipConfigToSetContent,
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should set new ipConfig - if it is an empty object", async () => {
      ipConfigToSetContent = {};

      await exec();

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedContent = {
        ...initialProjectFileContent,
        ipConfig: ipConfigToSetContent,
      };

      expect(fileContent).toEqual(expectedContent);
    });

    it("should throw if project file does not exist", async () => {
      createInitialProjectFile = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toContain("no such file or directory");

      //File should not have been created
      let fileExists = await checkIfFileExistsAsync(projectFilePath);

      expect(fileExists).toEqual(false);
    });

    it("should throw if project service was not initialized", async () => {
      initProjectService = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });

  describe("setIPConfigFromProjectToNetplan", () => {
    let initProjectService;
    let initialProjectFileContent;
    let createInitialProjectFile;
    let ipConfigToSetContent;
    let setIPContent;

    beforeEach(async () => {
      initProjectService = true;
      createInitialProjectFile = true;
      initialProjectFileContent = {
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
      ipConfigToSetContent = {
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth3",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      };
      setIPContent = true;
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

      if (setIPContent) await projectService.setIPConfig(ipConfigToSetContent);

      await projectService.setIPConfigFromProjectToNetplan();
    };

    it("should set ipConfig from projectFile to netplanFile", async () => {
      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(Object.values(ipConfigToSetContent));

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should set ipConfig from projectFile to netplanFile - if ipConfig is empty", async () => {
      ipConfigToSetContent = {};

      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(Object.values(ipConfigToSetContent));

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should not set ipConfig from projectFile to netplanFile - if ipConfig file does not exist", async () => {
      initialProjectFileContent = false;
      setIPContent = false;

      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();
    });

    it("should set ipConfig from projectFile to netplanFile - if ipConfig in netplan does not exists", async () => {
      initialIPServerContent = [];

      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).toHaveBeenCalledTimes(1);

      let expectedContent = JSON.stringify(Object.values(ipConfigToSetContent));

      expect(ipConfigMockServer.OnPostMockFn.mock.calls[0][1]).toEqual(
        expectedContent
      );

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should not set ipConfig from projectFile to netplanFile once again - if ipConfigToSet is the same as actual ipConfig in netplan", async () => {
      initialIPServerContent = [
        {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        {
          name: "eth3",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      ];

      await exec();

      //Checking fake netplan service post method
      expect(ipConfigMockServer.OnPostMockFn).not.toHaveBeenCalled();

      //Checking netplan interface content
      let interfaces = await netplanService.getInterfaces();
      expect(interfaces).toEqual(ipConfigToSetContent);
    });

    it("should not throw if netplanService is not active", async () => {
      runIPConfigServer = false;

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
      ).resolves.toBeDefined();
    });

    it("should throw if project has not been initialized", async () => {
      initProjectService = false;
      setIPContent = false;

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve();
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("project service not initialized");

      let fileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });

  describe("setIPConfigFromNetplanToProject", () => {
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
      ipConfigToSetContent = {
        eth2: {
          name: "eth2",
          dhcp: true,
          optional: true,
        },
        eth3: {
          name: "eth3",
          dhcp: false,
          optional: true,
          ipAddress: "10.10.11.2",
          subnetMask: "255.255.255.0",
          gateway: "10.10.11.1",
          dns: ["10.10.11.1"],
        },
      };
      setIPContent = true;
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

      await projectService.setIPConfigFromNetplanToProject();
    };

    it("should set ipConfig from netplan to project file", async () => {
      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }

      expect(projectFileContent.ipConfig).toEqual(expectedPayload);
    });

    it("should set ipConfig from netplan to project file - if netplan content is empty", async () => {
      initialIPServerContent = [];

      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(projectFileContent.ipConfig).toEqual({});
    });

    it("should set ipConfig to empty object - if netplan service has not started", async () => {
      runIPConfigServer = false;

      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      expect(projectFileContent.ipConfig).toEqual({});
    });

    it("should not set ipConfig - if netplan ip config is the same as ipConfig", async () => {
      initialProjectFileContent.ipConfig = {};

      for (let inter of initialIPServerContent) {
        initialProjectFileContent.ipConfig[inter.name] = inter;
      }

      await exec();

      let projectFileContent = JSON.parse(
        await readFileAsync(projectFilePath, "utf8")
      );

      let expectedPayload = {};

      for (let inter of initialIPServerContent) {
        expectedPayload[inter.name] = inter;
      }

      expect(projectFileContent.ipConfig).toEqual(expectedPayload);
    });

    it("should throw and not set ipConfig if project file does not exists", async () => {
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

      expect(error.message).toContain("no such file or directory,");

      let fileExists = await checkIfFileExistsAsync(projectFilePath);

      expect(fileExists).toEqual(false);
    });

    it("should throw and not set ipConfig if project service has not been initialized", async () => {
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

      let fileContent = JSON.parse(await readFileAsync(projectFilePath));

      expect(fileContent).toEqual(initialProjectFileContent);
    });
  });
});
