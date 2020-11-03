import { SET_ALL_DEVICES } from '../actions/DevicesSelectionPage.action';

const initialState = {
  devices: []
}

export const DevicesSelectionPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_DEVICES:
      return {
        ...state,
        devices: action.devices
      }
    default:
      return state
  }
}