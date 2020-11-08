//Function for hanging thread
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class FakeModbusRTU {
  constructor() {
    let self = this;
    //delay of answering in ms
    this.timeDelay = 5;
    this._timeout = null;

    //Data to be returned - key is unitId
    this.coilsData = {
      1: [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
      ],
    };
    this.discreteInputsData = {
      1: [
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
      ],
    };
    this.holdingRegistersData = {
      1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    };
    this.inputRegistersData = {
      1: [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    };
    this.busy = false;
    this._id = 1;
    this._port = 502;
    this._isOpen = false;

    this.getID = jest.fn(() => {
      return self._id;
    });

    this.setID = jest.fn((id) => {
      let previousId = self._id;

      let oldCoilsData = self.coilsData[previousId];
      let oldDiscreteInputsData = self.discreteInputsData[previousId];
      let oldHoldingRegistersData = self.holdingRegistersData[previousId];
      let oldInputRegistersData = self.inputRegistersData[previousId];

      self._id = id;

      self.coilsData = { [id]: oldCoilsData };
      self.discreteInputsData = { [id]: oldDiscreteInputsData };
      self.holdingRegistersData = { [id]: oldHoldingRegistersData };
      self.inputRegistersData = { [id]: oldInputRegistersData };
    });

    this.setTimeout = jest.fn((duration) => {
      self._timeout = duration;
    });

    this.getTimeout = jest.fn(() => {
      return self._timeout;
    });

    this.connectTCP = jest.fn(async (ipAdress, args) => {
      if (!args.port) throw new Error("Port was not given");
      return new Promise(async (resolve, reject) => {
        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            return reject(new Error("Connection timeout"));
          }, self._timeout);
        }

        //Waiting several ms
        await snooze(self.timeDelay);

        self.ipAdress = ipAdress;
        self.portNumber = args.port;
        self.isOpen = true;
        return resolve();
      });
    });

    this._internalDisconnect = jest.fn(() => {
      self.busy = false;
      self.isOpen = false;
    });

    this.close = jest.fn(async (callback) => {
      //disconnecting takes more or less half the time of timeout
      let timeout = self._timeout ? Math.round(self._timeout) / 2 : 100;
      await snooze(timeout);
      this._internalDisconnect();
      if (callback) callback();
    });

    this.readCoils = jest.fn(async (adress, length) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve({
          data: self.getPartOfArray(self.coilsData[self._id], adress, length),
        });
      });
    });

    this.readDiscreteInputs = jest.fn(async (adress, length) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve({
          data: self.getPartOfArray(
            self.discreteInputsData[self._id],
            adress,
            length
          ),
        });
      });
    });

    this.readHoldingRegisters = jest.fn(async (adress, length) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve({
          data: self.getPartOfArray(
            self.holdingRegistersData[self._id],
            adress,
            length
          ),
        });
      });
    });

    this.readInputRegisters = jest.fn(async (adress, length) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve({
          data: self.getPartOfArray(
            self.inputRegistersData[self._id],
            adress,
            length
          ),
        });
      });
    });

    this.writeCoils = jest.fn(async (adress, data) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve(
          self.setPartOfArray(self.coilsData[self._id], adress, data)
        );
      });
    });

    this.writeRegisters = jest.fn(async (adress, data) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve(
          self.setPartOfArray(self.holdingRegistersData[self._id], adress, data)
        );
      });
    });

    this.writeRegister = jest.fn(async (adress, value) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve((self.holdingRegistersData[self._id][adress] = value));
      });
    });

    this.writeCoil = jest.fn(async (adress, value) => {
      return new Promise(async (resolve, reject) => {
        if (!self.isOpen) throw new Error("Device is not connected");
        if (self.busy) throw new Error("Driver is busy");

        let handler = null;
        if (self._timeout) {
          handler = setTimeout(() => {
            self.busy = false;
            return reject(new Error("Handler timeout"));
          }, self._timeout);
        }

        self.busy = true;
        //Waiting several ms
        await snooze(self.timeDelay);
        if (handler) clearTimeout(handler);

        self.busy = false;
        return resolve((self.coilsData[self._id][adress] = value));
      });
    });
  }

  getPartOfArray(array, startAdress, length) {
    let arrayToReturn = [];

    for (let i = startAdress; i < startAdress + length; i++) {
      arrayToReturn.push(array[i]);
    }

    return arrayToReturn;
  }

  setPartOfArray(arrayToSet, startAdress, dataToSet) {
    for (let i = 0; i < dataToSet.length; i++) {
      arrayToSet[startAdress + i] = dataToSet[i];
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(value) {
    this._isOpen = value;
  }
}

module.exports = FakeModbusRTU;
