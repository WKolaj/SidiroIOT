const si = require("systeminformation");
const { roundToPrecision, exists } = require("../utilities/utilities");

const calcCPULoad = async () => {
  try {
    let loadInfo = await si.currentLoad();
    let load = loadInfo.currentload;
    if (!exists(load) || isNaN(load)) return null;
    let roundedLoad = roundToPrecision(load, 2);
    return roundedLoad;
  } catch (err) {
    return null;
  }
};

const calcCPUTemperature = async () => {
  try {
    let temp = await si.cpuTemperature();
    if (!exists(temp.max) || isNaN(temp.max)) return null;
    let roundedTemp = roundToPrecision(temp.max, 2);
    return roundedTemp;
  } catch (err) {
    return null;
  }
};

const calcAvailableMemory = async () => {
  try {
    let memInfo = await si.mem();
    if (!exists(memInfo.active) || !exists(memInfo.total)) return null;
    let avMemory = (100 * memInfo.active) / memInfo.total;
    if (!exists(avMemory) || isNaN(avMemory)) return null;
    let roundedAvMemory = roundToPrecision(avMemory, 2);
    return roundedAvMemory;
  } catch (err) {
    return null;
  }
};

const calcDiskUsage = async () => {
  try {
    let fsSizeInfo = await si.fsSize();

    let root = fsSizeInfo.find((element) => element.mount === "/");
    let boot = fsSizeInfo.find((element) => element.mount.includes("/boot"));

    if (!exists(root.used) || !exists(boot.size) || !exists(root.size))
      return null;

    let fsUsage = (100 * (root.used + boot.size)) / root.size;

    if (!exists(fsUsage) || isNaN(fsUsage)) return null;

    let roundedFSUsage = roundToPrecision(fsUsage, 2);
    return roundedFSUsage;
  } catch (err) {
    return null;
  }
};

module.exports.getDeviceInfo = async () => {
  let cpuUsage = await calcCPULoad();
  let cpuTemperature = await calcCPUTemperature();
  let ramUsage = await calcAvailableMemory();
  let diskUsage = await calcDiskUsage();

  return {
    cpuUsage,
    cpuTemperature,
    ramUsage,
    diskUsage,
  };
};
