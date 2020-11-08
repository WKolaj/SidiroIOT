const { snooze } = require("../../utilities/utilities");
const ProtocolRequest = require("../Request/ProtocolRequest");

class Driver {
  //#region ========= CONSTRUCTOR =========

  constructor() {
    this._isActive = false;
    this._timeout = 500;
    this._busy = false;
    this._enableConnectTimeout = true;
    this._disconnectOnConnectTimeout = true;
    this._disconnectOnConnectError = true;
    this._disconnectOnProcessTimeout = true;
    this._disconnectOnProcessError = true;
    this._enableProcessTimeout = true;
    this._connectWhenDisconnectedOnProcess = true;
  }

  //#endregion ========= CONSTRUCTOR =========

  //#region ========= PROPERTIES =========

  /**
   * @description Checking whether driver is active - if not connected, tries to connect every time request is invoked
   */
  get IsActive() {
    return this._isActive;
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
    return this._getTimeout();
  }

  //#endregion ========= PROPERTIES =========

  //#region ========= PRIVATE METHODS =========

  /**
   * @description Method for clearing timeout result if exists
   * @param {TimerHandler} timeoutHandler timeout handler
   */
  _clearTimeoutIfExists(timeoutHandler) {
    if (timeoutHandler) clearTimeout(timeoutHandler);
  }

  /**
   * @description Method for trying to disconnect - rejects if disconnect fails
   */
  async _tryDisconnect() {
    let self = this;

    return new Promise(async (resolve, reject) => {
      try {
        await self._disconnect();
        return resolve(true);
      } catch (err) {
        return resolve(false);
      }
    });
  }

  /**
   * @description Method for trying to connect - do not throw. Returns if connection was established. Return false and disconnect otherwise.
   */
  async _tryConnect() {
    let self = this;
    return new Promise(async (resolve, reject) => {
      //Setting timeout function for connecting
      let connectingRequestTimeoutHandler = null;
      if (self._enableConnectTimeout) {
        connectingRequestTimeoutHandler = setTimeout(async () => {
          if (self._disconnectOnConnectTimeout) await self._tryDisconnect();
          return resolve(false);
        }, self.Timeout);
      }

      try {
        await self._connect();
        self._clearTimeoutIfExists(connectingRequestTimeoutHandler);
        return resolve(true);
      } catch (err) {
        self._clearTimeoutIfExists(connectingRequestTimeoutHandler);
        if (self._disconnectOnConnectError) await self._tryDisconnect();
        return resolve(false);
      }
    });
  }

  //#region  ========= PRIVATE METHODS =========

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
    await this._tryDisconnect();

    //Setting busy to false
    this._busy = false;
  }

  /**
   * @description Method for invoking request. BY DEFAULT TRIES TO CONNECT IF ACTIVATE
   * @param {ProtocolRequest} request protocol request
   * @param {Number} tickId tickId of action
   */
  async invokeRequest(request, tickId) {
    let self = this;

    return new Promise(async (resolve, reject) => {
      //Not processing request if driver is not active
      if (!self.IsActive) {
        return reject(new Error("Driver is not active"));
      }
      //Not invoking another request if current request has not yet been processed
      if (self.Busy) return reject(new Error("Driver is busy"));
      //Blocking to prevent another request from being processed
      self._busy = true;

      //timeout handler in case there is a timeout while processing request
      let processRequestTimeoutHandler = null;

      //Try catch in order to force setting processingRequest to false
      try {
        if (self._connectWhenDisconnectedOnProcess) {
          //Connecting if not connected
          if (!self.IsConnected) {
            let connectionEstablished = await self._tryConnect();
            if (!connectionEstablished) {
              self._busy = false;
              return reject(new Error("Error while trying to connect"));
            }
          }
        }

        //Setting timeout function
        if (self._enableProcessTimeout)
          processRequestTimeoutHandler = setTimeout(async () => {
            if (self._disconnectOnProcessTimeout) await self._tryDisconnect();
            self._busy = false;
            return reject(new Error("Processing data timeout error"));
          }, self.Timeout);

        let data = await self._processRequest(request, tickId);

        //Clearing timeout
        self._clearTimeoutIfExists(processRequestTimeoutHandler);

        //Clearing busy state
        self._busy = false;

        //Resolving process
        return resolve(data);
      } catch (err) {
        //Clearing timeout handler in case of error
        self._clearTimeoutIfExists(processRequestTimeoutHandler);

        //Disconnects in case of error
        if (self._disconnectOnProcessError) await self._tryDisconnect();

        //Releasing busy flag
        self._busy = false;

        return reject(err);
      }
    });
  }

  /**
   * @description method for setting timeout. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  setTimeout(value) {
    this._timeout = value;
  }

  //#endregion ========= VIRTUAL PUBLIC METHODS =========

  //#region ========= VIRTUAL PRIVATE METHODS =========

  /**
   * @description method for getting timeout. CAN BE OVERRIDEN IN CHILD CLASSES
   */
  _getTimeout() {
    return this._timeout;
  }

  //#endregion ========= VIRTUAL PRIVATE METHODS =========

  //#region ========= ABSTRACT PRIVATE METHODS =========

  /**
   * @description Method for getting connection state of driver. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  _getIsConnectedState() {}

  /**
   * @description Method for establishing TCP connection to device. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  async _connect() {}

  /**
   * @description Method for disconnecting TCP session with device. MUST BE OVERRIDEN IN CHILD CLASSES
   */
  async _disconnect() {}

  /**
   * @description Method for processing request by driver. MUST BE OVERRIDEN IN CHILD CLASSES
   * @param {ProtocolRequest} protocolRequest
   * @param {Number} tickId tickId of action
   */
  async _processRequest(protocolRequest, tickId) {}

  //#endregion ========= ABSTRACT PRIVATE METHODS =========
}

module.exports = Driver;
