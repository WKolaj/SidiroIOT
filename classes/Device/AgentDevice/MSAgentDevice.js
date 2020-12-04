const { MindConnectAgent, retry } = require("@mindconnect/mindconnect-nodejs");
const AgentDevice = require("./AgentDevice");

const { joiSchema } = require("../../../models/Device/MSAgentDevice");
const NumberToStringConverter = require("../../NumberToStringConverter/NumberToStringConverter");
const Sampler = require("../../Sampler/Sampler");
const { exist } = require("joi");
const { exists } = require("../../../utilities/utilities");
const { isString } = require("lodash");

class MSAgentDevice extends AgentDevice {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);

    this._valueConverters = null;
    this._boardingKey = null;
    this._mindConnectAgent = null;
    this._numberOfSendDataRetries = null;
    this._numberOfSendEventRetries = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Number of send data retries
   */
  get NumberOfSendDataRetries() {
    return this._numberOfSendDataRetries;
  }

  /**
   * @description Number of send event retries
   */
  get NumberOfSendEventRetries() {
    return this._numberOfSendEventRetries;
  }

  //#endregion ========= PROPERTIES =========

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

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for initialize value converters based on dataConfig
   */
  _initValueConverters() {
    this._valueConverters = {};

    let allElementsConfig = Object.values(this.DataToSendConfig);

    for (let elementConfig of allElementsConfig) {
      let elementId = elementConfig.elementId;
      let dataConverterPayload = elementConfig.dataConverter;

      if (exists(dataConverterPayload)) {
        let converter = new NumberToStringConverter();
        converter.init(dataConverterPayload);
        this._valueConverters[elementId] = converter;
      }
    }
  }

  /**
   * @description Method for converting tickId to MindConnect timestamp string
   * @param {Number} tickId tick id to covert to string
   */
  _convertTickIdToMCTimestamp(tickId) {
    let dateTick = Sampler.convertTickNumberToDate(tickId);
    let date = new Date(dateTick);
    return date.toISOString();
  }

  /**
   * @description Method for converting payload of data to send from agent to the standard supported by Bulk MindConnect agent
   * @param {JSON} payload Standard agent data payload
   */
  _convertAgentDataSendPayloadToMCAgentPayload(payload) {
    let payloadToReturn = [];

    for (let tickId of Object.keys(payload)) {
      let valuesPayloadToAdd = [];

      let tickIdPayload = payload[tickId];
      for (let elementId of Object.keys(tickIdPayload)) {
        let elementConfig = this.DataToSendConfig[elementId];
        let elementConverter = this._valueConverters[elementId];

        let elementValue = tickIdPayload[elementId];

        if (exists(elementConfig) && exists(elementValue)) {
          let elementDatapointId = elementConfig.datapointId;

          //Adding datapointId to payload
          let valuePayloadToAdd = {
            dataPointId: elementDatapointId,
          };

          //Adding value to payload
          if (exists(elementConverter))
            valuePayloadToAdd.value = elementConverter.convertValue(
              elementValue
            );
          else valuePayloadToAdd.value = elementValue.toString();

          //Adding quality code to payload if enabled
          if (elementConfig.qualityCodeEnabled)
            valuePayloadToAdd.qualityCode = "0";

          //Adding values payload to general values
          valuesPayloadToAdd.push(valuePayloadToAdd);
        }
      }

      if (valuesPayloadToAdd.length > 0) {
        let tickPayloadToAdd = {
          timestamp: this._convertTickIdToMCTimestamp(tickId),
          values: valuesPayloadToAdd,
        };
        payloadToReturn.push(tickPayloadToAdd);
      }
    }

    return payloadToReturn;
  }

  /**
   * @description Method for converting payload of event to send from agent to the standard supported by PostEvent MindConnect agent
   * @param {Number} tickId tick id of event
   * @param {String} elementId element id to send event
   * @param {String} value value of alert
   */
  _convertAgentEventSendPayloadToMCAgentPayload(tickId, elementId, value) {
    //allow to do anything - only if all elements exists
    if (!exists(tickId) || !exists(elementId) || !exists(value)) return;

    let elementConfig = this.EventsToSendConfig[elementId];

    if (!exists(elementConfig)) return;

    //Stringinfing value if is not a string
    if (!isString(value)) value = JSON.stringify(value);

    let eventPayload = {
      entityId: elementConfig.entityId,
      sourceType: elementConfig.sourceType,
      sourceId: elementConfig.sourceId,
      source: elementConfig.source,
      severity: elementConfig.severity,
      timestamp: this._convertTickIdToMCTimestamp(tickId),
      description: value,
    };

    return eventPayload;
  }

  //#endregion  ========= PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    await super.init(payload);

    this._tryBoardOnSendData = true;
    this._tryBoardOnSendEvent = true;

    //Initializing boarding keys and MC Agent
    this._boardingKey = payload.boardingKey;
    this._mindConnectAgent = new MindConnectAgent(this._boardingKey);

    //Initializing value converters
    this._initValueConverters();

    //Initialzing number of send retries
    this._numberOfSendDataRetries = payload.numberOfSendDataRetries;
    this._numberOfSendEventRetries = payload.numberOfSendEventRetries;
  }

  /**
   * @description Method for generating payload of device.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    //Boarding key should not be assigned in payload

    superPayload.numberOfSendDataRetries = this.NumberOfSendDataRetries;
    superPayload.numberOfSendEventRetries = this.NumberOfSendEventRetries;

    return superPayload;
  }

  /**
   * @description Method for onboarding the device.
   */
  async OnBoard() {
    //On boarding and gathering data source configuration
    if (!this._mindConnectAgent.IsOnBoarded())
      await this._mindConnectAgent.OnBoard();

    if (!this._mindConnectAgent.HasDataSourceConfiguration())
      await this._mindConnectAgent.GetDataSourceConfiguration();
  }

  /**
   * @description Method for offboarding the device.
   */
  async OffBoard() {
    //MS Agent cannot be off boarded
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for REAL check if device is boarded.
   */
  async _checkIfBoarded() {
    return this._mindConnectAgent.IsOnBoarded();
  }

  /**
   * @description Method for send data (content of Clipboard).
   * @param {JSON} payload Payload of data to send
   */
  async _sendData(payload) {
    if (!exists(payload)) return;

    let payloadToSend = this._convertAgentDataSendPayloadToMCAgentPayload(
      payload
    );

    if (!exists(payloadToSend)) return;

    await retry(this.NumberOfSendDataRetries, () =>
      this._mindConnectAgent.BulkPostData(payloadToSend)
    );
  }

  /**
   * @description Method sending event. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickId tick if of event
   * @param {String} elementId it of element associated with event
   * @param {Object} value value (text) of event
   */
  async _sendEvent(tickId, elementId, value) {
    if (!exists(tickId) || !exists(elementId) || !exists(value)) return;

    let payloadToSend = this._convertAgentEventSendPayloadToMCAgentPayload(
      tickId,
      elementId,
      value
    );

    if (!exists(payloadToSend)) return;

    await retry(this.NumberOfEventFilesToSend, () =>
      this._mindConnectAgent.PostEvent(payloadToSend)
    );
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = MSAgentDevice;

//TODO - test this class
