export const SET_ALL_DEVICES = 'SET_ALL_DEVICES';
export const REFRESH_DEVICE_PARAMS = 'REFRESH_DEVICE_PARAMS';

export const setAllDevices = (devices) => ({ type: SET_ALL_DEVICES, devices: devices })
export const refreshDeviceParams = (params) => ({ type: REFRESH_DEVICE_PARAMS, params: params })