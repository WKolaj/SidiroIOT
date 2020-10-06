export const SELECT_DEVICE = 'SELECT_DEVICE';

export const selectDevice = (deviceIndex, deviceName, deviceType) => ({ type: SELECT_DEVICE, deviceIndex: deviceIndex, deviceName: deviceName, deviceType: deviceType })