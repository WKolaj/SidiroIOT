const Storage = require("./Storage");
const path = require("path");
const {
  createDirIfNotExists,
  clearDirectoryAsync,
  readDirAsync,
  removeExtensionFromFileName,
  checkIfFileExistsAsync,
  readFileAsync,
  removeFileOrDirectoryAsync,
  removeFileIfExistsAsync,
  writeFileAsync,
} = require("../../utilities/utilities");
const logger = require("../../logger/logger");

const fileExtension = "data";

class FileStorage extends Storage {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    super();
    this._dirPath = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Maximum length of data to store
   */
  get DirPath() {
    return this._dirPath;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PRIVATE METHODS =========

  async _createDirIfNotExists() {
    return createDirIfNotExists(this.DirPath);
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for deleting all data from storage. By default calls deleteData for every id. CAN BE OVERRIDEN IN CHILD CLASSES - performance
   */
  async clearAllData() {
    await clearDirectoryAsync(this.DirPath);
  }

  /**
   * @description Method for initializing storage
   * @param {JSON} payload initialization payload.
   */
  async init(payload) {
    await super.init(payload);

    //Setting dir path and create it if not exist
    this._dirPath = payload.dirPath;
    await this._createDirIfNotExists();
  }

  /**
   * @description Method for getting all ids of data from storage. Returns all file names.
   */
  async getAllIDs() {
    //Returning all file names without extensions - from directory
    let allFiles = await readDirAsync(this.DirPath);
    return allFiles.map((fileName) => removeExtensionFromFileName(fileName));
  }

  /**
   * @description Method for getting data of given id. Returns null if there are not data of given id.
   * @param {String} id id of data to get
   */
  async getData(id) {
    //Checking if file exists
    let filePath = path.join(this.DirPath, `${id}.${fileExtension}`);
    let fileExists = await checkIfFileExistsAsync(filePath);
    if (!fileExists) return null;

    //Reading file content and parsing it as a JSON
    let fileContent = await readFileAsync(filePath);
    let fileJSONContent = JSON.parse(fileContent);
    return fileJSONContent;
  }

  /**
   * @description Method for deleting data of given id. Returns null if there are not data of given id or deleted data otherwise.
   * @param {String} id id of data to delete
   */
  async deleteData(id) {
    //Checking if file exists
    let filePath = path.join(this.DirPath, `${id}.${fileExtension}`);
    let fileExists = await checkIfFileExistsAsync(filePath);
    if (!fileExists) return null;

    //Reading file content and parsing it as a JSON
    let fileContent = await readFileAsync(filePath, "utf8");
    let fileJSONContent = JSON.parse(fileContent);

    //Removing data file
    await removeFileOrDirectoryAsync(filePath);
    return fileJSONContent;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for setting data into storage. Returns data that has been set. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {String} id id to set data
   * @param {JSON} payload content of data to set
   */
  async _setData(id, payload) {
    //Removing file if exists
    let filePath = path.join(this.DirPath, `${id}.${fileExtension}`);
    await removeFileIfExistsAsync(filePath);

    //Writing data to file
    await writeFileAsync(filePath, JSON.stringify(payload), "utf8");

    return payload;
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = FileStorage;

//TODO - TEST IF ERRORS THROWS!
