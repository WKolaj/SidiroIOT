import { SET_CONFIG_FILE, SET_IP_CONFIGURATION } from '../actions/Settings.action';

const initialState = {
  file: null,
  ipconfig: {}
}

export const SettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIG_FILE:
      return {
        ...state,
        file: action.file
      }
    case SET_IP_CONFIGURATION:
      return {
        ...state,
        ipconfig: action.ipconfig
      }
    default:
      return state
  }
}