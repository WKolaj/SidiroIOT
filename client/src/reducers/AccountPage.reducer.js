import { SET_ACCOUNT_FORM_CURRENT_PASSWORD, SET_ACCOUNT_FORM_NEW_PASSWORD } from '../actions/AccountPage.action';

const initialState = {
  currentPassword: '',
  newPassword: ''

}

export const AccountPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_FORM_CURRENT_PASSWORD:
      return {
        ...state,
        currentPassword: action.password,
      }
    case SET_ACCOUNT_FORM_NEW_PASSWORD:
      return {
        ...state,
        newPassword: action.password
      }
    default:
      return state
  }
}