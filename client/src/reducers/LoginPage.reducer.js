import { SET_FORM_USERNAME, SET_FORM_PASSWORD } from '../actions/LoginPage.action';

const initialState = {
  username: '',
  password: ''

}

export const LoginPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FORM_USERNAME:
      return {
        ...state,
        username: action.username,
      }
    case SET_FORM_PASSWORD:
      return {
        ...state,
        password: action.password
      }
    default:
      return state
  }
}