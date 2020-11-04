const logger = require("../../logger/logger");

const InternalVariable = require("../Element/Variable/InternalVariable");
const AssociatedVariable = require("../Element/Variable/AssociatedVariable");

const MBBoolean = require("../Element/Variable/ConnectableVariable/MBVariable/MBBoolean");
const MBByteArray = require("../Element/Variable/ConnectableVariable/MBVariable/MBByteArray");
const MBDouble = require("../Element/Variable/ConnectableVariable/MBVariable/MBDouble");
const MBFloat = require("../Element/Variable/ConnectableVariable/MBVariable/MBFloat");
const MBInt16 = require("../Element/Variable/ConnectableVariable/MBVariable/MBInt16");
const MBInt32 = require("../Element/Variable/ConnectableVariable/MBVariable/MBInt32");
const MBSwappedFloat = require("../Element/Variable/ConnectableVariable/MBVariable/MBSwappedFloat");
const MBSwappedDouble = require("../Element/Variable/ConnectableVariable/MBVariable/MBSwappedDouble");
const MBSwappedInt32 = require("../Element/Variable/ConnectableVariable/MBVariable/MBSwappedInt32");
const MBSwappedUInt32 = require("../Element/Variable/ConnectableVariable/MBVariable/MBSwappedUInt32");
const MBUInt16 = require("../Element/Variable/ConnectableVariable/MBVariable/MBUInt16");
const MBUInt32 = require("../Element/Variable/ConnectableVariable/MBVariable/MBUInt32");

const S7ByteArray = require("../Element/Variable/ConnectableVariable/S7Variable/S7ByteArray");
const S7DTL = require("../Element/Variable/ConnectableVariable/S7Variable/S7DTL");
const S7Float = require("../Element/Variable/ConnectableVariable/S7Variable/S7Float");
const S7Int8 = require("../Element/Variable/ConnectableVariable/S7Variable/S7Int8");
const S7Int16 = require("../Element/Variable/ConnectableVariable/S7Variable/S7Int16");
const S7Int32 = require("../Element/Variable/ConnectableVariable/S7Variable/S7Int32");
const S7UInt8 = require("../Element/Variable/ConnectableVariable/S7Variable/S7UInt8");
const S7UInt16 = require("../Element/Variable/ConnectableVariable/S7Variable/S7UInt16");
const S7UInt32 = require("../Element/Variable/ConnectableVariable/S7Variable/S7UInt32");

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

    let variable = null;

    switch (type) {
      case "AssociatedVariable":
        variable = new AssociatedVariable();
        break;
      case "InternalVariable":
        variable = new InternalVariable();
        break;
      case "MBBoolean":
        variable = new MBBoolean();
        break;
      case "MBByteArray":
        variable = new MBByteArray();
        break;
      case "MBDouble":
        variable = new MBDouble();
        break;
      case "MBFloat":
        variable = new MBFloat();
        break;
      case "MBInt16":
        variable = new MBInt16();
        break;
      case "MBInt32":
        variable = new MBInt32();
        break;
      case "MBSwappedFloat":
        variable = new MBSwappedFloat();
        break;
      case "MBSwappedDouble":
        variable = new MBSwappedDouble();
        break;
      case "MBSwappedInt32":
        variable = new MBSwappedInt32();
        break;
      case "MBSwappedUInt32":
        variable = new MBSwappedUInt32();
        break;
      case "MBUInt16":
        variable = new MBUInt16();
        break;
      case "MBUInt32":
        variable = new MBUInt32();
        break;
      case "S7ByteArray":
        variable = new S7ByteArray();
        break;
      case "S7DTL":
        variable = new S7DTL();
        break;
      case "S7Float":
        variable = new S7Float();
        break;
      case "S7Int8":
        variable = new S7Int8();
        break;
      case "S7Int16":
        variable = new S7Int16();
        break;
      case "S7Int32":
        variable = new S7Int32();
        break;
      case "S7UInt8":
        variable = new S7UInt8();
        break;
      case "S7UInt16":
        variable = new S7UInt16();
        break;
      case "S7UInt32":
        variable = new S7UInt32();
        break;

      default:
        throw new Error(`Unrecognized Variable type: ${type}`);
    }

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

    let calcElement = null;

    switch (type) {
      case "AverageCalculator":
        calcElement = new AverageCalculator();
        break;
      case "FactorCalculator":
        calcElement = new FactorCalculator();
        break;
      case "IncreaseCalculator":
        calcElement = new IncreaseCalculator();
        break;
      case "SumCalculator":
        calcElement = new SumCalculator();
        break;
      case "ValueFromByteArrayCalculator":
        calcElement = new ValueFromByteArrayCalculator();
        break;

      default:
        throw new Error(`Unrecognized CalcElement type: ${type}`);
    }

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

//TODO - add device init tests
