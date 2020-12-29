import { SET_ACCOUNT_FORM_CURRENT_PASSWORD, SET_ACCOUNT_FORM_NEW_PASSWORD, SET_ACCOUNT_FORM_REPEATED_NEW_PASSWORD } from '../actions/AccountPage.action';

const initialState = {
  currentPassword: '',
  newPassword: '',
  repeatedNewPassword: ''

}

export const AccountPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_FORM_CURRENT_PASSWORD:
      return {
        ...state,
        currentPassword: action.currentPassword,
      }
    case SET_ACCOUNT_FORM_NEW_PASSWORD:
      return {
        ...state,
        newPassword: action.newPassword
      }
    case SET_ACCOUNT_FORM_REPEATED_NEW_PASSWORD:
      return {
        ...state,
        repeatedNewPassword: action.repeatedNewPassword
      }
    default:
      return state
  }
}