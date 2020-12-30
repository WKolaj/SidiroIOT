describe("logService", () => {
  let logDirPath;
  let logService;
  let utilities;

  beforeEach(async () => {
    jest.resetModules();
    jest.resetAllMocks();

    logService = require("../../../services/logService");
    utilities = require("../../../utilities/utilities");

    //Clearing logs directory
    logDirPath = "__testDir/logs";
    await utilities.clearDirectoryAsync(logDirPath);
  });

  describe("getLastLogFileContent", () => {
    let dirPath;
    let fileName;
    let fileExtension;
    let initService;
    let filesToCreatePaths;
    let filesToCreateContents;

    beforeEach(async () => {
      dirPath = logDirPath;
      fileName = "info";
      fileExtension = ".log";
      initService = true;
      filesToCreatePaths = [
        `${dirPath}/info1.log`,
        `${dirPath}/info2.log`,
        `${dirPath}/info3.log`,
        `${dirPath}/error1.log`,
        `${dirPath}/error2.log`,
        `${dirPath}/error3.log`,
        `${dirPath}/warn1.log`,
        `${dirPath}/warn2.log`,
        `${dirPath}/warn3.log`,
        `${dirPath}/fakeLogFile1.txt`,
        `${dirPath}/fakeLogFile2.txt`,
        `${dirPath}/fakeLogFile3.txt`,
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
        await utilities.snooze(100);

        await utilities.createFileAsync(filePath, fileContent);
      }

      if (initService) await logService.init(dirPath, fileName, fileExtension);

      return logService.getLastLogFileContent();
    };

    it("should return content of log file from log dir of youngest modification date", async () => {
      let result = await exec();

      expect(result).toEqual(`Content of log file - 3`);
    });

    it("should return null if there are no files", async () => {
      filesToCreatePaths = [];
      filesToCreateContents = [];

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return empty string - if content of file is an empty string", async () => {
      filesToCreateContents[2] = "";

      let result = await exec();

      expect(result).toEqual("");
    });

    it("should return null if directory does not exist", async () => {
      dirPath = "fakeDirName";
      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should throw if service was not initialized properly", async () => {
      initService = false;

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

      expect(error.message).toEqual(
        "Log service not initialized or not initialized properly!"
      );
    });

    it("should throw if service was initialized with null path", async () => {
      dirPath = null;

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

      expect(error.message).toEqual(
        "Log service not initialized or not initialized properly!"
      );
    });

    it("should throw if service was initialized with null file name", async () => {
      fileName = null;

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

      expect(error.message).toEqual(
        "Log service not initialized or not initialized properly!"
      );
    });

    it("should throw if service was initialized with null file extension", async () => {
      fileExtension = null;

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

      expect(error.message).toEqual(
        "Log service not initialized or not initialized properly!"
      );
    });
  });
});
