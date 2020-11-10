const logger = require("../../logger/logger");

const InternalVariable = require("../Element/Variable/InternalVariable");
const AssociatedVariable = require("../Element/Variable/AssociatedVariable");

const AverageCalculator = require("../Element/CalcElement/AverageCalculator");
const FactorCalculator = require("../Element/CalcElement/FactorCalculator");
const IncreaseCalculator = require("../Element/CalcElement/IncreaseCalculator");
const SumCalculator = require("../Element/CalcElement/SumCalculator");
const ValueFromByteArrayCalculator = require("../Element/CalcElement/ValueFromByteArrayCalculator");

const BandwidthLimitAlert = require("../Element/Alerts/BandwidthLimitAlert");
const ExactValuesAlert = require("../Element/Alerts/ExactValuesAlert");
const HighLimitAlert = require("../Element/Alerts/HighLimitAlert");
const LowLimitAlert = require("../Element/Alerts/LowLimitAlert");

class Device {
  //#region ========= CONSTRUCTOR =========

  constructor(project) {
    this._project = project;
  }

  //#endregion ========= CONSTRUCTOR =========

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

  /**
   * @description flag determining wether elements associated with device should be refreshed
   */
  get IsActive() {
    return this._getIsActiveState();
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for generating payload of elements collection
   * @param {Object} elementCollection elements collection
   */
  _generateElementsPayload(elementCollection) {
    let allElements = Object.values(elementCollection);
    let objectToReturn = {};

    for (let element of allElements) {
      let elementPayload = element.generatePayload();
      elementPayload.deviceId = this.ID;
      objectToReturn[element.ID] = elementPayload;
    }

    return objectToReturn;
  }

  //#endregion ========= PRIVATE METHODS =========

  //#region ========= PUBLIC VIRTUAL METHODS =========

  /**
   * @description Method for initializing device
   * @param {JSON} payload Payload to initialize
   */
  async init(payload) {
    this._id = payload.id;
    this._name = payload.name;
    this._type = payload.type;

    //Initializing variables
    this._variables = {};
    let allVariablesPayload = Object.values(payload.variables);
    for (let variablePayload of allVariablesPayload) {
      await this._initVariable(variablePayload);
    }

    //Initializing calcElements
    this._calcElements = {};
    let allCalcElementsPayload = Object.values(payload.calcElements);
    for (let calcElementPayload of allCalcElementsPayload) {
      await this._initCalcElement(calcElementPayload);
    }

    //Initializing alerts
    this._alerts = {};
    let allAlertsPayload = Object.values(payload.alerts);
    for (let alertPayload of allAlertsPayload) {
      await this._initAlert(alertPayload);
    }

    //Activating or deactivating based on payload content
    if (payload.isActive) await this.activate();
    else await this.deactivate();
  }

  /**
   * @description Method for refreshing device - invoked per tick. By default refreshes variables, calcElements and alerts. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickNumber tick number of actual date
   */
  async refresh(tickNumber) {
    //Return immediatelly if device is not active
    if (!this.IsActive) return;

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

  /**
   * @description Method for activating device - all elements associated with device will start refreshing. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  async activate() {
    this._isActive = true;
  }

  /**
   * @description Method for deactivating device - all elements associated with device will stop refreshing. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  async deactivate() {
    this._isActive = false;
  }

  /**
   * @description Method for generating payload of device. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  generatePayload() {
    return {
      id: this.ID,
      name: this.Name,
      type: this.Type,
      variables: this._generateElementsPayload(this.Variables),
      calcElements: this._generateElementsPayload(this.CalcElements),
      alerts: this._generateElementsPayload(this.Alerts),
      isActive: this.IsActive,
    };
  }

  //#endregion ========= PUBLIC VIRTUAL METHODS =========

  //#region ========= PRIVATE VIRTUAL METHODS =========

  /**
   * @description Method for refreshing variables of device - invoked per tick. CAN BE OVERRIDE IN CHILD CLASSES
   * @param {Number} tickNumber tick number of actual date
   */
  async _refreshVariables(tickNumber) {
    //Refreshing all variables one by one
    for (let variable of Object.values(this.Variables)) {
      try {
        if (variable.checkIfShouldBeRefreshed(tickNumber))
          await variable.refresh(tickNumber);
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  /**
   * @description Method for refreshing all calc elements - one by one. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {Number} tickNumber tick number of actual date
   */
  async _refreshCalcElements(tickNumber) {
    //Refreshing all calc elements one by one
    for (let calcElement of Object.values(this.CalcElements)) {
      try {
        if (calcElement.checkIfShouldBeRefreshed(tickNumber))
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
        if (alert.checkIfShouldBeRefreshed(tickNumber))
          await alert.refresh(tickNumber);
      } catch (err) {
        logger.warn(err.message, err);
      }
    }
  }

  /**
   * @description Method for creating, assigining and initializing variable based on its type and payload. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {JSON} variablePayload payload of variable (including variable type)
   */
  async _initVariable(variablePayload) {
    let type = variablePayload.type;

    let variable = this._createVariableBasedOnPayload(type);

    //Initializing variables
    await variable.init(variablePayload);

    //Assigning variable to Variables
    this.Variables[variable.ID] = variable;
  }

  /**
   * @description Method for creating, assigining and initializing calcElement based on its type and payload. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {JSON} calcElementPayload payload of calcElement (including calcElement type)
   */
  async _initCalcElement(calcElementPayload) {
    let type = calcElementPayload.type;

    let calcElement = this._createCalcElementBasedOnPayload(type);

    //Initializing calcElement
    await calcElement.init(calcElementPayload);

    //Assigning calcElement to CalcElements
    this.CalcElements[calcElement.ID] = calcElement;
  }

  /**
   * @description Method for creating, assigining and initializing alerts based on its type and payload. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {JSON} alertPayload payload of alerts (including alerts type)
   */
  async _initAlert(alertPayload) {
    let type = alertPayload.type;

    let alert = null;

    switch (type) {
      case "HighLimitAlert":
        alert = new HighLimitAlert();
        break;
      case "LowLimitAlert":
        alert = new LowLimitAlert();
        break;
      case "BandwidthLimitAlert":
        alert = new BandwidthLimitAlert();
        break;
      case "ExactValuesAlert":
        alert = new ExactValuesAlert();
        break;

      default:
        throw new Error(`Unrecognized Alert type: ${type}`);
    }

    //Initializing alert
    await alert.init(alertPayload);

    //Assigning alert to Alerts
    this.Alerts[alert.ID] = alert;
  }

  /**
   * @description Method for getting active state of device. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _getIsActiveState() {
    return this._isActive;
  }

  /**
   * @description Method for creating variables based on type - throws if type is not a valid type. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {String} type type of variable
   */
  _createVariableBasedOnPayload(type) {
    switch (type) {
      case "AssociatedVariable":
        return new AssociatedVariable(this._project, this);
      case "InternalVariable":
        return new InternalVariable(this._project, this);
      default:
        throw new Error(`Unrecognized Variable type: ${type}`);
    }
  }

  /**
   * @description Method for creating calcElement based on type - throws if type is not a valid type. CAN BE OVERRIDEN IN CHILD CLASSES
   * @param {String} type type of variable
   */
  _createCalcElementBasedOnPayload(type) {
    switch (type) {
      case "FactorCalculator":
        return new FactorCalculator(this._project, this);
      case "SumCalculator":
        return new SumCalculator(this._project, this);
      default:
        throw new Error(`Unrecognized CalcElement type: ${type}`);
    }
  }

  //#endregion ========= PRIVATE VIRTUAL METHODS =========

  //#region ========= PRIVATE ABSTRACT METHODS =========

  //#endregion ========= PRIVATE ABSTRACT METHODS =========

  //#region ========= PUBLIC ABSTRACT METHODS =========

  /**
   * @description Method for getting refresh group of devices - devices with the same group id WILL NOT be refreshed simuntaneusly. HAS TO BE OVERRIDE IN CHILD CLASSES!
   */
  getRefreshGroupID() {}

  //#endregion ========= PUBLIC ABSTRACT METHODS =========
}

module.exports = Device;

//TODO - add device init tests
