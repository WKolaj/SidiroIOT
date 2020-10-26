const { exists } = require("../../utilities/utilities");

class Sampler {
  //#region ========= CONSTRUCTOR =========

  /**
   * @description Class representing whole app time sampler
   */
  constructor() {
    this._internalTickHandler = null;
    this._active = false;
    this._internalTickInterval = 100;
    this._lastExternalTickNumber = 0;
    this._externalTickHandler = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Is sampler active
   */
  get Active() {
    return this._active;
  }

  /**
   * @description Last external tick date
   */
  get LastExternalTickNumber() {
    return this._lastExternalTickNumber;
  }

  /**
   * @description interval in ms between internal ticks
   */
  get InternalTickInterval() {
    return this._internalTickInterval;
  }

  /**
   * @description Method invoked on every external tick, (externalTickNumber) => {}
   */
  get ExternalTickHandler() {
    return this._externalTickHandler;
  }

  /**
   * @description Method invoked on every external tick, (externalTickNumber) => {}
   */
  set ExternalTickHandler(value) {
    this._externalTickHandler = value;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PUBLIC METHODS =========

  /**
   * @description Method for starting sampling of sampler
   */
  start() {
    if (!this.Active) {
      this._internalTickHandler = setInterval(
        async () => await this._onInternalTick(),
        this._internalTickInterval
      );
      this._active = true;
    }
  }

  /**
   * @description Method for stopaping
   */
  stop() {
    if (this.Active) {
      clearInterval(this._internalTickHandler);
      this._internalTickHandler = null;
      this._active = false;
    }
  }

  //#endregion ========= PUBLIC METHODS =========

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method called every tick of Interval handler
   */
  async _onInternalTick() {
    //Invoking only if sampler is active
    if (this.Active) {
      let tickNumber = Sampler.convertDateToTickNumber(Date.now());
      if (
        this._shouldExternalTickBeEmitted(tickNumber) &&
        exists(this.ExternalTickHandler)
      ) {
        //Preventing tick method for throwing
        try {
          await this.ExternalTickHandler(tickNumber);
        } catch (err) {}
      }
    }
  }

  /**
   * @description Should tick be emitted based on last tick time?
   * @param {number} tickNumber Actual tick time
   */
  _shouldExternalTickBeEmitted(tickNumber) {
    return tickNumber !== this._lastExternalTickNumber;
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Doest TickId matches actual tick?
   * @param {number} tickNumber Actual tick
   * @param {number} sampleTime TickId to be checked
   */
  static doesSampleTimeMatchesTick(tickNumber, sampleTime) {
    return tickNumber % sampleTime === 0;
  }

  /**
   * @description Converting date to tick number
   * @param {number} date Date to be converted
   */
  static convertDateToTickNumber(date) {
    return Math.round(date / 1000);
  }

  /**
   * @description Converting tick number to date in unix
   * @param {number} tickNumber tick to be converted
   */
  static convertTickNumberToDate(tickNumber) {
    return tickNumber * 1000;
  }

  //#endregion ========= PUBLIC STATIC METHODS =========
}

module.exports = Sampler;
