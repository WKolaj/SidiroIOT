const { generateRandomString, exists } = require("../../utilities/utilities");

class Storage {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._bufferLength = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Maximum length of data to store
   */
  get BufferLength() {
    return this._bufferLength;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for setting data in storage. Used for creating new data or to update existing one. Deletes oldest data in case there are more data than buffer limit
   * @param {String} id id of data
   * @param {JSON} payload payload of data
   */
  async setData(id, payload) {
    if (!exists(payload)) return null;

    //Setting new data
    await this._setData(id, payload);

    //Checking if last data exist and remove it - in case it does exist
    let allIds = await this.getAllIDs();

    if (allIds.length > this.BufferLength) {
      //Calculating how many data should be deleted and delete them
      let numberOdIdsToDelete = allIds.length - this.BufferLength;
      let idsToDelete = await this.getOldestDataID(numberOdIdsToDelete);
      for (let idToDelete of idsToDelete) await this.deleteData(idToDelete);
    }

    return payload;
  }

  /**
   * @description Method for create new data and save it in storage. Deletes oldest data in case there are more data than buffer limit. RETURNS GENERATED ID. CAN BE OVERRIDDEN IN CHILD CLASSES
   * @param {JSON} payload payload of data
   */
  async createData(payload) {
    if (!exists(payload)) return null;
    //Generating new id
    let id = this._generateID();
    //Setting new data
    await this.setData(id, payload);

    return id;
  }

  //#endregion ========= PUBLIC METHODS =========

  //#region ========= VIRTUAL PUBLIC METHODS =========

  /**
   * @description Method for deleting all data from storage. By default calls deleteData for every id. CAN BE OVERRIDEN IN CHILD CLASSES - performance
   */
  async clearAllData() {
    let allIds = await this.getAllIDs();
    for (let idToDelete of allIds) await this.deleteData(idToDelete);
  }

  /**
   * @description Method for getting oldest ids from storage. Returns number of ids in argument. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} numberOfIds number of ids to delete. By default only one id should be returned.
   */
  async getOldestDataID(numberOfIds = 1) {
    //if number of ids is 0 - return empty array
    if (numberOfIds === 0) return [];

    let allData = await this.getAllIDs();

    //Sorting all ids
    let sortMethod = this._getCreationDateFromId;
    let sortedData = allData.sort((id1, id2) => {
      return sortMethod(id2) - sortMethod(id1);
    });

    //returning number of elements from the last one
    return sortedData.slice(-numberOfIds);
  }

  /**
   * @description Method for getting newest ids from storage. Returns number of ids in argument. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} numberOfIds number of ids
   */
  async getNewestDataID(numberOfIds = 1) {
    //if number of ids is 0 - return empty array
    if (numberOfIds === 0) return [];

    let allData = await this.getAllIDs();

    //Sorting all ids
    let sortMethod = this._getCreationDateFromId;
    let sortedData = allData.sort((id1, id2) => {
      return sortMethod(id2) - sortMethod(id1);
    });

    if (!exists(numberOfIds)) return sortedData;

    //returning number of elements from the last one
    return sortedData.slice(0, numberOfIds);
  }

  //#endregion ========= VIRTUAL PUBLIC METHODS =========

  //#region ========= VIRTUAL PRIVATE METHODS =========

  /**
   * @description Method for generating id
   */
  _generateID() {
    let currentDate = Math.round(Date.now());

    let postfix = generateRandomString(8);

    return `${currentDate}-${postfix}`;
  }

  /**
   * @description Method for getting date from id. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {String} id ID to get date from
   */
  _getCreationDateFromId(id) {
    //id is 23541231254-asaasads
    //where first part is a date

    var firstMinusPosition = id.indexOf("-");
    if (firstMinusPosition === -1) return parseInt(id);
    else return parseInt(id.substr(0, firstMinusPosition));
  }

  //#endregion ========= VIRTUAL PRIVATE METHODS =========

  //#region ========= ABSTRACT PUBLIC METHODS =========

  /**
   * @description Method for initializing storage
   * @param {JSON} payload initialization payload. MUST BE OVERRIDDEN IN CHILD CLASSES
   */
  async init(payload) {
    this._bufferLength = payload.bufferLength;
  }

  /**
   * @description Method for getting all ids of data from storage. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  async getAllIDs() {}

  /**
   * @description Method for getting data of given id. Returns null if there are not data of given id. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {String} id id of data to get
   */
  async getData(id) {}

  /**
   * @description Method for deleting data of given id. Returns null if there are not data of given id or deleted data otherwise. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {String} id id of data to delete
   */
  async deleteData(id) {}

  //#endregion ========= ABSTRACT PUBLIC METHODS =========

  //#region ========= ABSTRACT PRIVATE METHODS =========

  /**
   * @description Method for setting data into storage. Returns data that has been set. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {String} id id to set data
   * @param {JSON} payload content of data to set
   */
  async _setData(id, payload) {}

  //#endregion ========= ABSTRACT PRIVATE METHODS =========
}

module.exports = Storage;
