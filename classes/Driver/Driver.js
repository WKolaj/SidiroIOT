const ProtocolRequest = require("../Request/ProtocolRequest");
const ProtocolRequest = require("../Request/ProtocolRequest");

class Driver {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._isActive = false;
    this._isConnected = false;
    this._timeout = 1000;
    this._busy = false;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Checking whether driver is active - if not connected, tries to connect every time request is invoked
   */
  get IsActive() {
    return this._getIsActiveState();
  }

  /**
   * @description Checking whether connection to device is established
   */
  get IsConnected() {
    return this._getIsConnectedState();
  }

  /**
   * @description Checking whether driver is busy - eg. processing request - driver cannot process more than one process at once
   */
  get Busy() {
    return this._busy;
  }

  /**
   * @description Timeout of processing request
   */
  get Timeout() {
    return this._timeout;
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= VIRTUAL PUBLIC METHODS =========

  /**
   * @description Method for activating driver - if not connected, tries to connect every time request is invoked
   */
  async activate() {
    this._isActive = true;
    //Connecting instantly is not an option here - connection will be established while invoking request
  }

  /**
   * @description Method for deactivating driver - if connected, tries to disconnect every time request is invoked. INVOKES DISCONNECT!!
   */
  async deactivate() {
    //If is already inactive - don't to anything
    if (!this.IsActive) return;

    this._isActive = false;
    //Additionally disconnect the driver instantly
    await this._disconnect();
  }

  /**
   * @description Method for invoking request. BY DEFAULT TRIES TO CONNECT IF ACTIVATE
   * @param {ProtocolRequest} request protocol request
   */
  async invokeRequest(request) {
    return new Promise(async (resolve, reject) => {
      //Not processing request if driver is not active
      if (!this.IsActive) {
        return reject(new Error("Driver is not active"));
      }

      //Not invoking another request if current request has not yet been processed
      if (this.Busy) return reject(new Error("Driver is busy"));
      //Blocking to prevent another request from being processed
      this._busy = true;

      //timeout handler in case there is a timeout while processing request
      let timeoutHandler = null;

      //Try catch in order to force setting processingRequest to false
      try {
        //Connecting if not connected
        if (!this.IsConnected) {
          await this._connect();
        }

        //Setting timeout function
        timeoutHandler = setTimeout(async () => {
          try {
            await this._disconnect();
          } catch (err) {}
          return reject("Timeout error");
        }, this.Timeout);

        let data = await this._processRequest();

        //Clearing timeout
        clearTimeout(timeoutHandler);
        timeoutHandler = null;

        //Clearing busy state
        this._busy = false;

        //Resolving process
        return resolve(data);
      } catch (err) {
        //Clearing timeout handler in case of error
        if (timeoutHandler != null) {
          clearTimeout(timeoutHandler);
          timeoutHandler = null;
        }

        this._busy = false;
        return reject(err);
      }
    });
  }

  //#endregion ========= VIRTUAL PUBLIC METHODS =========

  //#region ========= ABSTRACT PRIVATE METHODS =========

  /**
   * @description Method for getting active state of driver. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getIsActiveState() {
    return this._isActive;
  }

  /**
   * @description Method for getting connection state of driver. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getIsConnectedState() {
    return this._isConnected;
  }

  /**
   * @description Method for establishing TCP connection to device. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  async _connect() {
    this._isConnected = true;
  }

  /**
   * @description Method for disconnecting TCP session with device. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  async _disconnect() {
    this._isConnected = false;
  }

  /**
   * @description Method for processing request by driver. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {ProtocolRequest} protocolRequest
   */
  async _processRequest(protocolRequest) {
    return [];
  }

  //#endregion ========= ABSTRACT PRIVATE METHODS =========
}

module.exports = Driver;
