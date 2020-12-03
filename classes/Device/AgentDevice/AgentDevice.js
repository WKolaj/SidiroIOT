const {
  cloneObject,
  createDirIfNotExists,
  exists,
  isObjectEmpty,
} = require("../../../utilities/utilities");
const DataClipboard = require("../../Clipboard/DataClipboard");
const EventClipboard = require("../../Clipboard/EventClipboard");
const FileStorage = require("../../Storage/FileStorage");
const Device = require("../Device");
const path = require("path");
const Sampler = require("../../Sampler/Sampler");
const logger = require("../../../logger/logger");

const dataStorageDirName = "dataToSend";
const eventStorageDirName = "eventsToSend";

class AgentDevice extends Device {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    super(project);

    this._dirPath = null;
    this._dataClipboard = null;
    this._eventClipboard = null;
    this._tryBoardOnSendData = null;
    this._tryBoardOnSendEvent = null;
    this._lastDataValues = null;
    this._lastEventValues = null;
    this._dataStorage = null;
    this._eventStorage = null;
    this._sendDataFileInterval = null;
    this._sendEventFileInterval = null;
    this._dataStorageSize = null;
    this._eventStorageSize = null;
    this._numberOfDataFilesToSend = null;
    this._numberOfEventFilesToSend = null;
    this._dataToSendConfig = null;
    this._eventsToSendConfig = null;
    this._boarded = null;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Interval between sending data files
   */
  get SendDataFileInterval() {
    return this._sendDataFileInterval;
  }

  /**
   * @description Interval between sending event files
   */
  get SendEventFileInterval() {
    return this._sendEventFileInterval;
  }

  /**
   * @description Maxium number of data files to be stored
   */
  get DataStorageSize() {
    return this._dataStorageSize;
  }

  /**
   * @description Maximum number of event files to be stored
   */
  get EventStorageSize() {
    return this._eventStorageSize;
  }

  /**
   * @description Max number of data files to be send with one request
   */
  get NumberOfDataFilesToSend() {
    return this._numberOfDataFilesToSend;
  }

  /**
   * @description Max number of event files to be send with one request
   */
  get NumberOfEventFilesToSend() {
    return this._numberOfEventFilesToSend;
  }

  /**
   * @description Configuration of elements to be sent
   */
  get DataToSendConfig() {
    return this._dataToSendConfig;
  }

  /**
   * @description Configuration of elements to be sent
   */
  get EventsToSendConfig() {
    return this._eventsToSendConfig;
  }

  /**
   * @description Is element boarded. Method for checking board between refreshing - not for real check inside refresh
   */
  get Boarded() {
    return this._boarded;
  }

  //#endregion ========= PROPERTIES ========

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for assigning and creating main directory for agent
   */
  async _initializeMainDirectory() {
    //Creating directory for agent
    let agentsDirPath = this._project.AgentsDirPath;
    let agentDirPath = path.join(agentsDirPath, this.ID);
    await createDirIfNotExists(agentDirPath);
    this._dirPath = agentDirPath;
  }

  /**
   * @description Method for initialzing and creating new Clipboards
   */
  async _initializeClipboards() {
    this._dataClipboard = new DataClipboard();
    this._dataClipboard.init();
    this._eventClipboard = new EventClipboard();
    this._eventClipboard.init();
  }

  /**
   * @description Method for initializing storages - SHOULD BE USED AFTER INITIALIZING MAIN DIRECTORY
   */
  async _initializeStorages() {
    //Determining dataStorage and agentStorage paths
    let dataStorageDirPath = path.join(this._dirPath, dataStorageDirName);
    let eventStorageDirPath = path.join(this._dirPath, eventStorageDirName);

    this._dataStorage = new FileStorage();
    await this._dataStorage.init({
      dirPath: dataStorageDirPath,
      bufferLength: this.DataStorageSize,
    });

    this._eventStorage = new FileStorage();
    await this._eventStorage.init({
      dirPath: eventStorageDirPath,
      bufferLength: this.EventStorageSize,
    });
  }

