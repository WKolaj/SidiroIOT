const mqtt = require("async-mqtt");
const AgentDevice = require("./AgentDevice");

const { joiSchema } = require("../../../models/Device/MSMQTTAgentDevice");
const NumberToStringConverter = require("../../NumberToStringConverter/NumberToStringConverter");
const Sampler = require("../../Sampler/Sampler");
const {
  exists,
  isObjectEmpty,
  replaceAll,
} = require("../../../utilities/utilities");
const { isString } = require("lodash");

const MQTTPort = 1883;
const MQTTHost = "mciotextension.eu1.mindsphere.io";
const MQTTProtocol = "mqtt/tcp";

class MSMQTTAgentDevice extends AgentDevice {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);

    this._valueConverters = null;
    this._mqttClient = null;
    this._mqttName = null;
    this._clientId = null;
    this._checkStateInterval = null;
    this._model = null;
    this._revision = null;
    this._tenantName = null;
    this._userName = null;
    this._userPassword = null;
    this._serialNumber = null;
    this._mqttMessagesLimit = null;
    this._qos = null;
    this._publishTimeout = null;
    this._connectTimeout = null;

    //Flag for determining whether device was boarded before
    this._deviceCreatedViaMQTT = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Name of device
   */
  get MQTTName() {
    return this._mqttName;
  }

  /**
   * @description MQTT ID of device
   */
  get ClientId() {
    return this._clientId;
  }

  /**
   * @description Interval between checks if device is connected from server side
   */
  get CheckStateInterval() {
    return this._checkStateInterval;
  }

  /**
   * @description Model of device
   */
  get Model() {
    return this._model;
  }

  /**
   * @description Revision of device software
   */
  get Revision() {
    return this._revision;
  }

  /**
   * @description SerialNumber of device
   */
  get SerialNumber() {
    return this._serialNumber;
  }

  /**
   * @description Limit of rows of SmartREST commands to send in one request
   */
  get MQTTMessagesLimit() {
    return this._mqttMessagesLimit;
  }

  /**
   * @description Name of MindSphere tenant
   */
  get TenantName() {
    return this._tenantName;
  }

  /**
   * @description QoS used for publishing data and events
   */
  get QoS() {
    return this._qos;
  }

  /**
   * @description Timeout of publish method for data and events
   */
  get PublishTimeout() {
    return this._publishTimeout;
  }

  /**
   * @description Timeout of connect method
   */
  get ConnectTimeout() {
    return this._connectTimeout;
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

  /**
   * @description Method for normalizing string to send via smartRest - eg. change , to .
   * @param {string} stringToNormalize string to normalize
   */
  static normalizeStringToSendViaSmartREST(stringToNormalize) {
    if (!exists(stringToNormalize)) return "";
    //Changing " to '"'
    let convertedString = replaceAll(stringToNormalize, `"`, `""`);

    //Whole string should inserted inside " "
    convertedString = `"${convertedString}"`;

    return convertedString;
  }

  /**
   * @description Method for converting mindsphere severity to mqtt severity
   * @param {number} severity MindSphere severity
   */
  static normalizeMindConnectSeverity(severity) {
    /**
     *
     * MindConnect Exentsion:
     * Template 301 creates a critical alarm.
     * Template 302 creates a major alarm.
     * Template 303 creates a minor alarm.
     * Template 304 creates a warning alarm.
     *
     * MindConnectLib:
     * 0-99 : 20:error, 30:warning, 40: information
     *
     */

    if (severity <= 20) return 301;
    if (severity <= 30) return 302;
    if (severity <= 40) return 303;

    return 304;
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
   * @description Method for converting tickId to MQTT timestamp string
   * @param {Number} tickId tick id to covert to string
   */
  _convertTickIdToMQTTTimestamp(tickId) {
    let dateTick = Sampler.convertTickNumberToDate(tickId);
    let date = new Date(dateTick);
    return date.toISOString();
  }

  /**
   * @description Method for creating one line MQTT SmartREST command
   * @param {JSON} elementConfig
   * @param {Object} value
   * @param {number} tickId
   */
  _createMQTTSendValueCommand(elementId, value, tickId) {
    if (!exists(elementId) || !exists(value) || !exists(tickId)) return null;

    let elementConfig = this.DataToSendConfig[elementId];
    if (!exists(elementConfig)) return null;

    let elementConverter = this._valueConverters[elementId];

    //boolean values cannot be send
    if (typeof value === "boolean") return null;

    let convertedValue = value.toString();
    if (exists(elementConverter))
      convertedValue = elementConverter.convertValue(value);

    let timestamp = this._convertTickIdToMQTTTimestamp(tickId);

    return [
      200,
      elementConfig.groupName,
      elementConfig.variableName,
      convertedValue,
      elementConfig.variableUnit,
      timestamp,
    ].join(",");
  }

  /**
   * @description Method for converting payload of data to send from agent to collection of MQTT SmartREST commands
   * @param {JSON} payload Standard agent data payload
   */
  _convertAgentDataSendPayloadToMQTTCommands(payload) {
    if (!exists(payload) || isObjectEmpty(payload)) return null;
    //Due to the max length of mqtt payload in one request (16kB) data has to be divided into several commands
    let commandsToReturn = [];
    let currentCommand = "";
    let currentCommandLength = 0;

    for (let tickId of Object.keys(payload)) {
      let tickIdPayload = payload[tickId];
      for (let elementId of Object.keys(tickIdPayload)) {
        let elementValue = tickIdPayload[elementId];

        let variableCommand = this._createMQTTSendValueCommand(
          elementId,
          elementValue,
          tickId
        );

        if (exists(variableCommand)) {
          currentCommand += `${variableCommand}\n`;
          currentCommandLength++;

          //Switching to new command if actual one is to long
          if (currentCommandLength >= this.MQTTMessagesLimit) {
            commandsToReturn.push(currentCommand);
            currentCommand = "";
            currentCommandLength = 0;
          }
        }
      }
    }

    //Adding current command to array - if it was not added
    if (!commandsToReturn.includes(currentCommand) && currentCommand !== "")
      commandsToReturn.push(currentCommand);

    if (commandsToReturn.length > 0) return commandsToReturn;
    else return null;
  }

  /**
   * @description Method for converting payload of event to send from agent to the MQTT send event command
   * @param {Number} tickId tick id of event
   * @param {String} elementId element id to send event
   * @param {String} value value of alert
   */
  _convertAgentEventSendPayloadToMQTTCommand(tickId, elementId, value) {
    //allow to do anything - only if all elements exists
    if (!exists(tickId) || !exists(elementId) || !exists(value)) return null;

    let timestamp = this._convertTickIdToMQTTTimestamp(tickId);
    if (!exists(timestamp)) return null;

    let elementConfig = this.EventsToSendConfig[elementId];

    if (!exists(elementConfig)) return null;

    //Stringinfing value if is not a string
    if (!isString(value)) value = JSON.stringify(value);

    let normalizedValue = MSMQTTAgentDevice.normalizeStringToSendViaSmartREST(
      value
    );
    let nromalizedSeverity = MSMQTTAgentDevice.normalizeMindConnectSeverity(
      elementConfig.severity
    );

    if (elementConfig.eventType === "ALERT") {
      //Sending alert

      return [
        nromalizedSeverity,
        elementConfig.eventName,
        normalizedValue,
        timestamp,
      ].join(",");
    } else if (elementConfig.eventType === "EVENT") {
      //Sending event
      return [400, elementConfig.eventName, normalizedValue, timestamp].join(
        ","
      );
    } else {
      return null;
    }
  }

  /**
   * @description Method for generating connect parameters for MQTT connection
   */
  _generateConnectParameters() {
    return {
      port: MQTTPort,
      clientId: this.ClientId,
      username: `${this.TenantName}/${this._userName}`,
      password: this._userPassword,
      device_name: this.ClientId,
      tenant: this.TenantName,
      protocol: MQTTProtocol,
      host: MQTTHost,
      reconnectPeriod: 0,
      connectTimeout: this.ConnectTimeout,
    };
  }

  /**
   * @description Method for connecting with MQTT Broker
   */
  async _connectToMQTTBroker() {
    let connectParameters = this._generateConnectParameters();

    let mqttClient = await mqtt.connectAsync(
      `${this.TenantName}.${MQTTHost}`,
      connectParameters,
      false
    );

    this._mqttClient = mqttClient;
  }

  /**
   * @description Method for closing connection with MQTT Broker. According to npm package mqtt - connection should be closed every send of data
   * @param {boolean} forceEnd should connection be ended by force
   */
  async _closeConnectionWithBroker(forceEnd) {
    await this._mqttClient.end(forceEnd);
  }

  /**
   * @description Method for connecting if client is not connected
   */
  async _connectToBrokerIfNotConnected() {
    if (!this._mqttClient || !this._mqttClient.connected) {
      await this._connectToMQTTBroker();
    }
  }

  /**
   * @description Method for sending MQTT Command
   * @param {string} command Command to send
   */
  async _sendMQTTCommand(command) {
    let self = this;

    if (!exists(command) || command === "") return false;

    return new Promise(async (resolve, reject) => {
      try {
        let mqttClient = self._mqttClient;

        //Throwing in case there device is not connected - could be disconnected while sending data or event due to timeout!
        if (!mqttClient || !mqttClient.connected)
          return reject(
            new Error("Cannot publish MQTT when device not connected!")
          );

        //Special flag to prevent further actions in case promise would somehow go further after rejecting
        let promiseRejected = false;

        //Timeout function - in case of a timeout, disconnect the client and reject
        let timeoutHandler = setTimeout(async () => {
          try {
            promiseRejected = true;
            //Trying - in case end throws, promise has to be rejected
            await self._closeConnectionWithBroker(true);
            return reject(new Error("Publish MQTT message timeout..."));
          } catch (err) {
            return reject(
              new Error("Error while disconnecting after message timeout")
            );
          }
        }, self.PublishTimeout);

        //Publish method hangs if there is no Internet connection
        await self._mqttClient.publish("s/us", command, { qos: self.QoS });

        //Return imediatelly if promise already rejected
        if (promiseRejected) return;

        clearTimeout(timeoutHandler);

        return resolve(true);
      } catch (err) {
        return reject(err);
      }
    });
  }

  /**
   * @description Method for creating and setting up MQTT Device
   */
  async _createAndSetUpMQTTDevice() {
    let addDeviceCommand = [100, this.MQTTName, this.ClientId].join(",");
    let setIntervalCommand = [117, this.CheckStateInterval].join(",");
    let setupDeviceDataCommand = [
      110,
      this.SerialNumber,
      this.Model,
      this.Revision,
    ].join(",");

    let command = `${addDeviceCommand}\n${setIntervalCommand}\n${setupDeviceDataCommand}`;

    return this._sendMQTTCommand(command);
  }

  //#endregion  ========= PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    await super.init(payload);

    //Flag for determining wether device was initially created via MQTT - (boarded)
    this._deviceCreatedViaMQTT = false;

    this._tryBoardOnSendData = true;
    this._tryBoardOnSendEvent = true;

    //Initializing MQTT client - client is only available after invoke of connect method
    this._mqttClient = null;

    this._mqttName = payload.mqttName;
    this._clientId = payload.clientId;
    this._checkStateInterval = payload.checkStateInterval;
    this._model = payload.model;
    this._revision = payload.revision;
    this._tenantName = payload.tenantName;
    this._userName = payload.userName;
    this._userPassword = payload.userPassword;
    this._serialNumber = payload.serialNumber;
    this._mqttMessagesLimit = payload.mqttMessagesLimit;

    this._qos = payload.qos;
    this._publishTimeout = payload.publishTimeout;
    this._connectTimeout = payload.connectTimeout;

    //Flag for determining whether device was boarded before
    this._deviceCreatedViaMQTT = false;

    //Initializing value converters
    this._initValueConverters();
  }

  /**
   * @description Method for generating payload of device.
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.mqttName = this.MQTTName;
    superPayload.clientId = this.ClientId;
    superPayload.checkStateInterval = this.CheckStateInterval;
    superPayload.model = this.Model;
    superPayload.revision = this.Revision;
    superPayload.tenantName = this.TenantName;
    superPayload.serialNumber = this.SerialNumber;
    superPayload.mqttMessagesLimit = this.MQTTMessagesLimit;

    superPayload.qos = this.QoS;
    superPayload.publishTimeout = this.PublishTimeout;
    superPayload.connectTimeout = this.ConnectTimeout;

    return superPayload;
  }

  /**
   * @description Method for onboarding the device.
   */
  async OnBoard() {
    await this._connectToMQTTBroker();
    await this._createAndSetUpMQTTDevice();
    this._deviceCreatedViaMQTT = true;
  }

  /**
   * @description Method for offboarding the device.
   */
  async OffBoard() {
    //MQTT Agent cannot be offboarded
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= OVERRIDE PRIVATE METHODS =========

  /**
   * @description Method for REAL check if device is boarded.
   */
  async _checkIfBoarded() {
    return this._deviceCreatedViaMQTT;
  }

  /**
   * @description Method for send data (content of Clipboard).
   * @param {JSON} payload Payload of data to send
   */
  async _sendData(payload) {
    if (!exists(payload)) return;
    let sendDataCommands = this._convertAgentDataSendPayloadToMQTTCommands(
      payload
    );
    if (!exists(sendDataCommands)) return;

    //Connection can be broken, and device will return that is onboarded even if there is no internet connection
    //Due to giving possibility to save events or data to file if device cannot connect - if onBoard throws, data is not being save into file!
    await this._connectToBrokerIfNotConnected();

    for (let command of sendDataCommands) {
      await this._sendMQTTCommand(command);
    }
  }

  /**
   * @description Method sending event. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickId tick if of event
   * @param {String} elementId it of element associated with event
   * @param {Object} value value (text) of event
   */
  async _sendEvent(tickId, elementId, value) {
    if (!exists(tickId) || !exists(elementId) || !exists(value)) return;
    let sendEventCommand = this._convertAgentEventSendPayloadToMQTTCommand(
      tickId,
      elementId,
      value
    );
    if (!exists(sendEventCommand)) return;

    //Connection can be broken, and device will return that is onboarded even if there is no internet connection
    //Due to giving possibility to save events or data to file if device cannot connect - if onBoard throws, data is not being save into file!
    await this._connectToBrokerIfNotConnected();

    await this._sendMQTTCommand(sendEventCommand);
  }

  //#endregion ========= OVERRIDE PRIVATE METHODS =========
}

module.exports = MSMQTTAgentDevice;
