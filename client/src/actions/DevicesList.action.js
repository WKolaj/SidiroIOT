export const SELECT_DEVICE = 'SELECT_DEVICE';

export const selectDevice = (deviceID, deviceType) => ({ type: SELECT_DEVICE, deviceID: deviceID, deviceType: deviceType })