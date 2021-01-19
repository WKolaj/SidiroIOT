import { SET_HARDWARE_USAGE } from '../actions/HardwareUsage.action';

const initialState = {
  cpuUsage: 0,
  cpuTemperature: 0,
  ramUsage: 0,
  diskUsage: 0
}

export const HardwareUsageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HARDWARE_USAGE:
      return {
        ...state,
        cpuUsage: action.cpuUsage,
        cpuTemperature: action.cpuTemperature,
        ramUsage: action.ramUsage,
        diskUsage: action.diskUsage
      }
    default:
      return state
  }
}