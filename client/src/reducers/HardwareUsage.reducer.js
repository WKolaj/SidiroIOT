import { SET_HARDWARE_USAGE } from '../actions/HardwareUsage.action';

const initialState = {
  cpuUsage: 10,
  cpuTemperature: 30,
  ramUsage: 50,
  diskUsage: 70
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