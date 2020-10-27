class RequestManager {
  //#region========= CONSTRUCTOR =========

  constructor() {
    this._requests = [];
  }

  //#endregion========= CONSTRUCTOR =========

  //#region========= PROPERTIES =========

  /**
   * @description All created requests
   */
  get Requests() {
    return this._requests;
  }

  //#endregion========= PROPERTIES =========

  //#region========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for creating requests out of collection of variables. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Array} variables collection of variable to create request from
   */
  async createRequests(variables) {}

  //#endregion========= PUBLIC ABSTRACT METHODS =========
}

module.exports = RequestManager;

//TODO - test request manager