  /**
   * @description Method for getting and saving all actual values of elements from data
   * @param {Number} tickNumber actual tick number
   */
  _getAndSaveDataToClipboard(tickNumber) {
    for (let elementId of Object.keys(this.DataToSendConfig)) {
      this._getAndSaveElementsDataToClipboardIfFitsSendingInterval(
        elementId,
        tickNumber
      );
    }
  }

  /**
   * @description Method for adding elements value and lastValueTick to data cliboard - only if element is valid and meets requirements
   * @param {String} elementId id of element
   * @param {String} tickNumber tick number
   */
  _getAndSaveElementsDataToClipboardIfFitsSendingInterval(
    elementId,
    tickNumber
  ) {
    let elementConfig = this.DataToSendConfig[elementId];
    if (!exists(elementConfig)) return;

    //Getting deviceId and sendingInterval from element's config
    let deviceId = elementConfig.deviceId;
    let sendingInterval = elementConfig.sendingInterval;

    //Getting element from project
    let element = this._project.getElement(deviceId, elementId);

    //If element does not exist - return
    if (!exists(element)) return;

    //If element sending interval does not meet requriements - return
    if (!Sampler.doesSampleTimeMatchesTick(tickNumber, sendingInterval)) return;

    let elementsValue = element.Value;
    let elementsLastValueTick = element.LastValueTick;

    //Checking if element's value is different then element's value in lastDataValues
    let valueFromLastValues = this._lastDataValues[elementId];
    if (
      exists(valueFromLastValues) &&
      valueFromLastValues.tickId === elementsLastValueTick &&
      valueFromLastValues.value === elementsValue
    )
      return;

    //Adding data to clipboard
    this._dataClipboard.addData(
      elementsLastValueTick,
      elementId,
      elementsValue
    );
    //Adding data to lastDataValues
    this._lastDataValues[elementId] = {
      tickId: elementsLastValueTick,
      value: elementsValue,
    };
  }

  /**
   * @description Method for getting and saving all actual values of elements from events data
   * @param {Number} tickNumber actual tick number
   */
  _getAndSaveEventsToClipboard(tickNumber) {
    for (let elementId of Object.keys(this.EventsToSendConfig)) {
      this._getAndSaveElementsEventToClipboardIfFitsSendingInterval(
        elementId,
        tickNumber
      );
    }
  }

  /**
   * @description Method for adding elements value and lastValueTick to event cliboard - only if element is valid and meets requirements
   * @param {String} elementId id of element
   * @param {String} tickNumber tick number
   */
  _getAndSaveElementsEventToClipboardIfFitsSendingInterval(
    elementId,
    tickNumber
  ) {
    let elementConfig = this.EventsToSendConfig[elementId];
    if (!exists(elementConfig)) return;

    //Getting deviceId and sendingInterval from element's config
    let deviceId = elementConfig.deviceId;
    let sendingInterval = elementConfig.sendingInterval;

    //Getting element from project
    let element = this._project.getElement(deviceId, elementId);

    //If element does not exist - return
    if (!exists(element)) return;

    //If element sending interval does not meet requriements - return
    if (!Sampler.doesSampleTimeMatchesTick(tickNumber, sendingInterval)) return;

    let elementsValue = element.Value;
    let elementsLastValueTick = element.LastValueTick;

    //Checking if element's value is different then element's value in lastEventValues
    let valueFromLastValues = this._lastEventValues[elementId];
    if (
      exists(valueFromLastValues) &&
      valueFromLastValues.tickId === elementsLastValueTick &&
      valueFromLastValues.value === elementsValue
    )
      return;

    //Value cannot be null - if value is null it should not be added to cliboard but should be save in lastEventValues
    if (elementsValue !== null) {
      //Adding data to clipboard
      this._eventClipboard.addData(
        elementsLastValueTick,
        elementId,
        elementsValue
      );
    }

    //Adding data to lastDataValues
    this._lastEventValues[elementId] = {
      tickId: elementsLastValueTick,
      value: elementsValue,
    };
  }

  /**
   * @description Method for refrehsing Boarded state. Method will never throw na set false to Boarded in case error appears
   */
  async _refreshBoardedState() {
    let newBoardedState = false;
    try {
      newBoardedState = await this._checkIfBoarded();
    } catch (err) {
      logger.error(err.message, err);
    }

    this._boarded = newBoardedState;
  }

