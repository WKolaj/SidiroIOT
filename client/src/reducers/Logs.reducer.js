import { SET_LOGS } from '../actions/Logs.action';

const initialState = {
  logs: null,
}

export const LogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGS:
      return {
        ...state,
        logs: action.logs
      }
    default:
      return state
  }
}