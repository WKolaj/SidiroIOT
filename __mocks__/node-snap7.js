const { exists, snooze } = require("../utilities/utilities");

class FakeS7Client {
  constructor() {
    let self = this;
    //delay of answering in ms
    self.timeDelay = 5;

    this._connected = false;

    this._connectTimeout = 3000;
    this._sendTimeout = 3000;
    this._recieveTimeout = 3000;

    this.GetParam = (param) => {
      switch (param) {
        case 3:
          return self._connectTimeout;
        case 4:
          return self._sendTimeout;
        case 5:
          return self._recieveTimeout;
        default:
          throw new Error("unrecognized param");
      }
    };

    this.SetParam = (param, value) => {
      switch (param) {
        case 3:
          self._connectTimeout = value;
          break;
        case 4:
          self._sendTimeout = value;
          break;
        case 5:
          self._recieveTimeout = value;
          break;
        default:
          throw new Error("unrecognized param");
      }
    };

    this.ConnectTo = jest.fn(async (ip, rack, slot, callback) => {
      let timeoutHandler = setTimeout(async () => {
        await callback(Error("Connection timeout error"));
      }, this._connectTimeout);

      await snooze(self.timeDelay);
      this._connected = true;
      clearTimeout(timeoutHandler);
      await callback();
    });

    this.Disconnect = jest.fn(() => {
      this._connected = false;
      return true;
    });

    this.DBData = {
      1: [1, 2, 3, 4, 5, 6, 7],
      2: [8, 9, 10, 11, 12, 13, 14],
      3: [15, 16, 17, 18, 19, 20, 21],
    };

    this.IData = [12, 13, 14, 15, 16, 17, 18];

    this.QData = [19, 20, 21, 22, 23, 24, 25];

    this.MData = [26, 27, 28, 29, 30, 31, 32];

    this.DBRead = jest.fn(async (dbNumber, start, size, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (!exists(this.DBData[dbNumber]))
          throw new Error("No such dbNumber is defined!");
        if (start + size > this.DBData[dbNumber].length)
          throw new Error("Invalid area");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Read timeout error"));
        }, self._recieveTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = this.DBData[dbNumber].slice(start, start + size);
        callback(null, Buffer.from(data));
      } catch (err) {
        callback(err.message, null);
      }
    });

    this.DBWrite = jest.fn(async (dbNumber, start, size, buffer, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (!exists(this.DBData[dbNumber]))
          throw new Error("No such dbNumber is defined!");
        if (start + size > this.DBData[dbNumber].length)
          throw new Error("Invalid area");
        if (!Buffer.isBuffer(buffer))
          throw new Error("Data to set is not a buffer");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Write timeout error"));
        }, self._sendTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = [...buffer];

        for (let i = 0; i < size; i++) {
          let offset = start + i;

          self.DBData[dbNumber][offset] = data[i];
        }

        callback(null);
      } catch (err) {
        callback(err.message, null);
      }
    });

    this.ABRead = jest.fn(async (start, size, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (start + size > self.QData.length) throw new Error("Invalid area");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Read timeout error"));
        }, self._recieveTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = self.QData.slice(start, start + size);
        callback(null, Buffer.from(data));
      } catch (err) {
        callback(err.message, null);
      }
    });

    this.ABWrite = jest.fn(async (start, size, buffer, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (start + size > self.QData.length) throw new Error("Invalid area");
        if (!Buffer.isBuffer(buffer))
          throw new Error("Data to set is not a buffer");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Write timeout error"));
        }, self._sendTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = [...buffer];

        for (let i = 0; i < size; i++) {
          let offset = start + i;

          this.QData[offset] = data[i];
        }

        callback(null);
      } catch (err) {
        callback(err.message, null);
      }
    });

    this.EBRead = jest.fn(async (start, size, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (start + size > self.IData.length) throw new Error("Invalid area");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Read timeout error"));
        }, self._recieveTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = self.IData.slice(start, start + size);
        callback(null, Buffer.from(data));
      } catch (err) {
        callback(err.message, null);
      }
    });

    this.EBWrite = jest.fn(async (start, size, buffer, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (start + size > this.IData.length) throw new Error("Invalid area");
        if (!Buffer.isBuffer(buffer))
          throw new Error("Data to set is not a buffer");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Write timeout error"));
        }, self._sendTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = [...buffer];

        for (let i = 0; i < size; i++) {
          let offset = start + i;

          this.IData[offset] = data[i];
        }

        callback(null);
      } catch (err) {
        callback(err.message, null);
      }
    });

    this.MBRead = jest.fn(async (start, size, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (start + size > this.MData.length) throw new Error("Invalid area");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Read timeout error"));
        }, self._recieveTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = this.MData.slice(start, start + size);
        callback(null, Buffer.from(data));
      } catch (err) {
        callback(err.message, null);
      }
    });

    this.MBWrite = jest.fn(async (start, size, buffer, callback) => {
      try {
        if (!self.Connected()) throw new Error("Device not connected");
        if (start + size > this.MData.length) throw new Error("Invalid area");
        if (!Buffer.isBuffer(buffer))
          throw new Error("Data to set is not a buffer");

        let timeoutHandler = setTimeout(async () => {
          await callback(Error("Write timeout error"));
        }, self._sendTimeout);

        await snooze(self.timeDelay);

        clearTimeout(timeoutHandler);

        let data = [...buffer];

        for (let i = 0; i < size; i++) {
          let offset = start + i;

          this.MData[offset] = data[i];
        }

        callback(null);
      } catch (err) {
        callback(err.message, null);
      }
    });
  }

  Connected() {
    return this._connected;
  }
}

module.exports.S7Client = FakeS7Client;