  /**
   * @description Method for checking whether device should be boarded. INVOKE REFRESH BOARD STATE BEFORE THIS METHOD!
   */
  async _checkIfShouldBoard(tickNumber) {
    //If device is already boarded - no need to board it again
    if (this.Boarded) return false;

    //if device is not boarded - continue and check if should be boarded due to sending data or event

    //Checking if data should be send
    let shouldDataBeSend = this._checkIfDataShouldBeSent(tickNumber);

    //Boarding should be performed only if tick of sending data Interval fits tickNumber and device is allowed to try boarding on send data
    if (shouldDataBeSend && this._tryBoardOnSendData) return true;

    //Checking if data should be send
    let shouldEventsBeSend = this._checkIfEventsShouldBeSent(tickNumber);

    //Boarding should be performed only if tick of sending event Interval fits tickNumber and device is allowed to try boarding on send event
    if (shouldEventsBeSend && this._tryBoardOnSendEvent) return true;

    //Otherwise - device should not be boarded
    return false;
  }

  /**
   * @description Method for trying boarding.
   */
  async _tryBoard() {
    try {
      await this.OnBoard();
    } catch (err) {
      logger.error(err.message, err);
    }
  }

  /**
   * @description Method for checking if data should be sent in given refresh cycle
   * @param {NodeRequire} tickNumber tickNumber of given refresh cycle
   */
  _checkIfDataShouldBeSent(tickNumber) {
    return Sampler.doesSampleTimeMatchesTick(
      tickNumber,
      this.SendDataFileInterval
    );
  }

  /**
   * @description Method for writing data from data clipboard to data storage and clear data clipboard
   */
  async _tryMovingDataFromClipboardToStorage() {
    try {
      //Getting data from clipboard and saving it into storage
      let clipboardContent = this._dataClipboard.getAllData();
      await this._dataStorage.createData(clipboardContent);

      //Clearing data form clipboard
      this._dataClipboard.clearAllData();
      return true;
    } catch (err) {
      logger.error(err.message, err);
      return false;
    }
  }

  /**
   * @description Method for sending data from cliboard or write it to storage if sending failed. Throws if data was no send successfully
   */
  async _trySendingDataFromClipboardAndClearItOrMoveThemToStorage() {
    //If data clipboard content is empty - don't proceed with sending or saving data
    let dataClipboardContent = this._dataClipboard.getAllData();
    if (!exists(dataClipboardContent) || isObjectEmpty(dataClipboardContent)) {
      //Clearing data form clipboard
      this._dataClipboard.clearAllData();
      return true;
    }

    try {
      await this._sendData(dataClipboardContent);

      //Send successfully - clear data clipboard
      this._dataClipboard.clearAllData();
      return true;
    } catch (err) {
      logger.error(err.message, err);
      //If data not send successfully - write it to clipboard storage and do not proceed
      await this._tryMovingDataFromClipboardToStorage();
      return false;
    }
  }

  /**
   * @description Method for sending data from files storage.
   */
  async _trySendingDataFromStorage() {
    //Getting number of files to send
    let fileIdsToSend = [];
    try {
      fileIdsToSend = await this._dataStorage.getNewestDataID(
        this.NumberOfDataFilesToSend
      );

      if (!exists(fileIdsToSend)) return false;
      if (isObjectEmpty(fileIdsToSend)) return true;
    } catch (err) {
      logger.error(err.message, err);
      return false;
    }

    let sendingAtLeastOneFileFails = false;

    //Trying to send all files to send and delete them after
    for (let fileId of fileIdsToSend) {
      try {
        let fileContent = await this._dataStorage.getData(fileId);
        //If there was an error during getting data - method getData returns null
        if (exists(fileContent)) await this._sendData(fileContent);
        await this._dataStorage.deleteData(fileId);
      } catch (err) {
        logger.error(err.message, err);
        sendingAtLeastOneFileFails = true;
      }
    }

    return !sendingAtLeastOneFileFails;
  }

