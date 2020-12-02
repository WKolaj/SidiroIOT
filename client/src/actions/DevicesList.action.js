export const SELECT_DEVICE = 'SELECT_DEVICE';

export const selectDevice = (deviceIndex, deviceID, deviceType) => ({ type: SELECT_DEVICE, deviceIndex: deviceIndex, deviceID: deviceID, deviceType: deviceType })