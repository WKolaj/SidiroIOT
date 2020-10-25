const logger = require("../../logger/logger");

class Device {
  //#region ========= PROPERTIES =========

  /**
   * @description ID of device
   */
  get ID() {
    return this._id;
  }

  /**
   * @description Type of device
   */
  get Type() {
    return this._type;
  }

  /**
   * @description Name of device
   */
  get Name() {
    return this._name;
  }

  /**
   * @description All elements of device - variables, calcElements and alerts
   */
  get Elements() {
    return { ...this.Variables, ...this.CalcElements, ...this.Alerts };
  }

  /**
   * @description All variables of device
   */
  get Variables() {
    return this._variables;
  }

  /**
   * @description All calcElements of device
   */
  get CalcElements() {
    return this._calcElements;
  }

  /**
   * @description All alerts of device
   */
  get Alerts() {
    return this._alerts;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC VIRTUAL METHODS =========

  async load(payload) {
    this._id = payload.id;
    this._name = payload.name;
    this._type = payload.type;

    //TODO - add mechanism to add variables, calcElement and alerts
  }

  /**
   * @description Method for refreshing device - invoked per tick. By default refreshes variables, calcElements and alerts. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickNumber tick number of actual date
   */
  async refresh(tickNumber) {
    try {
      await this._refreshVariables(tickNumber);
    } catch (err) {
      logger.warn(err.message, err);
    }
    try {
      await this._refreshCalcElements(tickNumber);
    } catch (err) {
      logger.warn(err.message, err);
    }
    try {
      await this._refreshAlerts(tickNumber);
    } catch (err) {
      logger.warn(err.message, err);
    }
  }

  //#endregion ========= PUBLIC VIRTUAL METHODS =========

  //#region ========= PRIVATE VIRTUAL METHODS =========

  /**
   * @description Method for refreshing all calc elements - one by one. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickNumber tick number of actual date
   */
  async _refreshCalcElements(tickNumber) {
    //Refreshing all calc elements one by one
    for (let calcElement of Object.values(this.CalcElements)) {
      try {
        await calcElement.refresh(tickNumber);
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  /**
   * @description Method for refreshing all alerts - one by one. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickNumber tick number of actual date
   */
  async _refreshAlerts(tickNumber) {
    //Refreshing all calc elements one by one
    for (let alert of Object.values(this.Alerts)) {
      try {
        await alert.refresh(tickNumber);
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  //#endregion ========= PRIVATE VIRTUAL METHODS =========

  //#region ========= PRIVATE ABSTRACT METHODS =========

  /**
   * @description Method for refreshing variables of device - invoked per tick. HAS TO BE OVERRIDE IN CHILD CLASSES!
   * @param {Number} tickNumber tick number of actual date
   */
  async _refreshVariables(tickNumber) {}

  //#endregion ========= PRIVATE ABSTRACT METHODS =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly. HAS TO BE OVERRIDE IN CHILD CLASSES!
   */
  getRefreshGroupID() {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========
}

module.exports = Device;
