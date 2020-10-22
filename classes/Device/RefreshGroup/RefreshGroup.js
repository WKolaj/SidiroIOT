class RefreshGroup extends Device {
  constructor(key, devices) {
    this._key = key;

    //fill devices
    this._devices = {};
    for (let dev of devices) this._devices[dev.ID] = dev;
  }
}

module.exports = RefreshGroup;