  /**
   * @description Method for checking if event should be sent in given refresh cycle
   * @param {NodeRequire} tickNumber tickNumber of given refresh cycle
   */
  _checkIfEventsShouldBeSent(tickNumber) {
    return Sampler.doesSampleTimeMatchesTick(
      tickNumber,
      this.SendEventFileInterval
    );
  }

  /**
   * @description Method for saving event to storage. Returns true if saving was successfull or false otherwise
   * @param {JSON} eventToSave Event to save
   */
  async _trySavingEventToStorage(eventToSave) {
    try {
      //If event not send successfully - write it to storage
      await this._eventStorage.createData(eventToSave);
      return true;
    } catch (err2) {
      logger.error(err2.message, err2);
      return false;
    }
  }

  /**
   * @description Method for sending events from cliboard or write it to storage if sending failed. Return true if sending of all events was successfull (or events to send is empty) or false otherwise
   */
  async _trySendingEventsFromClipboardAndClearItOrMoveThemToStorage() {
    //If data clipboard content is empty - don't proceed with sending or saving data
    let eventClipboardContent = this._eventClipboard.getAllData();

    if (
      !exists(eventClipboardContent) ||
      isObjectEmpty(eventClipboardContent)
    ) {
      //Clearing data form clipboard
      this._eventClipboard.clearAllData();
      //Returning true - if data is empty it does not indicate that there was an error during sending
      return true;
    }

    let allEventsSendSuccessfully = true;
    for (let eventToSend of eventClipboardContent) {
      try {
        let tickId = eventToSend.tickId;
        let elementId = eventToSend.elementId;
        let value = eventToSend.value;

        //Sending event
        await this._sendEvent(tickId, elementId, value);
      } catch (err) {
        logger.error(err.message, err);

        //Saving event into storage
        await this._trySavingEventToStorage(eventToSend);

        //sending data failed
        allEventsSendSuccessfully = false;
      }
    }

    //All events not send saved to storage - clear event clipboard
    this._eventClipboard.clearAllData();

    return allEventsSendSuccessfully;
  }

