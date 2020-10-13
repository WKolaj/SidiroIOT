export const SET_HARDWARE_USAGE = 'SET_HARDWARE_USAGE';

export const setHardwareUsage = (cpuUsage, cpuTemperature, ramUsage, diskUsage) => ({ type: SET_HARDWARE_USAGE, cpuUsage: cpuUsage, cpuTemperature: cpuTemperature, ramUsage: ramUsage, diskUsage: diskUsage })