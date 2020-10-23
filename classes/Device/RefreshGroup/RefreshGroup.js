const logger = require("../../../logger/logger");

class RefreshGroup {
  //#region ========= CONSTRUCTOR =========

  /**
   * @description Class representing group of devices that should not be refreshed simuntaneusly
   * @param {String} id id of group
   * @param {Array} devices collection of devices associated with this group
   */
  constructor(id, devices) {
    this._id = id;

    //fill devices
    this._devices = {};
    for (let dev of devices) this._devices[dev.ID] = dev;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description ID of group
   */
  get ID() {
    return this._id;
  }

  /**
   * @description Devices associated with this group
   */
  get Devices() {
    return this._devices;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for getting a Promise to refresh group - in order to invoke it in Promise.all block
   * @param {Number} tickId tick number
   */
  createRefreshPromise(tickId) {
    //Getting this as self - in order to prevent lack of this;
    let self = this;

    return new Promise(async (resolve) => {
      for (let device of self.Devices) {
        //Ensuring to keep running in case one of device refresh throws
        try {
          //Refreshing device one after another
          await device.refresh(tickId);
        } catch (err) {
          //Logging error in case there is one
          logger.warn(err.message, err);
        }
      }

      return resolve();
    });
  }

  //#endregion ========= PUBLIC METHODS =========
}

module.exports = RefreshGroup;
