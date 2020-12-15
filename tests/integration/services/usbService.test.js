const {
  checkIfDirectoryExistsAsync,
  clearDirectoryAsync,
  createDirAsync,
  createDirIfNotExists,
  createFileAsync,
  snooze,
  writeFileAsync,
  removeDirectoryAsync,
} = require("../../../utilities/utilities");

const usbDirPath = "__testDir/usb";
const usbDirPath1 = "__testDir/usb/usb1";
const usbDirPath2 = "__testDir/usb/usb2";
const usbDirPath3 = "__testDir/usb/usb3";

describe("projectService", () => {
  let usb;
  let usbService;
  let projectService;
  let logger;
  let loggerInfoMockFunc;
  let loggerWarnMockFunc;
  let loggerErrorMockFunc;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();

    let usbDirExists = await checkIfDirectoryExistsAsync(usbDirPath);
    if (usbDirExists) await clearDirectoryAsync(usbDirPath);

    await createDirIfNotExists(usbDirPath);
    await createDirIfNotExists(usbDirPath1);
    await createDirIfNotExists(usbDirPath2);
    await createDirIfNotExists(usbDirPath3);

    usb = require("usb");
    usbService = require("../../../services/usbService");
    projectService = require("../../../services/projectService");

    logger = require("../../../logger/logger");
    loggerInfoMockFunc = jest.fn();
    loggerWarnMockFunc = jest.fn();
    loggerErrorMockFunc = jest.fn();

    logger.info = loggerInfoMockFunc;
    logger.warn = loggerWarnMockFunc;
    logger.error = loggerErrorMockFunc;
  });

  afterEach(async () => {
    let usbDirExists = await checkIfDirectoryExistsAsync(usbDirPath);
    if (usbDirExists) await clearDirectoryAsync(usbDirPath);
  });

  describe("handle usb attach", () => {
    let initUSBService;
    let startUSBService;

    let createFileDelay;
    let filePath;
    let createFile;
    let fileContent;
    let invokeAttachSimuntaneusly;
    let createInvalidFileContent;

    let validateProjectPayloadMockFunc;
    let saveProjectContentToFileMockFunc;
    let loadProjectFileMockFunc;
    let validateProjectPayloadMockResult;

    beforeEach(() => {
      invokeAttachSimuntaneusly = false;
      createInvalidFileContent = false;
      filePath = "__testDir/usb/usb1/projectSettings.json";
      fileContent = { a: 1, b: 2, c: 3 };
      createFile = true;
      initUSBService = true;
      startUSBService = true;
      createFileDelay = 150;

      validateProjectPayloadMockResult = null;
      validateProjectPayloadMockFunc = jest.fn(() => {
        return validateProjectPayloadMockResult;
      });

      saveProjectContentToFileMockFunc = jest.fn();

      loadProjectFileMockFunc = jest.fn();
    });

    afterEach(async () => {
      //Waiting for file to be created for sure and process end
      await snooze(createFileDelay);
    });

    let exec = async () => {
      projectService.validateProjectPayload = validateProjectPayloadMockFunc;
      projectService.saveProjectContentToFile = saveProjectContentToFileMockFunc;
      projectService.loadProjectFile = loadProjectFileMockFunc;

      if (initUSBService) usbService.init();
      if (startUSBService) usbService.start();

      let createFileFunc = async () => {
        await snooze(createFileDelay);
        if (!createInvalidFileContent)
          await writeFileAsync(filePath, JSON.stringify(fileContent), "utf8");
        else await writeFileAsync(filePath, "acasdasdasd", "utf8");
      };
      if (createFile) createFileFunc();

      if (invokeAttachSimuntaneusly)
        return Promise.all([usb._invokeOnAttach(), usb._invokeOnAttach()]);
      return usb._invokeOnAttach();
    };

    it("should reload project - if project file exists, it is valid and delay of file creation is shorter than 3 * timeout", async () => {
      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledBefore(
        saveProjectContentToFileMockFunc
      );
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledBefore(
        loadProjectFileMockFunc
      );

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should reload project again (busy check should be set to false) - if invokeOnAttach is invoked again", async () => {
      await exec();
      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(2);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(2);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(2);

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(validateProjectPayloadMockFunc.mock.calls[1][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[1][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(4);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
      expect(loggerInfoMockFunc.mock.calls[2][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[3][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project - if project file does not exist", async () => {
      createFile = false;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();
    });

    it("should not reload project but reload project again (busy check should be set to false)  - if project file does not exist", async () => {
      createFile = false;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();

      await writeFileAsync(filePath, JSON.stringify(fileContent), "utf8");

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project - if dirs do not exist", async () => {
      await removeDirectoryAsync(usbDirPath1);
      await removeDirectoryAsync(usbDirPath2);
      await removeDirectoryAsync(usbDirPath3);

      createFile = false;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();
    });

    it("should not reload project but reload project again (busy check should be set to false)  - if dirs do not exist", async () => {
      await removeDirectoryAsync(usbDirPath1);
      await removeDirectoryAsync(usbDirPath2);
      await removeDirectoryAsync(usbDirPath3);
      createFile = false;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();

      await createDirAsync(usbDirPath1);
      await createDirAsync(usbDirPath2);
      await createDirAsync(usbDirPath3);

      await writeFileAsync(filePath, JSON.stringify(fileContent), "utf8");

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project - if usbService is not initialized", async () => {
      initUSBService = false;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();
    });

    it("should not reload project but reload project again (busy check should be set to false)  - if usbService is not initialized", async () => {
      initUSBService = false;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();

      //Waiting for the file to be created - to perform test again
      await snooze(2 * createFileDelay);

      usbService.init();
      //start is not called if not initialized
      usbService.start();

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project two times - only one time thanks to busy - if attach is invoked two times simuntaneuslt", async () => {
      invokeAttachSimuntaneusly = true;

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledBefore(
        saveProjectContentToFileMockFunc
      );
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledBefore(
        loadProjectFileMockFunc
      );

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );
      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project two times and be able reload project again (busy check should be set to false)  - if usbService is not initialized - if attach is invoked two times simuntaneuslt", async () => {
      invokeAttachSimuntaneusly = true;

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledBefore(
        saveProjectContentToFileMockFunc
      );
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledBefore(
        loadProjectFileMockFunc
      );

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(2);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(2);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(2);

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(4);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
      expect(loggerInfoMockFunc.mock.calls[2][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[3][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project - if project file content is not a valid JSON", async () => {
      createInvalidFileContent = true;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();
    });

    it("should not reload project but reload project again (busy check should be set to false) - if project file content is not a valid JSON", async () => {
      createInvalidFileContent = true;

      await exec();

      expect(validateProjectPayloadMockFunc).not.toHaveBeenCalled();
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      //logger methods should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();

      await writeFileAsync(filePath, JSON.stringify(fileContent), "utf8");

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project - if validateProject returns a validation message", async () => {
      validateProjectPayloadMockResult = "test validation error";

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();

      expect(loggerWarnMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerWarnMockFunc.mock.calls[0][0]).toEqual(
        "Invalid project file read from usb!"
      );
    });

    it("should not reload project but reload project again (busy check should be set to false) - if validateProject returns a validation message", async () => {
      validateProjectPayloadMockResult = "test validation error";

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).not.toHaveBeenCalled();
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(loggerErrorMockFunc).not.toHaveBeenCalled();
      expect(loggerInfoMockFunc).not.toHaveBeenCalled();

      expect(loggerWarnMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerWarnMockFunc.mock.calls[0][0]).toEqual(
        "Invalid project file read from usb!"
      );

      validateProjectPayloadMockResult = null;

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(2);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(loggerWarnMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerErrorMockFunc).not.toHaveBeenCalled();

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project - if saveProjectContentToFile throws", async () => {
      saveProjectContentToFileMockFunc = jest.fn(() => {
        throw Error("testError");
      });

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      expect(loggerWarnMockFunc).not.toHaveBeenCalled();

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );

      expect(loggerErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerErrorMockFunc.mock.calls[0][0]).toEqual("testError");
    });

    it("should not reload project but reload project again (busy check should be set to false)  - if saveProjectContentToFile throws", async () => {
      let invokeCounter = 0;
      saveProjectContentToFileMockFunc = jest.fn(() => {
        invokeCounter++;
        //throwing an error only for coutner lesser than 1
        if (invokeCounter <= 1) throw Error("testError");
      });

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).not.toHaveBeenCalled();

      expect(loggerWarnMockFunc).not.toHaveBeenCalled();

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );

      expect(loggerErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerErrorMockFunc.mock.calls[0][0]).toEqual("testError");

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(2);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(2);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledBefore(
        saveProjectContentToFileMockFunc
      );
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledBefore(
        loadProjectFileMockFunc
      );

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(validateProjectPayloadMockFunc.mock.calls[1][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[1][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).toHaveBeenCalledTimes(1);

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(3);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[2][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });

    it("should not reload project - if loadProjectFile throws", async () => {
      loadProjectFileMockFunc = jest.fn(() => {
        throw Error("testError");
      });

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(loggerWarnMockFunc).not.toHaveBeenCalled();

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );

      expect(loggerErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerErrorMockFunc.mock.calls[0][0]).toEqual("testError");
    });

    it("should not reload project but reload project again (busy check should be set to false)  - if loadProjectFile throws", async () => {
      let invokeCounter = 0;
      loadProjectFileMockFunc = jest.fn(() => {
        invokeCounter++;
        //throwing an error only for coutner lesser than 1
        if (invokeCounter <= 1) throw Error("testError");
      });

      await exec();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(1);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(1);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(1);

      expect(loggerWarnMockFunc).not.toHaveBeenCalled();

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );

      expect(loggerErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(loggerErrorMockFunc.mock.calls[0][0]).toEqual("testError");

      await usb._invokeOnAttach();

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledTimes(2);
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledTimes(2);
      expect(loadProjectFileMockFunc).toHaveBeenCalledTimes(2);

      expect(validateProjectPayloadMockFunc).toHaveBeenCalledBefore(
        saveProjectContentToFileMockFunc
      );
      expect(saveProjectContentToFileMockFunc).toHaveBeenCalledBefore(
        loadProjectFileMockFunc
      );

      expect(validateProjectPayloadMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[0][0]).toEqual(
        fileContent
      );

      expect(validateProjectPayloadMockFunc.mock.calls[1][0]).toEqual(
        fileContent
      );

      expect(saveProjectContentToFileMockFunc.mock.calls[1][0]).toEqual(
        fileContent
      );

      //logger error and warn method should not have been invoked
      expect(loggerWarnMockFunc).not.toHaveBeenCalled();
      expect(loggerErrorMockFunc).toHaveBeenCalledTimes(1);

      //logger info method should have been called

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(3);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "Reading project from usb file!"
      );
      expect(loggerInfoMockFunc.mock.calls[2][0]).toEqual(
        "Project loaded from usb successfully!"
      );
    });
  });
});
