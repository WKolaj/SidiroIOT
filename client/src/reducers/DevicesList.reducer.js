import { SELECT_DEVICE } from '../actions/DevicesList.action';

const initialState = {
    selectedDeviceIndex: 0,
    selectedDeviceName: 'MindSphere',
    selectedDeviceType: 'mindsphere',
    
}

export const DevicesListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_DEVICE:
            return {
                ...state,
                selectedDeviceIndex: action.deviceIndex,
                selectedDeviceName: action.deviceName,
                selectedDeviceType: action.deviceType
            }
        default:
            return state
    }
}