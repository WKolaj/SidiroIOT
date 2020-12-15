import { SET_CONFIG_FILE } from '../actions/Settings.action';

const initialState = {
  file: null,
}

export const SettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIG_FILE:
      return {
        ...state,
        file: action.file
      }
    default:
      return state
  }
}