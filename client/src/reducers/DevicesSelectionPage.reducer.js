import { SET_ALL_DEVICES, REFRESH_DEVICE_PARAMS, TOGGLE_TABLE_VIEW } from '../actions/DevicesSelectionPage.action';

const initialState = {
  devices: [],
  tableView: 'simple'
}

export const DevicesSelectionPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_DEVICES:
      return {
        ...state,
        devices: action.devices
      }
    case REFRESH_DEVICE_PARAMS:
      return {
        ...state,
        devices: state.devices.map(dev => {
          if (action.params.id === Object.entries(dev)[0][0]) {
            return { [action.params.id]: action.params }
          }
          else {
            return dev
          }
        })
      }
    case TOGGLE_TABLE_VIEW:
      return {
        ...state,
        tableView: state.tableView === 'simple' ? 'advanced' : 'simple'
      }
    default:
      return state
  }
}