import { SET_SNACKBAR_TEXT, SET_SNACKBAR_SHOWN } from '../actions/Snackbar.action';

const initialState = {
  text: '',
  severity: '',
  shown: false
}

export const SnackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SNACKBAR_TEXT:
      return {
        ...state,
        text: action.text,
        severity: action.severity
      }
    case SET_SNACKBAR_SHOWN:
      return {
        ...state,
        shown: action.shown
      }
    default:
      return state
  }
}