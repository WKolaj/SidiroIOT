class Device {
  //#region ========= PROPERTIES =========

  /**
   * @description ID of device
   */
  get ID() {
    return this._id;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for refreshing device - invoked per tick. HAS TO BE OVERRIDE IN CHILD CLASSES!
   * @param {Number} tickNumber tick number of actual date
   */
  async refresh(tickNumber) {}

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly. HAS TO BE OVERRIDE IN CHILD CLASSES!
   */
  getRefreshGroupID() {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========
}

module.exports = Device;
