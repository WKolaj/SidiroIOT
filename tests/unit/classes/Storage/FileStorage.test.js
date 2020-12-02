const FileStorage = require("../../../../classes/Storage/FileStorage");
const path = require("path");
const {
  createDirIfNotExists,
  clearDirectoryAsync,
  checkIfDirectoryExistsAsync,
  createDirAsync,
  createFileAsync,
  checkIfFileExistsAsync,
  readFileAsync,
  readDirAsync,
  hasDuplicates,
} = require("../../../../utilities/utilities");

const storageDirPath = "__testDir/fileStorage";

describe("FileStorage", () => {
  beforeEach(async () => {
    await createDirIfNotExists(storageDirPath);
    await clearDirectoryAsync(storageDirPath);
  });

  afterEach(async () => {
    await createDirIfNotExists(storageDirPath);
    await clearDirectoryAsync(storageDirPath);
  });

  describe("constructor", () => {
    let exec = () => {
      return new FileStorage();
    };

    it("should create new FileStorage and set its dirPath and bufferLength to null", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result.BufferLength).toEqual(null);
      expect(result.DirPath).toEqual(null);
    });
  });

  describe("init", () => {
    let fileStorage;
    let dirPath;
    let payload;

    beforeEach(() => {
      dirPath = path.join(storageDirPath, "testDir");
      payload = {
        dirPath: dirPath,
        bufferLength: 10,
      };
    });

    let exec = async () => {
      fileStorage = new FileStorage();
      return fileStorage.init(payload);
    };

    it("should initialize fileStorage and create directory - if dir does not exist", async () => {
      await exec();

      expect(fileStorage.BufferLength).toEqual(10),
        expect(fileStorage.DirPath).toEqual(dirPath);

      //Directory should have been created
      let dirExists = await checkIfDirectoryExistsAsync(dirPath);
      expect(dirExists).toEqual(true);
    });

    it("should initialize fileStorage and not create directory and not delete files inside it - if dir already exists", async () => {
      let initialDirPath = path.join(storageDirPath, "testDir");
      let file1Path = path.join(initialDirPath, "file1.test");
      let file2Path = path.join(initialDirPath, "file2.test");
      let file3Path = path.join(initialDirPath, "file3.test");

      let file1Content = "abcd1234";
      let file2Content = "defg5678";
      let file3Content = "hijk9876";

      await createDirAsync(initialDirPath);
      await createFileAsync(file1Path, file1Content, "utf8");
      await createFileAsync(file2Path, file2Content, "utf8");
      await createFileAsync(file3Path, file3Content, "utf8");

      await exec();

      expect(fileStorage.BufferLength).toEqual(10),
        expect(fileStorage.DirPath).toEqual(dirPath);

      //Directory should have been created
      let dirExists = await checkIfDirectoryExistsAsync(dirPath);
      expect(dirExists).toEqual(true);

      let file1Exists = await checkIfFileExistsAsync(file1Path);
      expect(file1Exists).toEqual(true);
      let file1RealContent = await readFileAsync(file1Path, "utf8");
      expect(file1Content).toEqual(file1RealContent);

      let file2Exists = await checkIfFileExistsAsync(file2Path);
      expect(file2Exists).toEqual(true);
      let file2RealContent = await readFileAsync(file2Path, "utf8");
      expect(file2Content).toEqual(file2RealContent);

      let file3Exists = await checkIfFileExistsAsync(file3Path);
      expect(file3Exists).toEqual(true);
      let file3RealContent = await readFileAsync(file3Path, "utf8");
      expect(file3Content).toEqual(file3RealContent);
    });
  });

  describe("_generateID", () => {
    let fileStorage;

    beforeEach(() => {
      fileStorage = new FileStorage();
    });

    let exec = () => {
      return fileStorage._generateID();
    };

    it("should return ID based on date and random string", () => {
      let start = Date.now();
      let result = exec();
      let stop = Date.now();

      expect(result).toBeDefined();

      expect(result.includes("-")).toEqual(true);
      let resultSplited = result.split("-");

      expect(resultSplited.length).toEqual(2);

      //Checking first part - date
      expect(parseInt(resultSplited[0]) >= start).toEqual(true);
      expect(parseInt(resultSplited[0]) <= stop).toEqual(true);

      //Checking second part - 8 sign string
      expect(resultSplited[1].length).toEqual(8);
    });

    it("should return uniq ids for more than a 100 generated ids at the same time", () => {
      let allIDs = [];

      for (let i = 0; i < 100; i++) {
        allIDs.push(exec());
      }

      expect(hasDuplicates(allIDs)).toEqual(false);
    });
  });

  describe("_getCreationDateFromId", () => {
    let fileStorage;
    let idToSplit;

    beforeEach(() => {
      fileStorage = new FileStorage();
      idToSplit = "1606330872903-abcdefgh";
    });

    let exec = () => {
      return fileStorage._getCreationDateFromId(idToSplit);
    };

    it("should date from first part of the string id", () => {
      let result = exec();

      expect(result).toEqual(1606330872903);
    });

    it("should throw if id is null", () => {
      idToSplit = null;

      expect(exec).toThrow();
    });

    it("should throw if id is not defined", () => {
      idToSplit = undefined;

      expect(exec).toThrow();
    });

    it("should throw if id is not a string", () => {
      idToSplit = 12345;

      expect(exec).toThrow();
    });
  });

  describe("getOldestDataID", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
    });

    let exec = async () => {
      for (let fileName of fileNames)
        await createFileAsync(path.join(storageDirPath, fileName), fileName);

      await fileStorage.init({
        bufferLength: 10,
        dirPath: storageDirPath,
      });

      return fileStorage.getOldestDataID(numberOfIds);
    };

    it("should return last 5 ids after sorting - if numberOfIds is 5 and there are 10 ids", async () => {
      let result = await exec();

      let expectedResult = [
        "1606330872904-abcdefgh",
        "1606330872903-abcdefgh",
        "1606330872902-abcdefgh",
        "1606330872901-abcdefgh",
        "1606330872900-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return last 1 ids after sorting - if numberOfIds is 1", async () => {
      numberOfIds = 1;

      let result = await exec();

      let expectedResult = ["1606330872900-abcdefgh"];

      expect(result).toEqual(expectedResult);
    });

    it("should return last 1 ids after sorting - if numberOfIds is not defined", async () => {
      numberOfIds = undefined;

      let result = await exec();

      let expectedResult = ["1606330872900-abcdefgh"];

      expect(result).toEqual(expectedResult);
    });

    it("should return last 3 ids after sorting - if numberOfIds is 5 and there are 3 fileNames", async () => {
      numberOfIds = 5;
      fileNames = [
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872901-abcdefgh.data",
      ];

      let result = await exec();

      let expectedResult = [
        "1606330872903-abcdefgh",
        "1606330872902-abcdefgh",
        "1606330872901-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should take into account only files with valid extensions", async () => {
      numberOfIds = 3;

      fileNames = [
        "1606330872900-abcdefgh.test",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.test",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.test",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.test",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.test",
        "1606330872906-abcdefgh.data",
      ];

      let result = await exec();

      let expectedResult = [
        "1606330872905-abcdefgh",
        "1606330872903-abcdefgh",
        "1606330872902-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return empty array  - if numberOfIds is 0", async () => {
      numberOfIds = 0;

      let result = await exec();

      let expectedResult = [];

      expect(result).toEqual(expectedResult);
    });

    it("should return all ids  - if numberOfIds is null", async () => {
      numberOfIds = null;

      let result = await exec();

      let expectedResult = [
        "1606330872909-abcdefgh",
        "1606330872908-abcdefgh",
        "1606330872907-abcdefgh",
        "1606330872906-abcdefgh",
        "1606330872905-abcdefgh",
        "1606330872904-abcdefgh",
        "1606330872903-abcdefgh",
        "1606330872902-abcdefgh",
        "1606330872901-abcdefgh",
        "1606330872900-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getNewestDataID", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
    });

    let exec = async () => {
      for (let fileName of fileNames)
        await createFileAsync(path.join(storageDirPath, fileName), fileName);

      await fileStorage.init({
        bufferLength: 10,
        dirPath: storageDirPath,
      });

      return fileStorage.getNewestDataID(numberOfIds);
    };

    it("should return first 5 ids after sorting - if numberOfIds is 5 and there are 10 ids", async () => {
      let result = await exec();

      let expectedResult = [
        "1606330872909-abcdefgh",
        "1606330872908-abcdefgh",
        "1606330872907-abcdefgh",
        "1606330872906-abcdefgh",
        "1606330872905-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return first 1 ids after sorting - if numberOfIds is 1", async () => {
      numberOfIds = 1;

      let result = await exec();

      let expectedResult = ["1606330872909-abcdefgh"];

      expect(result).toEqual(expectedResult);
    });

    it("should return first 1 ids after sorting - if numberOfIds is not defined", async () => {
      numberOfIds = undefined;

      let result = await exec();

      let expectedResult = ["1606330872909-abcdefgh"];

      expect(result).toEqual(expectedResult);
    });

    it("should return first 3 ids after sorting - if numberOfIds is 5 and there are 3 fileNames", async () => {
      numberOfIds = 5;
      fileNames = [
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872901-abcdefgh.data",
      ];

      let result = await exec();

      let expectedResult = [
        "1606330872903-abcdefgh",
        "1606330872902-abcdefgh",
        "1606330872901-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should take into account only files with valid extensions", async () => {
      numberOfIds = 3;

      fileNames = [
        "1606330872900-abcdefgh.test",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.test",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.test",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.test",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.test",
        "1606330872906-abcdefgh.data",
      ];

      let result = await exec();

      let expectedResult = [
        "1606330872909-abcdefgh",
        "1606330872906-abcdefgh",
        "1606330872905-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return empty array  - if numberOfIds is 0", async () => {
      numberOfIds = 0;

      let result = await exec();

      let expectedResult = [];

      expect(result).toEqual(expectedResult);
    });

    it("should return all ids  - if numberOfIds is null", async () => {
      numberOfIds = null;

      let result = await exec();

      let expectedResult = [
        "1606330872909-abcdefgh",
        "1606330872908-abcdefgh",
        "1606330872907-abcdefgh",
        "1606330872906-abcdefgh",
        "1606330872905-abcdefgh",
        "1606330872904-abcdefgh",
        "1606330872903-abcdefgh",
        "1606330872902-abcdefgh",
        "1606330872901-abcdefgh",
        "1606330872900-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("clearAllData", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.test",
        "1606330872902-abcdefgh.test",
        "1606330872904-abcdefgh.test",
        "1606330872905-abcdefgh.test",
        "1606330872907-abcdefgh.test",
        "1606330872909-abcdefgh.test",
        "1606330872901-abcdefgh.test",
        "1606330872903-abcdefgh.test",
        "1606330872908-abcdefgh.test",
        "1606330872906-abcdefgh.test",
      ];
    });

    let exec = async () => {
      for (let fileName of fileNames)
        await createFileAsync(path.join(storageDirPath, fileName), fileName);

      await fileStorage.init({
        bufferLength: 10,
        dirPath: storageDirPath,
      });

      return fileStorage.clearAllData();
    };

    it("should remove all files from dir", async () => {
      await exec();

      let allFiles = await readDirAsync(storageDirPath);

      expect(allFiles).toEqual([]);
    });

    it("should do nothing if there are no files", async () => {
      fileNames = [];
      await exec();

      let allFiles = await readDirAsync(storageDirPath);

      expect(allFiles).toEqual([]);
    });
  });

  describe("getAllIDs", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
    });

    let exec = async () => {
      for (let fileName of fileNames)
        await createFileAsync(path.join(storageDirPath, fileName), fileName);

      await fileStorage.init({
        bufferLength: 10,
        dirPath: storageDirPath,
      });

      return fileStorage.getAllIDs();
    };

    it("should return all fileNames without extensions", async () => {
      let result = await exec();

      let expectedResult = [
        "1606330872900-abcdefgh",
        "1606330872901-abcdefgh",
        "1606330872902-abcdefgh",
        "1606330872903-abcdefgh",
        "1606330872904-abcdefgh",
        "1606330872905-abcdefgh",
        "1606330872906-abcdefgh",
        "1606330872907-abcdefgh",
        "1606330872908-abcdefgh",
        "1606330872909-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return all fileNames only with valid extensions", async () => {
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.test",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.test",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.test",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.test",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.test",
      ];

      let result = await exec();

      let expectedResult = [
        "1606330872900-abcdefgh",
        "1606330872901-abcdefgh",
        "1606330872904-abcdefgh",
        "1606330872907-abcdefgh",
        "1606330872908-abcdefgh",
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return empty array - if there are no files", async () => {
      fileNames = [];

      let result = await exec();

      let expectedResult = [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getData", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;
    let id;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
      fileContents = [
        { test0: "value0" },
        { test2: "value2" },
        { test4: "value4" },
        { test5: "value5" },
        { test7: "value7" },
        { test9: "value9" },
        { test1: "value1" },
        { test3: "value3" },
        { test8: "value8" },
        { test6: "value6" },
      ];
      id = "1606330872904-abcdefgh";
    });

    let exec = async () => {
      for (let i = 0; i < fileNames.length; i++) {
        let fileName = fileNames[i];
        let fileContent = fileContents[i];

        await createFileAsync(
          path.join(storageDirPath, fileName),
          JSON.stringify(fileContent)
        );
      }

      await fileStorage.init({
        bufferLength: 10,
        dirPath: storageDirPath,
      });

      return fileStorage.getData(id);
    };

    it("should data from given file", async () => {
      id = "1606330872904-abcdefgh";
      let result = await exec();

      expect(result).toEqual({ test4: "value4" });
    });

    it("should null if there is no file of given id", async () => {
      id = "1606330872911-abcdefgh";
      let result = await exec();

      expect(result).toEqual(null);
    });
  });

  describe("deleteData", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;
    let id;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
      fileContents = [
        { test0: "value0" },
        { test2: "value2" },
        { test4: "value4" },
        { test5: "value5" },
        { test7: "value7" },
        { test9: "value9" },
        { test1: "value1" },
        { test3: "value3" },
        { test8: "value8" },
        { test6: "value6" },
      ];
      id = "1606330872904-abcdefgh";
    });

    let exec = async () => {
      for (let i = 0; i < fileNames.length; i++) {
        let fileName = fileNames[i];
        let fileContent = fileContents[i];

        await createFileAsync(
          path.join(storageDirPath, fileName),
          JSON.stringify(fileContent)
        );
      }

      await fileStorage.init({
        bufferLength: 10,
        dirPath: storageDirPath,
      });

      return fileStorage.deleteData(id);
    };

    it("should delete file associated with given file and return deleted payload", async () => {
      id = "1606330872904-abcdefgh";

      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      expect(result).toEqual({ test4: "value4" });
    });

    it("should not delete anything and return null - if there is no file of given id", async () => {
      id = "1606330872911-abcdefgh";

      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      expect(result).toEqual(null);
    });
  });

  describe("_setData", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;
    let id;
    let newData;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
      fileContents = [
        { test0: "value0" },
        { test2: "value2" },
        { test4: "value4" },
        { test5: "value5" },
        { test7: "value7" },
        { test9: "value9" },
        { test1: "value1" },
        { test3: "value3" },
        { test8: "value8" },
        { test6: "value6" },
      ];
      id = "1606330872910-abcdefgh";
      newData = { test10: "value10" };
    });

    let exec = async () => {
      for (let i = 0; i < fileNames.length; i++) {
        let fileName = fileNames[i];
        let fileContent = fileContents[i];

        await createFileAsync(
          path.join(storageDirPath, fileName),
          JSON.stringify(fileContent)
        );
      }

      await fileStorage.init({
        bufferLength: 10,
        dirPath: storageDirPath,
      });

      return fileStorage._setData(id, newData);
    };

    it("should create new data (file) if it not exist and return its payload", async () => {
      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872910-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(
          path.join(storageDirPath, "1606330872910-abcdefgh.data")
        )
      );

      expect(fileContent).toEqual({ test10: "value10" });

      expect(result).toEqual({ test10: "value10" });
    });

    it("should replace existing data (file) if it exists and return its new payload", async () => {
      id = "1606330872904-abcdefgh";
      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(
          path.join(storageDirPath, "1606330872904-abcdefgh.data")
        )
      );

      expect(fileContent).toEqual({ test10: "value10" });

      expect(result).toEqual({ test10: "value10" });
    });
  });

  describe("setData", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;
    let id;
    let newData;
    let payload;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
      fileContents = [
        { test0: "value0" },
        { test2: "value2" },
        { test4: "value4" },
        { test5: "value5" },
        { test7: "value7" },
        { test9: "value9" },
        { test1: "value1" },
        { test3: "value3" },
        { test8: "value8" },
        { test6: "value6" },
      ];
      id = "1606330872910-abcdefgh";
      newData = { test10: "value10" };
      payload = {
        bufferLength: 5,
        dirPath: storageDirPath,
      };
    });

    let exec = async () => {
      for (let i = 0; i < fileNames.length; i++) {
        let fileName = fileNames[i];
        let fileContent = fileContents[i];

        await createFileAsync(
          path.join(storageDirPath, fileName),
          JSON.stringify(fileContent)
        );
      }

      await fileStorage.init(payload);

      return fileStorage.setData(id, newData);
    };

    it("should create new data (file) if it not exist and return its payload and remove old files in order to meet maxBuferSize requriments", async () => {
      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872910-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(
          path.join(storageDirPath, "1606330872910-abcdefgh.data")
        )
      );

      expect(fileContent).toEqual({ test10: "value10" });

      expect(result).toEqual({ test10: "value10" });
    });

    it("should replace existing data (file) if it exists and remove old files in order to meet maxBuferSize requriments - if id is in files to delete", async () => {
      id = "1606330872904-abcdefgh";
      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      expect(result).toEqual({ test10: "value10" });
    });

    it("should replace existing data (file) if it exists and remove old files in order to meet maxBuferSize requriments - if id is not in files to delete", async () => {
      id = "1606330872906-abcdefgh";
      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(
          path.join(storageDirPath, "1606330872906-abcdefgh.data")
        )
      );

      expect(fileContent).toEqual({ test10: "value10" });

      expect(result).toEqual({ test10: "value10" });
    });

    it("should add new file and not delete previous ones - if number of files is less than buffer size", async () => {
      fileNames = [
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872910-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(
          path.join(storageDirPath, "1606330872910-abcdefgh.data")
        )
      );

      expect(fileContent).toEqual({ test10: "value10" });

      expect(result).toEqual({ test10: "value10" });
    });

    it("should leave only new file - if buffer length is 1", async () => {
      payload.bufferLength = 1;

      let result = await exec();

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = ["1606330872910-abcdefgh.data"];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(
          path.join(storageDirPath, "1606330872910-abcdefgh.data")
        )
      );

      expect(fileContent).toEqual({ test10: "value10" });

      expect(result).toEqual({ test10: "value10" });
    });

    it("should do nothing and return undefined - if newData is undefined", async () => {
      newData = undefined;

      let result = await exec();

      expect(result).toEqual(null);

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);
    });

    it("should do nothing and return null - if newData is undefined", async () => {
      newData = null;

      let result = await exec();

      expect(result).toEqual(null);

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);
    });
  });

  describe("createData", () => {
    let fileStorage;
    let numberOfIds;
    let fileNames;
    let id;
    let newData;
    let payload;

    beforeEach(() => {
      fileStorage = new FileStorage();
      numberOfIds = 5;
      fileNames = [
        "1606330872900-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872906-abcdefgh.data",
      ];
      fileContents = [
        { test0: "value0" },
        { test2: "value2" },
        { test4: "value4" },
        { test5: "value5" },
        { test7: "value7" },
        { test9: "value9" },
        { test1: "value1" },
        { test3: "value3" },
        { test8: "value8" },
        { test6: "value6" },
      ];
      id = "1606330872910-abcdefgh";
      newData = { test10: "value10" };
      payload = {
        bufferLength: 5,
        dirPath: storageDirPath,
      };
    });

    let exec = async () => {
      for (let i = 0; i < fileNames.length; i++) {
        let fileName = fileNames[i];
        let fileContent = fileContents[i];

        await createFileAsync(
          path.join(storageDirPath, fileName),
          JSON.stringify(fileContent)
        );
      }

      await fileStorage.init(payload);

      return fileStorage.createData(newData);
    };

    it("should create new data (file) assign new id to this file and return it and adjust storage to meet buferLength requriements", async () => {
      let start = Date.now();
      let result = await exec();
      let stop = Date.now();

      //Result should be a valid id
      expect(result).toBeDefined();

      expect(result.includes("-")).toEqual(true);
      let resultSplited = result.split("-");

      expect(resultSplited.length).toEqual(2);

      //Checking first part - date
      expect(parseInt(resultSplited[0]) >= start).toEqual(true);
      expect(parseInt(resultSplited[0]) <= stop).toEqual(true);

      //Checking second part - 8 sign string
      expect(resultSplited[1].length).toEqual(8);

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
        `${result}.data`,
      ];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(path.join(storageDirPath, `${result}.data`))
      );

      expect(fileContent).toEqual({ test10: "value10" });
    });

    it("should create new data (file) assign new id to this file and return it - if there are not files", async () => {
      fileNames = [];

      let start = Date.now();
      let result = await exec();
      let stop = Date.now();

      //Result should be a valid id
      expect(result).toBeDefined();

      expect(result.includes("-")).toEqual(true);
      let resultSplited = result.split("-");

      expect(resultSplited.length).toEqual(2);

      //Checking first part - date
      expect(parseInt(resultSplited[0]) >= start).toEqual(true);
      expect(parseInt(resultSplited[0]) <= stop).toEqual(true);

      //Checking second part - 8 sign string
      expect(resultSplited[1].length).toEqual(8);

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [`${result}.data`];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(path.join(storageDirPath, `${result}.data`))
      );

      expect(fileContent).toEqual({ test10: "value10" });
    });

    it("should create new data (file) assign new id to this file and return it - if there are less file then buffer length", async () => {
      fileNames = [
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
      ];

      let start = Date.now();
      let result = await exec();
      let stop = Date.now();

      //Result should be a valid id
      expect(result).toBeDefined();

      expect(result.includes("-")).toEqual(true);
      let resultSplited = result.split("-");

      expect(resultSplited.length).toEqual(2);

      //Checking first part - date
      expect(parseInt(resultSplited[0]) >= start).toEqual(true);
      expect(parseInt(resultSplited[0]) <= stop).toEqual(true);

      //Checking second part - 8 sign string
      expect(resultSplited[1].length).toEqual(8);

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872901-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        `${result}.data`,
      ];

      expect(allFiles).toEqual(expectedFiles);

      let fileContent = JSON.parse(
        await readFileAsync(path.join(storageDirPath, `${result}.data`))
      );

      expect(fileContent).toEqual({ test10: "value10" });
    });

    it("should create new data (file) that then can be retrieved - if data is a valid json", async () => {
      newData = {
        value1: "test1",
        value2: "test2",
        value3: "test3",
        value4: {
          value5: "test5",
          value6: "test6",
          value7: "test7",
        },
        value8: "test8",
        value9: "test9",
      };

      let newId = await exec();

      let readData = await fileStorage.getData(newId);

      expect(readData).toEqual(newData);
    });

    it("should create new data (file) that then can be retrieved - if data is a string", async () => {
      newData = "testString";

      let newId = await exec();

      let readData = await fileStorage.getData(newId);

      expect(readData).toEqual(newData);
    });

    it("should create new data (file) that then can be retrieved - if data is an invalid json inside string", async () => {
      newData = "{ a : 1234, b}";

      let newId = await exec();

      let readData = await fileStorage.getData(newId);

      expect(readData).toEqual(newData);
    });

    it("should do nothing and return null - if data is null", async () => {
      newData = null;

      let newId = await exec();

      expect(newId).toEqual(null);

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);
    });

    it("should do nothing and return null - if data is undefined", async () => {
      newData = undefined;

      let newId = await exec();

      expect(newId).toEqual(null);

      let allFiles = await readDirAsync(storageDirPath);

      let expectedFiles = [
        "1606330872900-abcdefgh.data",
        "1606330872901-abcdefgh.data",
        "1606330872902-abcdefgh.data",
        "1606330872903-abcdefgh.data",
        "1606330872904-abcdefgh.data",
        "1606330872905-abcdefgh.data",
        "1606330872906-abcdefgh.data",
        "1606330872907-abcdefgh.data",
        "1606330872908-abcdefgh.data",
        "1606330872909-abcdefgh.data",
      ];

      expect(allFiles).toEqual(expectedFiles);
    });
  });
});
