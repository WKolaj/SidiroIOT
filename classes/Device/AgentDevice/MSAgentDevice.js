const { snooze } = require("../../../utilities/utilities");
const Sampler = require("../../Sampler/Sampler");
const AgentDevice = require("./AgentDevice");

const { joiSchema } = require("../../../models/Device/MSAgentDevice");

class MSAgentDevice extends AgentDevice {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for checking if payload is a valid device payload. Returns null if yes. Returns message if not.
   * @param {JSON} payload Payload to check
   */
  static validatePayload(payload) {
    let result = joiSchema.validate(payload);
    if (result.error) return result.error.details[0].message;
    else return null;
  }

  //#endregion  ========= PUBLIC STATIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    await super.init(payload);

    this._tryBoardOnSendData = true;
    this._tryBoardOnSendEvent = true;

    //TODO - adjust later

    //TODO FLAG PURELY FOR TESTING - RETURN LATER
    this._fakeBoarded = false;
  }

  /**
   * @description Method for generating payload of device.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    //TODO - adjust later
    return superPayload;
  }

  /**
   * @description Method for onboarding the device.
   */
  async OnBoard() {
    //TODO - adjust later
    await snooze(100);
    this._fakeBoarded = true;
  }

  /**
   * @description Method for offboarding the device.
   */
  async OffBoard() {
    //TODO - adjust later
    await snooze(100);
    this._fakeBoarded = false;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for REAL check if device is boarded.
   */
  async _checkIfBoarded() {
    //TODO - adjust later
    return this._fakeBoarded;
  }

  /**
   * @description Method for send data (content of Clipboard).
   * @param {JSON} payload Payload of data to send
   */
  async _sendData(payload) {
    //TODO - adjust later
    //throw new Error("test");
    let currentDate = Sampler.convertDateToTickNumber(Date.now());
    console.log(`${currentDate} - sending data:`);
    console.log(payload);
  }

  /**
   * @description Method sending event. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickId tick if of event
   * @param {String} elementId it of element associated with event
   * @param {Object} value value (text) of event
   */
  async _sendEvent(tickId, elementId, value) {
    //TODO - adjust later
    //throw new Error("test");
    let currentDate = Sampler.convertDateToTickNumber(Date.now());
    console.log(`${currentDate} - sending event:`);
    console.log({ tickId, elementId, value });
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = MSAgentDevice;
