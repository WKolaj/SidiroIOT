import { SELECT_DEVICE } from '../actions/DevicesList.action';

const initialState = {
    selectedDeviceIndex: 0,
    selectedDeviceID: '',
    selectedDeviceType: '',
    
}

export const DevicesListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_DEVICE:
            return {
                ...state,
                selectedDeviceIndex: action.deviceIndex,
                selectedDeviceID: action.deviceID,
                selectedDeviceType: action.deviceType
            }
        default:
            return state
    }
}