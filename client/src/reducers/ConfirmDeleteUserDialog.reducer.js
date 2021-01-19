import { SET_CONFIRM_DELETE_USER_DIALOG_USERNAME, SET_CONFIRM_DELETE_USER_DIALOG_OPEN } from '../actions/ConfirmDeleteUserDialog.action';

const initialState = {
  open: false,
  username: '',
  id: ''
}

export const ConfirmDeleteUserDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIRM_DELETE_USER_DIALOG_OPEN:
      return {
        ...state,
        open: action.open,
      }
    case SET_CONFIRM_DELETE_USER_DIALOG_USERNAME:
      return {
        ...state,
        username: action.username,
        id: action.id
      }
    default:
      return state
  }
}