  /**
   * @description Method for sending event from files.
   */
  async _trySendingEventsFromStorage() {
    let fileIdsToSend = [];
    try {
      //Getting number of files to send
      fileIdsToSend = await this._eventStorage.getNewestDataID(
        this.NumberOfEventFilesToSend
      );
      if (!exists(fileIdsToSend)) return false;
      if (isObjectEmpty(fileIdsToSend)) return true;
    } catch (err) {
      logger.error(err.message, err);
      return false;
    }

    let sendingAtLeastOneFileFails = false;

    //Trying to send all files
    for (let fileId of fileIdsToSend) {
      try {
        let fileContent = await this._eventStorage.getData(fileId);

        if (exists(fileContent)) {
          let tickId = fileContent.tickId;
          let elementId = fileContent.elementId;
          let value = fileContent.value;
          await this._sendEvent(tickId, elementId, value);
        }

        //File should have been deleted even if it is empty
        await this._eventStorage.deleteData(fileId);
      } catch (err) {
        logger.error(err.message, err);
        sendingAtLeastOneFileFails = true;
      }
    }

    return !sendingAtLeastOneFileFails;
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for refreshing device - invoked per tick.
   * @param {Number} tickNumber tick number of actual date
   */
  async refresh(tickNumber) {
    //Return immediatelly if device is not active
    if (!this.IsActive) return;

    //Refreshing all variables/calcElements/alerts
    await super.refresh(tickNumber);

    //#region SAVING DATA AND EVENTS TO CLIPBOARD

    //Adjusting data clipboard
    this._getAndSaveDataToClipboard(tickNumber);

    //Adjusting event clipboard
    this._getAndSaveEventsToClipboard(tickNumber);

    //#endregion SAVING DATA AND EVENTS TO CLIPBOARD

    //#region CHECKING BOARDING STATE

    //Refreshing boarded state
    await this._refreshBoardedState();

    if (!this.Boarded) {
      //Checking if agent should be boarded
      let shouldBeBoarded = await this._checkIfShouldBoard(tickNumber);

      //If device is not boarded and should not be boarded in this refresh cycle - no point to continue
      if (!shouldBeBoarded) return;

      //Trying to board if should be boarded
      await this._tryBoard();

      //Refreshing boarding state after attempt to board
      await this._refreshBoardedState();

      //If attemp failed - no point to continue
      if (!this.Boarded) return;
    }

    //#endregion CHECKING BOARDING STATE

    //At this poing - device is boarded

    //#region SENDING DATA

    //Checking if data should be send
    let shouldDataBeSend = this._checkIfDataShouldBeSent(tickNumber);

    if (shouldDataBeSend) {
      let dataSendSuccessfully = await this._trySendingDataFromClipboardAndClearItOrMoveThemToStorage();

      //If data send successfully - try sending data from files
      if (dataSendSuccessfully) {
        await this._trySendingDataFromStorage();
      }
    }

    //#endregion SENDING DATA

    //#region SENDING EVENTS

    //Checking if events should be send
    let shouldEventsBeSend = this._checkIfEventsShouldBeSent(tickNumber);

    //At this point device should be boarded - no point to board again
    if (shouldEventsBeSend) {
      let allEventsSendSuccessfully = await this._trySendingEventsFromClipboardAndClearItOrMoveThemToStorage();

      if (allEventsSendSuccessfully) {
        await this._trySendingEventsFromStorage();
      }
    }

    //#endregion SENDING EVENTS
  }

  /**
   * @description Method for initializing device.
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    await super.init(payload);

    this._tryBoardOnSendData = true;
    this._tryBoardOnSendEvent = true;
    this._lastDataValues = {};
    this._lastEventValues = {};
    this._sendDataFileInterval = payload.sendDataFileInterval;
    this._sendEventFileInterval = payload.sendEventFileInterval;
    this._dataStorageSize = payload.dataStorageSize;
    this._eventStorageSize = payload.eventStorageSize;
    this._numberOfDataFilesToSend = payload.numberOfDataFilesToSend;
    this._numberOfEventFilesToSend = payload.numberOfEventFilesToSend;
    this._dataToSendConfig = payload.dataToSendConfig;
    this._eventsToSendConfig = payload.eventsToSendConfig;
    this._boarded = false;

    await this._initializeMainDirectory();
    await this._initializeClipboards();
    await this._initializeStorages();
  }

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly.
   */
  getRefreshGroupID() {
    return this.ID;
  }

  /**
   * @description Method for generating payload of device. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  generatePayload() {
    let superPayload = super.generatePayload();

    superPayload.sendDataFileInterval = this.SendDataFileInterval;
    superPayload.sendEventFileInterval = this.SendEventFileInterval;
    superPayload.dataStorageSize = this.DataStorageSize;
    superPayload.eventStorageSize = this.EventStorageSize;
    superPayload.numberOfDataFilesToSend = this.NumberOfDataFilesToSend;
    superPayload.numberOfEventFilesToSend = this.NumberOfEventFilesToSend;
    superPayload.dataToSendConfig = cloneObject(this.DataToSendConfig);
    superPayload.eventsToSendConfig = cloneObject(this.EventsToSendConfig);
    superPayload.boarded = this.Boarded;

    return superPayload;
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========

  //#region ========= ABSTRACT PRIVATE METHODS =========

  /**
   * @description Method for REAL check if device is boarded. MUST BE OVERRIDEN IN CHILD CLASSES.
   */
  async _checkIfBoarded() {}

  /**
   * @description Method for send data (content of Clipboard). MUST BE OVERRIDEN IN CHILD CLASSES.
   * @param {JSON} payload Payload of data to send
   */
  async _sendData(payload) {}

  /**
   * @description Method sending event. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickId tick if of event
   * @param {String} elementId it of element associated with event
   * @param {Object} value value (text) of event
   */
  async _sendEvent(tickId, elementId, value) {}

  //#endregion ========= ABSTRACT PRIVATE METHODS =========

  //#region ========= ABSTRACT PUBLIC METHODS =========

  /**
   * @description Method for onboarding the device. MUST BE OVERRIDEN IN CHILD CLASSES.
   */
  async OnBoard() {}

  /**
   * @description Method for offboarding the device. MUST BE OVERRIDEN IN CHILD CLASSES.
   */
  async OffBoard() {}

  //#endregion ========= ABSTRACT PUBLIC METHODS =========
}

module.exports = AgentDevice;
